/* cinema-unified-v2.js
   أفلام ومسلسلات — فهرس TMDB والبحث المباشر
*/
(function () {
  'use strict';

  var TMDB_API_KEY = 'bd9c30274c4ca5405274bdf60ad42636';

  var KEY = '__CHAT_CINEMA_V1__';
  var ORIGIN = 'https://cinesrc.st';

  if (window[KEY]) window[KEY].destroy();

  var pane, host, root, shell, nav, tab, style;
  var playerHost = null;
  var playerRoot = null;
  var playerObserver = null;

  var cinemaStructureTimer;
  var searchTimer;
  var searchController;
  var detailController;

  var searchVersion = 0;
  var detailVersion = 0;
  var page = 1;
  var totalPages = 1;
  var catalogueStarted = false;
  var catalogue = [];
  var filter = 'all';

  var playerJob = 0;
  var paintJob = 0;
  var job = 0;

  var floating = false;
  var floatSized = false;
  var gesture = null;
  var corner = '';

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
  var selected = null;
  var loadTimer = null;

  var stateObserver = new MutationObserver(schedule);

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

  function stop() {
    clearTimeout(loadTimer);

    if (frame) frame.remove();
    frame = null;

    dock();

    if (q('[data-empty]')) {
      q('[data-empty]').hidden = false;
    }
  }

  function mountPlayer() {
    var screen = root.querySelector('.screen');
    var slot = document.createElement('div');

    slot.setAttribute('data-player-slot', '');
    slot.style.cssText = 'width:100%;aspect-ratio:16/9;';

    screen.before(slot);

    playerHost = document.createElement('div');
    playerHost.id = 'chat-cinema-player';
    playerHost.style.cssText =
      'all:initial!important;' +
      'zoom:1!important;' +
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
      mode === 'cinema' &&
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
    screen.style.setProperty('--video-height', box.h + 'px');
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
      say('اختر فيلمًا أو حلقة أولًا.');
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

  var TEMPLATE = `
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

      button,input,select {
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
      input:focus-visible,
      select:focus-visible {
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

      .tools button[aria-pressed="true"] {
        background:#eee;
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

      select {
        width:100%;
        max-width:100%;
        min-width:0;
        padding:8px;
        box-sizing:border-box;
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
        border:1px solid #666;
        border-radius:10px;
        box-shadow:0 8px 30px #0006;
        background:#111;
      }

      .floating .video-wrap {
        height:var(--video-height);
        aspect-ratio:auto;
      }

      .float-head,
      .resize-edge {
        display:none;
      }

      .floating .float-head {
        display:flex;
        height:39px;
        align-items:center;
        gap:4px;
        padding:5px 7px;
        background:var(--cinema-accent,#343a40);
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
        font:700 11px/1.5 Tahoma,sans-serif;
      }

      .float-head button {
        width:29px;
        height:29px;
        padding:0;
        flex-shrink:0;
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

      .screen.moving iframe {
        pointer-events:none;
      }

      .video-wrap:fullscreen {
        width:100vw!important;
        height:100vh!important;
        aspect-ratio:auto;
        border-radius:0;
      }

      [data-empty] {
        padding:15px;
        text-align:center;
      }

      [data-status],
      [data-catalog-status] {
        font-size:12px;
        color:#555;
      }

      [data-results] {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:8px;
      }

      [data-results] .result {
        display:flex;
        flex-direction:column;
        align-items:stretch;
        gap:8px;
        width:100%;
        min-width:0;
        margin:0;
        padding:7px;
        white-space:normal;
        text-align:right;
      }

      [data-results] img {
        width:100%;
        max-width:100%;
        height:auto;
        aspect-ratio:2/3;
        object-fit:cover;
        border-radius:6px;
      }

      [data-results] strong {
        font-size:13px;
        overflow-wrap:anywhere;
      }

      small {
        display:block;
        color:#666;
        font-size:11px;
        margin-top:4px;
      }

      [data-episode] label {
        flex:1;
        min-width:0;
      }

      [data-more] {
        width:100%;
        margin:10px 0;
      }

      details {
        margin-top:12px;
        font-size:11px;
      }

      summary {
        cursor:pointer;
      }
    </style>

    <strong data-title>أفلام ومسلسلات</strong>

    <div class="screen">
      <div class="float-head">
        <strong>سينما · اسحب هنا</strong>

        <button type="button" data-size
          title="صغير / كبير">⤢</button>

        <button type="button" data-dock
          title="إرجاع للقائمة">↩</button>

        <button type="button" data-float-close
          title="إيقاف وإغلاق">×</button>
      </div>

      <div class="video-wrap">
        <span data-empty>اختر فيلمًا أو مسلسلًا بالأسفل</span>
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

    <div class="tools">
      <button type="button" data-shape="free">حر</button>
      <button type="button" data-shape="wide">مستطيل</button>
      <button type="button" data-shape="square">مربع</button>
      <button type="button" data-scale="1.15" aria-label="تكبير">＋</button>
      <button type="button" data-scale="0.87" aria-label="تصغير">−</button>
    </div>

    <p data-status role="status">
      اختر عنوانًا. توفر التشغيل والترجمة يعتمد على مصدر المشاهدة.
    </p>

    <label>
      ابحث عن فيلم أو مسلسل
      <input data-search type="search"
        placeholder="اسم الفيلم أو المسلسل" maxlength="150">
    </label>

    <div class="tools">
      <button type="button" data-filter="all"
        aria-pressed="true">الكل</button>
      <button type="button" data-filter="movie">أفلام</button>
      <button type="button" data-filter="tv">مسلسلات</button>
    </div>

    <form data-episode hidden>
      <label>
        الموسم
        <select data-season required></select>
      </label>

      <label>
        الحلقة
        <select data-ep required></select>
      </label>

      <button type="submit">تشغيل</button>
    </form>

    <p data-catalog-status role="status"></p>
    <div data-results></div>

    <button data-more type="button" hidden>عرض المزيد</button>

    <details>
      <summary>مصدر معلومات الأفلام</summary>
      <a href="https://www.themoviedb.org/"
        target="_blank" rel="noopener noreferrer">
        <img alt="TMDB" width="90"
          src="https://www.themoviedb.org/assets/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg">
      </a>
      <p dir="ltr">
        This website uses TMDB and the TMDB APIs but is not endorsed,
        certified, or otherwise approved by TMDB.
      </p>
      <p>بيانات الفهرس لا تعني توفر جميع العناوين للمشاهدة.</p>
    </details>
  `;

  async function tmdb(path, params, signal) {
    if (!/^[a-f0-9]{32}$/i.test(TMDB_API_KEY.trim())) {
      throw new Error('ضع مفتاح TMDB في بداية السكربت أولًا.');
    }

    var url = new URL('https://api.themoviedb.org/3/' + path);
    url.searchParams.set('api_key', TMDB_API_KEY.trim());
    url.searchParams.set('language', 'ar-SA');

    Object.keys(params || {}).forEach(function (key) {
      url.searchParams.set(key, params[key]);
    });

    var response = await fetch(url.href, {
      signal: signal,
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(
        response.status === 401
          ? 'مفتاح TMDB غير صالح.'
          : response.status === 429
            ? 'طلبات كثيرة، انتظر قليلًا ثم أعد المحاولة.'
            : 'تعذر جلب البيانات. حاول مرة أخرى.'
      );
    }

    return response.json();
  }

  function queueSearch() {
    clearTimeout(searchTimer);
    searchVersion++;

    if (searchController) searchController.abort();

    q('[data-more]').hidden = true;

    var value = q('[data-search]').value.trim();

    if (value.length === 1) {
      q('[data-results]').replaceChildren();
      catalogStatus('اكتب حرفين أو أكثر لعرض الاقتراحات.');
      return;
    }

    catalogStatus('جارٍ البحث…');

    searchTimer = setTimeout(function () {
      render(false);
    }, 400);
  }

  async function render(append) {
    if (dead || !root) return;

    clearTimeout(searchTimer);

    var query = q('[data-search]').value.trim();
    if (query.length === 1) return;

    if (searchController) searchController.abort();

    searchController = new AbortController();

    var version = ++searchVersion;
    var currentRoot = root;
    var requestedPage = append ? page + 1 : 1;
    var kind = filter;

    var path = query
      ? 'search/' + (kind === 'all' ? 'multi' : kind)
      : 'trending/' + kind + '/week';

    q('[data-more]').hidden = true;

    if (!append) {
      catalogue = [];
      q('[data-results]').replaceChildren();
    }

    catalogStatus(
      query
        ? 'جارٍ البحث…'
        : 'جارٍ تحميل العناوين الرائجة…'
    );

    var timeout = setTimeout(function () {
      if (version === searchVersion) {
        searchController.abort();
      }
    }, 15000);

    try {
      var data = await tmdb(path, {
        query: query,
        page: requestedPage,
        include_adult: false
      }, searchController.signal);

      if (
        dead ||
        version !== searchVersion ||
        currentRoot !== root
      ) return;

      page = requestedPage;
      totalPages = Math.min(Number(data.total_pages) || 1, 500);

      (data.results || []).forEach(function (entry) {
        var type = entry.media_type || kind;

        if (
          entry.adult ||
          !['movie', 'tv'].includes(type) ||
          !Number.isInteger(entry.id)
        ) return;

        if (catalogue.some(function (item) {
          return item.id === entry.id && item.type === type;
        })) return;

        var item = {
          id: entry.id,
          type: type,
          title: entry.title || entry.name || '',
          year: (
            entry.release_date ||
            entry.first_air_date ||
            ''
          ).slice(0, 4)
        };

        catalogue.push(item);

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'result';

        if (/^\/[a-zA-Z0-9_.-]+$/.test(entry.poster_path || '')) {
          var img = document.createElement('img');

          img.src =
            'https://image.tmdb.org/t/p/w185' +
            entry.poster_path;

          img.alt = '';
          img.loading = 'lazy';
          img.decoding = 'async';

          img.onerror = function () {
            img.remove();
          };

          button.appendChild(img);
        }

        var title = document.createElement('strong');
        title.textContent = item.title;

        var meta = document.createElement('small');
        meta.textContent =
          (type === 'tv' ? 'مسلسل' : 'فيلم') +
          ' · ' + item.year;

        button.append(title, meta);

        button.onclick = function () {
          chooseTitle(item);
        };

        q('[data-results]').appendChild(button);
      });

      catalogStatus(
        catalogue.length
          ? (query ? 'نتائج البحث' : 'الرائج هذا الأسبوع')
          : 'لا توجد نتائج أفلام أو مسلسلات في هذه الصفحة.'
      );

      q('[data-more]').hidden = page >= totalPages;
    } catch (error) {
      if (
        dead ||
        version !== searchVersion ||
        currentRoot !== root
      ) return;

      catalogStatus(
        error.name === 'AbortError'
          ? 'انتهت مهلة الاتصال. أعد البحث.'
          : error.message
      );

      var retry = document.createElement('button');
      retry.type = 'button';
      retry.textContent = 'إعادة المحاولة';

      retry.onclick = function () {
        retry.remove();
        render(append);
      };

      q('[data-results]').appendChild(retry);
    } finally {
      clearTimeout(timeout);
    }
  }

  function option(select, value, label) {
    var node = document.createElement('option');
    node.value = value;
    node.textContent = label;
    select.appendChild(node);
  }

  async function chooseTitle(item) {
    selected = item;

    if (detailController) detailController.abort();

    var version = ++detailVersion;
    var currentRoot = root;

    q('[data-episode]').hidden = item.type !== 'tv';

    if (item.type !== 'tv') {
      play();
      return;
    }

    q('[data-season]').replaceChildren();
    q('[data-ep]').replaceChildren();
    q('[data-episode] button').disabled = true;

    say('جارٍ تحميل مواسم ' + item.title);

    detailController = new AbortController();

    try {
      var data = await tmdb(
        'tv/' + item.id,
        {},
        detailController.signal
      );

      if (
        dead ||
        version !== detailVersion ||
        currentRoot !== root
      ) return;

      (data.seasons || []).filter(function (season) {
        return season.season_number > 0 && season.episode_count > 0;
      }).forEach(function (season) {
        option(
          q('[data-season]'),
          season.season_number,
          season.name || 'الموسم ' + season.season_number
        );
      });

      if (!q('[data-season]').options.length) {
        say('لا توجد مواسم متاحة في الفهرس.');
        return;
      }

      loadEpisodes();
    } catch (error) {
      if (
        !dead &&
        version === detailVersion &&
        currentRoot === root &&
        error.name !== 'AbortError'
      ) {
        say(error.message + ' اختر المسلسل لإعادة المحاولة.');
      }
    }
  }

  async function loadEpisodes() {
    if (!selected || selected.type !== 'tv') return;

    if (detailController) detailController.abort();

    detailController = new AbortController();

    var version = ++detailVersion;
    var currentRoot = root;
    var id = selected.id;
    var season = Number(q('[data-season]').value);

    q('[data-ep]').replaceChildren();
    q('[data-episode] button').disabled = true;

    say('جارٍ تحميل الحلقات…');

    try {
      var data = await tmdb(
        'tv/' + id + '/season/' + season,
        {},
        detailController.signal
      );

      if (
        dead ||
        version !== detailVersion ||
        currentRoot !== root
      ) return;

      (data.episodes || []).filter(function (episode) {
        return episode.episode_number > 0;
      }).forEach(function (episode) {
        option(
          q('[data-ep]'),
          episode.episode_number,
          episode.episode_number + ' — ' +
          (episode.name || 'حلقة')
        );
      });

      q('[data-episode] button').disabled =
        !q('[data-ep]').options.length;

      say(
        q('[data-ep]').options.length
          ? 'اختر الموسم والحلقة ثم اضغط تشغيل.'
          : 'لا توجد حلقات في الفهرس.'
      );
    } catch (error) {
      if (
        !dead &&
        version === detailVersion &&
        currentRoot === root &&
        error.name !== 'AbortError'
      ) {
        say(error.message + ' أعد اختيار الموسم للمحاولة.');
      }
    }
  }

  function stopOthers() {
    var close = document.querySelector(
      '#chat-tv-floating [data-float-close]'
    );

    if (close) close.click();

    var tvStop = pane.querySelector('[data-tv-stop]');
    if (tvStop) tvStop.click();

    var yt = document.getElementById('chat-youtube-panel');
    var ytStop =
      yt &&
      yt.shadowRoot &&
      yt.shadowRoot.querySelector('[data-stop]');

    if (ytStop) ytStop.click();

    document.querySelectorAll(
      '#settings [data-kr-stop]'
    ).forEach(function (button) {
      button.click();
    });
  }

  function activate() {
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

  function play() {
    if (!selected) return;
    if (mode !== 'cinema') activate();

    var season = Number(q('[data-season]').value);
    var episode = Number(q('[data-ep]').value);

    if (
      selected.type === 'tv' &&
      (
        !Number.isInteger(season) ||
        season < 1 ||
        season > 999 ||
        !Number.isInteger(episode) ||
        episode < 1 ||
        episode > 9999
      )
    ) {
      say('أدخل رقم موسم وحلقة صحيحًا.');
      return;
    }

    stopOthers();
    clearTimeout(loadTimer);

    if (frame) frame.remove();

    var url = new URL(
      '/embed/' + selected.type + '/' + selected.id,
      ORIGIN
    );

    url.searchParams.set('autoplay', 'false');
    url.searchParams.set('back', 'close');
    url.searchParams.set('autonext', 'false');

    if (selected.type === 'tv') {
      url.searchParams.set('s', season);
      url.searchParams.set('e', episode);
    }

    frame = document.createElement('iframe');

    frame.setAttribute(
      'sandbox',
      'allow-scripts allow-same-origin allow-presentation'
    );

    frame.title = selected.title;
    frame.allow = 'autoplay; fullscreen; picture-in-picture';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.src = url.href;

    q('.video-wrap').appendChild(frame);
    q('[data-empty]').hidden = true;

    var title = selected.title + (
      selected.type === 'tv'
        ? ' · ' + season + ' / ' + episode
        : ''
    );

    q('[data-title]').textContent = title;
    q('.float-head strong').textContent = title;

    say(
      'اضغط تشغيل داخل المشغّل. اختر العربية من قائمة الترجمة إن توفرت.'
    );

    loadTimer = setTimeout(function () {
      if (frame) {
        say(
          'إذا لم يبدأ الفيديو، جرّب خيارات المشغّل. ' +
          'تحميل الإطار وحده لا يعني توفر البث.'
        );
      }
    }, 45000);

    schedulePlayer();
  }

  function onMessage(event) {
    if (
      !frame ||
      event.source !== frame.contentWindow ||
      event.origin !== ORIGIN ||
      !event.data
    ) return;

    var data = event.data;

    if (
      data.type === 'cinesrc:ready' ||
      data.type === 'cinesrc:play'
    ) {
      clearTimeout(loadTimer);
    }

    if (data.type === 'cinesrc:play') {
      say('بدأ التشغيل.');
    }

    if (data.type === 'cinesrc:error') {
      clearTimeout(loadTimer);
      say('تعذّر تشغيل هذا المصدر. جرّب الخيارات داخل المشغّل.');
    }

    if (data.type === 'cinesrc:close') {
      stop();
    }

    if (
      data.type === 'cinesrc:nextepisode' &&
      selected &&
      selected.type === 'tv' &&
      Number.isInteger(data.season) &&
      data.season > 0 &&
      Number.isInteger(data.episode) &&
      data.episode > 0
    ) {
      q('[data-season]').value = data.season;
      q('[data-ep]').value = data.episode;

      q('[data-title]').textContent =
        selected.title + ' · ' +
        data.season + ' / ' + data.episode;

      q('.float-head strong').textContent =
        q('[data-title]').textContent;
    }
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
    var nextNav = document.querySelector(
      '#dpnl .chat-youtube-tabs'
    );

    if (!nextPane || !nextNav) return;

    cleanup();

    pane = nextPane;
    nav = nextNav;
    host = document.getElementById('dpnl');

    tab = document.createElement('button');
    tab.type = 'button';
    tab.id = 'chat-cinema-tab';
    tab.textContent = '🎬 نتفلكس';
    tab.setAttribute('aria-pressed', 'false');
    tab.onclick = activate;

    nav.appendChild(tab);

    shell = document.createElement('div');
    shell.id = 'chat-cinema-panel';

    root = shell.attachShadow({ mode: 'open' });
    root.innerHTML = TEMPLATE;

    pane.appendChild(shell);
    mountPlayer();

    var accent = getComputedStyle(pane)
      .getPropertyValue('--tv-accent')
      .trim();

    if (accent) {
      playerHost.style.setProperty('--cinema-accent', accent);
    }

    q('[data-search]').oninput = queueSearch;

    q('[data-search]').onkeydown = function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        render(false);
      }
    };

    q('[data-more]').onclick = function () {
      render(true);
    };

    q('[data-season]').onchange = loadEpisodes;

    q('[data-episode]').onsubmit = function (event) {
      event.preventDefault();
      play();
    };

    root.querySelectorAll('[data-filter]').forEach(function (button) {
      button.onclick = function () {
        filter = button.dataset.filter;

        root.querySelectorAll('[data-filter]').forEach(function (item) {
          item.setAttribute(
            'aria-pressed',
            String(item === button)
          );
        });

        render(false);
      };
    });

    q('[data-stop]').onclick = stop;
    q('[data-float-close]').onclick = stop;
    q('[data-dock]').onclick = dock;
    q('[data-float]').onclick = toggleFloat;

    q('[data-full]').onclick = function () {
      if (!frame) {
        say('اختر فيديو أولًا.');
        return;
      }

      var video = q('.video-wrap');

      if (!video.requestFullscreen) {
        say('استخدم زر ملء الشاشة داخل المشغّل.');
        return;
      }

      video.requestFullscreen().catch(function () {
        say('استخدم زر ملء الشاشة داخل المشغّل.');
      });
    };

    q('[data-size]').onclick = function () {
      box.w = box.w > 260 ? 240 : 340;
      box.h = box.w * 9 / 16;
      box.ratio = 0;
      paint();
    };

    root.querySelectorAll('[data-scale]').forEach(function (button) {
      button.onclick = function () {
        if (!floating) toggleFloat();

        if (floating) {
          scaleFloat(Number(button.dataset.scale));
        }
      };
    });

    root.querySelectorAll('[data-shape]').forEach(function (button) {
      button.onclick = function () {
        if (!floating) toggleFloat();
        if (!floating) return;

        box.ratio = button.dataset.shape === 'wide'
          ? 16 / 9
          : button.dataset.shape === 'square'
            ? 1
            : 0;

        if (box.ratio) box.h = box.w / box.ratio;

        paint();
      };
    });

    bindGesture(q('.float-head'), 'drag');
    bindGesture(q('[data-resize]'), 'resize');

    q('[data-resize]').onkeydown = function (event) {
      if (
        !floating ||
        ![
          'ArrowLeft',
          'ArrowRight',
          'ArrowUp',
          'ArrowDown'
        ].includes(event.key)
      ) return;

      event.preventDefault();

      var step = event.shiftKey ? 30 : 10;

      if (event.key === 'ArrowLeft') box.w -= step;
      if (event.key === 'ArrowRight') box.w += step;
      if (event.key === 'ArrowUp') box.h -= step;
      if (event.key === 'ArrowDown') box.h += step;

      if (box.ratio) box.h = box.w / box.ratio;

      paint();
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

    catalogueStarted = false;
  }

  function sync() {
    job = 0;
    if (dead) return;

    if (
      !shell ||
      !shell.isConnected ||
      !tab ||
      !tab.isConnected ||
      !pane ||
      !pane.isConnected
    ) {
      mount();
    }

    if (!shell || !pane) return;

    var active =
      pane.classList.contains('active') &&
      pane.getClientRects().length > 0 &&
      getComputedStyle(host).visibility !== 'hidden';

    if (
      !active &&
      mode === 'cinema' &&
      frame &&
      !floating
    ) {
      toggleFloat();
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

    if (!target || !target.closest) return;

    if (
      target.closest(
        '.chat-youtube-tabs [data-mode], ' +
        '#chat-tv [data-tv-start], ' +
        '#chat-tv [data-tv-channel]'
      )
    ) {
      deactivate();
    }

    if (
      target.closest(
        '#settings .SERT, #settings [data-kr-play]'
      )
    ) {
      stop();
    }

    schedule();
  }

  function onHide() {
    stop();
  }

  function init() {
    if (dead) return;

    style = document.createElement('style');
    style.id = 'chat-cinema-style';

    style.textContent = `
      #chat-tv > #chat-cinema-panel {
        display:none!important;
      }

      #chat-tv.chat-cinema-mode > :not(#chat-cinema-panel) {
        display:none!important;
      }

      #chat-tv.chat-cinema-mode > #chat-cinema-panel {
        display:block!important;
      }

      #dpnl .chat-youtube-tabs {
        flex-wrap:wrap!important;
        max-width:calc(100% - 48px);
      }

      #dpnl .chat-youtube-tabs button {
        white-space:nowrap;
      }

      #dpnl #chat-cinema-tab {
        font-size:12px;
        padding:5px 7px;
      }
    `;

    document.head.appendChild(style);

    cinemaStructureTimer = setInterval(function () {
      if (dead) {
        clearInterval(cinemaStructureTimer);
        return;
      }

      if (
        !shell || !shell.isConnected ||
        !tab || !tab.isConnected ||
        !pane || !pane.isConnected
      ) {
        schedule();
      }
    }, 1500);

    document.addEventListener('click', onClick, true);
    document.addEventListener('scroll', schedulePlayer, true);

    window.addEventListener('message', onMessage);
    window.addEventListener('pagehide', onHide);
    window.addEventListener('resize', schedulePaint);
    window.addEventListener('resize', schedulePlayer);

    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        'resize', schedulePaint
      );
      window.visualViewport.addEventListener(
        'scroll', schedulePaint
      );
      window.visualViewport.addEventListener(
        'resize', schedulePlayer
      );
      window.visualViewport.addEventListener(
        'scroll', schedulePlayer
      );
    }

    schedule();
  }

  function destroy() {
    dead = true;

    clearInterval(cinemaStructureTimer);
    clearTimeout(searchTimer);

    if (searchController) searchController.abort();
    if (detailController) detailController.abort();

    cleanup();

    document.removeEventListener('DOMContentLoaded', init);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('scroll', schedulePlayer, true);

    window.removeEventListener('message', onMessage);
    window.removeEventListener('pagehide', onHide);
    window.removeEventListener('resize', schedulePaint);
    window.removeEventListener('resize', schedulePlayer);

    if (window.visualViewport) {
      window.visualViewport.removeEventListener(
        'resize', schedulePaint
      );
      window.visualViewport.removeEventListener(
        'scroll', schedulePaint
      );
      window.visualViewport.removeEventListener(
        'resize', schedulePlayer
      );
      window.visualViewport.removeEventListener(
        'scroll', schedulePlayer
      );
    }

    [job, playerJob, paintJob].forEach(cancelAnimationFrame);

    if (style) style.remove();

    delete window[KEY];
  }

  window[KEY] = {
    destroy: destroy,
    stop: stop,
    version: '2.1.0'
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {
      once: true
    });
  } else {
    init();
  }
})();
