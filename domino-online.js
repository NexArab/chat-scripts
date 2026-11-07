(function () {
  'use strict';

  const styleId = 'domino-online-dialog-style';
  if (window.__dominoOnlineLoaded || document.getElementById(styleId)) return;
  window.__dominoOnlineLoaded = true;

  const service = new URL('https://domino-server-5xbx.onrender.com/');
  const site = location.hostname.replace(/^www\./i, '');

  // أقصى فاصل بين رسالتين للسياق إذا ما تغيّر شي (نبضة حياة)
  const HEARTBEAT_MS = 15000;

  let game = null;
  let pendingChallenge = null;
  let challengeSequence = 0;
  let noticeTimer;
  let scheduled = false;
  let inviteSwitch = null;

  const inviteSwitchObserver = new MutationObserver(() => syncChat());

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .games-duo-modern.domino-online-row {
      display: grid;
      direction: ltr;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 14px;
      margin-top: 6px;
    }

    .games-duo-modern.domino-online-row > .game-btn {
      grid-column: 2;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      direction: rtl;
    }

    .domino-online-icon {
      display: inline-block;
      width: 1.2em;
      height: 1.2em;
      margin-inline-end: .3em;
      vertical-align: middle;
    }

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

    .domino-online-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: 3px 10px;
      background: var(--domino-accent);
      color: var(--domino-ink);
    }

    .domino-online-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .domino-online-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 16px;
      text-align: center;
    }

    .domino-online-loading[hidden] { display: none !important; }
    .domino-online-loading button { display: none; }
    .domino-online-loading.slow button { display: inline-block; }

    #domino-online-dialog iframe {
      flex: 1;
      width: 100%;
      min-height: 0;
      border: 0;
    }

    #domino-online-dialog button,
    #domino-online-dock,
    #domino-online-invite button {
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

    #domino-online-dialog .domino-online-controls button {
      padding: 3px 10px;
    }

    #domino-online-dock,
    #domino-online-notice {
      position: fixed;
      inset-inline-end: 12px;
      max-width: calc(100vw - 24px);
      box-sizing: border-box;
      box-shadow: 0 3px 12px #0005;
    }

    #domino-online-dock {
      z-index: 10020;
      bottom: calc(62px + env(safe-area-inset-bottom));
      background: var(--domino-accent);
      color: var(--domino-ink);
    }

    #domino-online-invite {
      position: fixed;
      z-index: 10021;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: min(420px, calc(100vw - 32px));
      max-height: calc(100vh - 32px);
      max-height: calc(100dvh - 32px);
      overflow: auto;
      box-sizing: border-box;
      padding: 24px;
      border-radius: 14px;
      background: var(--domino-accent);
      color: var(--domino-ink);
      text-align: center;
      box-shadow: 0 10px 36px #0006;
    }

    #domino-online-invite strong {
      display: block;
      font-size: 20px;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }

    #domino-online-invite small {
      display: block;
      margin-top: 6px;
      opacity: .8;
    }

    #domino-online-invite .domino-online-controls {
      display: flex;
      gap: 10px;
      margin-top: 16px;
    }

    #domino-online-invite .domino-online-controls button {
      flex: 1;
      min-height: 44px;
      font-weight: 700;
      color: #fff;
    }

    #domino-online-invite .domino-invite-accept {
      background: #166534;
      border-color: #166534;
    }

    #domino-online-invite .domino-invite-decline {
      background: #b91c1c;
      border-color: #b91c1c;
    }

    #domino-online-invite button:disabled {
      opacity: .65;
      cursor: wait;
    }

    #domino-online-notice {
      z-index: 10022;
      bottom: calc(112px + env(safe-area-inset-bottom));
      padding: 10px 14px;
      border-radius: 8px;
      background: #222;
      color: #fff;
    }

    #domino-online-dialog #domino-online-notice {
      bottom: calc(16px + env(safe-area-inset-bottom));
    }

    #domino-online-dock[hidden],
    #domino-online-invite[hidden] {
      display: none !important;
    }
  `;
  document.head.append(style);

  function button(label, click) {
    const node = document.createElement('button');
    node.type = 'button';
    node.textContent = label;
    node.addEventListener('click', click);
    return node;
  }

  function dominoLabel(node, label) {
    const ns = 'http://www.w3.org/2000/svg';
    const icon = document.createElementNS(ns, 'svg');
    icon.setAttribute('viewBox', '0 0 28 28');
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('class', 'domino-online-icon');

    const outline = document.createElementNS(ns, 'path');
    outline.setAttribute(
      'd',
      'M4 7h20a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3zm10 0v14'
    );
    outline.setAttribute('fill', 'none');
    outline.setAttribute('stroke', 'currentColor');
    outline.setAttribute('stroke-width', '2');
    icon.append(outline);

    for (const [x, y] of [[7, 14], [18, 11], [21, 14], [24, 17]]) {
      const pip = document.createElementNS(ns, 'circle');
      pip.setAttribute('cx', x);
      pip.setAttribute('cy', y);
      pip.setAttribute('r', '1.3');
      pip.setAttribute('fill', 'currentColor');
      icon.append(pip);
    }

    node.replaceChildren(icon, document.createTextNode(label));
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

  function gameInvitesAreStopped(fallback = false) {
    const toggle = document.querySelector('#gameinvite .thGamesSwitchUI');
    return toggle ? toggle.classList.contains('is-on') : fallback;
  }

  function onlineItems() {
    try {
      const result = typeof TH_LUDO_GROUP_GET_ONLINE_ITEMS === 'function'
        ? TH_LUDO_GROUP_GET_ONLINE_ITEMS()
        : [];
      return Array.isArray(result) ? result : [];
    } catch (error) {
      return [];
    }
  }

  function readContext() {
    const id = currentId();
    if (!id) return null;

    const ownRow = Array.from(document.querySelectorAll('.uzr[data-th-upro]'))
      .find(row => row.dataset.thUpro === id);

    const items = onlineItems();
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
      invites: !gameInvitesAreStopped(blocksInvites(ownEntry?.nogameinvite)),
      challenge: pendingChallenge?.owner === id ? pendingChallenge : null,
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
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

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
      const accent = '#' + channels
        .map(n => n.toString(16).padStart(2, '0'))
        .join('');

      const [red, green, blue] = channels.map(n => {
        const value = n / 255;
        return value <= 0.04045
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4;
      });

      const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
      return { siteName, accent, ink: luminance > 0.179 ? '#000000' : '#ffffff' };
    }

    return { siteName, accent: '#343a40', ink: '#ffffff' };
  }

  function post(message) {
    game?.frame.contentWindow?.postMessage(message, service.origin);
  }

  // يرسل السياق فقط عند تغيّره، أو كل HEARTBEAT_MS كنبضة حياة.
  // force=true يتجاوز الفحص (عند تحميل الـ iframe أو فتح النافذة).
  function sendContext(context = readContext(), force = false) {
    if (!context || game?.id !== context.id) return;

    game.invitesStopped = !context.invites;
    if (game.invitesStopped) removeInvite();

    const snapshot = JSON.stringify(context);
    const fresh = Date.now() - game.lastSent < HEARTBEAT_MS;

    if (!force && snapshot === game.lastContext && fresh) return;

    game.lastContext = snapshot;
    game.lastSent = Date.now();
    post(context);
  }

  function showNotice(text) {
    const parent = game?.dialog.open ? game.dialog : document.body;
    let node = document.getElementById('domino-online-notice');

    if (node && node.parentNode !== parent) {
      node.remove();
      node = null;
    }

    if (!node) {
      node = document.createElement('div');
      node.id = 'domino-online-notice';
      node.dir = 'rtl';
      node.setAttribute('role', 'status');
      parent.append(node);
    }

    node.textContent = text;
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => node.remove(), 4500);
  }

  function applyTheme(node, theme) {
    node.style.setProperty('--domino-accent', theme.accent);
    node.style.setProperty('--domino-ink', theme.ink);
  }

  function removeInvite() {
    game?.panel?.remove();
    if (game) game.panel = null;
  }

  function removeGame() {
    if (!game) return;
    removeInvite();
    game.dialog.close();
    game.dialog.remove();
    game.dock.remove();
    game = null;
  }

  function createGame(id) {
    const theme = readTheme();
    const title = 'دومينو جماعي · ' + theme.siteName;
    const url = new URL(service.href);
    url.searchParams.set('parent', location.origin);
    url.searchParams.set('site', theme.siteName);
    url.searchParams.set('accent', theme.accent);
    url.searchParams.set('ink', theme.ink);

    const dialog = document.createElement('dialog');
    dialog.id = 'domino-online-dialog';
    dialog.dir = 'rtl';
    dialog.setAttribute('aria-label', title);

    const frame = document.createElement('iframe');
    frame.title = title;
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
    frame.setAttribute('allow', 'autoplay');

    const loading = document.createElement('div');
    loading.className = 'domino-online-loading';
    loading.setAttribute('role', 'status');

    const loadingText = document.createElement('span');
    loadingText.textContent = 'جاري تجهيز الطاولة… إذا الخادم كان نايم قد يأخذ دقيقة.';

    let slowTimer;
    const armLoading = () => {
      clearTimeout(slowTimer);
      loading.hidden = false;
      loading.classList.remove('slow');
      slowTimer = setTimeout(() => loading.classList.add('slow'), 45000);
    };

    const retry = button('إعادة المحاولة', () => {
      armLoading();
      frame.src = url.href;
    });
    loading.append(loadingText, retry);

    const dock = button('', restore);
    dock.id = 'domino-online-dock';
    dock.hidden = true;
    dock.setAttribute('aria-controls', dialog.id);
    dominoLabel(dock, 'دومينو');

    applyTheme(dialog, theme);
    applyTheme(dock, theme);

    function restore() {
      if (!dialog.open) dialog.showModal();
      removeInvite();
      dock.hidden = true;
      sendContext(readContext(), true);
    }

    function minimize() {
      dialog.close();
      dock.hidden = false;
      dock.focus({ preventScroll: true });
    }

    function closeGame() {
      if (game?.wasPlaying) {
        minimize();
        showNotice('المباراة مستمرة. صغّرت النافذة وتقدر ترجع من زر دومينو.');
        return;
      }

      dialog.close();
      dock.hidden = true;
    }

    const header = document.createElement('header');
    header.className = 'domino-online-header';

    const heading = document.createElement('strong');
    dominoLabel(heading, title);

    const controls = document.createElement('div');
    controls.className = 'domino-online-controls';
    controls.append(button('تصغير', minimize), button('إغلاق', closeGame));

    header.append(heading, controls);
    dialog.append(header, loading, frame);

    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      minimize();
    });

    frame.addEventListener('load', () => {
      clearTimeout(slowTimer);
      loading.hidden = true;
      sendContext(readContext(), true);
    });

    game = {
      id, dialog, frame, dock, restore, theme,
      panel: null,
      openAfterAccept: null,
      wasPlaying: false,
      lastPlayingMatchId: null,
      lastContext: '',
      lastSent: 0
    };

    armLoading();
    frame.src = url.href;
    document.body.append(dialog, dock);
  }

  function syncChat() {
    if (!document.body) return;

    const id = currentId();
    if (game && game.id !== id) removeGame();
    if (pendingChallenge && pendingChallenge.owner !== id) pendingChallenge = null;

    const context = readContext();
    if (!context) return;
    if (!game) createGame(context.id);
    sendContext(context);
  }

  function openGame() {
    syncChat();

    if (!game) {
      showNotice('بانتظار حساب الشات. جرّب بعد ظهور اسمك بالمتصلين.');
      return;
    }

    game.restore();
  }

  function challengeFromProfile(targetId) {
    const context = readContext();

    if (!context) {
      showNotice('بانتظار حساب الشات. جرّب مرة ثانية.');
      return;
    }

    if (pendingChallenge) {
      showNotice('دعوة الدومينو قيد الإرسال.');
      return;
    }

    const member = context.roster.find(item => item.id === targetId);

    if (!member) {
      showNotice('هالعضو غير متصل حاليًا.');
      return;
    }

    if (member.blocked) {
      showNotice('هذا المستخدم أوقف استقبال دعوات الألعاب');
      return;
    }

    const key = Date.now() + ':' + (++challengeSequence);
    pendingChallenge = { key, targetId, owner: context.id };
    showNotice('جاري إرسال الدعوة إلى ' + member.name + '…');
    syncChat();

    setTimeout(() => {
      if (pendingChallenge?.key !== key) return;
      pendingChallenge = null;
      showNotice('ما وصل تأكيد الإرسال. افحص الدعوات قبل إعادة المحاولة.');
    }, 15000);
  }

  function showInvite(invites) {
    const invite = invites[0];

    if (!invite || game.dialog.open ||
        gameInvitesAreStopped(game.invitesStopped)) {
      removeInvite();
      return;
    }

    const key = invite.id + ':' + invites.length;
    if (game.panel?.dataset.invite === key) return;
    removeInvite();

    const panel = document.createElement('section');
    panel.id = 'domino-online-invite';
    panel.dataset.invite = key;
    panel.dir = 'rtl';
    panel.setAttribute('role', 'alertdialog');
    panel.setAttribute('aria-label', 'دعوة دومينو');
    applyTheme(panel, game.theme);

    const title = document.createElement('strong');
    dominoLabel(title, 'تحدي دومينو من ' + String(invite.from ?? '').slice(0, 80));
    panel.append(title);

    if (invites.length > 1) {
      const more = document.createElement('small');
      more.textContent = '+ ' + (invites.length - 1) + ' دعوات أخرى بالانتظار';
      panel.append(more);
    }

    const controls = document.createElement('div');
    controls.className = 'domino-online-controls';

    const accept = button('موافقة', () => answer('accept'));
    accept.className = 'domino-invite-accept';

    const decline = button('رفض', () => answer('decline'));
    decline.className = 'domino-invite-decline';

    function answer(action) {
      if (gameInvitesAreStopped(game.invitesStopped)) {
        removeInvite();
        showNotice('أوقفت استقبال دعوات الألعاب.');
        return;
      }

      game.openAfterAccept = action === 'accept' ? invite.id : null;
      accept.disabled = true;
      decline.disabled = true;
      post({ type: 'domino-invite-answer', id: invite.id, action });

      setTimeout(() => {
        if (game?.panel !== panel) return;
        accept.disabled = false;
        decline.disabled = false;
        game.openAfterAccept = null;
      }, 10000);
    }

    controls.append(accept, decline);
    panel.append(controls);
    document.body.append(panel);
    game.panel = panel;
  }

  function bindGameInviteSwitch() {
    const next = document.querySelector('#gameinvite .thGamesSwitchUI');

    if (next !== inviteSwitch) {
      inviteSwitchObserver.disconnect();
      inviteSwitch = next;

      if (inviteSwitch) {
        inviteSwitchObserver.observe(inviteSwitch, {
          attributes: true,
          attributeFilter: ['class']
        });
        syncChat();
      }
    }

    const subtitle = document.querySelector('#gameinvite .thGamesCardSub');
    const label = 'لا تصلك دعوات Ludo أو X-O أو دومينو';
    if (subtitle && subtitle.textContent !== label) subtitle.textContent = label;
  }

  function mount() {
    bindGameInviteSwitch();

    const cards = document.querySelector('#thGames .thGamesSection .thGamesCards');

    if (cards && !cards.querySelector('.domino-online-card')) {
      const node = button('', openGame);
      node.className = 'thGamesCard thGamesCardBot domino-online-card';
      dominoLabel(node, 'دومينو جماعي · دعواتي');
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

      const node = button('', () => challengeFromProfile(wrapper.dataset.recipient));
      node.className = 'game-btn game-ludo';
      dominoLabel(node, 'تحدّي دومينو');

      wrapper.append(node);
      row.after(wrapper);
    }
  }

  window.addEventListener('message', event => {
    if (!game || event.origin !== service.origin ||
        event.source !== game.frame.contentWindow) return;

    const data = event.data;

    if (data?.type === 'domino-invite-result') {
      if (!data.answerId) pendingChallenge = null;
      if (data.answerId === game.openAfterAccept && data.ok === false) {
        game.openAfterAccept = null;
      }
      removeInvite();
      if (typeof data.text === 'string') showNotice(data.text.slice(0, 200));
      return;
    }

    if (data?.type !== 'domino-pending') return;

    const invites = Array.isArray(data.invites) ? data.invites : [];
    const playing = data.playing === true;
    const matchId = data.playingMatchId || null;

    const started = playing && (
      !game.wasPlaying || (matchId && matchId !== game.lastPlayingMatchId)
    );

    game.wasPlaying = playing;
    game.lastPlayingMatchId = matchId;

    if (started) {
      game.openAfterAccept = null;
      game.restore();
      return;
    }

    if (game.openAfterAccept && Array.isArray(data.pendingMatchIds) &&
        !data.pendingMatchIds.includes(game.openAfterAccept)) {
      game.openAfterAccept = null;
    }

    const label = playing ? 'دومينو · الطاولة جاهزة' : 'دومينو';

    if (game.dock.dataset.label !== label) {
      dominoLabel(game.dock, label);
      game.dock.dataset.label = label;
    }

    showInvite(invites);
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
