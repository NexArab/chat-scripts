(function () {
  'use strict';

  const styleId = 'domino-online-dialog-style';
  if (document.getElementById(styleId) ||
      document.getElementById('sh8awh-online-domino-style')) return;

  const serviceUrl = 'https://domino-server-5xbx.onrender.com/';
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .domino-online-row { margin-top: 6px; }
    .domino-online-row .game-btn { cursor: pointer; }

    #domino-online-dialog {
      width: min(96vw, 950px);
      height: 90vh;
      height: 90dvh;
      max-height: 96dvh;
      padding: 0;
      border: 1px solid var(--domino-accent);
      border-radius: 14px;
      background: #181818;
      color: #fff;
      font-family: inherit;
      overflow: hidden;
    }

    #domino-online-dialog[open] {
      display: flex;
      flex-direction: column;
    }

    #domino-online-dialog::backdrop { background: #000b; }

    #domino-online-dialog .domino-online-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--domino-accent);
      color: var(--domino-ink);
    }

    #domino-online-dialog .domino-online-controls {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 6px;
    }

    #domino-online-dialog button {
      padding: 8px 12px;
      background: transparent;
      color: inherit;
      border: 1px solid currentColor;
      border-radius: 6px;
      cursor: pointer;
      font: inherit;
    }

    #domino-online-dialog iframe {
      flex: 1;
      width: 100%;
      min-height: 0;
      border: 0;
    }

    #domino-online-dock {
      position: fixed;
      z-index: 10020;
      inset-inline-end: 12px;
      bottom: calc(62px + env(safe-area-inset-bottom));
      min-height: 42px;
      padding: 8px 14px;
      border: 1px solid currentColor;
      border-radius: 9px;
      background: var(--domino-accent);
      color: var(--domino-ink);
      box-shadow: 0 3px 12px #0005;
      cursor: pointer;
      font: inherit;
    }

    #domino-online-dock[hidden] { display: none !important; }
  `;
  document.head.append(style);

  function readTheme() {
    const siteName = (
      document.querySelector('meta[property="og:site_name"]')?.content.trim() ||
      document.title.split(/[|｜]/)[0].trim() ||
      location.hostname
    ).slice(0, 80);

    const sample = document.createElement('canvas');
    sample.width = sample.height = 1;
    const context = sample.getContext('2d');

    const selectors = [
      '#d0 button.label-primary',
      '#d0 .label-primary',
      '#d0',
      '#dpnl .th-dpnl-head'
    ];

    for (const selector of selectors) {
      const node = document.querySelector(selector);
      if (!node || !context) continue;

      context.clearRect(0, 0, 1, 1);
      context.fillStyle = getComputedStyle(node).backgroundColor;
      context.fillRect(0, 0, 1, 1);

      const [r, g, b, alpha] = context.getImageData(0, 0, 1, 1).data;
      if (alpha < 240 || Math.min(r, g, b) > 240) continue;

      const channels = [r, g, b];
      const accent = '#' + channels
        .map(channel => channel.toString(16).padStart(2, '0'))
        .join('');

      const [red, green, blue] = channels.map(channel => {
        const value = channel / 255;
        return value <= 0.04045
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4;
      });

      const lightness = red * 0.2126 + green * 0.7152 + blue * 0.0722;
      return {
        siteName,
        accent,
        ink: lightness > 0.179 ? '#000000' : '#ffffff'
      };
    }

    return { siteName, accent: '#343a40', ink: '#ffffff' };
  }

  function makeButton(label, handler) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', handler);
    return button;
  }

  function openGame(recipient) {
    if (document.getElementById('domino-online-dialog')) {
      document.getElementById('domino-online-dock')?.click();
      return;
    }

    const opener = document.activeElement;
    const { siteName, accent, ink } = readTheme();
    const heading = 'دومينو جماعي · ' + siteName;

    const url = new URL(serviceUrl);
    url.searchParams.set('site', siteName);
    url.searchParams.set('accent', accent);
    url.searchParams.set('ink', ink);
    if (recipient) url.searchParams.set('name', recipient);

    const dialog = document.createElement('dialog');
    dialog.id = 'domino-online-dialog';
    dialog.dir = 'rtl';
    dialog.setAttribute('aria-label', heading);
    dialog.style.setProperty('--domino-accent', accent);
    dialog.style.setProperty('--domino-ink', ink);

    const header = document.createElement('header');
    header.className = 'domino-online-header';

    const title = document.createElement('strong');
    title.textContent = heading;

    const controls = document.createElement('div');
    controls.className = 'domino-online-controls';

    const dock = makeButton('دومينو', restoreGame);
    dock.id = 'domino-online-dock';
    dock.hidden = true;
    dock.setAttribute('aria-label', 'استئناف الدومينو');
    dock.setAttribute('aria-controls', dialog.id);
    dock.style.setProperty('--domino-accent', accent);
    dock.style.setProperty('--domino-ink', ink);

    const minimize = makeButton('تصغير', minimizeGame);
    const close = makeButton('إغلاق', closeGame);
    controls.append(minimize, close);
    header.append(title, controls);

    const frame = document.createElement('iframe');
    frame.title = heading;
    frame.src = url.href;
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');

    dialog.append(header, frame);
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      minimizeGame();
    });

    document.body.append(dialog, dock);
    dialog.showModal();

    function minimizeGame() {
      if (!dialog.open) return;
      dialog.close();
      dock.hidden = false;
      dock.focus({ preventScroll: true });
    }

    function restoreGame() {
      if (dialog.open) return;
      dialog.showModal();
      dock.hidden = true;
      minimize.focus({ preventScroll: true });
    }

    function closeGame() {
      dialog.close();
      dialog.remove();
      dock.remove();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    }
  }

  function mount() {
    const cards = document.querySelector('#thGames .thGamesSection .thGamesCards');
    if (cards && !cards.querySelector('.domino-online-card')) {
      const button = makeButton('دومينو جماعي · دعواتي', () => openGame());
      button.className = 'thGamesCard thGamesCardBot domino-online-card';
      cards.append(button);
    }

    const rows = document.querySelectorAll(
      '.th-upro-profile-container .games-duo-modern:not(.domino-online-row)'
    );

    for (const row of rows) {
      const next = row.nextElementSibling;
      const existing = next?.classList.contains('domino-online-row') ? next : null;
      const recipientId = row.querySelector('[data-ludoid]')?.dataset.ludoid ||
        row.querySelector('[data-xo-target]')?.dataset.xoTarget;

      if (!recipientId ||
          (typeof TIGERHOST !== 'undefined' && String(TIGERHOST) === recipientId)) {
        existing?.remove();
        continue;
      }

      const profile = row.closest('.th-upro-profile-container');
      const name = profile.querySelector('.th-upro-profile-name')?.textContent.trim() || '';

      if (existing) {
        existing.dataset.recipient = name;
        continue;
      }

      const extra = document.createElement('div');
      extra.className = 'games-duo-modern domino-online-row';
      extra.dataset.recipient = name;

      const button = makeButton('تحدّي دومينو', () => openGame(extra.dataset.recipient));
      button.className = 'game-btn game-ludo';
      extra.append(button);
      row.after(extra);
    }
  }

  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      mount();
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-ludoid', 'data-xo-target']
  });

  mount();
})();
