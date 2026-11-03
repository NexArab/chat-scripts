(function () {
  'use strict';

  var KEY = '__CHAT_YOUTUBE_V1__';

  // ضع مفتاح YouTube Data API هنا.
  var API_KEY = 'AIzaSyCqfwOe_v9eBsqJWwjPZjSDL3mlQlqOhO8';

  if (window[KEY]) window[KEY].destroy();

  var pane, host, header, nav, label, root, shell, style;

  var playerHost = null;
  var playerRoot = null;
  var playerJob = 0;
  var playerObserver = null;

  var corner = '';
  var floatSized = false;
  var floating = false;
  var gesture = null;
  var paintJob = 0;

  var box = {
    x: 12,
    y: 70,
    w: 240,
    h: 135,
    ratio: 0
  };

  var mode = 'tv';
  var dead = false;
  var frame = null;
  var job = 0;

  var request = null;
  var timeout = null;
  var sequence = 0;
  var busy = false;
  var query = '';
  var next = '';
  var lastSearch = 0;
  var cache = new Map();

  var observer = new MutationObserver(function () {
    if (
      !pane || !pane.isConnected ||
      !shell || !shell.isConnected ||
      !nav || !nav.isConnected
    ) {
      schedule();
    }
  });

  var stateObserver = new MutationObserver(schedule);

  var tvIcon =
    '<svg viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" aria-hidden="true">' +
    '<rect x="3" y="7" width="18" height="13" rx="2"/>' +
    '<path d="m8 3 4 4 4-4M9 23h6"/></svg>';

  var ytIcon =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<rect x="1" y="4" width="22" height="16" rx="5" fill="#f00"/>' +
    '<path d="m10 8 6 4-6 4" fill="#fff"/></svg>';

  function q(selector) {
    return (root && root.querySelector(selector)) ||
      (playerRoot && playerRoot.querySelector(selector));
  }

  function say(text) {
    var node = q('[data-status]');
    if (node) node.textContent = text;
  }

  function stop() {
    if (frame) frame.remove();
    frame = null;

    dock();

    if (q('[data-empty]')) {
      q('[data-empty]').hidden = false;
    }
  }

  // المشغّل مستقل عن القائمة، فلا ينقطع عند إغلاقها.
  function mountPlayer() {
    var screen = root.querySelector('.screen');
    var slot = document.createElement('div');

    slot.setAttribute('data-player-slot', '');
    slot.style.cssText = 'width:100%;aspect-ratio:16/9;';

    screen.before(slot);

    playerHost = document.createElement('div');
    playerHost.id = 'chat-youtube-player';

    playerHost.style.cssText =
      'all:initial!important;' +
      'display:block!important;' +
      'position:fixed!important;' +
      'inset:0!important;' +
      'z-index:10030!important;' +
      'pointer-events:none!important;';

    playerRoot = playerHost.attachShadow({ mode: 'open' });

    var css = document.createElement('style');

    css.textContent = root.querySelector('style').textContent + `
      :host {
        background:transparent!important;
        pointer-events:none!important;
      }

      .screen {
        position:fixed;
        pointer-events:auto;
        direction:rtl;
        font:13px/1.6 Tahoma,sans-serif;
        color:#222;
      }

      .screen.floating {
        clip-path:none!important;
      }
    `;

    playerRoot.append(css, screen);
    document.documentElement.appendChild(playerHost);

    if (typeof ResizeObserver === 'function') {
      playerObserver = new ResizeObserver(schedulePlayer);
      playerObserver.observe(slot);
    }

    schedulePlayer();
  }

  function schedulePlayer() {
    if (!dead && !playerJob) {
      playerJob = requestAnimationFrame(placePlayer);
    }
  }

  function placePlayer() {
    playerJob = 0;

    if (!playerRoot || !pane || !pane.isConnected) return;

    var screen = playerRoot.querySelector('.screen');

    if (floating) {
      screen.style.display = 'block';
      schedulePaint();
      return;
    }

    var slot = root.querySelector('[data-player-slot]');

    var visible =
      mode === 'yt' &&
      pane.classList.contains('active') &&
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

    screen.style.clipPath =
      'inset(' +
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

      box.w = Math.max(
        Math.min(200, max),
        Math.min(box.w, max)
      );

      box.h = box.w / box.ratio;
    } else {
      box.w = Math.max(
        Math.min(200, maxW),
        Math.min(box.w, maxW)
      );

      box.h = Math.max(
        Math.min(112, maxH),
        Math.min(box.h, maxH)
      );
    }

    box.x = Math.max(
      v.x + 8,
      Math.min(box.x, v.x + v.w - box.w - 8)
    );

    box.y = Math.max(
      v.y + 8,
      Math.min(box.y, v.y + v.h - box.h - 49)
    );

    if (corner) {
      box.x = corner[1] === 'r'
        ? v.x + v.w - box.w - 8
        : v.x + 8;

      box.y = corner[0] === 'b'
        ? Math.max(v.y + 8, v.y + v.h - box.h - 49)
        : v.y + 8;
    }
  }

  function paint() {
    paintJob = 0;

    if (!floating || !q('.screen')) return;

    fitBox();

    var screen = q('.screen');

    screen.style.left = box.x + 'px';
    screen.style.top = box.y + 'px';
    screen.style.width = box.w + 'px';

    screen.style.setProperty(
      '--video-height',
      box.h + 'px'
    );
  }

  function schedulePaint() {
    if (floating && !paintJob) {
      paintJob = requestAnimationFrame(paint);
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

    if (q('.screen')) {
      q('.screen').classList.remove('moving');
    }
  }

  function dock() {
    floating = false;
    endGesture();

    if (paintJob) cancelAnimationFrame(paintJob);
    paintJob = 0;

    var screen = q('.screen');

    if (screen) {
      screen.classList.remove('floating');
      screen.removeAttribute('style');
    }

    if (q('[data-float]')) {
      q('[data-float]').textContent = '▣ نافذة عائمة';
    }

    if (
      frame &&
      pane &&
      (
        !pane.classList.contains('active') ||
        !pane.getClientRects().length
      )
    ) {
      var openButton = document.getElementById('chat-tv-open');
      if (openButton) openButton.click();
    }

    schedulePlayer();
  }

  function toggleFloat() {
    if (floating) {
      dock();
      return;
    }

    if (!frame) {
      say('اختر فيديو أولًا.');
      return;
    }

    if (
      document.fullscreenElement ||
      (playerRoot && playerRoot.fullscreenElement)
    ) {
      say('اخرج من ملء الشاشة أولًا.');
      return;
    }

    var v = viewport();

    if (!floatSized) {
      box.w = v.w <= 600 ? 240 : 340;
      box.h = box.w * 9 / 16;
      floatSized = true;
    }

    box.x = v.x + 16;
    box.y = v.y + 80;
    floating = true;

    q('.screen').style.display = 'block';
    q('.screen').style.clipPath = 'none';
    q('.screen').classList.add('floating');

    q('[data-float]').textContent = '↩ إرجاع للقائمة';

    paint();
  }

  function scaleFloat(factor) {
    box.w *= factor;
    box.h *= factor;
    paint();
  }

  function bindGesture(node, kind) {
    node.addEventListener('pointerdown', function (event) {
      if (
        !floating ||
        event.button !== 0 ||
        gesture ||
        (
          kind === 'drag' &&
          event.target.closest('button,select')
        )
      ) return;

      corner = '';

      gesture = {
        node: node,
        id: event.pointerId,
        kind: kind,
        x: event.clientX,
        y: event.clientY,
        bx: box.x,
        by: box.y,
        w: box.w,
        h: box.h
      };

      try {
        node.setPointerCapture(event.pointerId);
      } catch (error) {}

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
        // المقبض في الطرف الأيسر.
        box.w = Math.max(200, current.w - dx);
        box.x = current.bx + current.w - box.w;

        box.h = box.ratio
          ? box.w / box.ratio
          : current.h + dy;
      }

      schedulePaint();
    });

    [
      'pointerup',
      'pointercancel',
      'lostpointercapture'
    ].forEach(function (name) {
      node.addEventListener(name, function (event) {
        if (gesture && gesture.id === event.pointerId) {
          endGesture();
        }
      });
    });
  }

  function cancel() {
    sequence++;

    if (request) request.abort();

    clearTimeout(timeout);
    request = null;
    busy = false;

    if (q('[type=submit]')) {
      q('[type=submit]').disabled = false;
    }

    if (q('[data-next]')) {
      q('[data-next]').disabled = false;
    }
  }

  function stopTV() {
    var close = document.querySelector(
      '#chat-tv-floating [data-float-close]'
    );

    if (close) close.click();

    var control = pane && pane.querySelector('[data-tv-stop]');
    if (control) control.click();
  }

  function switchMode(value) {
    if (mode === value) return;

    cancel();
    stop();

    if (value === 'yt') stopTV();

    mode = value;
    pane.classList.toggle('chat-youtube-mode', mode === 'yt');

    nav.querySelectorAll('button').forEach(function (button) {
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.mode === mode)
      );
    });

    schedulePlayer();

    if (mode === 'yt') {
      say('ابحث عن فيديو، أو اختر من الفيديوهات الموجودة أدناه.');
    }
  }

  function play(id, title) {
    if (!/^[\w-]{11}$/.test(id)) return;

    var wasFloating = floating;

    stopTV();
    stop();

    document.querySelectorAll(
      '#settings [data-kr-stop]'
    ).forEach(function (button) {
      button.click();
    });

    q('[data-title]').textContent = title;
    q('.float-head strong').textContent = title;
    q('[data-empty]').hidden = true;

    frame = document.createElement('iframe');
    frame.title = title;
    frame.allow =
      'autoplay; encrypted-media; fullscreen; picture-in-picture';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';

    frame.src =
      'https://www.youtube.com/embed/' +
      id +
      '?playsinline=1&autoplay=0';

    q('.video-wrap').appendChild(frame);

    if (wasFloating) toggleFloat();

    schedulePlayer();

    say(
      'اضغط تشغيل داخل الفيديو. إذا منع صاحب الفيديو التضمين، جرّب فيديو آخر.'
    );
  }

  function render(items) {
    var list = q('[data-results]');
    list.replaceChildren();

    items.forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'result';

      var img = document.createElement('img');
      img.src =
        'https://i.ytimg.com/vi/' + item.id + '/mqdefault.jpg';

      img.alt = '';
      img.loading = 'lazy';
      img.width = 120;
      img.height = 68;

      var text = document.createElement('span');
      text.textContent = item.title;

      var small = document.createElement('small');
      small.textContent = item.author || 'YouTube';

      text.appendChild(small);
      button.append(img, text);

      button.addEventListener('click', function () {
        play(item.id, item.title);
      });

      list.appendChild(button);
    });
  }

  function apply(data) {
    var decoder = document.createElement('textarea');

    var items = (data.items || []).filter(function (item) {
      return (
        item.id &&
        /^[\w-]{11}$/.test(item.id.videoId) &&
        item.snippet
      );
    }).map(function (item) {
      decoder.innerHTML = item.snippet.title;

      return {
        id: item.id.videoId,
        title: decoder.value,
        author: item.snippet.channelTitle
      };
    });

    render(items);

    next = data.nextPageToken || '';
    q('[data-next]').hidden = !next;

    say(
      items.length
        ? 'نتائج YouTube — اختر فيديو للمشاهدة.'
        : 'ماكو نتائج لهذا البحث.'
    );
  }

  async function search(token) {
    if (busy) return;

    var term = token ? query : q('input').value.trim();
    if (!term) return;

    if (
      API_KEY === 'PUT_YOUR_API_KEY_HERE' ||
      !API_KEY.trim()
    ) {
      say('أضف مفتاح YouTube API داخل ملف اليوتيوب.');
      return;
    }

    var key = JSON.stringify([term, token || '']);

    if (cache.has(key)) {
      query = term;
      apply(cache.get(key));
      return;
    }

    if (Date.now() - lastSearch < 2000) {
      say('انتظر ثانيتين قبل البحث مرة ثانية.');
      return;
    }

    cancel();

    busy = true;
    lastSearch = Date.now();
    query = term;

    var ticket = sequence;
    var controller = new AbortController();

    request = controller;

    timeout = setTimeout(function () {
      controller.abort();
    }, 15000);

    q('[type=submit]').disabled = true;
    q('[data-next]').disabled = true;

    say('جاري البحث…');

    var params = new URLSearchParams({
      key: API_KEY.trim(),
      part: 'snippet',
      type: 'video',
      q: term,
      maxResults: '12',
      videoEmbeddable: 'true',
      videoSyndicated: 'true',
      relevanceLanguage: 'ar',
      safeSearch: 'moderate'
    });

    if (token) params.set('pageToken', token);

    try {
      var response = await fetch(
        'https://www.googleapis.com/youtube/v3/search?' + params,
        {
          signal: controller.signal,
          credentials: 'omit',
          referrerPolicy: 'strict-origin-when-cross-origin'
        }
      );

      var data = await response.json();

      if (dead || ticket !== sequence) return;

      if (!response.ok || data.error) {
        var reason = JSON.stringify(data.error || {});

        say(
          /quotaExceeded|dailyLimitExceeded/.test(reason)
            ? 'وصل البحث للحد المسموح للمشروع. جرّب لاحقًا.'
            : 'تعذر البحث. تحقق من المفتاح وتفعيل API والسماح بنطاق الشات.'
        );

        return;
      }

      if (cache.size >= 20) {
        cache.delete(cache.keys().next().value);
      }

      cache.set(key, data);
      apply(data);

    } catch (error) {
      if (!dead && ticket === sequence) {
        say('تعذر الاتصال أو انتهت مهلة البحث. جرّب مرة أخرى.');
      }

    } finally {
      if (ticket === sequence) {
        clearTimeout(timeout);
        request = null;
        busy = false;

        if (q('[type=submit]')) {
          q('[type=submit]').disabled = false;
        }

        if (q('[data-next]')) {
          q('[data-next]').disabled = false;
        }
      }
    }
  }

  function cleanup() {
    cancel();
    stop();
    stateObserver.disconnect();

    if (pane) {
      pane.classList.remove('chat-youtube-mode');
    }

    if (host) {
      host.classList.remove('chat-youtube-visible');
    }

    if (label) {
      label.classList.remove('chat-youtube-label');
    }

    if (nav) nav.remove();
    if (shell) shell.remove();

    if (playerObserver) playerObserver.disconnect();
    playerObserver = null;

    if (playerJob) cancelAnimationFrame(playerJob);
    playerJob = 0;

    if (playerHost) playerHost.remove();
    playerHost = playerRoot = null;

    pane = host = header = nav = label = root = shell = null;

    mode = 'tv';
    next = '';
    query = '';
    cache.clear();
  }

  function mount() {
    cleanup();

    pane = document.getElementById('chat-tv');
    host = document.getElementById('dpnl');

    if (!pane || !host) return;

    label = host.querySelector('.pnhead');
    if (!label) return;

    header = label.parentElement;
    label.classList.add('chat-youtube-label');

    nav = document.createElement('span');
    nav.className = 'chat-youtube-tabs';

    nav.innerHTML =
      '<button type="button" data-mode="tv" aria-pressed="true">' +
      tvIcon + ' التلفاز</button>' +
      '<button type="button" data-mode="yt" aria-pressed="false">' +
      ytIcon + ' يوتيوب</button>';

    label.after(nav);

    nav.addEventListener('click', function (event) {
      var button = event.target.closest('[data-mode]');

      if (button) {
        event.preventDefault();
        event.stopPropagation();
        switchMode(button.dataset.mode);
      }
    });

    shell = document.createElement('div');
    shell.id = 'chat-youtube-panel';
    root = shell.attachShadow({ mode: 'open' });

    root.innerHTML = `
      <style>
        :host {
          display:block;
          direction:rtl;
          color:#222;
          background:#fff;
          font:13px/1.6 Tahoma,sans-serif;
        }

        * {
          box-sizing:border-box;
        }

        [hidden] {
          display:none!important;
        }

        button,input {
          font:inherit;
        }

        button {
          cursor:pointer;
          border:1px solid #bbb;
          border-radius:7px;
          padding:8px;
          color:#111;
          background:#fff;
        }

        button:disabled {
          opacity:.5;
          cursor:default;
        }

        button:focus-visible,
        input:focus-visible {
          outline:2px solid #a00;
          outline-offset:2px;
        }

        form,.tools {
          display:flex;
          gap:6px;
          margin:10px 0;
        }

        .tools {
          flex-wrap:wrap;
        }

        .tools button {
          flex:1;
        }

        input {
          width:100%;
          min-width:0;
          border:1px solid #aaa;
          border-radius:7px;
          padding:9px;
          background:#fff;
          color:#111;
        }

        .screen {
          width:100%;
          background:#fff;
          border-radius:8px;
          overflow:hidden;
        }

        .video-wrap {
          position:relative;
          width:100%;
          aspect-ratio:16/9;
          background:#090b0f;
          color:#fff;
          display:grid;
          place-items:center;
        }

        iframe {
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          border:0;
          display:block;
        }

        .screen.floating {
          position:fixed;
          z-index:10030;
          right:auto;
          bottom:auto;
          margin:0;
          box-shadow:0 6px 24px #0005;
          border-radius:8px;
        }

        .floating .video-wrap {
          height:var(--video-height);
          aspect-ratio:auto;
        }

        .floating .float-head {
          display:flex;
          height:40px;
          align-items:center;
          gap:4px;
          padding:4px 6px;
          background:#252525;
          color:white;
          touch-action:none;
          user-select:none;
          cursor:grab;
        }

        .float-head strong {
          flex:1;
          min-width:0;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          font-size:11px;
        }

        .float-head button {
          width:32px;
          height:32px;
          padding:0;
          flex-shrink:0;
        }

        [data-resize] {
          touch-action:none;
          user-select:none;
          cursor:nesw-resize;
        }

        .screen.moving iframe {
          pointer-events:none;
        }

        .video-wrap:fullscreen {
          width:100vw!important;
          height:100vh!important;
          aspect-ratio:auto;
          border-radius:0;
        }

        @media(max-width:420px) {
          .result img {
            max-width:100px;
          }
        }

        [data-empty] {
          padding:15px;
          text-align:center;
        }

        [data-status] {
          font-size:12px;
          color:#555;
        }

        [data-results] {
          display:grid;
          gap:8px;
        }

        .result {
          display:flex;
          align-items:center;
          gap:8px;
          width:100%;
          text-align:right;
        }

        .result img {
          width:120px;
          height:68px;
          object-fit:cover;
          border-radius:5px;
          flex-shrink:0;
        }

        .result span {
          overflow-wrap:anywhere;
        }

        small {
          display:block;
          color:#666;
          font-size:10px;
          margin-top:4px;
        }

        [data-next] {
          width:100%;
          margin-top:10px;
        }

        .float-head,
        .resize-edge {
          display:none;
        }

        .screen.floating {
          border:1px solid #666;
          border-radius:10px;
          box-shadow:0 8px 30px #0006;
          background:#111;
        }

        .floating .float-head {
          height:39px;
          gap:4px;
          padding:5px 7px;
          background:var(--youtube-accent,#343a40);
        }

        .float-head strong {
          font:700 11px/1.5 Tahoma,sans-serif;
        }

        .float-head button {
          width:29px;
          height:29px;
          padding:0;
          border:1px solid #ffffff70;
          border-radius:5px;
          font:700 18px/25px Tahoma,sans-serif;
        }

        .floating .resize-edge {
          display:block;
          position:relative;
          height:8px;
          background:#343a40;
        }

        [data-resize] {
          position:absolute;
          left:0;
          bottom:0;
          width:30px;
          height:18px;
          text-align:center;
          line-height:18px;
          font-size:15px;
          background:#343a40;
          color:#fff;
          cursor:nesw-resize;
          touch-action:none;
          user-select:none;
          border-radius:0 5px 0 0;
        }

        [data-resize]:focus-visible {
          outline:2px solid #fff;
          outline-offset:-2px;
        }
      </style>

      <strong data-title>YouTube</strong>

      <div class="screen">
        <div class="float-head">
          <strong>يوتيوب · اسحب هنا</strong>

          <button type="button" data-size
            title="حجم صغير / كبير"
            aria-label="تغيير حجم النافذة">⤢</button>

          <button type="button" data-dock
            title="إرجاع للقائمة"
            aria-label="إرجاع للقائمة">↩</button>

          <button type="button" data-float-close
            title="إغلاق وإيقاف"
            aria-label="إغلاق وإيقاف">×</button>
        </div>

        <div class="video-wrap">
          <span data-empty>اختر فيديو أو ابحث بالأسفل</span>
        </div>

        <div class="resize-edge">
          <span data-resize role="button" tabindex="0"
            aria-label="اسحب لتغيير العرض والارتفاع أو استخدم الأسهم"
            title="تغيير الحجم بحرية">⤡</span>
        </div>
      </div>

      <div class="tools">
        <button type="button" data-stop>■ إيقاف</button>
        <button type="button" data-full>⛶ ملء الشاشة</button>
        <button type="button" data-float>▣ نافذة عائمة</button>
      </div>

      <form>
        <input type="search"
          maxlength="150"
          required
          aria-label="البحث في YouTube"
          placeholder="ابحث في YouTube">

        <button type="submit">بحث</button>
      </form>

      <p data-status role="status" aria-live="polite">
        فيديوهات مختارة، وليست مقترحات حسابك.
      </p>

      <div data-results></div>

      <button type="button" data-next hidden>
        النتائج التالية
      </button>
    `;

    pane.appendChild(shell);
    mountPlayer();

    var accent = getComputedStyle(pane)
      .getPropertyValue('--tv-accent')
      .trim();

    if (accent) {
      q('.screen').style.setProperty('--youtube-accent', accent);
      playerHost.style.setProperty('--youtube-accent', accent);
    }

    // فيديوهات البداية.
    render([
      {
        id: 'sqv44Msl6rg',
        title: 'فنجان — كواليس برامج ثمانية'
      },
      {
        id: 'sNdpKc9kjHM',
        title: 'فنجان — السودان'
      }
    ]);

    q('form').addEventListener('submit', function (event) {
      event.preventDefault();
      search('');
    });

    q('[data-next]').onclick = function () {
      if (next) search(next);
    };

    q('[data-stop]').onclick = function () {
      stop();
      say('تم إيقاف الفيديو.');
    };

    q('[data-float]').onclick = toggleFloat;
    q('[data-dock]').onclick = dock;

    q('[data-float-close]').onclick = function () {
      stop();
      say('تم إيقاف الفيديو.');
    };

    q('[data-full]').onclick = function () {
      if (!frame) return;

      var video = q('.video-wrap');

      if (!video.requestFullscreen) {
        say('استخدم زر ملء الشاشة داخل مشغّل YouTube.');
        return;
      }

      video.requestFullscreen().catch(function () {
        say('استخدم زر ملء الشاشة داخل مشغّل YouTube.');
      });
    };

    q('[data-size]').onclick = function () {
      box.w = box.w > 260 ? 240 : 340;
      box.h = box.w * 9 / 16;
      box.ratio = 0;

      paint();
    };

    bindGesture(q('.float-head'), 'drag');
    bindGesture(q('[data-resize]'), 'resize');

    q('[data-resize]').addEventListener('keydown', function (event) {
      if (![
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown'
      ].includes(event.key)) return;

      event.preventDefault();

      var step = event.shiftKey ? 30 : 10;

      if (event.key === 'ArrowLeft') box.w -= step;
      if (event.key === 'ArrowRight') box.w += step;

      if (box.ratio) {
        if (event.key === 'ArrowUp') box.w -= step * box.ratio;
        if (event.key === 'ArrowDown') box.w += step * box.ratio;

        box.h = box.w / box.ratio;
      } else {
        if (event.key === 'ArrowUp') box.h -= step;
        if (event.key === 'ArrowDown') box.h += step;
      }

      paint();
    });

    for (
      var node = pane;
      node;
      node = node.parentElement
    ) {
      stateObserver.observe(node, {
        attributes: true,
        attributeFilter: ['class', 'style', 'hidden']
      });
    }
  }

  function sync() {
    job = 0;
    if (dead) return;

    if (
      !pane || !pane.isConnected ||
      !shell || !shell.isConnected ||
      !nav || !nav.isConnected
    ) {
      mount();
    }

    if (!pane || !nav) return;

    var active =
      pane.classList.contains('active') &&
      pane.getClientRects().length > 0 &&
      getComputedStyle(host).visibility !== 'hidden';

    if (
      host.classList.contains('chat-youtube-visible') !== active
    ) {
      host.classList.toggle('chat-youtube-visible', active);
    }

    if (!active) {
      if (request) cancel();

      if (!floating && frame && mode === 'yt') {
        toggleFloat();
      }
    }

    schedulePlayer();
  }

  function schedule() {
    if (!dead && !job) {
      job = requestAnimationFrame(sync);
    }
  }

  function onClick(event) {
    var target = event.target;
    if (!target.closest) return;

    var hardStop = target.closest(
      '#settings .SERT, ' +
      '#settings [data-kr-play], ' +
      '#chat-tv [data-tv-start], ' +
      '#chat-tv [data-tv-channel]'
    );

    var leaving =
      target.closest('#dpnl .th-dpnl-close') ||
      (
        target.closest('#d0 [data-key]') &&
        !target.closest('#chat-tv-open')
      );

    if (hardStop || leaving) {
      cancel();

      if (hardStop) {
        stop();
      } else if (frame && !floating && mode === 'yt') {
        toggleFloat();
      }
    }

    schedule();
  }

  function onHide() {
    cancel();
    stop();
  }

  function init() {
    style = document.createElement('style');

    style.textContent = `
      #dpnl .chat-youtube-tabs {
        display:none;
        gap:5px;
        align-items:center;
        float:left;
        direction:rtl;
        padding:3px;
      }

      #dpnl.chat-youtube-visible .chat-youtube-tabs {
        display:inline-flex;
      }

      #dpnl.chat-youtube-visible .chat-youtube-label {
        display:none!important;
      }

      #dpnl .chat-youtube-tabs button {
        display:inline-flex!important;
        align-items:center;
        gap:5px;
        float:none!important;
        position:static!important;
        width:auto!important;
        height:32px!important;
        margin:0!important;
        padding:4px 9px!important;
        border:1px solid #ffffff80!important;
        border-radius:6px!important;
        background:transparent!important;
        color:white!important;
        font:700 12px Tahoma!important;
        cursor:pointer;
      }

      #dpnl .chat-youtube-tabs button[aria-pressed="true"] {
        background:#fff!important;
        color:#222!important;
      }

      #dpnl .chat-youtube-tabs svg {
        width:19px;
        height:19px;
        flex-shrink:0;
      }

      #chat-tv > #chat-youtube-panel {
        display:none!important;
      }

      #chat-tv.chat-youtube-mode > :not(#chat-youtube-panel) {
        display:none!important;
      }

      #chat-tv.chat-youtube-mode > #chat-youtube-panel {
        display:block!important;
      }
    `;

    document.head.appendChild(style);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    document.addEventListener('click', onClick, true);
    document.addEventListener('scroll', schedulePlayer, true);

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

    observer.disconnect();
    stateObserver.disconnect();

    if (job) cancelAnimationFrame(job);

    document.removeEventListener('DOMContentLoaded', init);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('scroll', schedulePlayer, true);

    window.removeEventListener('pagehide', onHide);
    window.removeEventListener('resize', schedulePaint);
    window.removeEventListener('resize', schedulePlayer);

    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', schedulePaint);
      window.visualViewport.removeEventListener('scroll', schedulePaint);
      window.visualViewport.removeEventListener('resize', schedulePlayer);
      window.visualViewport.removeEventListener('scroll', schedulePlayer);
    }

    cleanup();

    if (style) style.remove();
  }

  window[KEY] = {
    destroy: destroy
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {
      once: true
    });
  } else {
    init();
  }
})();
