(function () {
  'use strict';

  const styleId = 'domino-online-dialog-style';
  if (document.getElementById(styleId)) return;

  const service = new URL('https://domino-server-5xbx.onrender.com/');
  const site = location.hostname.replace(/^www\./i, '');
  let windowState = null;
  let recipient = '';
  let scheduled = false;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .domino-online-row { margin-top: 6px; }

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
      gap: 6px;
    }

    #domino-online-dialog button,
    #domino-online-dock {
      padding: 8px 12px;
      border: 1px solid currentColor;
      border-radius: 6px;
      font: inherit;
      cursor: pointer;
    }

    #domino-online-dialog button {
      background: transparent;
      color: inherit;
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
      background: var(--domino-accent);
      color: var(--domino-ink);
      box-shadow: 0 3px 12px #0005;
    }

    #domino-online-dock[hidden] { display: none !important; }
  `;
  document.head.append(style);

  function button(label, click) {
    const node = document.createElement('button');
    node.type = 'button';
    node.textContent = label;
    node.addEventListener('click', click);
    return node;
  }

  function currentId() {
    if (typeof TIGERHOST === 'undefined') return '';
    return typeof TIGERHOST === 'string' || typeof TIGERHOST === 'number'
      ? String(TIGERHOST)
      : '';
  }

  function blocksInvites(value) {
    return value === true || value === 1 || value === '1' || value === 'true';
  }

  function readContext() {
    const id = currentId();
    if (!id) return null;

    const rows = document.querySelectorAll('.uzr[data-th-upro]');
    const ownRow = Array.from(rows).find(row => row.dataset.thUpro === id);
    const result = typeof TH_LUDO_GROUP_GET_ONLINE_ITEMS === 'function'
      ? TH_LUDO_GROUP_GET_ONLINE_ITEMS()
      : [];
    const items = Array.isArray(result) ? result : [];
    const ownEntry = items.find(item => item && String(item.id) === id);
    const name = (
      ownRow?.querySelector('.u-topic')?.textContent.trim() ||
      String(ownEntry?.topic || '').trim()
    ).slice(0, 80);
    if (!name) return null;

    return {
      type: 'domino-chat-context',
      site,
      id,
      name,
      room: typeof M_ROOM === 'undefined' ? '' : String(M_ROOM ?? ''),
      recipient,
      invites: !blocksInvites(ownEntry?.nogameinvite),
      roster: items
        .filter(item => item?.id != null && String(item.id) !== id && item.topic)
        .map(item => ({
          id: String(item.id),
          name: String(item.topic).trim().slice(0, 80),
          room: String(item.roomid ?? ''),
          blocked: blocksInvites(item.nogameinvite)
        }))
    };
  }

  function readTheme() {
    const siteName = (
      document.querySelector('meta[property="og:site_name"]')?.content.trim() ||
      document.title.split(/[|｜]/)[0].trim() ||
      site
    ).slice(0, 80);

    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');
    const selectors = [
      '#d0 button.label-primary',
      '#d0 .label-primary',
      '#d0',
      '#dpnl .th-dpnl-head'
    ];

    for (const selector of selectors) {
      const node = document.querySelector(selector);
      if (!node || !ctx) continue;

      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = getComputedStyle(node).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);

      const [r, g, b, alpha] = ctx.getImageData(0, 0, 1, 1).data;
      if (alpha < 240 || Math.min(r, g, b) > 240) continue;

      const channels = [r, g, b];
      const accent = '#' + channels.map(n => n.toString(16).padStart(2, '0')).join('');
      const [red, green, blue] = channels.map(n => {
        const v = n / 255;
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      });
      const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
      return { siteName, accent, ink: luminance > 0.179 ? '#000000' : '#ffffff' };
    }

    return { siteName, accent: '#343a40', ink: '#ffffff' };
  }

  function sendContext(context = readContext()) {
    if (context && windowState?.id === context.id) {
      windowState.frame.contentWindow?.postMessage(context, service.origin);
    }
  }

  function removeWindow() {
    if (!windowState) return;
    windowState.dialog.close();
    windowState.dialog.remove();
    windowState.dock.remove();
    windowState = null;
  }

  function createWindow(id) {
    const { siteName, accent, ink } = readTheme();
    const title = 'دومينو جماعي · ' + siteName;
    const url = new URL(service.href);
    url.searchParams.set('parent', location.origin);
    url.searchParams.set('site', siteName);
    url.searchParams.set('accent', accent);
    url.searchParams.set('ink', ink);

    const dialog = document.createElement('dialog');
    dialog.id = 'domino-online-dialog';
    dialog.dir = 'rtl';
    dialog.setAttribute('aria-label', title);

    const frame = document.createElement('iframe');
    frame.title = title;
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');

    const dock = button('دومينو', restore);
    dock.id = 'domino-online-dock';
    dock.hidden = true;
    dock.setAttribute('aria-controls', dialog.id);

    for (const node of [dialog, dock]) {
      node.style.setProperty('--domino-accent', accent);
      node.style.setProperty('--domino-ink', ink);
    }

    function restore() {
      if (!dialog.open) dialog.showModal();
      dock.hidden = true;
      sendContext();
    }

    function minimize() {
      dialog.close();
      dock.hidden = false;
      dock.focus({ preventScroll: true });
    }

    const header = document.createElement('header');
    header.className = 'domino-online-header';
    const heading = document.createElement('strong');
    heading.textContent = title;

    const controls = document.createElement('div');
    controls.className = 'domino-online-controls';
    controls.append(
      button('تصغير', minimize),
      button('إغلاق', () => dialog.close())
    );

    header.append(heading, controls);
    dialog.append(header, frame);
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      minimize();
    });
    frame.addEventListener('load', () => sendContext());

    windowState = { id, dialog, frame, dock, restore };
    frame.src = url.href;
    document.body.append(dialog, dock);
  }

  function syncChat() {
    if (!document.body) return;
    const id = currentId();
    if (windowState && windowState.id !== id) {
      removeWindow();
      recipient = '';
    }

    const context = readContext();
    if (!context) return;
    if (!windowState) createWindow(context.id);
    sendContext(context);
  }

  function openGame(targetId = '') {
    recipient = targetId;
    const id = currentId();

    if (windowState && windowState.id !== id) removeWindow();
    if (!windowState) createWindow(id);
    windowState.restore();
  }

  function mount() {
    const cards = document.querySelector('#thGames .thGamesSection .thGamesCards');
    if (cards && !cards.querySelector('.domino-online-card')) {
      const node = button('دومينو جماعي · دعواتي', () => openGame());
      node.className = 'thGamesCard thGamesCardBot domino-online-card';
      cards.append(node);
    }

    const rows = document.querySelectorAll(
      '.th-upro-profile-container .games-duo-modern:not(.domino-online-row)'
    );

    for (const row of rows) {
      const next = row.nextElementSibling;
      const extra = next?.classList.contains('domino-online-row') ? next : null;
      const targetId = row.querySelector('[data-ludoid]')?.dataset.ludoid ||
        row.querySelector('[data-xo-target]')?.dataset.xoTarget;

      if (!targetId || targetId === currentId()) {
        extra?.remove();
        continue;
      }

      if (extra) {
        extra.dataset.recipient = targetId;
        continue;
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'games-duo-modern domino-online-row';
      wrapper.dataset.recipient = targetId;
      const node = button('تحدّي دومينو', () => openGame(wrapper.dataset.recipient));
      node.className = 'game-btn game-ludo';
      wrapper.append(node);
      row.after(wrapper);
    }
  }

  window.addEventListener('message', event => {
    const game = windowState;
    if (!game || event.origin !== service.origin ||
        event.source !== game.frame.contentWindow ||
        event.data?.type !== 'domino-pending') return;

    const count = Number(event.data.count) || 0;
    game.dock.textContent = count > 0 ? 'دومينو · ' + count + ' دعوة' : 'دومينو';
    if (count > 0 && !game.dialog.open) game.dock.hidden = false;
  });

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
  syncChat();
  setInterval(syncChat, 3500);
})();
