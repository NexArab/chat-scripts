(function () {
  'use strict';

  var KEY = '__CHAT_CINEMA_V1__';
  var ORIGIN = 'https://cinesrc.st';
  var API = 'https://nexarab-cinema-api.king-divel2007.workers.dev/3/';
  if (window[KEY]) window[KEY].destroy();

  var pane, host, root, shell, nav, tab, style;
  var playerHost = null, playerRoot = null, playerObserver = null;
  var structureObserver = null;
  var searchTimer, searchController, detailController;
  var searchVersion = 0, detailVersion = 0;
  var page = 1, totalPages = 1;
  var catalogueStarted = false;
  var catalogue = [];
  var filter = 'all';
  var playerJob = 0, paintJob = 0, job = 0;
  var floating = false, floatSized = false, hasPos = false;
  var gesture = null;
  var corner = '';
  var box = { x: 12, y: 70, w: 240, h: 135, ratio: 0 };
  var mode = 'tv';
  var dead = false;
  var frame = null;
  var serverIndex = 0, pinned = false;
  var suggestions = [];
  var selected = null;
  var directUrl = '';
  var loadTimer = null;
  var countdownTimer = 0;
  var cache = new Map();
  var stateObserver = new MutationObserver(schedule);

  var store = {
    get: function (k, d) {
      try {
        var v = localStorage.getItem('chatCinema:' + k);
        return v ? JSON.parse(v) : d;
      } catch (e) { return d; }
    },
    set: function (k, v) {
      try {
        localStorage.setItem('chatCinema:' + k, JSON.stringify(v));
      } catch (e) {}
    }
  };

  function clear(node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
  }

  function q(selector) {
    return (root && root.querySelector(selector)) ||
      (playerRoot && playerRoot.querySelector(selector));
  }

  function say(text) {
    var node = q('[data-status]');
    if (node) node.textContent = text;
  }

  function catalogStatus(text) {
    var node = q('[data-catalog-status]');
    if (node) node.textContent = text;
  }

  function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement ||
      (playerRoot && (playerRoot.fullscreenElement || playerRoot.webkitFullscreenElement)));
  }

  function isPseudo() {
    var s = q('.screen');
    return !!(s && s.classList.contains('pseudo-full'));
  }

  function wait(ms, signal) {
    return new Promise(function (resolve, reject) {
      var t = setTimeout(resolve, ms);
      if (signal) {
        signal.addEventListener('abort', function () {
          clearTimeout(t);
          var e = new Error('aborted');
          e.name = 'AbortError';
          reject(e);
        });
      }
    });
  }



  function pseudoFull() {
    var s = q('.screen');
    if (s) {
      s.classList.add('pseudo-full');
      s.style.display = 'block';
    }
    schedulePlayer();
  }

  function exitFull() {
    var s = q('.screen');
    if (s) s.classList.remove('pseudo-full');
    var fn = document.exitFullscreen || document.webkitExitFullscreen;
    if (fn && (document.fullscreenElement || document.webkitFullscreenElement)) {
      try {
        var r = fn.call(document);
        if (r && r.catch) r.catch(function () {});
      } catch (e) {}
    }
    schedulePlayer();
  }

  function toggleFull() {
    if (!frame) { say('اختر فيديو أولًا.'); return; }
    if (isFullscreen() || isPseudo()) { exitFull(); return; }
    var el = q('.video-wrap');
    var fn = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!fn) { pseudoFull(); return; }
    try {
      var r = fn.call(el);
      if (r && r.catch) r.catch(pseudoFull);
    } catch (e) { pseudoFull(); }
  }

  function cancelCountdown() {
    clearInterval(countdownTimer);
    countdownTimer = 0;
    var bar = q('[data-next-up]');
    if (bar) bar.hidden = true;
  }

  function startCountdown() {
    if (!selected || selected.type !== 'tv' || !frame) return;
    var epSel = q('[data-ep]'), seSel = q('[data-season]');
    var hasNext = epSel.selectedIndex < epSel.options.length - 1 ||
      seSel.selectedIndex < seSel.options.length - 1;
    if (!hasNext) return;
    cancelCountdown();
    var left = 5;
    var bar = q('[data-next-up]');
    var text = q('[data-next-text]');
    bar.hidden = false;
    text.textContent = 'الحلقة التالية خلال ' + left + ' ث';
    countdownTimer = setInterval(function () {
      left--;
      if (left <= 0) {
        cancelCountdown();
        step(1);
      } else {
        text.textContent = 'الحلقة التالية خلال ' + left + ' ث';
      }
    }, 1000);
  }

  function stop() {
    clearTimeout(loadTimer);
    cancelCountdown();
    if (frame) frame.remove();
    frame = null;
    directUrl = '';
    serverIndex = 0;
    updateServers();
    exitFull();
    dock();
    var title = q('[data-title]');
    var floatingTitle = q('.float-head strong');
    if (title) title.textContent = 'أفلام ومسلسلات';
    if (floatingTitle) floatingTitle.textContent = 'سينما · اسحب هنا';
    if (q('[data-empty]')) q('[data-empty]').hidden = false;
  }

  function mountPlayer() {
    var screen = root.querySelector('.screen');
    var slot = document.createElement('div');
    slot.setAttribute('data-player-slot', '');
    slot.style.cssText = 'width:100%;height:0;padding-top:56.25%;margin-bottom:43px;';
    screen.parentNode.insertBefore(slot, screen);

    playerHost = document.createElement('div');
    playerHost.id = 'chat-cinema-player';
    playerHost.style.cssText =
      'all:initial!important;zoom:1!important;display:block!important;' +
      'position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:0!important;' +
      'z-index:10030!important;pointer-events:none!important;';

    playerRoot = playerHost.attachShadow({ mode: 'open' });
    var css = document.createElement('style');
    css.textContent = root.querySelector('style').textContent + `
      :host{background:transparent!important;pointer-events:none!important}
      .screen{position:fixed;pointer-events:auto;direction:rtl;
        font:13px/1.6 Tahoma,sans-serif;color:#222}
      .screen.floating{clip-path:none!important}
    `;
    playerRoot.appendChild(css);
    playerRoot.appendChild(screen);
    document.documentElement.appendChild(playerHost);

    if (typeof ResizeObserver === 'function') {
      playerObserver = new ResizeObserver(schedulePlayer);
      playerObserver.observe(slot);
    }
    schedulePlayer();
  }

  function schedulePlayer() {
    if (!dead && !playerJob) playerJob = requestAnimationFrame(placePlayer);
  }

  function placePlayer() {
    playerJob = 0;
    if (!playerRoot || !pane || !pane.isConnected) return;
    if (isFullscreen() || isPseudo()) return;
    var screen = playerRoot.querySelector('.screen');

    if (floating) {
      screen.style.display = 'block';
      schedulePaint();
      return;
    }

    var slot = root.querySelector('[data-player-slot]');
    var visible = mode === 'cinema' && pane.classList.contains('active') &&
      slot.getClientRects().length > 0 &&
      getComputedStyle(host).visibility !== 'hidden';

    if (!visible) {
      screen.style.display = 'none';
      return;
    }

    var r = slot.getBoundingClientRect();
    var p = pane.getBoundingClientRect();
    var top = Math.max(r.top, p.top, 0);
    var bottom = Math.min(r.bottom, p.bottom, window.innerHeight);
    var left = Math.max(r.left, p.left, 0);
    var right = Math.min(r.right, p.right, window.innerWidth);

    if (bottom <= top || right <= left) {
      screen.style.display = 'none';
      return;
    }

    screen.style.display = 'block';
    screen.style.left = r.left + 'px';
    screen.style.top = r.top + 'px';
    screen.style.width = r.width + 'px';
    screen.style.clipPath = 'inset(' +
      Math.max(0, top - r.top) + 'px ' +
      Math.max(0, r.right - right) + 'px ' +
      Math.max(0, r.bottom - bottom) + 'px ' +
      Math.max(0, left - r.left) + 'px)';
  }

  function viewport() {
    var v = window.visualViewport;
    return {
      x: v ? v.offsetLeft : 0,
      y: v ? v.offsetTop : 0,
      w: v ? v.width : window.innerWidth,
      h: v ? v.height : window.innerHeight
    };
  }

  function fitBox() {
    var v = viewport();
    var maxW = Math.max(1, v.w - 16);
    var maxH = Math.max(1, v.h - 57);
    if (box.ratio) {
      var max = Math.min(maxW, maxH * box.ratio);
      box.w = Math.max(Math.min(200, max), Math.min(box.w, max));
      box.h = box.w / box.ratio;
    } else {
      box.w = Math.max(Math.min(200, maxW), Math.min(box.w, maxW));
      box.h = Math.max(Math.min(112, maxH), Math.min(box.h, maxH));
    }
    box.x = Math.max(v.x + 8, Math.min(box.x, v.x + v.w - box.w - 8));
    box.y = Math.max(v.y + 8, Math.min(box.y, v.y + v.h - box.h - 49));
    if (corner) {
      box.x = corner.charAt(1) === 'r' ? v.x + v.w - box.w - 8 : v.x + 8;
      box.y = corner.charAt(0) === 'b'
        ? Math.max(v.y + 8, v.y + v.h - box.h - 49) : v.y + 8;
    }
  }

  function paint() {
    paintJob = 0;
    var screen = q('.screen');
    if (!floating || !screen) return;
    fitBox();
    screen.style.left = box.x + 'px';
    screen.style.top = box.y + 'px';
    screen.style.width = box.w + 'px';
    screen.style.setProperty('--video-height', box.h + 'px');
  }

  function schedulePaint() {
    if (floating && !paintJob) paintJob = requestAnimationFrame(paint);
  }

  function saveBox() {
    store.set('box', { x: box.x, y: box.y, w: box.w, h: box.h, ratio: box.ratio, corner: corner });
  }

  function loadBox() {
    var s = store.get('box', null);
    if (!s || !isFinite(s.x) || !isFinite(s.y) || !isFinite(s.w) || !isFinite(s.h)) return;
    box.x = s.x; box.y = s.y; box.w = s.w; box.h = s.h;
    box.ratio = isFinite(s.ratio) ? s.ratio : 0;
    corner = /^[tb][lr]$/.test(s.corner || '') ? s.corner : '';
    floatSized = true;
    hasPos = true;
  }

  function snapCorner() {
    var v = viewport(), m = 40;
    var l = box.x - (v.x + 8);
    var r = (v.x + v.w - 8) - (box.x + box.w);
    var t = box.y - (v.y + 8);
    var b = (v.y + v.h - 49) - (box.y + box.h);
    if (Math.min(l, r) < m && Math.min(t, b) < m) {
      corner = (b < t ? 'b' : 't') + (r < l ? 'r' : 'l');
      schedulePaint();
    }
  }

  function endGesture() {
    if (gesture) {
      var current = gesture;
      gesture = null;
      try {
        if (current.node.hasPointerCapture(current.id)) {
          current.node.releasePointerCapture(current.id);
        }
      } catch (error) {}
    }
    if (q('.screen')) q('.screen').classList.remove('moving');
  }

  function dock() {
    floating = false;
    endGesture();
    if (paintJob) cancelAnimationFrame(paintJob);
    paintJob = 0;
    var screen = q('.screen');
    if (screen) {
      var keepPseudo = screen.classList.contains('pseudo-full');
      screen.classList.remove('floating');
      screen.removeAttribute('style');
      if (keepPseudo) screen.style.display = 'block';
    }
    if (q('[data-float]')) q('[data-float]').textContent = '▣ نافذة عائمة';
    if (frame && pane &&
        (!pane.classList.contains('active') || !pane.getClientRects().length)) {
      var openButton = document.getElementById('chat-tv-open');
      if (openButton) openButton.click();
    }
    schedulePlayer();
  }

  function toggleFloat() {
    if (floating) { dock(); return; }
    if (!frame) { say('اختر فيلمًا أو حلقة أولًا.'); return; }
    if (isFullscreen() || isPseudo()) { say('اخرج من ملء الشاشة أولًا.'); return; }

    var v = viewport();
    if (!floatSized) {
      box.w = v.w <= 600 ? 240 : 340;
      box.h = box.w * 9 / 16;
      floatSized = true;
    }
    if (!hasPos) {
      box.x = v.x + 16;
      box.y = v.y + 80;
      hasPos = true;
    }
    floating = true;
    var screen = q('.screen');
    screen.style.display = 'block';
    screen.style.clipPath = 'none';
    screen.classList.add('floating');
    q('[data-float]').textContent = '↩ إرجاع للقائمة';
    paint();
  }

  function scaleFloat(factor) {
    box.w *= factor;
    box.h *= factor;
    paint();
    saveBox();
  }

  function bindGesture(node, kind) {
    node.addEventListener('pointerdown', function (event) {
      if (!floating || pinned || event.button !== 0 || gesture ||
          (kind === 'drag' && event.target.closest('button,select'))) return;
      corner = '';
      gesture = {
        node: node, id: event.pointerId, kind: kind,
        x: event.clientX, y: event.clientY,
        bx: box.x, by: box.y, w: box.w, h: box.h
      };
      try { node.setPointerCapture(event.pointerId); } catch (error) {}
      q('.screen').classList.add('moving');
      event.preventDefault();
    });

    node.addEventListener('pointermove', function (event) {
      var current = gesture;
      if (!current || current.id !== event.pointerId) return;
      var dx = event.clientX - current.x;
      var dy = event.clientY - current.y;
      if (current.kind === 'drag') {
        box.x = current.bx + dx;
        box.y = current.by + dy;
      } else {
        box.w = Math.max(200, current.w + dx);
        box.h = box.w * 9 / 16;
      }
      schedulePaint();
    });

    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (name) {
      node.addEventListener(name, function (event) {
        if (gesture && gesture.id === event.pointerId) {
          var wasDrag = gesture.kind === 'drag';
          endGesture();
          if (wasDrag) snapCorner();
          saveBox();
        }
      });
    });
  }

  var TEMPLATE = `
    <style>
      :host{display:block;direction:rtl;color:#222;background:#fff;font:13px/1.6 Tahoma,sans-serif}
      *{box-sizing:border-box}
      [hidden]{display:none!important}
      button,input,select{font:inherit}
      button{cursor:pointer;border:1px solid #bbb;border-radius:7px;padding:8px;color:#111;background:#fff}
      button:disabled{opacity:.5;cursor:default}
      button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #a00;outline-offset:2px}
      form,.tools{display:flex;gap:6px;margin:10px 0}
      .tools{flex-wrap:wrap}
      .tools button{flex:1}
      .tools button[aria-pressed="true"]{background:#eee}
      input{width:100%;min-width:0;border:1px solid #aaa;border-radius:7px;padding:9px;background:#fff;color:#111}
      select{width:100%;max-width:100%;min-width:0;padding:8px;box-sizing:border-box}
      .screen{width:100%;background:#fff;border-radius:8px;overflow:hidden}
      .video-wrap{position:relative;width:100%;aspect-ratio:16/9;background:#090b0f;color:#fff;display:grid;place-items:center}
      @supports not (aspect-ratio:1){
        .video-wrap{height:0;padding-top:56.25%}
        .floating .video-wrap{padding-top:0;height:var(--video-height)}
      }
      iframe{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;border:0;display:block}
      .screen.floating{position:fixed;z-index:10030;right:auto;bottom:auto;margin:0;border:1px solid #666;border-radius:10px;box-shadow:0 8px 30px #0006;background:#111}
      .floating .video-wrap{height:var(--video-height);aspect-ratio:auto}
      .float-head,.resize-edge,.exit-full,.float-foot{display:none}
      .server-bar{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;padding:5px 3px;background:#f3f3f5}
      .server-bar button{padding:5px 1px;font-size:11px;min-width:0;border-color:#ddd}
      .server-bar button[aria-pressed="true"]{background:#343a40;color:#fff;border-color:#343a40}
      .floating .server-bar{background:#252a32}
      .floating .server-bar button{background:#454b55;color:#fff;border-color:#555}
      .floating .server-bar button[aria-pressed="true"]{background:#fff;color:#222}
      .floating .float-foot{display:none!important}
      .float-head .head-scale{display:flex;align-items:center;justify-content:center;gap:5px;flex:0 0 auto;margin:0 auto}
      .float-head .head-scale button{width:25px;height:25px;font:700 15px/23px Tahoma,sans-serif;border-color:#ffffff40;background:#ffffff16;color:white}
      .floating .server-bar{gap:3px;padding:3px 4px;background:#343a40}
      .floating .server-bar button{border-radius:5px;padding:3px 1px;font-size:10px;line-height:1.3;min-height:25px}
      .floating .server-bar button[aria-pressed="true"]{background:#fff;color:#252a32}
      .floating .resize-edge{height:0!important}
      .floating .resize-edge{position:absolute;right:0;bottom:0;width:25px;height:28px;background:transparent;z-index:2;display:block}
      .floating [data-resize]{right:0;left:auto;bottom:0;width:25px;height:28px;cursor:nwse-resize;background:transparent;color:#fff}
      .float-head button[aria-pressed="true"]{background:#f9d86c;color:#111}
      .selected-show{display:flex;align-items:center;gap:9px;margin-bottom:9px}
      .selected-show img{width:55px;height:82px;object-fit:cover;border-radius:6px}
      .selected-show strong{font-size:13px}
      [data-episode]{display:block;border:1px solid #ddd;border-radius:9px;padding:10px;background:#f8f8fa;margin:10px 0}
      .episode-fields{display:flex;gap:7px;margin-bottom:8px}
      .episode-fields label{flex:1;min-width:0}
      [data-episode] button[type=submit]{width:100%;background:#343a40;color:#fff}
      .catalog-heading{font-weight:700;font-size:13px;margin:12px 0 7px}
      .catalog-group{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
      .suggestions{border:1px solid #ddd;border-radius:7px;margin:3px 0 6px;overflow:hidden}
      .suggestions button{display:block;width:100%;text-align:right;border:0;border-bottom:1px solid #eee;border-radius:0;padding:6px 9px}
      .result.is-selected{border-color:#555;background:#eee}

      .floating .float-head{display:flex;height:39px;align-items:center;gap:4px;padding:5px 7px;background:var(--cinema-accent,#343a40);color:white;touch-action:none;user-select:none;-webkit-user-select:none;cursor:grab}
      .float-head strong{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:700 11px/1.5 Tahoma,sans-serif}
      .float-head button{width:29px;height:29px;padding:0;flex-shrink:0;border:1px solid #ffffff70;border-radius:5px;font:700 18px/25px Tahoma,sans-serif}
      .floating .resize-edge{display:block}
      [data-resize]{position:absolute;right:0;bottom:0;width:25px;height:28px;text-align:center;line-height:28px;font-size:16px;color:#fff;cursor:nwse-resize;touch-action:none;user-select:none;-webkit-user-select:none}
      [data-resize]:focus-visible{outline:2px solid #fff;outline-offset:-2px}
      .screen.moving iframe{pointer-events:none}
      .video-wrap:-webkit-full-screen{width:100vw!important;height:100vh!important;aspect-ratio:auto;padding:0;border-radius:0}
      .video-wrap:fullscreen{width:100vw!important;height:100vh!important;aspect-ratio:auto;padding:0;border-radius:0}
      .screen.pseudo-full{position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:0!important;width:100%!important;height:100vh!important;height:100dvh!important;z-index:2147483647;clip-path:none!important;border-radius:0;border:0;display:block!important;background:#000}
      .pseudo-full .video-wrap{height:100%!important;padding:0;aspect-ratio:auto;border-radius:0}
      .pseudo-full .float-head,.pseudo-full .resize-edge{display:none!important}
      .pseudo-full .exit-full{display:block}
      .exit-full{position:absolute;top:10px;left:10px;z-index:6;background:#000b;color:#fff;border:1px solid #fff6;font-size:18px;line-height:1;padding:6px 11px}
      .next-up{position:absolute;bottom:10px;left:10px;right:10px;z-index:5;display:flex;gap:6px;align-items:center;background:#000d;color:#fff;border-radius:8px;padding:6px 8px;font-size:12px}
      .next-up span{flex:1}
      .next-up button{padding:4px 9px}
      [data-empty]{padding:15px;text-align:center}
      [data-status],[data-catalog-status]{font-size:12px;color:#555}
      [data-resume]{width:100%;margin:6px 0}
      [data-results]{display:block}
      [data-results]>.catalog-group{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
      [data-results] .result{display:flex;flex-direction:column;align-items:stretch;gap:3px;width:100%;min-width:0;margin:0;padding:3px;white-space:normal;text-align:right}
      [data-results] img{width:100%;max-width:100%;height:auto;aspect-ratio:2/3;object-fit:cover;border-radius:6px}
      [data-results] strong{font-size:11px;overflow-wrap:anywhere;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      small{display:block;color:#666;font-size:11px;margin-top:4px}
      [data-episode] label{flex:1;min-width:0}
      [data-more]{width:100%;margin:10px 0}
      details{margin-top:12px;font-size:11px}
      summary{cursor:pointer}
      @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
    </style>

    <strong data-title>أفلام ومسلسلات</strong>
    <div class="screen">
      <div class="float-head">
        <strong>سينما · اسحب هنا</strong>
        <span class="head-scale"><button type="button" data-shrink title="تصغير">−</button><button type="button" data-grow title="تكبير">+</button></span>
        <button type="button" data-pin title="تثبيت مكان النافذة" aria-pressed="false">📌</button>
        <button type="button" data-dock title="إرجاع للقائمة">↩</button>
        <button type="button" data-float-close title="إيقاف وإغلاق">×</button>
      </div>
      <div class="video-wrap">
        <span data-empty>اختر فيلمًا أو مسلسلًا بالأسفل</span>
        <button type="button" class="exit-full" data-exit-full aria-label="خروج من ملء الشاشة">×</button>
        <div class="next-up" data-next-up hidden>
          <span data-next-text></span>
          <button type="button" data-next-now>الآن</button>
          <button type="button" data-next-cancel>إلغاء</button>
        </div>
      </div>
      <div class="server-bar" data-servers>
        <button type="button" data-server="0" aria-pressed="true">سيرفر 1</button>
        <button type="button" data-server="1" aria-pressed="false">سيرفر 2</button>
        <button type="button" data-server="2" aria-pressed="false">سيرفر 3</button>
        <button type="button" data-server="3" aria-pressed="false">سيرفر 4</button>
      </div>
      <div class="resize-edge">
        <span data-resize role="button" tabindex="0"
          aria-label="تغيير العرض والارتفاع بالسحب أو الأسهم">⤡</span>
      </div>
    </div>

    <div class="tools">
      <button type="button" data-stop>■ إيقاف</button>
      <button type="button" data-full>⛶ ملء الشاشة</button>
      <button type="button" data-float>▣ نافذة عائمة</button>
    </div>
    <div class="tools" data-nav hidden>
      <button type="button" data-prev>⏮ الحلقة السابقة</button>
      <button type="button" data-next>الحلقة التالية ⏭</button>
    </div>
    <div class="tools" hidden>
      <button type="button" data-shape="free">حر</button>
      <button type="button" data-shape="wide">مستطيل</button>
      <button type="button" data-shape="square">مربع</button>
      <button type="button" data-scale="1.15" aria-label="تكبير">＋</button>
      <button type="button" data-scale="0.87" aria-label="تصغير">−</button>
    </div>
    <p data-status role="status">اختر عنوانًا. توفر التشغيل والترجمة يعتمد على مصدر المشاهدة.</p>
    <button type="button" data-resume hidden></button>
    <form data-episode hidden>
      <div class="selected-show"><img data-selected-poster alt="" hidden><strong data-selected-name></strong></div>
      <div class="episode-fields"><label>الموسم <select data-season required></select></label>
      <label>الحلقة <select data-ep required></select></label></div>
      <button type="submit">▶ تشغيل الحلقة</button>
    </form>
    <label>ابحث عن فيلم أو مسلسل
      <input data-search type="search" placeholder="اسم الفيلم أو المسلسل" maxlength="150">
    </label>
    <div class="suggestions" data-suggestions hidden></div>
    <div class="tools">
      <button type="button" data-filter="all" aria-pressed="true">الكل</button>
      <button type="button" data-filter="movie">أفلام</button>
      <button type="button" data-filter="tv">مسلسلات</button>
    </div>
    <p data-catalog-status role="status"></p>
    <div data-results></div>
    <button data-more type="button" hidden>عرض المزيد</button>
    <details>
      <summary>مصدر معلومات الأفلام</summary>
      <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
        <img alt="TMDB" width="90"
          src="https://www.themoviedb.org/assets/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg">
      </a>
      <p dir="ltr">This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.</p>
      <p>بيانات الفهرس لا تعني توفر جميع العناوين للمشاهدة.</p>
      <p>اختصارات: F ملء الشاشة · M نافذة عائمة · N التالية · P السابقة · Esc خروج</p>
    </details>
  `;

  async function tmdb(path, params, signal) {
    var url = new URL(API + path);
    Object.keys(params || {}).forEach(function (key) {
      url.searchParams.set(key, params[key]);
    });
    var key = url.href;
    var hit = cache.get(key);
    if (hit && Date.now() - hit.t < 300000) return hit.data;

    var attempt = 0;
    while (true) {
      try {
        var response = await fetch(key, { signal: signal, credentials: 'omit' });
        if (!response.ok) {
          var err = new Error(response.status === 429
            ? 'طلبات كثيرة، انتظر قليلًا ثم أعد المحاولة.'
            : 'تعذر جلب البيانات. حاول مرة أخرى.');
          err.fatal = response.status < 500 && response.status !== 429;
          throw err;
        }
        var data = await response.json();
        cache.set(key, { t: Date.now(), data: data });
        if (cache.size > 100) cache.delete(cache.keys().next().value);
        return data;
      } catch (error) {
        if (error.name === 'AbortError' || error.fatal || attempt >= 2) throw error;
        await wait(800 * Math.pow(2, attempt), signal);
        attempt++;
      }
    }
  }

  function updateServers() {
    if (!root) return;
    root.querySelectorAll('[data-server]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(Number(b.dataset.server) === serverIndex));
    });
    if (playerRoot) playerRoot.querySelectorAll('[data-server]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(Number(b.dataset.server) === serverIndex));
    });
  }

  function scrollToPlayer() {
    if (floating || !root) return;
    var slot = root.querySelector('[data-player-slot]');
    if (slot) {
      var scrollParent = slot.parentElement;
      while (scrollParent && scrollParent !== pane && scrollParent !== document.body) {
        if (scrollParent.scrollHeight > scrollParent.clientHeight + 5) break;
        scrollParent = scrollParent.parentElement;
      }
      if (scrollParent && scrollParent !== document.body) scrollParent.scrollTop = 0;
    }
  }

  function showSuggestions(value) {
    var holder = q('[data-suggestions]');
    clear(holder);
    if (!value) { holder.hidden = true; return; }
    var term = value.toLocaleLowerCase();
    var hits = suggestions.filter(function (item) {
      return item.title.toLocaleLowerCase().includes(term);
    }).slice(0, 6);
    hits.forEach(function (item) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = item.title + ' · ' + (item.type === 'tv' ? 'مسلسل' : 'فيلم');
      b.onclick = function () {
        q('[data-search]').value = item.title;
        holder.hidden = true;
        chooseTitle(item);
      };
      holder.appendChild(b);
    });
    holder.hidden = !hits.length;
  }

  function queueSearch() {
    clearTimeout(searchTimer);
    searchVersion++;
    if (searchController) searchController.abort();
    q('[data-more]').hidden = true;
    var value = q('[data-search]').value.trim();
    showSuggestions(value);
    if (value.length === 1) {
      catalogStatus('اقتراحات من العناوين المحمّلة. اكتب حرفاً آخر للبحث الشامل.');
      return;
    }
    catalogStatus('جارٍ البحث…');
    searchTimer = setTimeout(function () { render(false); }, 400);
  }

  function addCard(entry, kind, parent) {
    var type = entry.media_type || kind;
    if (entry.adult || ['movie', 'tv'].indexOf(type) < 0 || !Number.isInteger(entry.id)) return;
    var item = {
      id: entry.id, type: type, title: entry.title || entry.name || '',
      year: (entry.release_date || entry.first_air_date || '').slice(0, 4),
      poster: entry.poster_path || ''
    };
    if (catalogue.some(function (x) { return x.id === item.id && x.type === item.type; })) return;
    catalogue.push(item);
    if (!suggestions.some(function (x) { return x.id === item.id && x.type === item.type; })) suggestions.push(item);
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'result';
    if (/^\/[a-zA-Z0-9_.-]+$/.test(item.poster)) {
      var img = document.createElement('img');
      img.src = 'https://image.tmdb.org/t/p/w185' + item.poster;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = function () { img.remove(); };
      button.appendChild(img);
    }
    var title = document.createElement('strong');
    title.textContent = item.title;
    var meta = document.createElement('small');
    meta.textContent = item.year;
    button.appendChild(title);
    button.appendChild(meta);
    button.onclick = function () { chooseTitle(item); };
    parent.appendChild(button);
  }

  async function render(append) {
    if (dead || !root) return;
    clearTimeout(searchTimer);
    var query = q('[data-search]').value.trim();
    if (query.length === 1) return;
    if (searchController) searchController.abort();
    var ctrl = new AbortController();
    searchController = ctrl;
    var version = ++searchVersion;
    var currentRoot = root;
    var requestedPage = append ? page + 1 : 1;
    var kind = filter;
    q('[data-more]').hidden = true;
    if (!append) { catalogue = []; clear(q('[data-results]')); }
    catalogStatus(query ? 'جارٍ البحث…' : 'جارٍ تحميل الرائج…');
    var timeout = setTimeout(function () { if (version === searchVersion) ctrl.abort(); }, 15000);
    try {
      var results;
      if (!query && kind === 'all') {
        results = await Promise.all([
          tmdb('trending/movie/week', { page: requestedPage }, ctrl.signal),
          tmdb('trending/tv/week', { page: requestedPage }, ctrl.signal)
        ]);
      } else {
        results = [await tmdb(query ? 'search/' + (kind === 'all' ? 'multi' : kind) : 'trending/' + kind + '/week',
          { query: query, page: requestedPage, include_adult: false }, ctrl.signal)];
      }
      if (dead || version !== searchVersion || currentRoot !== root) return;
      page = requestedPage;
      totalPages = Math.min(500, Math.min.apply(null, results.map(function (x) { return Number(x.total_pages) || 1; })));
      results.forEach(function (data, i) {
        var groupKind = results.length === 2 ? (i === 0 ? 'movie' : 'tv') : kind;
        var heading = document.createElement('div');
        heading.className = 'catalog-heading';
        heading.textContent = results.length === 2 ? (i === 0 ? '🎬 أفلام رائجة' : '📺 مسلسلات رائجة') : (query ? 'نتائج البحث' : 'الرائج هذا الأسبوع');
        var group = document.createElement('div');
        group.className = 'catalog-group';
        q('[data-results]').appendChild(heading);
        q('[data-results]').appendChild(group);
        (data.results || []).forEach(function (entry) { addCard(entry, groupKind, group); });
      });
      catalogStatus(catalogue.length ? '' : 'لا توجد نتائج.');
      q('[data-more]').hidden = page >= totalPages;
      showSuggestions(query);
    } catch (error) {
      if (dead || version !== searchVersion || currentRoot !== root) return;
      catalogStatus(error.name === 'AbortError' ? 'انتهت مهلة الاتصال. أعد البحث.' : error.message);
      var retry = document.createElement('button');
      retry.type = 'button'; retry.textContent = 'إعادة المحاولة';
      retry.onclick = function () { retry.remove(); render(append); };
      q('[data-results]').appendChild(retry);
    } finally { clearTimeout(timeout); }
  }

  function option(select, value, label) {
    var node = document.createElement('option');
    node.value = value;
    node.textContent = label;
    select.appendChild(node);
  }

  async function chooseTitle(item, opts) {
    opts = opts || {};
    selected = item;
    q('[data-selected-name]').textContent = item.title + ' · اختر الموسم والحلقة';
    var poster = q('[data-selected-poster]');
    poster.hidden = !/^\/[a-zA-Z0-9_.-]+$/.test(item.poster || '');
    if (!poster.hidden) poster.src = 'https://image.tmdb.org/t/p/w185' + item.poster;
    if (detailController) detailController.abort();
    var version = ++detailVersion;
    var currentRoot = root;
    q('[data-episode]').hidden = item.type !== 'tv';
    q('[data-suggestions]').hidden = true;
    q('[data-nav]').hidden = item.type !== 'tv';
    if (item.type !== 'tv') {
      play();
      return;
    }
    q('[data-episode]').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    var seSel = q('[data-season]');
    clear(seSel);
    clear(q('[data-ep]'));
    q('[data-episode] button').disabled = true;
    say('جارٍ تحميل مواسم ' + item.title);
    detailController = new AbortController();

    try {
      var data = await tmdb('tv/' + item.id, {}, detailController.signal);
      if (dead || version !== detailVersion || currentRoot !== root) return;
      (data.seasons || []).filter(function (season) {
        return season.season_number > 0 && season.episode_count > 0;
      }).forEach(function (season) {
        option(seSel, season.season_number,
          season.name || 'الموسم ' + season.season_number);
      });
      if (!seSel.options.length) {
        say('لا توجد مواسم متاحة في الفهرس.');
        return;
      }
      if (Number.isInteger(opts.season)) {
        seSel.value = String(opts.season);
        if (seSel.selectedIndex < 0) seSel.selectedIndex = 0;
      }
      var ok = await loadEpisodes(opts.ep);
      if (ok && opts.play && selected === item && !dead) play();
    } catch (error) {
      if (!dead && version === detailVersion && currentRoot === root &&
          error.name !== 'AbortError') {
        say(error.message + ' اختر المسلسل لإعادة المحاولة.');
      }
    }
  }

  async function loadEpisodes(target) {
    if (!selected || selected.type !== 'tv') return false;
    if (detailController) detailController.abort();
    detailController = new AbortController();
    var version = ++detailVersion;
    var currentRoot = root;
    var id = selected.id;
    var season = Number(q('[data-season]').value);
    var epSel = q('[data-ep]');

    clear(epSel);
    q('[data-episode] button').disabled = true;
    say('جارٍ تحميل الحلقات…');

    try {
      var data = await tmdb('tv/' + id + '/season/' + season, {}, detailController.signal);
      if (dead || version !== detailVersion || currentRoot !== root) return false;
      (data.episodes || []).filter(function (episode) {
        return episode.episode_number > 0;
      }).forEach(function (episode) {
        option(epSel, episode.episode_number,
          episode.episode_number + ' — ' + (episode.name || 'حلقة'));
      });
      if (epSel.options.length) {
        if (target === 'last') {
          epSel.selectedIndex = epSel.options.length - 1;
        } else if (Number.isInteger(target)) {
          epSel.value = String(target);
          if (epSel.selectedIndex < 0) epSel.selectedIndex = 0;
        } else {
          epSel.selectedIndex = 0;
        }
      }
      q('[data-episode] button').disabled = !epSel.options.length;
      say(epSel.options.length
        ? 'اختر الموسم والحلقة ثم اضغط تشغيل.' : 'لا توجد حلقات في الفهرس.');
      return epSel.options.length > 0;
    } catch (error) {
      if (!dead && version === detailVersion && currentRoot === root &&
          error.name !== 'AbortError') {
        say(error.message + ' أعد اختيار الموسم للمحاولة.');
      }
      return false;
    }
  }

  async function step(dir) {
    if (!selected || selected.type !== 'tv') return;
    cancelCountdown();
    var epSel = q('[data-ep]'), seSel = q('[data-season]');
    var i = epSel.selectedIndex + dir;
    if (i >= 0 && i < epSel.options.length) {
      epSel.selectedIndex = i;
      play();
      return;
    }
    var j = seSel.selectedIndex + dir;
    if (j < 0 || j >= seSel.options.length) {
      say(dir > 0 ? 'هذه آخر حلقة متاحة.' : 'هذه أول حلقة.');
      return;
    }
    seSel.selectedIndex = j;
    var ok = await loadEpisodes(dir > 0 ? undefined : 'last');
    if (ok) play();
  }

  function saveProgress(season, episode) {
    if (!selected) return;
    store.set('last', {
      id: selected.id, type: selected.type, title: selected.title,
      year: selected.year || '', season: season, ep: episode
    });
    updateResume();
  }

  function updateResume() {
    var b = q('[data-resume]');
    if (!b) return;
    var last = store.get('last', null);
    if (!last || !Number.isInteger(last.id) ||
        (last.type !== 'movie' && last.type !== 'tv')) {
      b.hidden = true;
      return;
    }
    b.hidden = false;
    b.textContent = '▶ متابعة: ' + last.title +
      (last.type === 'tv' ? ' · ' + last.season + ' / ' + last.ep : '');
    b.onclick = function () {
      chooseTitle(
        { id: last.id, type: last.type, title: String(last.title || ''), year: last.year || '' },
        { season: Number(last.season), ep: Number(last.ep), play: true }
      );
    };
  }

  function stopOthers() {
    var close = document.querySelector('#chat-tv-floating [data-float-close]');
    if (close) close.click();
    var tvStop = pane.querySelector('[data-tv-stop]');
    if (tvStop) tvStop.click();
    var yt = document.getElementById('chat-youtube-panel');
    var ytStop = yt && yt.shadowRoot && yt.shadowRoot.querySelector('[data-stop]');
    if (ytStop) ytStop.click();
    document.querySelectorAll('#settings [data-kr-stop]').forEach(function (button) {
      button.click();
    });
  }

  function activate() {
    if (mode === 'cinema') {
      schedulePlayer();
      return;
    }
    var tvTab = nav && nav.querySelector('[data-mode="tv"]');
    if (tvTab) tvTab.click();
    stopOthers();
    mode = 'cinema';
    pane.classList.add('chat-cinema-mode');
    nav.querySelectorAll('button').forEach(function (button) {
      button.setAttribute('aria-pressed', 'false');
    });
    tab.setAttribute('aria-pressed', 'true');
    if (!catalogueStarted) {
      catalogueStarted = true;
      render(false);
    }
    schedulePlayer();
  }

  function deactivate() {
    if (mode !== 'cinema') return;
    mode = 'tv';
    stop();
    if (pane) pane.classList.remove('chat-cinema-mode');
    if (tab) tab.setAttribute('aria-pressed', 'false');
  }

  function setTitle(season, episode) {
    if (!selected) return;
    var title = selected.title +
      (selected.type === 'tv' ? ' · ' + season + ' / ' + episode : '');
    q('[data-title]').textContent = title;
    q('.float-head strong').textContent = title;
  }

  function sourceUrl(season, episode) {
    if (serverIndex === 0) {
      var u = new URL('/embed/' + selected.type + '/' + selected.id, ORIGIN);
      u.searchParams.set('autoplay', 'false');
      u.searchParams.set('back', 'close');
      u.searchParams.set('autonext', 'false');
      if (selected.type === 'tv') { u.searchParams.set('s', season); u.searchParams.set('e', episode); }
      return u.href;
    }
    var domains = ['', 'https://vidrock.net', 'https://vidcore.net', 'https://vidfast.vc'];
    var path = selected.type === 'tv'
      ? '/tv/' + selected.id + '/' + season + '/' + episode
      : '/movie/' + selected.id;
    return domains[serverIndex] + path;
  }

  function play() {
    if (!selected) return;
    if (mode !== 'cinema') activate();
    var season = Number(q('[data-season]').value);
    var episode = Number(q('[data-ep]').value);
    if (selected.type === 'tv' && (
      !Number.isInteger(season) || season < 1 || season > 999 ||
      !Number.isInteger(episode) || episode < 1 || episode > 9999
    )) {
      say('أدخل رقم موسم وحلقة صحيحًا.');
      return;
    }

    stopOthers();
    clearTimeout(loadTimer);
    cancelCountdown();
    if (frame) frame.remove();
    directUrl = sourceUrl(season, episode);
    frame = document.createElement('iframe');
    // CineSrc works sandboxed. Other tested embeds explicitly reject sandbox.
    // Only these fixed, reviewed provider URLs are ever loaded without it.
    if (serverIndex === 0) frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
    frame.title = selected.title;
    frame.allow = 'autoplay; fullscreen; picture-in-picture';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.src = directUrl;
    updateServers();
    q('.video-wrap').appendChild(frame);
    q('[data-empty]').hidden = true;
    q('[data-nav]').hidden = selected.type !== 'tv';
    setTitle(season, episode);
    saveProgress(season, episode);
    say('السيرفر ' + (serverIndex + 1) + ': اضغط تشغيل داخل المشغّل، واختر الترجمة إن توفرت.');
    loadTimer = setTimeout(function () {
      if (frame) say('تأخر السيرفر ' + (serverIndex + 1) + '؟ اختر سيرفراً آخر من الأزرار تحت الفيديو.');
    }, 45000);
    schedulePlayer();
    scrollToPlayer();
  }

  async function onMessage(event) {
    if (!frame || event.source !== frame.contentWindow ||
        event.origin !== ORIGIN || serverIndex !== 0 || !event.data) return;
    var data = event.data;

    if (data.type === 'cinesrc:ready' || data.type === 'cinesrc:play') {
      clearTimeout(loadTimer);
    }
    if (data.type === 'cinesrc:play') say('بدأ التشغيل.');
    if (data.type === 'cinesrc:error') {
      clearTimeout(loadTimer);
      say('تعذّر تشغيل هذا المصدر. جرّب مصدرًا آخر داخل المشغّل.');
    }
    if (data.type === 'cinesrc:close') stop();
    if (data.type === 'cinesrc:ended') startCountdown();

    if (data.type === 'cinesrc:nextepisode' && selected && selected.type === 'tv' &&
        Number.isInteger(data.season) && data.season > 0 &&
        Number.isInteger(data.episode) && data.episode > 0 && directUrl) {
      var currentFrame = frame;
      var currentItem = selected;
      var nextUrl = new URL(directUrl);
      if (nextUrl.pathname !== '/embed/tv/' + currentItem.id) return;

      var seasonSelect = q('[data-season]');
      var episodeSelect = q('[data-ep]');
      if (!Array.from(seasonSelect.options).some(function (opt) {
        return Number(opt.value) === data.season;
      })) return;

      if (Number(seasonSelect.value) !== data.season || !episodeSelect.options.length) {
        seasonSelect.value = String(data.season);
        var loading = loadEpisodes(data.episode);
        var version = detailVersion;
        var loaded = await loading;
        if (!loaded || dead || frame !== currentFrame || selected !== currentItem ||
            detailVersion !== version || Number(seasonSelect.value) !== data.season) return;
      }

      if (!Array.from(episodeSelect.options).some(function (opt) {
        return Number(opt.value) === data.episode;
      })) return;

      episodeSelect.value = String(data.episode);
      nextUrl.searchParams.set('s', data.season);
      nextUrl.searchParams.set('e', data.episode);
      directUrl = nextUrl.href;
      setTitle(data.season, data.episode);
      saveProgress(data.season, data.episode);
    }
  }

  function onKey(event) {
    if (dead || mode !== 'cinema' ||
        event.ctrlKey || event.metaKey || event.altKey) return;
    var t = event.composedPath ? event.composedPath()[0] : event.target;
    if (t && (/^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName || '') || t.isContentEditable)) return;

    if (event.key === 'Escape') {
      if (isFullscreen() || isPseudo()) { exitFull(); event.preventDefault(); }
      else if (floating) { dock(); event.preventDefault(); }
      return;
    }
    if (!frame) return;
    var handled = true;
    switch (event.code) {
      case 'KeyF': toggleFull(); break;
      case 'KeyM': toggleFloat(); break;
      case 'KeyN': step(1); break;
      case 'KeyP': step(-1); break;
      default: handled = false;
    }
    if (handled) event.preventDefault();
  }

  function cleanup() {
    mode = 'tv';
    stop();
    stateObserver.disconnect();
    if (playerObserver) playerObserver.disconnect();
    if (pane) pane.classList.remove('chat-cinema-mode');
    [tab, shell, playerHost].forEach(function (node) {
      if (node) node.remove();
    });
    tab = shell = root = playerRoot = playerHost = null;
  }

  function mount() {
    var nextPane = document.getElementById('chat-tv');
    var nextNav = document.querySelector('#dpnl .chat-youtube-tabs');
    if (!nextPane || !nextNav) return;

    var snapshot = null;
    if (root && frame && selected) {
      snapshot = {
        item: selected,
        season: Number(q('[data-season]').value),
        ep: Number(q('[data-ep]').value)
      };
    }

    cleanup();
    pane = nextPane;
    nav = nextNav;
    host = document.getElementById('dpnl');
    tab = document.createElement('button');
    tab.type = 'button';
    tab.id = 'chat-cinema-tab';
    tab.textContent = 'نتفلكس';
    tab.setAttribute('aria-pressed', 'false');
    tab.onclick = activate;
    nav.appendChild(tab);

    shell = document.createElement('div');
    shell.id = 'chat-cinema-panel';
    root = shell.attachShadow({ mode: 'open' });
    root.innerHTML = TEMPLATE;
    pane.appendChild(shell);
    mountPlayer();

    var accent = getComputedStyle(pane).getPropertyValue('--tv-accent').trim();
    if (accent) playerHost.style.setProperty('--cinema-accent', accent);
    q('[data-search]').oninput = queueSearch;
    q('[data-search]').onkeydown = function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        render(false);
      }
    };
    q('[data-more]').onclick = function () { render(true); };
    q('[data-season]').onchange = function () { loadEpisodes(); };
    q('[data-episode]').onsubmit = function (event) {
      event.preventDefault();
      play();
    };

    root.querySelectorAll('[data-filter]').forEach(function (button) {
      button.onclick = function () {
        filter = button.dataset.filter;
        root.querySelectorAll('[data-filter]').forEach(function (item) {
          item.setAttribute('aria-pressed', String(item === button));
        });
        render(false);
      };
    });

    q('[data-stop]').onclick = stop;
    q('[data-float-close]').onclick = stop;
    q('[data-dock]').onclick = dock;
    q('[data-float]').onclick = toggleFloat;
    q('[data-full]').onclick = toggleFull;
    q('[data-exit-full]').onclick = exitFull;
    q('[data-prev]').onclick = function () { step(-1); };
    q('[data-next]').onclick = function () { step(1); };
    q('[data-next-now]').onclick = function () { cancelCountdown(); step(1); };
    q('[data-next-cancel]').onclick = cancelCountdown;

    playerRoot.querySelectorAll('[data-server]').forEach(function (b) {
      b.onclick = function () {
        var next = Number(b.dataset.server);
        if (next === serverIndex) return;
        serverIndex = next;
        updateServers();
        if (selected && frame) play();
      };
    });
    q('[data-pin]').onclick = function () {
      pinned = !pinned;
      q('[data-pin]').setAttribute('aria-pressed', String(pinned));
      q('[data-pin]').textContent = '📌';
      q('[data-pin]').title = pinned ? 'فك التثبيت' : 'تثبيت مكان النافذة';
    };
    q('[data-grow]').onclick = function () { if (floating && !pinned) scaleFloat(1.08); };
    q('[data-shrink]').onclick = function () { if (floating && !pinned) scaleFloat(1/1.08); };
    root.querySelectorAll('[data-scale]').forEach(function (button) {
      button.onclick = function () {
        if (!floating) toggleFloat();
        if (floating) scaleFloat(Number(button.dataset.scale));
      };
    });

    root.querySelectorAll('[data-shape]').forEach(function (button) {
      button.onclick = function () {
        if (!floating) toggleFloat();
        if (!floating) return;
        var shape = button.dataset.shape;
        box.ratio = shape === 'wide' ? 16 / 9 : shape === 'square' ? 1 : 0;
        if (box.ratio) box.h = box.w / box.ratio;
        paint();
        saveBox();
      };
    });

    bindGesture(q('.float-head'), 'drag');
    bindGesture(q('[data-resize]'), 'resize');
    q('[data-resize]').onkeydown = function (event) {
      var arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
      if (!floating || arrows.indexOf(event.key) < 0) return;
      event.preventDefault();
      var stepSize = event.shiftKey ? 30 : 10;
      if (event.key === 'ArrowLeft') box.w -= stepSize;
      if (event.key === 'ArrowRight') box.w += stepSize;
      if (event.key === 'ArrowUp') box.h -= stepSize;
      if (event.key === 'ArrowDown') box.h += stepSize;
      if (box.ratio) box.h = box.w / box.ratio;
      paint();
      saveBox();
    };

    for (var node = pane; node; node = node.parentElement) {
      stateObserver.observe(node, {
        attributes: true, attributeFilter: ['class', 'style', 'hidden']
      });
    }
    catalogueStarted = false;
    updateResume();
    if (snapshot) {
      chooseTitle(snapshot.item, {
        season: snapshot.season, ep: snapshot.ep, play: true
      });
    }
    watchStructure();
  }

  // Watch only the structural ancestors after mounting. When dependencies are
  // absent, temporarily watch the document for their insertion.
  function watchStructure() {
    if (dead || !structureObserver) return;
    structureObserver.disconnect();
    if (!shell || !shell.isConnected || !tab || !tab.isConnected ||
        !pane || !pane.isConnected || !nav || !nav.isConnected ||
        document.getElementById('chat-tv') !== pane ||
        document.querySelector('#dpnl .chat-youtube-tabs') !== nav) {
      structureObserver.observe(document.body || document.documentElement,
        { childList: true, subtree: true });
      return;
    }
    var watched = new Set();
    [pane, nav].forEach(function (start) {
      for (var node = start; node && node.nodeType === 1; node = node.parentElement) {
        if (!watched.has(node)) {
          structureObserver.observe(node, { childList: true });
          watched.add(node);
        }
      }
    });
  }

  function sync() {
    job = 0;
    if (dead) return;
    if (!shell || !shell.isConnected || !tab || !tab.isConnected ||
        !pane || !pane.isConnected || !nav || !nav.isConnected ||
        document.getElementById('chat-tv') !== pane ||
        document.querySelector('#dpnl .chat-youtube-tabs') !== nav) mount();
    watchStructure();
    if (!shell || !pane) return;

    var active = pane.classList.contains('active') &&
      pane.getClientRects().length > 0 &&
      getComputedStyle(host).visibility !== 'hidden';
    if (!active && mode === 'cinema' && frame && !floating &&
        !isFullscreen() && !isPseudo()) toggleFloat();
    schedulePlayer();
  }

  function schedule() {
    if (!dead && !job) job = requestAnimationFrame(sync);
  }

  function onClick(event) {
    var target = event.target;
    if (!target || !target.closest) return;
    if (target.closest('.chat-youtube-tabs [data-mode], #chat-tv [data-tv-start], #chat-tv [data-tv-channel]')) {
      deactivate();
    }
    if (target.closest('#settings .SERT, #settings [data-kr-play]')) stop();
    schedule();
  }

  function onHide() { stop(); }
  function onFsChange() { schedulePlayer(); }

  function init() {
    if (dead) return;
    loadBox();
    style = document.createElement('style');
    style.id = 'chat-cinema-style';
    style.textContent = `
      #chat-tv > #chat-cinema-panel{display:none!important}
      #chat-tv.chat-cinema-mode > :not(#chat-cinema-panel){display:none!important}
      #chat-tv.chat-cinema-mode > #chat-cinema-panel{display:block!important}
      #dpnl .chat-youtube-tabs{flex-wrap:wrap!important;max-width:calc(100% - 48px)}
      #dpnl .chat-youtube-tabs button{white-space:nowrap}
      #dpnl #chat-cinema-tab{font-size:12px;padding:5px 7px}
    `;
    document.head.appendChild(style);

    structureObserver = new MutationObserver(function () {
      if (dead) return;
      if (!shell || !shell.isConnected || !tab || !tab.isConnected ||
          !pane || !pane.isConnected || !nav || !nav.isConnected ||
          document.getElementById('chat-tv') !== pane ||
          document.querySelector('#dpnl .chat-youtube-tabs') !== nav) schedule();
    });
    watchStructure();

    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('scroll', schedulePlayer, true);
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    window.addEventListener('message', onMessage);
    window.addEventListener('pagehide', onHide);
    window.addEventListener('resize', schedulePaint);
    window.addEventListener('resize', schedulePlayer);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', schedulePaint);
      window.visualViewport.addEventListener('scroll', schedulePaint);
      window.visualViewport.addEventListener('resize', schedulePlayer);
      window.visualViewport.addEventListener('scroll', schedulePlayer);
    }
    schedule();
  }

  function destroy() {
    dead = true;
    if (structureObserver) structureObserver.disconnect();
    clearTimeout(searchTimer);
    if (searchController) searchController.abort();
    if (detailController) detailController.abort();
    cleanup();
    document.removeEventListener('DOMContentLoaded', init);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('keydown', onKey, true);
    document.removeEventListener('scroll', schedulePlayer, true);
    document.removeEventListener('fullscreenchange', onFsChange);
    document.removeEventListener('webkitfullscreenchange', onFsChange);
    window.removeEventListener('message', onMessage);
    window.removeEventListener('pagehide', onHide);
    window.removeEventListener('resize', schedulePaint);
    window.removeEventListener('resize', schedulePlayer);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', schedulePaint);
      window.visualViewport.removeEventListener('scroll', schedulePaint);
      window.visualViewport.removeEventListener('resize', schedulePlayer);
      window.visualViewport.removeEventListener('scroll', schedulePlayer);
    }
    [job, playerJob, paintJob].forEach(cancelAnimationFrame);
    if (style) style.remove();
    delete window[KEY];
  }

  window[KEY] = { destroy: destroy, stop: stop, version: '4.0.0-test' };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
