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
  var root = null;
  var ui = null;
  var playProxy = null;
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
      icon: '📖',
      urls: ['https://edge.mixlr.com/channel/rwumx']
    },
    {
      label: 'أغاني عربية',
      icon: '♫',
      urls: [
        'https://mazajfm.ice.infomaniak.ch/mazajfm-192.mp3'
      ]
    },
    {
      label: 'أغاني أجنبية',
      icon: '🎧',
      urls: [
        'https://channels.fluxfm.de/90s/externalembedflxhp/stream.mp3'
      ]
    },
    {
      label: 'سوالف مباشرة',
      icon: '🎙',
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
    var style = document.createElement('style');

    style.textContent = `
      #shfaq-radio-panel,
      #shfaq-radio-panel * {
        box-sizing: border-box;
      }

      #shfaq-radio-panel {
        display: block;
        width: calc(100% - 8px);
        margin: 10px 4px;
        padding: 14px;
        direction: rtl;
        text-align: right;
        background: #fff;
        color: #333;
        border: 1px solid #d9d9d9;
        border-radius: 12px;
        font: 13px/1.7 Tahoma, "Segoe UI", sans-serif;
      }

      .kr-r-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }

      .kr-r-heading strong {
        color: var(--chat-radio-accent, #67436f);
        font-size: 15px;
        font-weight: 700;
      }

      .kr-r-heading > span {
        color: #666;
        font-size: 11px;
        white-space: nowrap;
      }

      .kr-r-grid,
      .kr-r-controls {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 7px;
      }

      .kr-r-controls {
        gap: 8px;
      }

      button {
        position: static;
        float: none;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: 100%;
        min-width: 0;
        min-height: 42px;
        height: auto;
        margin: 0;
        padding: 9px 6px;
        border: 1px solid #d0d0d0;
        border-radius: 8px;
        background: #f6f6f6;
        color: #333;
        font: 700 12px/1.7 Tahoma, "Segoe UI", sans-serif;
        white-space: normal;
        text-align: center;
        text-indent: 0;
        text-shadow: none;
        box-shadow: none;
        cursor: pointer;
      }

      button[aria-pressed="true"],
      button[data-kr-play] {
        background: var(--chat-radio-accent, #67436f);
        border-color: var(--chat-radio-accent, #67436f);
        color: #fff;
      }

      button:disabled {
        opacity: .65;
        cursor: default;
      }

      button:focus-visible,
      input:focus-visible {
        outline: 2px solid var(--chat-radio-accent, #67436f);
        outline-offset: 2px;
      }

      .kr-r-icon {
        display: inline-block;
        flex: 0 0 auto;
        font-size: 16px;
        line-height: 1;
      }

      .kr-r-label {
        display: inline;
        min-width: 0;
        color: inherit;
        font: inherit;
        overflow-wrap: anywhere;
      }

      .kr-r-info {
        padding: 6px 0;
        margin-bottom: 8px;
        border-bottom: 1px solid #e3e3e3;
        overflow-wrap: anywhere;
      }

      .kr-r-status {
        min-height: 22px;
        margin: 0;
        color: #555;
        font-size: 12px;
      }

      .kr-r-status[data-state="error"] {
        color: #a32828;
      }

      .kr-r-volume {
        display: block;
        width: 100%;
        margin: 12px 0 0;
        font-weight: 400;
      }

      .kr-r-volume > span {
        display: flex;
        justify-content: space-between;
        color: #555;
        font-size: 12px;
      }

      output {
        display: inline;
        padding: 0;
        color: #555;
        font: inherit;
      }

      input[type="range"] {
        appearance: auto;
        position: static;
        display: block;
        float: none;
        width: 100%;
        height: 24px;
        min-width: 0;
        margin: 8px 0;
        padding: 0;
        border: 0;
        background: transparent;
        box-shadow: none;
        direction: ltr;
        accent-color: var(--chat-radio-accent, #67436f);
      }

      .kr-r-bottom {
        margin: 8px 0 0;
        color: #666;
        font-size: 11px;
        text-align: center;
      }

      audio,
      [hidden] {
        display: none !important;
      }
    `;

    root.appendChild(style);
  }

  function el(selector) {
    return ui ? ui.querySelector(selector) : null;
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
      !ui ||
      !Number.isInteger(index) ||
      index < 0 ||
      index >= stations.length
    ) {
      return;
    }

    stop();
    selected = index;

    ui.querySelectorAll('[data-kr-station]').forEach(
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

      ui.appendChild(audio);

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

    // مراقبة الحاويات دون محتويات رسائل الشات.
    var node = watchedParent;

    while (node && node.nodeType === 1) {
      observer.observe(node, {
        childList: true
      });

      node = node.parentElement;
    }
  }

  function createCompatibilityButton(attribute, handler) {
    var button = document.createElement('button');

    button.type = 'button';
    button.hidden = true;
    button.tabIndex = -1;
    button.setAttribute(attribute, '');
    button.setAttribute('aria-hidden', 'true');
    button.style.setProperty('display', 'none', 'important');
    button.addEventListener('click', handler);

    panel.appendChild(button);

    return button;
  }

  function mount() {
    if (destroyed) return;

    if (panel && !panel.isConnected) {
      release();
      panel = null;
      ui = null;
      root = null;
      playProxy = null;
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

    panel = document.createElement('section');
    panel.id = 'shfaq-radio-panel';
    panel.dir = 'rtl';
    panel.lang = 'ar';

    var radioName = detectName();
    var accent = detectAccent();

    panel.setAttribute('aria-label', radioName);

    // عزل الحاوية عن قواعد الإعدادات العامة.
    panel.style.setProperty('all', 'initial', 'important');
    panel.style.setProperty('display', 'block', 'important');
    panel.style.setProperty('clear', 'both', 'important');
    panel.style.setProperty('float', 'none', 'important');
    panel.style.setProperty('width', '100%', 'important');

    // CSS الموقع لا يصل إلى العناصر داخل هذه الواجهة.
    root = panel.attachShadow({ mode: 'open' });

    ui = document.createElement('div');
    ui.id = 'shfaq-radio-panel';
    ui.dir = 'rtl';
    ui.lang = 'ar';
    ui.style.setProperty('--chat-radio-accent', accent);

    root.appendChild(ui);
    installStyle();

    ui.innerHTML = `
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
              <span class="kr-r-icon" aria-hidden="true">
                ${station.icon}
              </span>

              <span class="kr-r-label">
                ${station.label}
              </span>
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
          <span class="kr-r-icon" aria-hidden="true">▶</span>
          <span class="kr-r-label">تشغيل</span>
        </button>

        <button type="button" data-kr-stop>
          <span class="kr-r-icon" aria-hidden="true">■</span>
          <span class="kr-r-label">إيقاف</span>
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

    el('[data-chat-radio-heading]').textContent =
      '📻 ' + radioName;

    // يحافظان على التوافق مع سكربت التلفاز الموجود.
    playProxy = createCompatibilityButton(
      'data-kr-play',
      play
    );

    createCompatibilityButton(
      'data-kr-stop',
      stop
    );

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

    ui.addEventListener('click', function (event) {
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
        !ui ||
        !ui.contains(button)
      ) {
        return;
      }

      if (button.hasAttribute('data-kr-station')) {
        choose(
          Number(button.getAttribute('data-kr-station'))
        );
      } else if (button.hasAttribute('data-kr-play')) {
        // يمر الحدث عبر الصفحة ليلتقطه سكربت التلفاز.
        if (playProxy) playProxy.click();
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
          // بعض الأجهزة تتحكم بالصوت من أزرار الجهاز.
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

    if (panel) panel.remove();

    panel = null;
    ui = null;
    root = null;
    playProxy = null;
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
