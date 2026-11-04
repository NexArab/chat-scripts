(function () {
  'use strict';

  const key = '__CHAT_SPORTS_TEST__';
  if (window[key]) window[key].destroy();

  const groups = ['كرة القدم', 'كرة السلة', 'باقي الرياضات'];

  const sources = [20, 60, 61].map((id, i) => ({
    name: 'ثمانية ' + (i + 1) + ' · تجريبي',
    group: 0,
    url: 'https://dflive.app.tc/' + id + '.m3u8'
  }));

  let catalogRequest;
  let catalogReady = false;

  let tab, panel, tabs, pane, video, status, list, hls;
  let attempt = 0;
  let active = false;
  let library;
  let mountTimer;

  function readCatalog(text) {
    const found = [];
    const urls = new Set(sources.map(item => item.url));
    let name = '';

    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();

      if (line.startsWith('#EXTINF:')) {
        name = line.slice(line.indexOf(',') + 1).trim();
      } else if (/^#(?:EXTVLCOPT|KODIPROP|EXTHTTP)/i.test(line)) {
        name = '';
      } else if (line && !line.startsWith('#')) {
        const supportedUrl =
          /^https:\/\//i.test(line) &&
          /\.m3u8(?:[?#]|$)/i.test(line);

        const existingChannel =
          /oman sports|arryadia|kuwait sport|ktv sport|bahrain sport|jordan sport|thmanyah [123]|ثمانية [١٢٣123]/i.test(name);

        if (name && supportedUrl && !urls.has(line) && !existingChannel) {
          let group = 2; // باقي الرياضات افتراضياً

          // تخصيص شامل للبحث عن كرة السلة
          if (/basket|nba|wnba|fiba|courtside|السلة/i.test(name)) {
            group = 1;
          } 
          // تخصيص شامل للبحث عن كرة القدم والدوريات الكبرى وأبطال أوروبا وآسيا
          else if (/football|soccer|futbol|fútbol|calcio|laliga|la liga|serie a|premier league|bundesliga|ligue 1|دوري روشن|السعودي|أبطال أوروبا|champions league|دوري أبطال|afc|أسيوي|أسيا|كرة القدم/i.test(name)) {
            group = 0;
          }

          found.push({ name, group, url: line });
          urls.add(line);
        }

        name = '';
      }
    }

    return found;
  }

  async function loadCatalog() {
    if (catalogReady) return;

    if (!catalogRequest) {
      catalogRequest = fetch(
        'https://iptv-org.github.io/iptv/categories/sports.m3u',
        { credentials: 'omit' }
      )
        .then(async response => {
          if (!response.ok) throw new Error('Catalog unavailable');

          const extra = readCatalog(await response.text());
          if (!extra.length) throw new Error('Empty catalog');

          sources.push(...extra);
          catalogReady = true;
        })
        .finally(() => {
          catalogRequest = null;
        });
    }

    try {
      await catalogRequest;
      if (active && panel) drawList();
    } catch {
      if (active && panel) {
        list.querySelector('[data-note]').textContent =
          'تعذّر تحميل الدليل. أعد فتح القسم للمحاولة.';
      }
    }
  }

  function drawList() {
    list.replaceChildren();

    const note = document.createElement('small');
    note.dataset.note = '';
    note.textContent = catalogReady
      ? 'التوفر يختلف حسب المصدر والمنطقة.'
      : 'جارٍ تحميل دليل الرياضة والدوريات الكبرى…';

    list.appendChild(note);

    groups.forEach((label, index) => {
      const items = sources.filter(item => item.group === index);
      const details = document.createElement('details');
      details.open = index === 0;

      const summary = document.createElement('summary');
      summary.textContent = label + ' (' + items.length + ')';
      details.appendChild(summary);

      items.forEach(source => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = source.name;
        button.onclick = () => play(source);
        details.appendChild(button);
      });

      list.appendChild(details);
    });
  }

  function stop() {
    attempt++;

    if (hls) hls.destroy();
    hls = null;

    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.hidden = true;
    }
  }

  function loadLibrary() {
    if (window.Hls) return Promise.resolve(window.Hls);

    if (!library) {
      library = new Promise(function (resolve, reject) {
        const script = document.createElement('script');
        script.src =
          'https://cdn.jsdelivr.net/npm/hls.js@1.6.13/dist/hls.min.js';

        script.onload = function () {
          if (window.Hls) resolve(window.Hls);
          else reject(new Error('HLS unavailable'));
        };

        script.onerror = reject;
        document.head.appendChild(script);
      }).catch(function (error) {
        library = null;
        throw error;
      });
    }

    return library;
  }

  async function play(source) {
    stop();

    const ticket = attempt;
    video.hidden = false;
    status.textContent = 'جارٍ الاتصال بالمصدر…';

    try {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source.url;
      } else {
        const Hls = await loadLibrary();
        if (ticket !== attempt) return;
        if (!Hls.isSupported()) throw new Error('HLS unsupported');

        hls = new Hls();

        hls.on(Hls.Events.ERROR, function (_, data) {
          if (ticket === attempt && data.fatal) {
            stop();
            status.textContent = 'تعذّر تشغيل المصدر في هذا المتصفح.';
          }
        });

        hls.loadSource(source.url);
        hls.attachMedia(video);
      }

      await video.play();
    } catch (error) {
      if (ticket !== attempt) return;

      status.textContent = error.name === 'NotAllowedError'
        ? 'اضغط تشغيل داخل الفيديو.'
        : 'تعذّر تحميل البث. تحقق من المصدر.';
    }
  }

  function leave() {
    if (!active) return;

    active = false;
    stop();
    pane.classList.remove('chat-sports-test-active');
    tab.setAttribute('aria-pressed', 'false');
  }

  function navigate(event) {
    if (event.target.closest(
      '.chat-youtube-tabs [data-mode], #chat-cinema-tab, ' +
       '#dpnl .th-dpnl-close, #settings .SERT, #d0 [data-key]'
    )) {
      leave();
    }
  }

  const style = document.createElement('style');

  style.textContent = `
    #chat-tv > #chat-sports-test {
      display: none !important;
    }

    #chat-tv.chat-sports-test-active > :not(#chat-sports-test) {
      display: none !important;
    }

    #chat-tv.chat-sports-test-active > #chat-sports-test {
      display: block !important;
    }
  `;

  document.head.appendChild(style);

  function unmount() {
    leave();

    if (tab) tab.remove();
    if (panel) panel.remove();

    tab = panel = video = null;
  }

  function mount() {
    const nextTabs = document.querySelector('#dpnl .chat-youtube-tabs');
    const nextPane = document.getElementById('chat-tv');

    if (
      tab && nextTabs && nextPane &&
      tab.parentNode === nextTabs &&
      panel.parentNode === nextPane
    ) return;

    unmount();
    if (!nextTabs || !nextPane) return;

    tabs = nextTabs;
    pane = nextPane;

    tab = document.createElement('button');
    tab.type = 'button';
    tab.textContent = '⚽ رياضة';
    tab.setAttribute('aria-pressed', 'false');

    panel = document.createElement('section');
    panel.id = 'chat-sports-test';

    const root = panel.attachShadow({ mode: 'open' });

    root.innerHTML = `
      <style>
        :host {
          direction: rtl;
          background: white;
          color: #222;
          font: 14px Tahoma, sans-serif;
        }

        section {
          padding: 12px;
        }

        button {
          padding: 8px;
          margin: 4px;
          cursor: pointer;
        }

        video {
          width: 100%;
          background: #111;
          max-height: 60vh;
        }

        video[hidden] {
          display: none;
        }
      </style>

      <section>
        <strong>القنوات الرياضية والدوريات</strong>
        <div data-list></div>
        <video controls playsinline hidden></video>
        <p role="status"></p>
        <button type="button" data-stop>إيقاف البث</button>
      </section>
    `;

    status = root.querySelector('[role="status"]');
    list = root.querySelector('[data-list]');
    video = root.querySelector('video');

    video.onplaying = function () {
      status.textContent = 'البث يعمل.';
    };

    video.onerror = function () {
      if (active && !video.hidden) {
        status.textContent = 'تعذّر تشغيل الفيديو من هذا المصدر.';
      }
    };

    drawList();

    root.querySelector('[data-stop]').onclick = function () {
      stop();
      status.textContent = 'تم إيقاف البث.';
    };

    tab.onclick = function () {
      if (active) return;

      const tv = tabs.querySelector('[data-mode="tv"]');
      if (tv) tv.click();

      const stopTV = pane.querySelector('[data-tv-stop]');
      if (stopTV) stopTV.click();

      const closeFloat = document.querySelector(
        '#chat-tv-floating [data-float-close]'
      );
      if (closeFloat) closeFloat.click();

      active = true;
      drawList();
      loadCatalog();

      pane.classList.add('chat-sports-test-active');

      tabs.querySelectorAll('button').forEach(function (button) {
        button.setAttribute('aria-pressed', String(button === tab));
      });

      status.textContent = 'اختر المصدر لتجربة البث.';
    };

    tabs.appendChild(tab);
    pane.appendChild(panel);
  }

  document.addEventListener('click', navigate, true);
  window.addEventListener('pagehide', leave);
  mountTimer = setInterval(mount, 1500);

  window[key] = {
    destroy: function () {
      clearInterval(mountTimer);
      document.removeEventListener('click', navigate, true);
      window.removeEventListener('pagehide', leave);
      unmount();
      style.remove();
      delete window[key];
    }
  };

  mount();
})();
