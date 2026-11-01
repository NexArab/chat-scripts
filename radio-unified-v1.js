(function () {
  'use strict';

  var GLOBAL = '__SHFAQ_RADIO_V1__';

  if (
    window[GLOBAL] &&
    typeof window[GLOBAL].destroy === 'function'
  ) {
    window[GLOBAL].destroy();
  }

  var options = window.CHAT_RADIO_CONFIG || {};
  var panel = null;
  var media = null;
  var selected = 0;
  var volume = 0.5;
  var attempt = 0;
  var deadline = null;
  var mountTimer = null;
  var observer = null;
  var watchedParent = null;
  var destroyed = false;

  var stations = [
    {
      label: 'قرآن كريم',
      icon: 'book',
      urls: ['https://edge.mixlr.com/channel/rwumx']
    },
    {
      label: 'أغاني عربية',
      icon: 'music',
      urls: [
        'https://mazajfm.ice.infomaniak.ch/mazajfm-192.mp3'
      ]
    },
    {
      label: 'أغاني أجنبية',
      icon: 'headphones',
      urls: [
        'https://channels.fluxfm.de/90s/externalembedflxhp/stream.mp3'
      ]
    },
    {
      label: 'سوالف مباشرة',
      icon: 'mic',
      urls: ['https://hala-alrayamedia.radioca.st/;']
    }
  ];

  function detectName() {
    var meta = document.querySelector(
      'meta[property="og:site_name"]'
    );

    var heading = document.querySelector(
      '#tlogins .th-login-topbar h1'
    );

    var name =
      options.name ||
      (meta && meta.content) ||
      (heading && heading.textContent) ||
      document.title ||
      '';

    name = String(name).split(/[|–—]/)[0].trim();

    return name ? 'راديو ' + name : 'راديو الموقع';
  }

  function detectAccent() {
    if (
      typeof options.accent === 'string' &&
      window.CSS &&
      CSS.supports('color', options.accent)
    ) {
      return options.accent;
    }

    var selectors = [
      '#tlogins .th-login-btn',
      '#tlogins .th-login-tab-link',
      '#tlogins .th-login-topbar',
      '#settings .th-settings-more-btn'
    ];

    for (var i = 0; i < selectors.length; i++) {
      var node = document.querySelector(selectors[i]);

      if (!node) continue;

      var color = getComputedStyle(node).backgroundColor;

      if (
        color &&
        color !== 'transparent' &&
        color !== 'rgba(0, 0, 0, 0)' &&
        color !== 'rgb(255, 255, 255)'
      ) {
        return color;
      }
    }

    return '#67436f';
  }

  function installStyle() {
    var style = document.getElementById(
      'chat-radio-unified-style'
    );

    if (!style) {
      style = document.createElement('style');
      style.id = 'chat-radio-unified-style';
    }

    style.textContent = `
      #settings #shfaq-radio-panel,
      #settings #shfaq-radio-panel * {
        box-sizing: border-box;
      }

      #settings #shfaq-radio-panel {
        clear: both !important;
        float: none !important;
        display: block !important;
        width: calc(100% - 8px) !important;
        margin: 10px 4px !important;
        padding: 14px !important;
        direction: rtl;
        background: #fff !important;
        color: #333 !important;
        border: 1px solid #d9d9d9 !important;
        border-radius: 12px !important;
        text-align: right !important;
        font-family: Tahoma, "Segoe UI", sans-serif !important;
        font-size: 13px !important;
        line-height: 1.7 !important;
      }

      #shfaq-radio-panel .kr-r-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }

      #shfaq-radio-panel .kr-r-heading strong {
        color: #555;
        font-size: 15px;
      }

      #shfaq-radio-panel .kr-r-heading > span {
        color: #666;
        font-size: 11px;
      }

      #shfaq-radio-panel .kr-r-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 7px;
      }

      #settings #shfaq-radio-panel button {
        position: static !important;
        float: none !important;
        display: flex !important;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: auto !important;
        min-width: 0 !important;
        min-height: 42px !important;
        height: auto !important;
        margin: 0 !important;
        padding: 9px 6px !important;
        border: 1px solid #d0d0d0 !important;
        border-radius: 8px !important;
        background: #f6f6f6 !important;
        color: #333 !important;
        font-family: inherit !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        line-height: 1.7 !important;
        white-space: normal !important;
        text-shadow: none !important;
        box-shadow: none !important;
        cursor: pointer;
      }

      #settings #shfaq-radio-panel button[aria-pressed="true"],
      #settings #shfaq-radio-panel [data-kr-play] {
        background: var(--chat-radio-accent, #67436f) !important;
        border-color: var(--chat-radio-accent, #67436f) !important;
        color: #fff !important;
      }

      #settings #shfaq-radio-panel button:disabled {
        opacity: .65;
        cursor: default;
      }

      #settings #shfaq-radio-panel button:focus-visible,
      #settings #shfaq-radio-panel input:focus-visible {
        outline: 2px solid var(--chat-radio-accent, #67436f) !important;
        outline-offset: 2px;
      }

      #settings #shfaq-radio-panel .kr-r-info {
        padding: 6px 0 !important;
        margin-bottom: 8px !important;
        border-bottom: 1px solid #e3e3e3;
        overflow-wrap: anywhere;
      }

      #settings #shfaq-radio-panel .kr-r-status {
        min-height: 22px !important;
        margin: 0 !important;
        color: #555;
        font-size: 12px !important;
      }

      #shfaq-radio-panel .kr-r-status[data-state="error"] {
        color: #a32828;
      }

      #shfaq-radio-panel .kr-r-controls {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }

      #shfaq-radio-panel .kr-r-volume {
        display: block;
        width: 100%;
        margin: 12px 0 0;
        font-weight: 400;
      }

      #shfaq-radio-panel .kr-r-volume > span {
        display: flex;
        justify-content: space-between;
        color: #555;
        font-size: 12px;
      }

      #shfaq-radio-panel output {
        display: inline;
        padding: 0;
        color: #555;
        font-size: 12px;
      }

      #settings #shfaq-radio-panel input[type="range"] {
        display: block;
        float: none;
        width: 100%;
        min-height: 24px;
        margin: 8px 0;
        padding: 0;
        border: 0;
        background: transparent;
        direction: ltr;
        accent-color: var(--chat-radio-accent, #67436f);
      }

      #shfaq-radio-panel .kr-r-bottom {
        margin: 8px 0 0;
        color: #666;
        font-size: 11px;
        text-align: center;
      }

      #settings #shfaq-radio-panel audio {
        display: none !important;
      }

      #settings #shfaq-radio-panel button {
        visibility: visible !important;
        opacity: 1;
        overflow: visible !important;
        text-indent: 0 !important;
        font: 700 12px/1.7 Tahoma, "Segoe UI", sans-serif !important;
      }

      #settings #shfaq-radio-panel button::before,
      #settings #shfaq-radio-panel button::after {
        content: none !important;
        display: none !important;
      }

      #settings #shfaq-radio-panel .kr-r-icon {
        display: inline-block !important;
        position: static !important;
        float: none !important;
        flex: 0 0 20px !important;
        width: 20px !important;
        height: 20px !important;
        min-width: 20px !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        color: inherit !important;
        fill: none !important;
        stroke: currentColor !important;
        stroke-width: 1.8 !important;
        overflow: visible !important;
        pointer-events: none;
      }

      #settings #shfaq-radio-panel button:disabled {
        opacity: .65;
      }

      #settings #shfaq-radio-panel input[type="range"] {
        appearance: auto !important;
        position: static !important;
        float: none !important;
        width: 100% !important;
        max-width: none !important;
        height: 24px !important;
        min-width: 0 !important;
        padding: 0 !important;
        margin: 8px 0 !important;
        box-shadow: none !important;
        background: transparent !important;
      }
    `;

    document.head.appendChild(style);
  }

  function icon(name) {
    var paths = {
      book:
        '<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Z"/>' +
        '<path d="M12 5v15"/>',

      music:
        '<path d="M9 18V5l11-2v13M9 9l11-2"/>' +
        '<ellipse cx="6" cy="18" rx="3" ry="2"/>' +
        '<ellipse cx="17" cy="16" rx="3" ry="2"/>',

      headphones:
        '<path d="M4 14v-3a8 8 0 0 1 16 0v3"/>' +
        '<rect x="3" y="12" width="4" height="9" rx="2"/>' +
        '<rect x="17" y="12" width="4" height="9" rx="2"/>',

      mic:
        '<rect x="9" y="2" width="6" height="13" rx="3"/>' +
        '<path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/>',

      play:
        '<path d="m8 4 12 8-12 8Z"/>',

      stop:
        '<rect x="5" y="5" width="14" height="14" rx="1"/>'
    };

    return (
      '<svg class="kr-r-icon" viewBox="0 0 24 24" ' +
      'aria-hidden="true" focusable="false" ' +
      'stroke-linecap="round" stroke-linejoin="round">' +
      paths[name] +
      '</svg>'
    );
  }

  function el(selector) {
    return panel ? panel.querySelector(selector) : null;
  }

  function clearDeadline() {
    if (deadline !== null) {
      clearTimeout(deadline);
      deadline = null;
    }
  }

  function setStatus(message, mode) {
    var node = el('[data-kr-status]');

    if (!node) return;

    if (node.textContent !== message) {
      node.textContent = message;
    }

    mode = mode || 'stopped';

    if (node.getAttribute('data-state') !== mode) {
      node.setAttribute('data-state', mode);
    }
  }

  function enablePlay() {
    var button = el('[data-kr-play]');

    if (button) button.disabled = false;
  }

  function release() {
    attempt++;
    clearDeadline();

    var previous = media;
    media = null;

    if (!previous) return;

    try {
      previous.pause();
      previous.removeAttribute('src');
      previous.load();
    } catch (error) {
      // قد يكون العنصر أُزيل أثناء تغيير واجهة الشات.
    }

    previous.remove();
  }

  function stop() {
    release();
    setStatus('متوقف · اضغط تشغيل للاستماع');
    enablePlay();
  }

  function choose(index) {
    if (
      !panel ||
      !Number.isInteger(index) ||
      index < 0 ||
      index >= stations.length
    ) {
      return;
    }

    stop();
    selected = index;

    panel.querySelectorAll('[data-kr-station]').forEach(
      function (button) {
        var active =
          Number(button.getAttribute('data-kr-station')) ===
          selected;

        button.setAttribute('aria-pressed', String(active));
      }
    );
  }

  function play() {
    if (destroyed || !panel || !panel.isConnected) return;

    var sources = stations[selected].urls;
    var sourceIndex = 0;

    function connect() {
      release();

      var token = attempt;
      var audio = document.createElement('audio');

      media = audio;
      audio.preload = 'none';
      audio.hidden = true;
      audio.setAttribute('playsinline', '');

      try {
        audio.volume = volume;
      } catch (error) {
        // بعض الأجهزة تدير الصوت من أزرار الجهاز.
      }

      panel.appendChild(audio);

      setStatus(
        sourceIndex
          ? 'جارٍ تجربة بث بديل…'
          : 'جارٍ الاتصال…',
        'loading'
      );

      var button = el('[data-kr-play]');

      if (button) button.disabled = true;

      function current() {
        return (
          !destroyed &&
          media === audio &&
          token === attempt &&
          panel &&
          panel.isConnected
        );
      }

      function failed(message, allowFallback) {
        if (!current()) return;

        release();

        if (
          allowFallback &&
          sourceIndex + 1 < sources.length
        ) {
          sourceIndex++;
          connect();
          return;
        }

        setStatus(message, 'error');
        enablePlay();
      }

      function armDeadline() {
        clearDeadline();

        deadline = setTimeout(function () {
          deadline = null;

          failed(
            'تعذّر الاتصال بالبث. جرّب مجددًا أو اختر محطة أخرى.',
            true
          );
        }, 20000);
      }

      audio.addEventListener('playing', function () {
        if (!current()) return;

        clearDeadline();
        setStatus('يعمل الآن · الصوت عندك فقط', 'playing');
      });

      audio.addEventListener('waiting', function () {
        if (!current()) return;

        setStatus('جارٍ تحميل الصوت…', 'loading');
        armDeadline();
      });

      audio.addEventListener('error', function () {
        failed(
          'تعذّر تشغيل المحطة. جرّب مجددًا أو اختر محطة أخرى.',
          true
        );
      });

      audio.addEventListener('ended', function () {
        failed(
          'انقطع البث. اضغط تشغيل لإعادة الاتصال.',
          true
        );
      });

      audio.addEventListener('pause', function () {
        if (!current()) return;

        clearDeadline();
        setStatus('متوقف · اضغط تشغيل للاستماع');
        enablePlay();
      });

      armDeadline();
      audio.src = sources[sourceIndex];

      try {
        var result = audio.play();

        if (result && typeof result.catch === 'function') {
          result.catch(function (error) {
            if (!current()) return;

            if (
              error &&
              error.name === 'NotAllowedError'
            ) {
              failed(
                'اضغط تشغيل للسماح بالصوت في المتصفح.',
                false
              );
              return;
            }

            failed(
              'تعذّر تشغيل البث. جرّب محطة أخرى.',
              true
            );
          });
        }
      } catch (error) {
        failed(
          'تعذّر تشغيل البث على هذا الجهاز.',
          true
        );
      }
    }

    connect();
  }

  function isMounted() {
    var settings = document.getElementById('settings');

    return Boolean(
      settings &&
      panel &&
      panel.isConnected &&
      settings.contains(panel)
    );
  }

  function watchStructure() {
    if (destroyed || !observer) return;

    observer.disconnect();
    watchedParent = panel ? panel.parentElement : null;

    if (!isMounted()) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      return;
    }

    // مراقبة الحاويات دون مراقبة محتويات رسائل الشات.
    var node = watchedParent;

    while (node && node.nodeType === 1) {
      observer.observe(node, {
        childList: true
      });

      node = node.parentElement;
    }
  }

  function mount() {
    if (destroyed) return;

    if (panel && !panel.isConnected) {
      release();
      panel = null;
    }

    var settings = document.getElementById('settings');

    if (!settings) {
      watchStructure();
      return;
    }

    if (panel && settings.contains(panel)) {
      watchStructure();
      return;
    }

    if (observer) observer.disconnect();

    if (panel) {
      release();
      panel.remove();
      panel = null;
    }

    var oldPanel = document.getElementById(
      'shfaq-radio-panel'
    );

    if (oldPanel) oldPanel.remove();

    installStyle();

    panel = document.createElement('section');
    panel.id = 'shfaq-radio-panel';
    panel.dir = 'rtl';
    panel.lang = 'ar';

    var radioName = detectName();

    panel.setAttribute('aria-label', radioName);

    panel.style.setProperty(
      '--chat-radio-accent',
      detectAccent()
    );

    panel.innerHTML = `
      <div class="kr-r-heading">
        <strong data-chat-radio-heading></strong>
        <span>استماع شخصي</span>
      </div>

      <div
        class="kr-r-grid"
        role="group"
        aria-label="اختيار المحطة"
      >
        ${stations.map(function (station, index) {
          return `
            <button
              type="button"
              data-kr-station="${index}"
              aria-pressed="${index === selected}"
            >
              ${icon(station.icon)}
              ${station.label}
            </button>
          `;
        }).join('')}
      </div>

      <div class="kr-r-info">
        <div
          class="kr-r-status"
          data-kr-status
          role="status"
          aria-live="polite"
        ></div>
      </div>

      <div class="kr-r-controls">
        <button type="button" data-kr-play>
          ${icon('play')}
          تشغيل
        </button>

        <button type="button" data-kr-stop>
          ${icon('stop')}
          إيقاف
        </button>
      </div>

      <label class="kr-r-volume">
        <span>
          مستوى الصوت
          <output data-kr-level></output>
        </span>

        <input
          data-kr-volume
          type="range"
          min="0"
          max="100"
          step="1"
          aria-label="مستوى صوت الراديو"
        >
      </label>

      <p class="kr-r-bottom">
        لا يُبث الصوت للغرفة · يبدأ التشغيل باختيارك
      </p>
    `;

    panel.querySelector(
      '[data-chat-radio-heading]'
    ).textContent = radioName;

    var gamesButton = settings.querySelector(
      '#thGamesOpenBtn'
    );

    var moreButton = settings.querySelector(
      '.th-settings-more-btn'
    );

    if (gamesButton) {
      gamesButton.insertAdjacentElement('afterend', panel);
    } else if (moreButton) {
      moreButton.before(panel);
    } else {
      settings.appendChild(panel);
    }

    panel.addEventListener('click', function (event) {
      var target = event.target;

      if (
        !target ||
        typeof target.closest !== 'function'
      ) {
        return;
      }

      var button = target.closest('button');

      if (
        !button ||
        !panel ||
        !panel.contains(button)
      ) {
        return;
      }

      if (button.hasAttribute('data-kr-station')) {
        choose(
          Number(button.getAttribute('data-kr-station'))
        );
      } else if (button.hasAttribute('data-kr-play')) {
        play();
      } else if (button.hasAttribute('data-kr-stop')) {
        stop();
      }
    });

    var slider = el('[data-kr-volume]');
    var output = el('[data-kr-level]');

    slider.value = String(Math.round(volume * 100));
    output.textContent = slider.value + '٪';

    slider.addEventListener('input', function () {
      volume = Math.max(
        0,
        Math.min(1, Number(slider.value) / 100)
      );

      if (media) {
        try {
          media.volume = volume;
        } catch (error) {
          // يبقى التحكم متاحًا من أزرار الجهاز.
        }
      }

      output.textContent =
        Math.round(volume * 100) + '٪';
    });

    choose(selected);
    watchStructure();
  }

  function scheduleMount() {
    if (destroyed || mountTimer !== null) return;

    if (
      isMounted() &&
      panel.parentElement === watchedParent
    ) {
      return;
    }

    if (panel && !panel.isConnected) release();

    mountTimer = setTimeout(function () {
      mountTimer = null;

      if (!destroyed) mount();
    }, 150);
  }

  function onLogout(event) {
    var target = event.target;

    if (
      target &&
      typeof target.closest === 'function' &&
      target.closest('#settings .SERT')
    ) {
      stop();
    }
  }

  function init() {
    if (destroyed || !document.body) return;

    observer = new MutationObserver(scheduleMount);
    mount();
  }

  function destroy() {
    destroyed = true;

    if (mountTimer !== null) {
      clearTimeout(mountTimer);
      mountTimer = null;
    }

    if (observer) {
      observer.disconnect();
      observer = null;
    }

    release();

    document.removeEventListener(
      'DOMContentLoaded',
      init
    );

    document.removeEventListener(
      'click',
      onLogout,
      true
    );

    window.removeEventListener('pagehide', stop);

    if (panel) {
      panel.remove();
      panel = null;
    }

    watchedParent = null;
  }

  window[GLOBAL] = {
    destroy: destroy
  };

  document.addEventListener('click', onLogout, true);
  window.addEventListener('pagehide', stop);

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
