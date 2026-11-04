(function () {
  'use strict';

  const key = '__CHAT_SPORTS_TEST__';
  if (window[key]) window[key].destroy();

  const sources = [
    { name: 'ثمانية 1 · مصدر تجريبي', url: 'https://dflive.app.tc/20.m3u8' }
  ];

  let tab, panel, tabs, pane, video, status, list, hls;
  let attempt = 0;
  let active = false;
  let library;
  let mountTimer;

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
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.6.13/dist/hls.min.js';
        script.onload = function () {
          if (window.Hls) resolve(window.Hls);
          else reject(new Error('HLS unavailable'));
        };
        script.onerror = reject;
        document.head.appendChild(script);
      }).catch(function (error) { library = null; throw error; });
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
        if (!Hls.isSupported()) throw new Error('unsupported');
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
        ? 'اضغط تشغيل داخل الفيديو.' : 'تعذّر تحميل البث. تحقق من المصدر.';
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
    if (event.target.closest('.chat-youtube-tabs [data-mode], #chat-cinema-tab, #dpnl .th-dpnl-close, #settings .SERT, #d0 [data-key]')) leave();
  }

  const style = document.createElement('style');
  style.textContent = `
    #chat-tv > #chat-sports-test { display:none!important }
    #chat-tv.chat-sports-test-active > :not(#chat-sports-test) { display:none!important }
    #chat-tv.chat-sports-test-active > #chat-sports-test { display:block!important }
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
    if (tab && tab.parentNode === nextTabs && panel.parentNode === nextPane &&
        nextTabs && nextPane) return;
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
    const root = panel.attachShadow({mode:'open'});
    root.innerHTML = `
      <style>
        :host{direction:rtl;background:white;color:#222;font:14px Tahoma,sans-serif}
        section{padding:12px}button{padding:8px;margin:4px;cursor:pointer}
        video{width:100%;background:#111;max-height:60vh}video[hidden]{display:none}
      </style>
      <section><strong>بث رياضي تجريبي</strong><div data-list></div>
      <video controls playsinline hidden></video><p role="status"></p>
      <button type="button" data-stop>إيقاف البث</button></section>`;
    status = root.querySelector('[role=status]');
    list = root.querySelector('[data-list]');
    video = root.querySelector('video');
    video.onplaying = function () { status.textContent = 'البث يعمل.'; };
    video.onerror = function () {
      if (active && !video.hidden) status.textContent = 'تعذّر تشغيل الفيديو من هذا المصدر.';
    };
    sources.forEach(function (source) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = source.name;
      button.onclick = function () { play(source); };
      list.appendChild(button);
    });
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
      const closeFloat = document.querySelector('#chat-tv-floating [data-float-close]');
      if (closeFloat) closeFloat.click();
      active = true;
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
  window[key] = {destroy: function () {
    clearInterval(mountTimer);
    document.removeEventListener('click', navigate, true);
    window.removeEventListener('pagehide', leave);
    unmount();
    style.remove();
    delete window[key];
  }};
  mount();
})();
