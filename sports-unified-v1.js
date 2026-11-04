(function () {
  'use strict';

  const key = '__CHAT_SPORTS_TEST__';
  if (window[key]) window[key].destroy();

  const groups = ['كرة القدم', 'كرة السلة', 'باقي الرياضات'];

  const sources = [20, 60, 61].map((id, i) => ({
    id: 'thmanyah' + (i + 1) + '.sa',
    name: 'ثمانية ' + (i + 1) + ' · تجريبي',
    group: 0,
    urls: ['https://dflive.app.tc/' + id + '.m3u8']
  }));

  let catalogRequest;
  let catalogReady = false;

  let tab, panel, tabs, pane, video, status, list, hls;
  let attempt = 0;
  let active = false;
  let library;
  let mountTimer;

  function readCatalog(text, mixed) {
    const channels = new Map(sources.map(item => [item.id, {...item, urls: [...item.urls]}]));
    const used = new Set(sources.flatMap(item => item.urls));
    let meta = null;
    for (const line of text.split(/\r?\n/).map(value => value.trim())) {
      if (line.startsWith('#EXTINF:')) {
        const info = line.match(/^#EXTINF:(?:[^",]|"[^"]*")*,(.*)$/);
        const id = (line.match(/\btvg-id="([^"]*)"/i) || [,''])[1].toLowerCase().split('@')[0];
        meta = info && {id, name: info[1].replace(/\s*\(\d+p\)|\s*\[(?:geo-blocked|not 24\/7)\]/gi, '').trim()};
        continue;
      }

      if (!line || line.startsWith('#') || !meta) continue;
      const {id, name} = meta;
      meta = null;
      if (!name || !/^https?:\/\//i.test(line) || used.has(line)) continue;
      const label = name.normalize('NFKC').replace(/[\u064B-\u065Fـ]/g, '').replace(/[أإآ]/g, 'ا');
      const tags = id + ' ' + label;
      if (mixed && !/sport|bein|kass|ssc|nba|basket|football|soccer|espn|tennis|رياضية|رياضة|سبورت|الكاس|السلة|القدم/i.test(tags)) continue;
      const key = id || label.toLowerCase().replace(/\s+/g,' ');
      const group = /basket|nba\b|wnba|fiba|courtside|سلة/i.test(tags) ? 1 :
        /football|soccer|calcio|f[uú]tbol|laliga|روشن|كرة القدم|thmanyah/i.test(tags) ? 0 : 2;
      if (!channels.has(key)) channels.set(key,{id:key, name, group, urls:[]});
      channels.get(key).urls.push(line);
      used.add(line);
    }
    return Array.from(channels.values());
  }

  let catalogSummary = '';
  async function loadCatalog() {
    if (catalogReady) return;

    if (!catalogRequest) {
      const catalogs = [
        ['IPTV-org', 'https://iptv-org.github.io/iptv/categories/sports.m3u'],
        ['beinsports', 'https://gist.githubusercontent.com/fuadmirzaliyev/c76eab4a0d7deeaecfa7565d50c69a25/raw/beinsports.m3u'],
        ['beinsport', 'https://gist.githubusercontent.com/regragi-younes/a77b56c45b3c086cc166b79d5cc45e4a/raw/beinsport.m3u']
      ];
      catalogRequest = Promise.allSettled(catalogs.map(async ([name, url]) => {
        const response = await fetch(url, {credentials: 'omit', signal: AbortSignal.timeout(15000)});
        if (!response.ok) throw new Error(name);
        const text = await response.text();
        if (!text.includes('#EXTINF:')) throw new Error(name);
        return text;
      })).then(results => {
        const missing = [];
        results.forEach((result, i) => {
          if (result.status === 'rejected') { missing.push(catalogs[i][0]); return; }
          const merged = readCatalog(result.value, i === 2);
          sources.splice(0, sources.length, ...merged);
        });
        catalogReady = !missing.length;
        catalogSummary = sources.length + ' قناة للتجربة' +
          (missing.length ? ' · تعذّر تحميل ' + missing.join('، ') + ' · أعد فتح القسم للمحاولة.' : '');
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
    note.textContent = catalogSummary || 'جارٍ تحميل قوائم الرياضة…';

    list.appendChild(note);

    groups.forEach((label, index) => {
      const items = sources.filter(item => item.group === index);
      const details = document.createElement('details');
      details.open = index === 0;

      const summary = document.createElement('summary');
      summary.textContent = label + ' (' + items.length + ')';
      details.appendChild(summary);

      const grid = document.createElement('div');
      grid.className = 'grid';
      details.appendChild(grid);
      items.forEach(source => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = source.name;
        button.onclick = () => play(source);
        grid.appendChild(button);
      });

      list.appendChild(details);
    });
  }

  function stop() {
    attempt++;

    if (hls) hls.destroy();
    hls = null;

    if (video) {
      video.onerror = null;
      panel.shadowRoot.querySelector('[data-title]').textContent = 'القنوات الرياضية العربية';
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

  async function play(source, index = 0) {
    stop();

    const ticket = attempt;
    const url = source.urls[index];
    panel.shadowRoot.querySelector('[data-title]').textContent = source.name;
    function failed() {
      if (ticket !== attempt) return;
      if (index + 1 < source.urls.length) { play(source, index + 1); return; }
      stop();
      status.textContent = 'تعذّر تشغيل مصادر هذه القناة.';
    }
    if (location.protocol === 'https:' && url.startsWith('http:')) {
      if (index + 1 < source.urls.length) return play(source, index + 1);
      status.textContent = 'هذا المصدر HTTP فقط ولا يتوفر رابط HTTPS آخر للتجربة.';
      return;
    }
    video.onerror = failed;
    video.hidden = false;
    status.textContent = 'جارٍ الاتصال بالمصدر…';

    try {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else {
        const Hls = await loadLibrary();
        if (ticket !== attempt) return;
        if (!Hls.isSupported()) throw new Error('HLS unsupported');

        hls = new Hls();

        hls.on(Hls.Events.ERROR, function (_, data) {
          if (ticket === attempt && data.fatal) {
            failed();
          }
        });

        hls.loadSource(url);
        hls.attachMedia(video);
      }

      await video.play();
    } catch (error) {
      if (ticket !== attempt) return;

      if (error.name === 'NotAllowedError') status.textContent = 'اضغط تشغيل داخل الفيديو.';
      else failed();
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
    tab.textContent = '⚽ رياضة عربية';
    tab.setAttribute('aria-pressed', 'false');

    panel = document.createElement('section');
    panel.id = 'chat-sports-test';

    const root = panel.attachShadow({ mode: 'open' });

    root.innerHTML = `
      <style>
        :host{direction:rtl;background:#fff;color:#202724;font:14px/1.5 Tahoma,sans-serif}
        *{box-sizing:border-box}section{padding:8px}
        .screen{display:grid;place-items:center;position:relative;width:100%;aspect-ratio:16/9;background:#101714;color:white;border-radius:8px;overflow:hidden}
        .screen span{padding:10px;text-align:center}video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000}
        [hidden]{display:none!important}.tools{display:flex;align-items:center;gap:8px;margin:8px 0}
        strong{flex:1;overflow-wrap:anywhere}button{font:inherit;cursor:pointer;border:1px solid #cad1ce;background:white;color:#16251d;border-radius:6px;padding:6px 8px}
        details{border:1px solid #dbe3df;border-radius:7px;margin:7px 0}summary{padding:8px;cursor:pointer;font-weight:bold}
        .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(115px,100%),1fr));gap:5px;padding:6px}
        .grid button{overflow-wrap:anywhere}small,p{font-size:12px;color:#55615b;margin:5px 0}
      </style>
      <section>
        <div class="screen"><span>اختر قناة من القائمة بالأسفل</span><video controls playsinline hidden></video></div>
        <div class="tools"><strong data-title>القنوات الرياضية العربية</strong><button type="button" data-stop>■ إيقاف</button></div>
        <p role="status"></p>
        <div data-list></div>
      </section>`;

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

      status.textContent = 'اختر القناة العربية لتجربة البث.';
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
