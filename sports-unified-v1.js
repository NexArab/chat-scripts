(function () {
  'use strict';

  const allowedSites = ['chatsaudia.com', 'www.chatsaudia.com'];
  if (!allowedSites.includes(location.hostname)) return;

  const key = '__CHAT_SPORTS_SD_V1__';
  window[key]?.destroy();
  window.__BEIN_SD_TEST__?.();
  window.__CHAT_SPORTS_TEST__?.destroy?.();
  document.getElementById('bein-chat-test')?.remove();

  const relay = '/sports-live/';
  const hlsScript =
    'https://cdn.jsdelivr.net/npm/hls.js@1.6.13/dist/hls.min.js';

  let tabs, pane, tab, panel, video, status, channelList;
  let active = false;
  let generation = 0;
  let hls = null;
  let library = null;

  const style = document.createElement('style');
  style.textContent = `
    #chat-tv > .bein-sports-panel {
      display: none !important;
    }
    #chat-tv.bein-sports-active > :not(.bein-sports-panel) {
      display: none !important;
    }
    #chat-tv.bein-sports-active > .bein-sports-panel {
      display: block !important;
    }
    .bein-sports-panel {
      direction: rtl;
      width: 100%;
      box-sizing: border-box;
      padding: 8px;
    }
    .bein-sports-panel video {
      display: block;
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #111;
      border-radius: 6px;
    }
    .bein-sports-panel p {
      margin: 8px 0;
      min-height: 1.5em;
    }
    .bein-sports-panel nav {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 5px;
    }
    .bein-sports-panel button {
      min-height: 36px;
      padding: 5px;
      cursor: pointer;
      font: inherit;
    }
    .bein-sports-panel nav button {
      direction: ltr;
    }
    .bein-sports-panel button[aria-pressed="true"] {
      font-weight: bold;
      outline: 2px solid currentColor;
      outline-offset: -2px;
    }
    .bein-sports-panel [data-sports-stop] {
      margin-top: 8px;
    }
  `;
  document.head.appendChild(style);

  function stop() {
    generation++;
    if (video) {
      video.onerror = null;
      video.onplaying = null;
    }
    if (hls) {
      hls.destroy();
      hls = null;
    }
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    if (channelList) {
      for (const button of channelList.children) {
        button.setAttribute('aria-pressed', 'false');
      }
    }
  }

  function leave() {
    if (!active) return;
    active = false;
    stop();
    pane?.classList.remove('bein-sports-active');
    tab?.setAttribute('aria-pressed', 'false');
  }

  function loadHls() {
    if (window.Hls) return Promise.resolve(window.Hls);
    if (library) return library;

    library = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = hlsScript;
      script.onload = () => {
        if (window.Hls) resolve(window.Hls);
        else reject(new Error('HLS library unavailable'));
      };
      script.onerror = () => {
        script.remove();
        reject(new Error('HLS library failed to load'));
      };
      document.head.appendChild(script);
    }).catch(error => {
      library = null;
      throw error;
    });

    return library;
  }

  async function play(number, button) {
    stop();
    const ticket = generation;
    const url = `${relay}sd${number}/index.m3u8`;
    const player = video;
    button.setAttribute('aria-pressed', 'true');
    status.textContent = `جارٍ فتح Bein Sport SD${number}…`;

    function fail(message) {
      if (ticket !== generation) return;
      stop();
      status.textContent = message;
    }

    player.onplaying = () => {
      if (ticket === generation) {
        status.textContent = `البث يعمل · Bein Sport SD${number}`;
      }
    };
    player.onerror = () => {
      fail(`تعذّر تشغيل فيديو SD${number}.`);
    };

    try {
      if (player.canPlayType('application/vnd.apple.mpegurl')) {
        player.src = url;
      } else {
        const Hls = await loadHls();
        if (ticket !== generation) return;
        if (!Hls.isSupported()) {
          fail('هذا المتصفح لا يدعم تشغيل البث.');
          return;
        }

        hls = new Hls();
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (!data.fatal || ticket !== generation) return;
          const code = data.response?.code;
          fail(code
            ? `تعذّر تحميل SD${number} · ردّ السيرفر ${code}.`
            : `تعذّر تحميل SD${number}. تحقّق من وسيط البث.`);
        });
        hls.loadSource(url);
        hls.attachMedia(player);
      }

      await player.play();
    } catch (error) {
      if (ticket !== generation) return;
      if (error?.name === 'NotAllowedError') {
        status.textContent = 'اضغط زر التشغيل داخل الشاشة.';
      } else {
        fail(`تعذّر تشغيل SD${number}. تحقّق من وسيط البث.`);
      }
    }
  }

  function unmount() {
    leave();
    tab?.remove();
    panel?.remove();
    tabs = pane = tab = panel = video = status = channelList = null;
  }

  function mount() {
    const nextTabs = document.querySelector('#dpnl .chat-youtube-tabs');
    const nextPane = document.getElementById('chat-tv');

    if (
      nextTabs && nextPane &&
      tab?.parentNode === nextTabs && panel?.parentNode === nextPane
    ) return;

    if (tab || panel) unmount();
    if (!nextTabs || !nextPane) return;

    tabs = nextTabs;
    pane = nextPane;

    tab = document.createElement('button');
    tab.type = 'button';
    tab.textContent = '⚽ رياضة';
    tab.setAttribute('aria-pressed', 'false');

    panel = document.createElement('section');
    panel.className = 'bein-sports-panel';
    panel.setAttribute('aria-label', 'القنوات الرياضية');
    panel.innerHTML = `
      <video controls playsinline aria-label="مشغّل القناة"></video>
      <p role="status">اختر القناة.</p>
      <nav aria-label="قنوات beIN Sports"></nav>
      <button type="button" data-sports-stop>إيقاف البث</button>
    `;

    video = panel.querySelector('video');
    status = panel.querySelector('[role="status"]');
    channelList = panel.querySelector('nav');

    for (let number = 1; number <= 9; number++) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `Bein Sport SD${number}`;
      button.setAttribute('aria-pressed', 'false');
      button.onclick = () => play(number, button);
      channelList.appendChild(button);
    }

    panel.querySelector('[data-sports-stop]').onclick = () => {
      stop();
      status.textContent = 'تم إيقاف البث.';
    };

    tab.onclick = () => {
      if (active) return;
      tabs.querySelector('[data-mode="tv"]')?.click();
      pane.querySelector('[data-tv-stop]')?.click();
      document.querySelector('#chat-tv-floating [data-float-close]')?.click();

      active = true;
      pane.classList.add('bein-sports-active');
      for (const button of tabs.querySelectorAll('button')) {
        button.setAttribute('aria-pressed', String(button === tab));
      }
      status.textContent = 'اختر القناة.';
    };

    tabs.appendChild(tab);
    pane.appendChild(panel);
  }

  function navigate(event) {
    if (!active) return;
    const selector = [
      '.chat-youtube-tabs [data-mode]',
      '#chat-cinema-tab',
      '#dpnl .th-dpnl-close',
      '#settings .SERT',
      '#d0 [data-key]'
    ].join(',');
    if (event.target.closest?.(selector)) leave();
  }

  const observer = new MutationObserver(() => {
    if (tab?.isConnected && panel?.isConnected) return;
    mount();
  });

  function start() {
    observer.observe(document.body, { childList: true, subtree: true });
    mount();
  }

  window[key] = {
    destroy() {
      observer.disconnect();
      document.removeEventListener('DOMContentLoaded', start);
      document.removeEventListener('click', navigate, true);
      window.removeEventListener('pagehide', leave);
      unmount();
      style.remove();
      delete window[key];
    }
  };

  document.addEventListener('click', navigate, true);
  window.addEventListener('pagehide', leave);

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
