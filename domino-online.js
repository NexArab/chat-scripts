(function () {
  'use strict';
  if (document.getElementById('domino-online-dialog-style') ||
      document.getElementById('sh8awh-online-domino-style')) return;

  const serviceUrl = 'https://domino-server-5xbx.onrender.com/';
  const style = document.createElement('style');
  style.id = 'domino-online-dialog-style';
  style.textContent = `
    .domino-online-row{margin-top:6px}
    .domino-online-row .game-btn{cursor:pointer}
    #domino-online-dialog{width:min(96vw,950px);height:90vh;height:90dvh;max-height:96dvh;padding:0;border:1px solid var(--domino-accent);border-radius:14px;background:#181818;color:#fff;font-family:inherit;overflow:hidden}
    #domino-online-dialog[open]{display:flex;flex-direction:column}
    #domino-online-dialog::backdrop{background:#000b}
    #domino-online-dialog .domino-online-header{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 12px;background:var(--domino-accent);color:var(--domino-ink)}
    #domino-online-dialog button{padding:8px 12px;background:transparent;color:inherit;border:1px solid currentColor;border-radius:6px;cursor:pointer;font:inherit}
    #domino-online-dialog .domino-online-controls{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px}
    #domino-online-dock{position:fixed;z-index:10020;inset-inline-end:12px;bottom:calc(62px + env(safe-area-inset-bottom));padding:8px 14px;min-height:42px;border:1px solid currentColor;border-radius:9px;background:var(--domino-accent);color:var(--domino-ink);font:inherit;cursor:pointer;box-shadow:0 3px 12px #0005}
    #domino-online-dock[hidden]{display:none!important}
    #domino-online-dialog iframe{flex:1;width:100%;min-height:0;border:0}
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
    const selectors = ['#d0 button.label-primary', '#d0 .label-primary', '#d0', '#dpnl .th-dpnl-head'];
    for (const selector of selectors) {
      const node = document.querySelector(selector);
      if (!node || !context) continue;
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = getComputedStyle(node).backgroundColor;
      context.fillRect(0, 0, 1, 1);
      const [r, g, b, alpha] = context.getImageData(0, 0, 1, 1).data;
      if (alpha < 240 || Math.min(r, g, b) > 240) continue;
      const accent = '#' + [r, g, b].map(channel => channel.toString(16).padStart(2, '0')).join('');
      const [red, green, blue] = [r, g, b].map(channel => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      const lightness = red * 0.2126 + green * 0.7152 + blue * 0.0722;
      return { siteName, accent, ink: lightness > 0.179 ? '#000000' : '#ffffff' };
    }
    return { siteName, accent: '#343a40', ink: '#ffffff' };
  }

  let chatFrame;
  let activeIdentity = '';
  let selectedRecipient = '';
  const gameOrigin = new URL(serviceUrl).origin;
  const site = location.hostname.replace(/^www\./i, '');

  function chatContext() {
    if (typeof TIGERHOST === 'undefined' ||
        !['string', 'number'].includes(typeof TIGERHOST)) return null;
    const id = String(TIGERHOST);
    const row = [...document.querySelectorAll('.uzr[data-th-upro]')]
      .find(node => node.dataset.thUpro === id);
    const entries = typeof TH_LUDO_GROUP_GET_ONLINE_ITEMS === 'function'
      ? TH_LUDO_GROUP_GET_ONLINE_ITEMS() : [];
    if (!Array.isArray(entries)) return null;
    const me = entries.find(item => String(item?.id) === id);
    const label = node => node?.textContent.trim();
    const name = (label(row?.querySelector('.u-topic')) || String(me?.topic || '').trim()).slice(0, 80);
    if (!name) return null;
    const room = typeof M_ROOM === 'undefined' ? '' : String(M_ROOM || '');
    const blocked = value => value === true || value === 1 || value === '1' || value === 'true';
    return {
      type: 'domino-chat-context', site, id, name, room, recipient: selectedRecipient,
      invites: !blocked(me?.nogameinvite),
      roster: entries.filter(item => item && item.id != null && String(item.id) !== id && item.topic)
        .map(item => ({
          id: String(item.id), name: String(item.topic).trim().slice(0, 80),
          room: String(item.roomid || ''), blocked: blocked(item.nogameinvite)
        }))
    };
  }

  function syncChat() {
    const context = chatContext();
    if (!context || (chatFrame && context.id !== activeIdentity)) {
      document.getElementById('domino-online-dialog')?.querySelector('[data-domino-reset]')?.click();
      if (!context) return;
    }
    if (!chatFrame) open('', true, context.id);
    chatFrame?.contentWindow?.postMessage(context, gameOrigin);
  }

  function syncOpenContext() {
    const context = chatContext();
    if (context) chatFrame?.contentWindow?.postMessage(context, gameOrigin);
  }

  function open(recipient, background = false, identity = '') {
    if (document.getElementById('domino-online-dialog')) {
      if (recipient) selectedRecipient = recipient;
      if (!background) syncOpenContext();
      if (!background) document.getElementById('domino-online-dock')?.click();
      return;
    }
    if (recipient) selectedRecipient = recipient;
    const opener = document.activeElement;
    const { siteName, accent, ink } = readTheme();
    const url = new URL(serviceUrl);
    url.searchParams.set('site', siteName);
    url.searchParams.set('accent', accent);
    url.searchParams.set('ink', ink);
    url.searchParams.set('parent', location.origin);
    const dialog = document.createElement('dialog');
    dialog.id = 'domino-online-dialog';
    dialog.dir = 'rtl';
    const heading = 'دومينو جماعي · ' + siteName;
    dialog.setAttribute('aria-label', heading);
    dialog.style.setProperty('--domino-accent', accent);
    dialog.style.setProperty('--domino-ink', ink);
    const header = document.createElement('header');
    header.className = 'domino-online-header';
    const title = document.createElement('strong');
    title.textContent = heading;
    function makeButton(label, handler) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', handler);
      return button;
    }

    const dock = makeButton('دومينو', restore);
    dock.id = 'domino-online-dock';
    dock.hidden = true;
    dock.setAttribute('aria-label', 'استئناف الدومينو');
    dock.setAttribute('aria-controls', dialog.id);
    dock.style.setProperty('--domino-accent', accent);
    dock.style.setProperty('--domino-ink', ink);

    const controls = document.createElement('div');
    controls.className = 'domino-online-controls';
    const minimize = makeButton('تصغير', minimizeGame);
    const close = makeButton('إغلاق', () => dialog.close());
    controls.append(minimize, close);
    header.append(title, controls);

    const frame = document.createElement('iframe');
    frame.title = heading;
    frame.src = url.href;
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
    chatFrame = frame;
    activeIdentity = identity || chatContext()?.id || '';
    frame.addEventListener('load', () => {
      const context = chatContext();
      if (context) frame.contentWindow.postMessage(context, gameOrigin);
    });
    const reset = makeButton('', closeGame);
    reset.hidden = true;
    reset.dataset.dominoReset = '';
    dialog.append(reset);
    dialog.append(header, frame);
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      minimizeGame();
    });
    document.body.append(dialog, dock);
    if (!background) dialog.showModal();

    function minimizeGame() {
      if (!dialog.open) return;
      dialog.close();
      dock.hidden = false;
      dock.focus({ preventScroll: true });
    }

    function restore() {
      if (dialog.open) return;
      dialog.showModal();
      dock.hidden = true;
      minimize.focus({ preventScroll: true });
    }

    function closeGame() {
      dialog.close();
      dialog.remove();
      dock.remove();
      chatFrame = null;
      activeIdentity = '';
      selectedRecipient = '';
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    }
  }

  function mount() {
    const cards = document.querySelector('#thGames .thGamesSection .thGamesCards');
    if (cards && !cards.querySelector('.domino-online-card')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'thGamesCard thGamesCardBot domino-online-card';
      button.textContent = 'دومينو جماعي · دعواتي';
      button.onclick = () => open();
      cards.append(button);
    }
    for (const row of document.querySelectorAll('.th-upro-profile-container .games-duo-modern:not(.domino-online-row)')) {
      const secondRow = row.nextElementSibling;
      const recipient = row.querySelector('[data-ludoid]')?.dataset.ludoid ||
        row.querySelector('[data-xo-target]')?.dataset.xoTarget;
      if (!recipient || (typeof TIGERHOST !== 'undefined' && String(TIGERHOST) === recipient)) {
        if (secondRow?.classList.contains('domino-online-row')) secondRow.remove();
        continue;
      }
      if (secondRow?.classList.contains('domino-online-row')) {
        secondRow.dataset.recipient = recipient;
        continue;
      }
      const extra = document.createElement('div');
      extra.className = 'games-duo-modern domino-online-row';
      extra.dataset.recipient = recipient;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'game-btn game-ludo';
      button.textContent = 'تحدّي دومينو';
      button.onclick = () => open(extra.dataset.recipient);
      extra.append(button);
      row.after(extra);
    }
  }

  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; mount(); });
  });
  observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-ludoid','data-xo-target']});
  window.addEventListener('message', event => {
    if (event.origin !== gameOrigin || event.source !== chatFrame?.contentWindow ||
        event.data?.type !== 'domino-pending') return;
    const count = Number(event.data.count) || 0;
    const dock = document.getElementById('domino-online-dock');
    if (!dock) return;
    dock.textContent = count ? 'دومينو · ' + count + ' دعوة' : 'دومينو';
    if (count && !document.getElementById('domino-online-dialog')?.open) dock.hidden = false;
  });
  mount();
  syncChat();
  setInterval(syncChat, 3500);
})();
