(function () {
  'use strict';

  var KEY = '__CHAT_YOUTUBE_V1__';

  // ضع مفتاحك هنا فقط.
  var API_KEY = 'AIzaSyCqfwOe_v9eBsqJWwjPZjSDL3mlQlqOhO8';

  if (window[KEY]) window[KEY].destroy();

  var pane, host, header, nav, label, root, shell, style;
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
    return root && root.querySelector(selector);
  }

  function say(text) {
    var node = q('[data-status]');
    if (node) node.textContent = text;
  }

  function stop() {
    if (frame) frame.remove();
    frame = null;

    if (q('.screen')) {
      q('.screen').classList.remove('floating');
    }

    if (q('[data-empty]')) {
      q('[data-empty]').hidden = false;
    }
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

    if (mode === 'yt') {
      say('ابحث عن فيديو، أو اختر من الفيديوهات الموجودة أدناه.');
    }
  }

  function play(id, title) {
    if (!/^[\w-]{11}$/.test(id)) return;

    stopTV();
    stop();

    document.querySelectorAll(
      '#settings [data-kr-stop]'
    ).forEach(function (button) {
      button.click();
    });

    q('[data-title]').textContent = title;
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

    q('.screen').appendChild(frame);

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

        q('[type=submit]').disabled = false;
        q('[data-next]').disabled = false;
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
          display: block;
          direction: rtl;
          color: #222;
          background: #fff;
          font: 13px/1.6 Tahoma, sans-serif;
        }

        * { box-sizing: border-box; }
        [hidden] { display: none !important; }

        button, input { font: inherit; }

        button {
          cursor: pointer;
          border: 1px solid #bbb;
          border-radius: 7px;
          padding: 8px;
          color: #111;
          background: #fff;
        }

        button:disabled {
          opacity: .5;
          cursor: default;
        }

        button:focus-visible,
        input:focus-visible {
          outline: 2px solid #a00;
          outline-offset: 2px;
        }

        form, .tools {
          display: flex;
          gap: 6px;
          margin: 10px 0;
        }

        .tools { flex-wrap: wrap; }
        .tools button { flex: 1; }

        input {
          width: 100%;
          min-width: 0;
          border: 1px solid #aaa;
          border-radius: 7px;
          padding: 9px;
          background: white;
          color: #111;
        }

        .screen {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          min-height: 200px;
          background: #090b0f;
          border-radius: 8px;
          overflow: hidden;
          color: white;
          display: grid;
          place-items: center;
        }

        iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        .screen.floating {
          position: fixed;
          z-index: 10030;
          bottom: 65px;
          right: 12px;
          width: min(360px, calc(100vw - 24px));
          height: 220px;
        }

        .screen:fullscreen {
          width: 100vw;
          height: 100vh;
          max-width: none;
          border-radius: 0;
        }

        .float-close {
          display: none;
          position: absolute;
          z-index: 2;
          top: 2px;
          right: 2px;
          background: #fff;
          color: #111;
        }

        .floating { padding-top: 32px; }

        .floating iframe {
          top: 32px;
          height: calc(100% - 32px);
        }

        .floating .float-close { display: block; }

        [data-empty] {
          padding: 15px;
          text-align: center;
        }

        [data-status] {
          font-size: 12px;
          color: #555;
        }

        [data-results] {
          display: grid;
          gap: 8px;
        }

        .result {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          text-align: right;
        }

        .result img {
          width: 120px;
          height: 68px;
          object-fit: cover;
          border-radius: 5px;
          flex-shrink: 0;
        }

        .result span { overflow-wrap: anywhere; }

        small {
          display: block;
          color: #666;
          font-size: 10px;
          margin-top: 4px;
        }

        [data-next] {
          width: 100%;
          margin-top: 10px;
        }
      </style>

      <strong data-title>YouTube</strong>

      <div class="screen">
        <span data-empty>اختر فيديو أو ابحث بالأسفل</span>

        <button type="button"
          class="float-close"
          data-dock
          aria-label="إرجاع الفيديو للقائمة">↩ إرجاع</button>
      </div>

      <div class="tools">
        <button type="button" data-stop>■ إيقاف</button>
        <button type="button" data-full>⛶ ملء الشاشة</button>
        <button type="button" data-float>▣ نافذة عائمة</button>
      </div>

      <form>
        <input
          type="search"
          maxlength="150"
          required
          aria-label="البحث في YouTube"
          placeholder="ابحث في YouTube"
        >
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

    // فيديوهات البداية: تستطيع تغييرها لاحقًا.
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

    q('[data-float]').onclick = function () {
      if (frame) {
        q('.screen').classList.toggle('floating');
      } else {
        say('اختر فيديو أولًا.');
      }
    };

    q('[data-dock]').onclick = function () {
      q('.screen').classList.remove('floating');
    };

    q('[data-full]').onclick = function () {
      if (!frame) return;

      var screen = q('.screen');
      var fn = screen.requestFullscreen;

      if (!fn) {
        say('استخدم ملء الشاشة من داخل مشغّل YouTube.');
        return;
      }

      fn.call(screen).catch(function () {
        say('استخدم ملء الشاشة من داخل مشغّل YouTube.');
      });
    };

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

    if (!active && (frame || request)) {
      cancel();
      stop();
    }
  }

  function schedule() {
    if (!dead && !job) {
      job = requestAnimationFrame(sync);
    }
  }

  function onClick(event) {
    var target = event.target;
    if (!target.closest) return;

    if (
      target.closest(
        '#dpnl .th-dpnl-close, #settings .SERT, #settings [data-kr-play]'
      ) ||
      (
        target.closest('#d0 [data-key]') &&
        !target.closest('#chat-tv-open')
      )
    ) {
      cancel();
      stop();
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
        display: none;
        gap: 5px;
        align-items: center;
        float: left;
        direction: rtl;
        padding: 3px;
      }

      #dpnl.chat-youtube-visible .chat-youtube-tabs {
        display: inline-flex;
      }

      #dpnl.chat-youtube-visible .chat-youtube-label {
        display: none !important;
      }

      #dpnl .chat-youtube-tabs button {
        display: inline-flex !important;
        align-items: center;
        gap: 5px;
        float: none !important;
        position: static !important;
        width: auto !important;
        height: 32px !important;
        margin: 0 !important;
        padding: 4px 9px !important;
        border: 1px solid #ffffff80 !important;
        border-radius: 6px !important;
        background: transparent !important;
        color: white !important;
        font: 700 12px Tahoma !important;
        cursor: pointer;
      }

      #dpnl .chat-youtube-tabs button[aria-pressed="true"] {
        background: #fff !important;
        color: #222 !important;
      }

      #dpnl .chat-youtube-tabs svg {
        width: 19px;
        height: 19px;
        flex-shrink: 0;
      }

      #chat-tv > #chat-youtube-panel {
        display: none !important;
      }

      #chat-tv.chat-youtube-mode > :not(#chat-youtube-panel) {
        display: none !important;
      }

      #chat-tv.chat-youtube-mode > #chat-youtube-panel {
        display: block !important;
      }
    `;

    document.head.appendChild(style);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    document.addEventListener('click', onClick, true);
    window.addEventListener('pagehide', onHide);

    schedule();
  }

  function destroy() {
    dead = true;

    observer.disconnect();
    stateObserver.disconnect();

    if (job) cancelAnimationFrame(job);

    document.removeEventListener('DOMContentLoaded', init);
    document.removeEventListener('click', onClick, true);
    window.removeEventListener('pagehide', onHide);

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
