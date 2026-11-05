(function () {
  'use strict';

  if (!['chatsaudia.com', 'www.chatsaudia.com'].includes(location.hostname)) return;

  const key = '__CHAT_SPORTS_SD_V1__';
  window[key]?.destroy();
  window.__BEIN_SD_TEST__?.();
  window.__CHAT_SPORTS_TEST__?.destroy?.();
  document.getElementById('bein-chat-test')?.remove();

  const relay = 'http://127.0.0.1:8091/sports-live/';
  const libraryUrl = 'https://cdn.jsdelivr.net/npm/hls.js@1.6.13/dist/hls.min.js';

  let tabs, pane, tab, panel, root, screen, slot, title, video, status, floatBtn;
  let active = false, floating = false, selected = 0, ticket = 0;
  let hls, library, gesture, box;

  const style = document.createElement('style');
  style.textContent = `
    #chat-tv > .sd-sports {display:none!important}
    #chat-tv.sd-open > :not(.sd-sports) {display:none!important}
    #chat-tv.sd-open > .sd-sports {display:block!important;width:100%;min-width:0}
  `;
  document.head.append(style);

  const sheet = `
    :host {direction:rtl;color:#172526;font:14px Tahoma,Arial,sans-serif}
    * {box-sizing:border-box}
    .layout {padding:8px;background:#fff;display:grid;gap:8px}
    .slot {position:relative;width:100%}
    .slot.away {aspect-ratio:16/9;display:grid;place-items:center;
      border:1px dashed #b6cac5;border-radius:8px;background:#f4f8f6}
    .screen {background:#101818;color:white;border-radius:8px;overflow:hidden}
    .head {display:flex;align-items:center;justify-content:space-between;
      padding:7px 10px;background:#103d34;color:white}
    .floating .head {cursor:move;touch-action:none;user-select:none}
    video {display:block;width:100%;aspect-ratio:16/9;background:#090d0c;object-fit:contain}
    .floating {position:fixed!important;z-index:2147483646;
      display:flex;flex-direction:column;box-shadow:0 4px 22px #0006}
    .floating video {flex:1;min-height:0;height:0;aspect-ratio:auto}
    .grip {display:none}
    .floating .grip {display:block;position:absolute;bottom:0;right:0;
      width:20px;height:20px;background:#135649;color:white;
      text-align:center;cursor:nwse-resize;touch-action:none}
    .screen:fullscreen,.screen:-webkit-full-screen {
      width:100%!important;height:100%!important;max-width:none!important;
      max-height:none!important;border-radius:0;display:flex;flex-direction:column}
    .screen:fullscreen video,.screen:-webkit-full-screen video {
      flex:1;height:0;min-height:0;aspect-ratio:auto}
    .tools,.filters {display:flex;flex-wrap:wrap;gap:5px}
    button {font:inherit;color:inherit;cursor:pointer;padding:6px 9px;
      border:1px solid #cbd5d2;border-radius:6px;background:#fff}
    button:focus-visible {outline:2px solid #157967;outline-offset:1px}
    button[aria-pressed=true] {background:#103d34;border-color:#103d34;color:#fff}
    .head button {padding:3px 8px;background:transparent;color:white;border-color:#ffffff66}
    .channels {display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
    .channels button {direction:ltr;min-height:36px}
    .filters {border-top:1px solid #e0e7e4;padding-top:8px}
    .status {margin:0;min-height:1.4em;color:#435653}
    [hidden] {display:none!important}
    @media(max-width:360px){.channels{grid-template-columns:repeat(2,minmax(0,1fr))}}
  `;

  function stop() {
    ticket++;
    if (video) video.onerror = video.onplaying = null;
    if (hls) hls.destroy();
    hls = null;
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    selected = 0;
    if (root) {
      for (const b of root.querySelectorAll('[data-channel]')) {
        b.setAttribute('aria-pressed', 'false');
      }
      title.textContent = 'رياضة';
    }
  }

  function engine() {
    if (window.Hls) return Promise.resolve(window.Hls);
    if (!library) {
      library = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = libraryUrl;
        script.onload = () => window.Hls ? resolve(window.Hls) : reject();
        script.onerror = () => { script.remove(); reject(); };
        document.head.append(script);
      }).catch(error => { library = null; throw error; });
    }
    return library;
  }

  async function play(number) {
    if (selected === number && !video.paused) return;
    stop();
    const id = ticket;
    const player = video;
    selected = number;
    title.textContent = `beIN SPORTS SD${number}`;
    root.querySelector(`[data-channel="${number}"]`).setAttribute('aria-pressed', 'true');
    status.textContent = `جارٍ فتح SD${number}…`;

    function fail(message) {
      if (id !== ticket) return;
      stop();
      status.textContent = message;
    }

    player.onplaying = () => {
      if (id === ticket) status.textContent = `البث يعمل · SD${number}`;
    };
    player.onerror = () => fail(`تعذّر تشغيل فيديو SD${number}.`);

    try {
      const url = `${relay}sd${number}/index.m3u8`;
      if (player.canPlayType('application/vnd.apple.mpegurl')) {
        player.src = url;
      } else {
        const Hls = await engine();
        if (id !== ticket) return;
        if (!Hls.isSupported()) {
          fail('المتصفح لا يدعم تشغيل هذا البث.');
          return;
        }
        hls = new Hls();
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (!data.fatal || id !== ticket) return;
          const code = data.response?.code;
          fail(`تعذّر تحميل SD${number}${code ? ` · ردّ السيرفر ${code}` : ''}.`);
        });
        hls.loadSource(url);
        hls.attachMedia(player);
      }
      await player.play();
    } catch (error) {
      if (id !== ticket) return;
      if (error?.name === 'NotAllowedError') status.textContent = 'اضغط تشغيل داخل الشاشة.';
      else fail(`تعذّر بدء SD${number}.`);
    }
  }

  function paintBox() {
    if (!floating || !box) return;
    const w = innerWidth, h = innerHeight;
    box.width = Math.min(w, Math.max(Math.min(220, w), box.width));
    box.height = Math.min(h, Math.max(Math.min(145, h), box.height));
    box.x = Math.max(0, Math.min(w - box.width, box.x));
    box.y = Math.max(0, Math.min(h - box.height, box.y));
    Object.assign(screen.style, {
      left: `${box.x}px`, top: `${box.y}px`,
      width: `${box.width}px`, height: `${box.height}px`
    });
  }

  function setFloat(on) {
    floating = on;
    gesture = null;
    screen.classList.toggle('floating', on);
    slot.classList.toggle('away', on);
    floatBtn.setAttribute('aria-pressed', String(on));
    floatBtn.textContent = on ? 'إرجاع الشاشة' : 'نافذة عائمة';
    root.querySelector('[data-return]').hidden = !on;
    root.querySelector('[data-slot-return]').hidden = !on;
    if (on) {
      if (!box) {
        const width = Math.min(420, innerWidth - 12);
        box = {width, height: Math.round(width * 9 / 16) + 36,
          x: innerWidth - width - 6, y: 65};
      }
      paintBox();
    } else {
      screen.removeAttribute('style');
    }
  }

  function bindDrag(handle, resize) {
    handle.onpointerdown = event => {
      if (!floating || event.button !== 0 || event.target.closest('button')) return;
      gesture = {id:event.pointerId, x:event.clientX, y:event.clientY, start:{...box}};
      handle.setPointerCapture(event.pointerId);
      event.preventDefault();
    };
    handle.onpointermove = event => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
      const start = gesture.start;
      if (resize) {
        box.width = start.width + dx;
        box.height = start.height + dy;
      } else {
        box.x = start.x + dx;
        box.y = start.y + dy;
      }
      paintBox();
    };
    handle.onlostpointercapture = () => { gesture = null; };
  }

  async function fullscreen() {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        await exit.call(document);
      } else if (screen.requestFullscreen || screen.webkitRequestFullscreen) {
        const enter = screen.requestFullscreen || screen.webkitRequestFullscreen;
        await enter.call(screen);
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      } else {
        status.textContent = 'ملء الشاشة غير متاح في هذا المتصفح.';
      }
    } catch {
      status.textContent = 'تعذّر فتح ملء الشاشة.';
    }
  }

  function filter(group) {
    for (const button of root.querySelectorAll('[data-group]')) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.group) === group));
    }
    for (const button of root.querySelectorAll('[data-channel]')) {
      const bucket = Math.ceil(Number(button.dataset.channel) / 3);
      button.hidden = group !== 0 && group !== bucket;
    }
  }

  function leave() {
    if (!active) return;
    active = false;
    stop();
    setFloat(false);
    pane.classList.remove('sd-open');
    tab.setAttribute('aria-pressed', 'false');
  }

  function activate() {
    if (active) return;
    tabs.querySelector('[data-mode="tv"]')?.click();
    pane.querySelector('[data-tv-stop]')?.click();
    document.querySelector('#chat-tv-floating [data-float-close]')?.click();
    active = true;
    pane.classList.add('sd-open');
    for (const b of tabs.querySelectorAll('button')) {
      b.setAttribute('aria-pressed', String(b === tab));
    }
    status.textContent = 'اختر القناة.';
  }

  function unmount() {
    leave();
    tab?.remove();
    panel?.remove();
    tab = panel = root = video = screen = slot = title = status = floatBtn = null;
    tabs = pane = null;
  }

  function mount() {
    const nextTabs = document.querySelector('#dpnl .chat-youtube-tabs');
    const nextPane = document.getElementById('chat-tv');
    if (nextTabs && nextPane && tab?.parentNode === nextTabs &&
        panel?.parentNode === nextPane) return;
    if (panel || tab) unmount();
    if (!nextTabs || !nextPane) return;
    tabs = nextTabs;
    pane = nextPane;

    tab = document.createElement('button');
    tab.type = 'button';
    tab.textContent = '⚽ رياضة';
    tab.setAttribute('aria-pressed','false');
    tab.onclick = activate;

    panel = document.createElement('section');
    panel.className = 'sd-sports';
    panel.setAttribute('aria-label','الرياضة');
    root = panel.attachShadow({mode:'open'});
    root.innerHTML = `
      <style>${sheet}</style>
      <div class="layout">
        <div class="slot">
          <button type="button" data-slot-return hidden>إرجاع الشاشة للقائمة</button>
          <div class="screen">
            <div class="head">
              <strong>رياضة</strong>
              <button type="button" data-return hidden>إرجاع</button>
            </div>
            <video controls playsinline aria-label="شاشة الرياضة"></video>
            <div class="grip" title="تغيير حجم الشاشة">◢</div>
          </div>
        </div>
        <div class="tools">
          <button type="button" data-full>⛶ ملء الشاشة</button>
          <button type="button" data-float aria-pressed="false">نافذة عائمة</button>
          <button type="button" data-stop>■ إيقاف</button>
        </div>
        <p class="status" role="status">اختر القناة.</p>
        <nav class="filters" aria-label="أقسام القنوات"></nav>
        <div class="channels" role="group" aria-label="القنوات"></div>
      </div>`;

    screen = root.querySelector('.screen');
    slot = root.querySelector('.slot');
    title = root.querySelector('strong');
    video = root.querySelector('video');
    status = root.querySelector('.status');
    floatBtn = root.querySelector('[data-float]');

    ['الكل', 'SD1 – SD3', 'SD4 – SD6', 'SD7 – SD9'].forEach((name, group) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = name;
      b.dataset.group = group;
      b.onclick = () => filter(group);
      root.querySelector('.filters').append(b);
    });
    for (let i = 1; i <= 9; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = `beIN SD${i}`;
      b.dataset.channel = i;
      b.setAttribute('aria-pressed','false');
      b.onclick = () => play(i);
      root.querySelector('.channels').append(b);
    }
    filter(0);
    root.querySelector('[data-full]').onclick = fullscreen;
    floatBtn.onclick = () => setFloat(!floating);
    root.querySelector('[data-return]').onclick = () => setFloat(false);
    root.querySelector('[data-slot-return]').onclick = () => setFloat(false);
    root.querySelector('[data-stop]').onclick = () => {
      stop();
      status.textContent = 'تم إيقاف البث.';
    };
    bindDrag(root.querySelector('.head'), false);
    bindDrag(root.querySelector('.grip'), true);
    tabs.append(tab);
    pane.prepend(panel);
  }

  function navigate(event) {
    if (active && event.target.closest?.(
      '.chat-youtube-tabs [data-mode],#chat-cinema-tab,#dpnl .th-dpnl-close,#settings .SERT,#d0 [data-key]'
    )) leave();
  }

  const observer = new MutationObserver(() => {
    if (!tab?.isConnected || !panel?.isConnected) mount();
  });
  function start() {
    observer.observe(document.body, {childList:true, subtree:true});
    mount();
  }
  window[key] = { destroy() {
    observer.disconnect();
    document.removeEventListener('DOMContentLoaded', start);
    document.removeEventListener('click', navigate, true);
    window.removeEventListener('pagehide', leave);
    window.removeEventListener('resize', paintBox);
    unmount();
    style.remove();
    delete window[key];
  }};
  document.addEventListener('click', navigate, true);
  window.addEventListener('pagehide', leave);
  window.addEventListener('resize', paintBox);
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, {once:true});
})();
