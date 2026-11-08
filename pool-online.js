(function () {
  'use strict';

  const styleId = 'pool-online-dialog-style';
  if (window.__poolOnlineLoaded || document.getElementById(styleId)) return;
  const configured = document.currentScript?.dataset.poolService;
  let service;
  try {
    const origin = new URL(configured);
    if (origin.protocol !== 'https:' || origin.username || origin.password) return;
    service = new URL('/pool/', origin.origin);
  } catch {
    return;
  }
  window.__poolOnlineLoaded = true;
  const site = location.hostname.replace(/^www\./i, '');

  // أقصى فاصل بين رسالتين للسياق إذا ما تغيّر شي (نبضة حياة)
  const HEARTBEAT_MS = 15000;
  const GAME_LIKES_MINIMUM = 500;
  const GAME_LIKES_NOTICE = `تحتاج إلى ${GAME_LIKES_MINIMUM} لايك لاستخدام الألعاب`;
  const GAME_INVITES_STOPPED_NOTICE = 'هذا المستخدم أوقف استقبال دعوات الألعاب';

  let game = null;
  let pendingChallenge = null;
  let challengeSequence = 0;
  let closeSequence = 0;
  let noticeTimer;
  let scheduled = false;
  let inviteSwitch = null;

  const inviteSwitchObserver = new MutationObserver(() => syncChat());

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .games-duo-modern.pool-online-row {
      display: grid;
      direction: ltr;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 14px;
      margin-top: 6px;
    }

    .games-duo-modern.pool-online-row > .game-btn {
      position: relative;
      direction: ltr;
      grid-column: 2;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }

    .pool-online-icon {
      display: inline-block;
      width: 1.2em;
      height: 1.2em;
      margin-inline-end: .3em;
      vertical-align: middle;
    }

    .games-duo-modern.pool-online-row > .game-btn > .pool-online-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      width: 22px;
      height: 22px;
      margin: 0;
      transform: translateY(-50%);
      pointer-events: none;
    }

    #pool-online-dialog {
      box-sizing: border-box;
      width: min(calc(100vw - 12px), clamp(306px, calc((90vh - 136px) * .59 + 100px), 556px));
      width: min(calc(100vw - 12px), clamp(306px, calc((90dvh - 136px) * .59 + 100px), 556px));
      height: 90vh;
      height: 90dvh;
      max-height: 96dvh;
      padding: 0;
      border: 1px solid var(--pool-accent);
      border-radius: 14px;
      background: #0d1714;
      color: #fff;
      font-family: inherit;
      overflow: hidden;
    }

    #pool-online-dialog[open] {
      display: flex;
      flex-direction: column;
    }

    #pool-online-dialog::backdrop { background: #000b; }

    .pool-online-header {
      display: flex;
      direction: ltr;
      flex: 0 0 auto;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: 3px 10px;
      background: var(--pool-accent);
      color: var(--pool-ink);
    }

    .pool-online-header strong {
      direction: rtl;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
    }

    .pool-online-header .pool-online-controls {
      flex-wrap: nowrap;
      flex: 0 0 auto;
      direction: ltr;
    }

    .pool-online-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .pool-online-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 16px;
      text-align: center;
    }

    .pool-online-loading[hidden] { display: none !important; }
    .pool-online-loading button { display: none; }
    .pool-online-loading.slow button { display: inline-block; }

    #pool-online-dialog iframe {
      flex: 1;
      width: 100%;
      min-height: 0;
      border: 0;
    }

    #pool-online-dialog button,
    #pool-online-dock,
    #pool-online-invite button {
      padding: 8px 12px;
      border: 1px solid currentColor;
      border-radius: 6px;
      font: inherit;
      cursor: pointer;
    }

    #pool-online-dialog button {
      background: transparent;
      color: inherit;
    }

    #pool-online-dialog .pool-online-controls button {
      width: 29px;
      min-height: 26px;
      padding: 0;
      line-height: 1;
    }

    #pool-online-dock,
    #pool-online-notice {
      position: fixed;
      inset-inline-end: 12px;
      max-width: calc(100vw - 24px);
      box-sizing: border-box;
      box-shadow: 0 3px 12px #0005;
    }

    #pool-online-dock {
      z-index: 10020;
      bottom: calc(62px + env(safe-area-inset-bottom));
      background: var(--pool-accent);
      color: var(--pool-ink);
    }

    #pool-online-invite {
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
      background: var(--pool-accent);
      color: var(--pool-ink);
      text-align: center;
      box-shadow: 0 10px 36px #0006;
    }

    #pool-online-invite strong {
      display: block;
      font-size: 20px;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }

    #pool-online-invite small {
      display: block;
      margin-top: 6px;
      opacity: .8;
    }

    #pool-online-invite .pool-online-controls {
      display: flex;
      gap: 10px;
      margin-top: 16px;
    }

    #pool-online-invite .pool-online-controls button {
      flex: 1;
      min-height: 44px;
      font-weight: 700;
      color: #fff;
    }

    #pool-online-invite .pool-invite-accept {
      background: #166534;
      border-color: #166534;
    }

    #pool-online-invite .pool-invite-decline {
      background: #b91c1c;
      border-color: #b91c1c;
    }

    #pool-online-invite button:disabled {
      opacity: .65;
      cursor: wait;
    }

    #pool-online-notice {
      z-index: 10022;
      bottom: calc(112px + env(safe-area-inset-bottom));
      padding: 10px 14px;
      border-radius: 8px;
      background: #222;
      color: #fff;
    }

    #pool-online-dialog #pool-online-notice {
      bottom: calc(16px + env(safe-area-inset-bottom));
    }

    #pool-online-dock[hidden],
    #pool-online-invite[hidden] {
      display: none !important;
    }

    @media (max-width: 520px) {
      #pool-online-dialog {
        width: min(420px, calc(100vw - 8px));
        height: 96vh;
        height: 96dvh;
      }
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

  function poolLabel(node, label) {
    const ns = 'http://www.w3.org/2000/svg';
    const icon = document.createElementNS(ns, 'svg');
    icon.setAttribute('viewBox', '0 0 28 28');
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('class', 'pool-online-icon');

    const ball = document.createElementNS(ns, 'circle');
    ball.setAttribute('cx', '14');
    ball.setAttribute('cy', '14');
    ball.setAttribute('r', '12');
    ball.setAttribute('fill', '#151a17');
    ball.setAttribute('stroke', '#f7e9cc');
    ball.setAttribute('stroke-width', '1.5');

    const number = document.createElementNS(ns, 'text');
    number.setAttribute('x', '14');
    number.setAttribute('y', '19');
    number.setAttribute('text-anchor', 'middle');
    number.setAttribute('font-size', '15');
    number.setAttribute('font-weight', 'bold');
    number.setAttribute('fill', '#fff');
    number.textContent = '8';
    icon.append(ball, number);

    node.replaceChildren(icon, document.createTextNode(label));
  }

  function currentId() {
    if (typeof TIGERHOST === 'undefined') return '';
    return typeof TIGERHOST === 'string' || typeof TIGERHOST === 'number'
      ? String(TIGERHOST)
      : '';
  }

  function chatMember(id) {
    return typeof GET_USERS_TIGERHOST === 'function' ? GET_USERS_TIGERHOST(id) : null;
  }

  function hasGameLikes(rep) {
    return (typeof rep === 'number' || typeof rep === 'string') &&
      Number.isFinite(Number(rep)) && Number(rep) >= GAME_LIKES_MINIMUM;
  }

  function showLikesNotice() {
    if (!game?.dialog.open && typeof ON_DATE_SEND === 'function') {
      ON_DATE_SEND('not', { force: true, msg: GAME_LIKES_NOTICE, user: '' });
      return;
    }
    showNotice(GAME_LIKES_NOTICE);
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
    const ownMember = chatMember(id);
    const eligible = hasGameLikes(ownMember?.rep ?? ownEntry?.rep);
    const name = (
      ownRow?.querySelector('.u-topic')?.textContent.trim() ||
      String(ownEntry?.topic || '').trim()
    ).slice(0, 80);

    if (!name) return null;

    return {
      type: 'pool-chat-context',
      site,
      id,
      name,
      room: typeof M_ROOM === 'undefined' ? '' : String(M_ROOM ?? ''),
      eligible,
      invites: eligible && !gameInvitesAreStopped(blocksInvites(ownMember?.nogameinvite ?? ownEntry?.nogameinvite)),
      challenge: eligible && pendingChallenge?.owner === id ? pendingChallenge : null,
      roster: eligible ? items
        .filter(item => item?.id != null && String(item.id) !== id && item.topic)
        .map(item => {
          const member = chatMember(String(item.id));
          if (!hasGameLikes(member?.rep ?? item.rep)) return null;
          return {
            id: String(item.id),
            name: String(item.topic).trim().slice(0, 80),
            room: String(item.roomid ?? ''),
            blocked: blocksInvites(member?.nogameinvite ?? item.nogameinvite)
          };
        })
        .filter(Boolean) : []
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

  // يرسل السياق عند تغيّره، أو كل HEARTBEAT_MS كنبضة حياة.
  // force=true يتجاوز الفحص عند تحميل الـ iframe أو فتح النافذة.
  function sendContext(context = readContext(), force = false) {
    if (!context || game?.id !== context.id) return;

    game.eligible = context.eligible;
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
    let node = document.getElementById('pool-online-notice');

    if (node && node.parentNode !== parent) {
      node.remove();
      node = null;
    }

    if (!node) {
      node = document.createElement('div');
      node.id = 'pool-online-notice';
      node.dir = 'rtl';
      node.setAttribute('role', 'status');
      parent.append(node);
    }

    node.textContent = text;
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => node.remove(), 4500);
  }

  function applyTheme(node, theme) {
    node.style.setProperty('--pool-accent', theme.accent);
    node.style.setProperty('--pool-ink', theme.ink);
  }

  function removeInvite() {
    game?.panel?.remove();
    if (game) game.panel = null;
  }

  function removeGame() {
    if (!game) return;
    removeInvite();
    clearTimeout(game.closeTimer);
    game.dialog.close();
    game.dialog.remove();
    game.dock.remove();
    game = null;
  }

  function createGame(id) {
    const theme = readTheme();
    const title = 'بلياردو جماعي · ' + theme.siteName;
    const url = new URL(service.href);
    url.searchParams.set('parent', location.origin);
    url.searchParams.set('site', theme.siteName);
    url.searchParams.set('accent', theme.accent);
    url.searchParams.set('ink', theme.ink);

    const dialog = document.createElement('dialog');
    dialog.id = 'pool-online-dialog';
    dialog.dir = 'rtl';
    dialog.setAttribute('aria-label', title);

    const frame = document.createElement('iframe');
    frame.title = title;
    frame.loading = 'eager';
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
    frame.setAttribute('allow', 'autoplay');

    const loading = document.createElement('div');
    loading.className = 'pool-online-loading';
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
    dock.id = 'pool-online-dock';
    dock.hidden = true;
    dock.setAttribute('aria-controls', dialog.id);
    poolLabel(dock, 'بلياردو');

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
      if (game.closeRequest) return;
      game.closeRequest = ++closeSequence;
      closeButton.disabled = true;
      closeButton.textContent = '…';
      sendContext(readContext(), true);
      post({ type: 'pool-close-request', requestId: game.closeRequest });
      const currentGame = game;
      game.closeTimer = setTimeout(() => {
        if (game !== currentGame || !game.closeRequest) return;
        resetCloseButton();
        showNotice('ما وصل تأكيد الخروج. جرّب مرة ثانية.');
      }, 45000);
    }

    function resetCloseButton() {
      clearTimeout(game.closeTimer);
      game.closeRequest = null;
      closeButton.disabled = false;
      closeButton.textContent = '×';
    }

    function finishClose(data) {
      if (data.requestId !== game.closeRequest && data.requestId !== undefined) return;
      resetCloseButton();
      if (!data.ok) return;
      dialog.close();
      dock.hidden = true;
    }


    const header = document.createElement('header');
    header.className = 'pool-online-header';

    const heading = document.createElement('strong');
    poolLabel(heading, title);

    const controls = document.createElement('div');
    controls.className = 'pool-online-controls';
    const closeButton = button('×', closeGame);
    closeButton.setAttribute('aria-label', 'إغلاق');
    closeButton.title = 'إغلاق';
    const minimizeButton = button('−', minimize);
    minimizeButton.setAttribute('aria-label', 'تصغير');
    minimizeButton.title = 'تصغير';
    controls.append(closeButton, minimizeButton);

    header.append(controls, heading);
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
      id, dialog, frame, dock, restore, theme, finishClose,
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
    if (!game && context.eligible) createGame(context.id);
    sendContext(context);
  }

  function challengeFromProfile(targetId) {
    const context = readContext();

    if (!context) {
      showNotice('بانتظار حساب الشات. جرّب مرة ثانية.');
      return;
    }

    if (!context.eligible) {
      showLikesNotice();
      return;
    }

    if (pendingChallenge) {
      showNotice('دعوة البلياردو قيد الإرسال.');
      return;
    }

    const member = context.roster.find(item => item.id === targetId);

    if (!member) {
      const online = onlineItems().find(item => item && String(item.id) === targetId && item.topic);
      const recipient = online && chatMember(targetId);
      if (blocksInvites(recipient?.nogameinvite ?? online?.nogameinvite)) {
        showNotice(GAME_INVITES_STOPPED_NOTICE);
      } else {
        showNotice(online
          ? `هالعضو يحتاج إلى ${GAME_LIKES_MINIMUM} لايك لاستخدام الألعاب`
          : 'هالعضو غير متصل حاليًا.');
      }
      return;
    }

    if (member.blocked) {
      showNotice(GAME_INVITES_STOPPED_NOTICE);
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

    if (!invite || !game.eligible || game.dialog.open ||
        gameInvitesAreStopped(game.invitesStopped)) {
      removeInvite();
      return;
    }

    const key = invite.id + ':' + invites.length;
    if (game.panel?.dataset.invite === key) return;
    removeInvite();

    const panel = document.createElement('section');
    panel.id = 'pool-online-invite';
    panel.dataset.invite = key;
    panel.dir = 'rtl';
    panel.setAttribute('role', 'alertdialog');
    panel.setAttribute('aria-label', 'دعوة بلياردو');
    applyTheme(panel, game.theme);

    const title = document.createElement('strong');
    poolLabel(title, 'تحدي بلياردو من ' + String(invite.from ?? '').slice(0, 80));
    panel.append(title);

    if (invites.length > 1) {
      const more = document.createElement('small');
      more.textContent = '+ ' + (invites.length - 1) + ' دعوات أخرى بالانتظار';
      panel.append(more);
    }

    const controls = document.createElement('div');
    controls.className = 'pool-online-controls';

    const accept = button('موافقة', () => answer('accept'));
    accept.className = 'pool-invite-accept';

    const decline = button('رفض', () => answer('decline'));
    decline.className = 'pool-invite-decline';

    function answer(action) {
      if (!readContext()?.eligible) {
        removeInvite();
        showLikesNotice();
        return;
      }
      if (gameInvitesAreStopped(game.invitesStopped)) {
        removeInvite();
        showNotice('أوقفت استقبال دعوات الألعاب.');
        return;
      }

      game.openAfterAccept = action === 'accept' ? invite.id : null;
      accept.disabled = true;
      decline.disabled = true;
      post({ type: 'pool-invite-answer', id: invite.id, action });

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
  }

  function mount() {
    bindGameInviteSwitch();

    const rows = document.querySelectorAll(
      '.th-upro-profile-container .games-duo-modern:not(.pool-online-row):not(.domino-online-row)'
    );

    for (const row of rows) {
      const next = row.nextElementSibling;
      const after = next?.classList.contains('domino-online-row') ? next : row;
      const extra = after.nextElementSibling?.classList.contains('pool-online-row')
        ? after.nextElementSibling : null;
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
      wrapper.className = 'games-duo-modern pool-online-row';
      wrapper.dataset.recipient = targetId;

      const node = button('', () => challengeFromProfile(wrapper.dataset.recipient));
      node.className = 'game-btn game-ludo';
      poolLabel(node, 'تحدّي بلياردو');

      wrapper.append(node);
      after.after(wrapper);
    }
  }

  window.addEventListener('message', event => {
    if (!game || event.origin !== service.origin ||
        event.source !== game.frame.contentWindow) return;

    const data = event.data;

    if (data?.type === 'pool-close-result') {
      game.finishClose(data);
      return;
    }

    if (data?.type === 'pool-match-notice') {
      if (typeof data.text === 'string' && data.text) showNotice(data.text.slice(0, 200));
      return;
    }

    if (data?.type === 'pool-invite-result') {
      if (!data.answerId) pendingChallenge = null;
      if (data.answerId === game.openAfterAccept && data.ok === false) {
        game.openAfterAccept = null;
      }
      removeInvite();
      if (typeof data.text === 'string') showNotice(data.text.slice(0, 200));
      return;
    }

    if (data?.type !== 'pool-pending') return;

    const invites = Array.isArray(data.invites) ? data.invites : [];
    const playing = data.playing === true;
    const matchId = data.playingMatchId || null;

    const started = playing && (
      !game.wasPlaying || (matchId && matchId !== game.lastPlayingMatchId)
    );

    game.wasPlaying = playing;
    game.lastPlayingMatchId = matchId;

    if (started && !game.closeRequest) {
      game.openAfterAccept = null;
      game.restore();
      return;
    }

    if (game.openAfterAccept && Array.isArray(data.pendingMatchIds) &&
        !data.pendingMatchIds.includes(game.openAfterAccept)) {
      game.openAfterAccept = null;
    }

    const label = playing ? 'بلياردو · الطاولة جاهزة' : 'بلياردو';

    if (game.dock.dataset.label !== label) {
      poolLabel(game.dock, label);
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
