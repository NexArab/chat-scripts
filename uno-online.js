(function () {
  'use strict';

  const styleId = 'uno-online-dialog-style';
  if (window.__unoOnlineLoaded || document.getElementById(styleId)) return;
  const configured = document.currentScript?.dataset.unoService;
  let service;
  try {
    const origin = new URL(configured);
    if (origin.protocol !== 'https:' || origin.username || origin.password) return;
    service = new URL('/uno/', origin.origin);
  } catch {
    return;
  }
  window.__unoOnlineLoaded = true;
  const site = location.hostname.replace(/^www\./i, '');

  // أقصى فاصل بين رسالتين للسياق إذا ما تغيّر شي (نبضة حياة)
  const HEARTBEAT_MS = 15000;
  const MIN_LIKES = 500;

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
    .games-duo-modern.uno-online-row {
      display: grid;
      direction: ltr;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      column-gap: 14px;
      margin-top: 6px;
    }

    .games-duo-modern.uno-online-row > .game-btn {
      position: relative;
      direction: ltr;
      grid-column: 2;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }

    .uno-online-icon {
      display: inline-block;
      width: 1.2em;
      height: 1.2em;
      margin-inline-end: .3em;
      vertical-align: middle;
    }

    .games-duo-modern.uno-online-row > .game-btn > .uno-online-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      width: 22px;
      height: 22px;
      margin: 0;
      transform: translateY(-50%);
      pointer-events: none;
    }

    #uno-online-dialog {
      box-sizing: border-box;
      width: min(calc(100vw - 12px), clamp(306px, calc((90vh - 136px) * .59 + 100px), 556px));
      width: min(calc(100vw - 12px), clamp(306px, calc((90dvh - 136px) * .59 + 100px), 556px));
      height: 90vh;
      height: 90dvh;
      max-height: 96dvh;
      padding: 0;
      border: 1px solid var(--uno-accent);
      border-radius: 14px;
      background: #0d1714;
      color: #fff;
      font-family: inherit;
      overflow: hidden;
    }

    #uno-online-dialog[open] {
      display: flex;
      flex-direction: column;
    }

    #uno-online-dialog::backdrop { background: #000b; }

    .uno-online-header {
      display: flex;
      direction: ltr;
      flex: 0 0 auto;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: 3px 10px;
      background: var(--uno-accent);
      color: var(--uno-ink);
    }

    .uno-online-header strong {
      direction: rtl;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
    }

    .uno-online-header .uno-online-controls {
      flex-wrap: nowrap;
      flex: 0 0 auto;
      direction: ltr;
    }

    .uno-online-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .uno-online-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 16px;
      text-align: center;
    }

    .uno-online-loading[hidden] { display: none !important; }
    .uno-online-loading button { display: none; }
    .uno-online-loading.slow button { display: inline-block; }

    #uno-online-dialog iframe {
      flex: 1;
      width: 100%;
      min-height: 0;
      border: 0;
    }

    #uno-online-dialog button,
    #uno-online-dock,
    #uno-online-invite button {
      padding: 8px 12px;
      border: 1px solid currentColor;
      border-radius: 6px;
      font: inherit;
      cursor: pointer;
    }

    #uno-online-dialog button {
      background: transparent;
      color: inherit;
    }

    #uno-online-dialog .uno-online-controls button {
      width: 29px;
      min-height: 26px;
      padding: 0;
      line-height: 1;
    }

    #uno-online-dock,
    #uno-online-notice {
      position: fixed;
      inset-inline-end: 12px;
      max-width: calc(100vw - 24px);
      box-sizing: border-box;
      box-shadow: 0 3px 12px #0005;
    }

    #uno-online-dock {
      z-index: 10020;
      bottom: calc(110px + env(safe-area-inset-bottom));
      background: var(--uno-accent);
      color: var(--uno-ink);
    }

    #uno-online-invite {
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
      background: var(--uno-accent);
      color: var(--uno-ink);
      text-align: center;
      box-shadow: 0 10px 36px #0006;
    }

    #uno-online-invite strong {
      display: block;
      font-size: 20px;
      line-height: 1.5;
      overflow-wrap: anywhere;
    }

    #uno-online-invite small {
      display: block;
      margin-top: 6px;
      opacity: .8;
    }

    #uno-online-invite .uno-online-controls {
      display: flex;
      gap: 10px;
      margin-top: 16px;
    }

    #uno-online-invite .uno-online-controls button {
      flex: 1;
      min-height: 44px;
      font-weight: 700;
      color: #fff;
    }

    #uno-online-invite .uno-invite-accept {
      background: #166534;
      border-color: #166534;
    }

    #uno-online-invite .uno-invite-decline {
      background: #b91c1c;
      border-color: #b91c1c;
    }

    #uno-online-invite button:disabled {
      opacity: .65;
      cursor: wait;
    }

    #uno-online-notice {
      z-index: 10022;
      bottom: calc(112px + env(safe-area-inset-bottom));
      padding: 10px 14px;
      border-radius: 8px;
      background: #222;
      color: #fff;
    }

    #uno-online-dialog #uno-online-notice {
      bottom: calc(16px + env(safe-area-inset-bottom));
    }

    #uno-online-dock[hidden],
    #uno-online-invite[hidden] {
      display: none !important;
    }

    @media (max-width: 520px) {
      #uno-online-dialog {
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

  function unoLabel(node, label) {
    const ns = 'http://www.w3.org/2000/svg';
    const icon = document.createElementNS(ns, 'svg');
    icon.setAttribute('viewBox', '0 0 28 28');
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('class', 'uno-online-icon');

    const ball = document.createElementNS(ns, 'circle');
    ball.setAttribute('cx', '14');
    ball.setAttribute('cy', '14');
    ball.setAttribute('r', '12');
    ball.setAttribute('fill', '#a72953');
    ball.setAttribute('stroke', '#f7e9cc');
    ball.setAttribute('stroke-width', '1.5');

    const number = document.createElementNS(ns, 'text');
    number.setAttribute('x', '14');
    number.setAttribute('y', '19');
    number.setAttribute('text-anchor', 'middle');
    number.setAttribute('font-size', '8');
    number.setAttribute('font-weight', 'bold');
    number.setAttribute('fill', '#fff');
    number.textContent = 'UNO';
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
    try { return typeof GET_USERS_TIGERHOST === 'function' ? GET_USERS_TIGERHOST(id) : null; }
    catch { return null; }
  }

  function hasLikes(value) {
    return value != null && Number.isFinite(Number(value)) && Number(value) >= MIN_LIKES;
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

  function readContext(includeRoster = false) {
    const id = currentId();
    if (!id) return null;

    const ownRow = Array.from(document.querySelectorAll('.uzr[data-th-upro]'))
      .find(row => row.dataset.thUpro === id);

    const items = onlineItems();
    const ownEntry = items.find(item => item && String(item.id) === id);
    const member = chatMember(id);
    const eligible = hasLikes(member?.rep ?? ownEntry?.rep);
    const name = (
      ownRow?.querySelector('.u-topic')?.textContent.trim() ||
      String(ownEntry?.topic || '').trim()
    ).slice(0, 80);

    if (!name) return null;

    return {
      type: 'uno-chat-context',
      site,
      id,
      name,
      eligible,
      invites: eligible && !gameInvitesAreStopped(blocksInvites(member?.nogameinvite ?? ownEntry?.nogameinvite)),
      challenge: pendingChallenge?.owner === id ? pendingChallenge : null,
      roster: includeRoster ? items
        .filter(item => item?.id != null && String(item.id) !== id && item.topic)
        .map(item => {
          const member = chatMember(String(item.id));
          return {
            id: String(item.id),
            name: String(item.topic).trim().slice(0, 80),
            eligible: hasLikes(member?.rep ?? item.rep),
            blocked: blocksInvites(member?.nogameinvite ?? item.nogameinvite)
          };
        }) : undefined
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

    game.invitesStopped = !context.invites;
    if (game.invitesStopped) removeInvite();

    const { roster, ...message } = context;
    const snapshot = JSON.stringify(message);
    const fresh = Date.now() - game.lastSent < HEARTBEAT_MS;

    if (!force && snapshot === game.lastContext && fresh) return;

    game.lastContext = snapshot;
    game.lastSent = Date.now();
    post(message);
  }

  function showNotice(text) {
    const parent = game?.dialog.open ? game.dialog : document.body;
    let node = document.getElementById('uno-online-notice');

    if (node && node.parentNode !== parent) {
      node.remove();
      node = null;
    }

    if (!node) {
      node = document.createElement('div');
      node.id = 'uno-online-notice';
      node.dir = 'rtl';
      node.setAttribute('role', 'status');
      parent.append(node);
    }

    node.textContent = text;
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => node.remove(), 4500);
  }

  function applyTheme(node, theme) {
    node.style.setProperty('--uno-accent', theme.accent);
    node.style.setProperty('--uno-ink', theme.ink);
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
    const title = 'أونو · لاعب ضد لاعب · ' + theme.siteName;
    const url = new URL(service.href);
    url.searchParams.set('parent', location.origin);

    const dialog = document.createElement('dialog');
    dialog.id = 'uno-online-dialog';
    dialog.dir = 'rtl';
    dialog.setAttribute('aria-label', title);

    const frame = document.createElement('iframe');
    frame.title = title;
    frame.loading = 'eager';
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');

    const loading = document.createElement('div');
    loading.className = 'uno-online-loading';
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
    dock.id = 'uno-online-dock';
    dock.hidden = true;
    dock.setAttribute('aria-controls', dialog.id);
    unoLabel(dock, 'أونو');

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
      post({ type: 'uno-close-request', requestId: game.closeRequest });
      const currentGame = game;
      game.closeTimer = setTimeout(() => {
        if (game !== currentGame || !game.closeRequest) return;
        resetCloseButton();
        showNotice('ما وصل تأكيد الخروج. جرّب مرة ثانية.');
      }, 65000);
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
    header.className = 'uno-online-header';

    const heading = document.createElement('strong');
    unoLabel(heading, title);

    const controls = document.createElement('div');
    controls.className = 'uno-online-controls';
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
    if (!context || !context.eligible) {
      removeGame();
      return;
    }
    if (!game) createGame(context.id);
    sendContext(context);
  }

  function challengeFromProfile(targetId) {
    const context = readContext(true);

    if (!context) {
      showNotice('بانتظار حساب الشات. جرّب مرة ثانية.');
      return;
    }

    if (!context.eligible) {
      showNotice('تحتاج إلى 500 لايك لاستخدام الألعاب');
      return;
    }

    if (pendingChallenge) {
      showNotice('دعوة أونو قيد الإرسال.');
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

    if (!member.eligible) {
      showNotice('هالعضو يحتاج إلى 500 لايك لاستخدام الألعاب');
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
    }, 75000);
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
    panel.id = 'uno-online-invite';
    panel.dataset.invite = key;
    panel.dir = 'rtl';
    panel.setAttribute('role', 'alertdialog');
    panel.setAttribute('aria-label', 'دعوة أونو');
    applyTheme(panel, game.theme);

    const title = document.createElement('strong');
    unoLabel(title, 'تحدي أونو من ' + String(invite.from ?? '').slice(0, 80));
    panel.append(title);

    if (invites.length > 1) {
      const more = document.createElement('small');
      more.textContent = '+ ' + (invites.length - 1) + ' دعوات أخرى بالانتظار';
      panel.append(more);
    }

    const controls = document.createElement('div');
    controls.className = 'uno-online-controls';

    const accept = button('موافقة', () => answer('accept'));
    accept.className = 'uno-invite-accept';

    const decline = button('رفض', () => answer('decline'));
    decline.className = 'uno-invite-decline';

    function answer(action) {
      if (gameInvitesAreStopped(game.invitesStopped)) {
        removeInvite();
        showNotice('أوقفت استقبال دعوات الألعاب.');
        return;
      }

      game.openAfterAccept = action === 'accept' ? invite.id : null;
      accept.disabled = true;
      decline.disabled = true;
      post({ type: 'uno-invite-answer', id: invite.id, action });

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

    for (const profile of document.querySelectorAll('.th-upro-profile-container')) {
      const target = profile.querySelector('[data-ludoid], [data-xo-target]');
      const row = target?.closest('.games-duo-modern');
      const existing = profile.querySelector('.uno-online-row');
      const targetId = target?.dataset.ludoid || target?.dataset.xoTarget;
      if (!row || !targetId || targetId === currentId()) {
        existing?.remove();
        continue;
      }

      let after = row;
      while (after.nextElementSibling?.matches('.domino-online-row, .pool-online-row')) {
        after = after.nextElementSibling;
      }
      if (existing) {
        existing.dataset.recipient = targetId;
        if (after.nextElementSibling !== existing) after.after(existing);
        continue;
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'games-duo-modern uno-online-row';
      wrapper.dataset.recipient = targetId;
      const node = button('', () => challengeFromProfile(wrapper.dataset.recipient));
      node.className = 'game-btn game-ludo uno-profile-challenge';
      unoLabel(node, 'تحدّي أونو');
      wrapper.append(node);
      after.after(wrapper);
    }
  }

  window.addEventListener('message', event => {
    if (!game || event.origin !== service.origin ||
        event.source !== game.frame.contentWindow) return;

    const data = event.data;

    if (data?.type === 'uno-close-result') {
      game.finishClose(data);
      return;
    }

    if (data?.type === 'uno-match-notice') {
      if (typeof data.text === 'string' && data.text) showNotice(data.text.slice(0, 200));
      return;
    }

    if (data?.type === 'uno-invite-result') {
      if (!data.answerId) {
        pendingChallenge = null;
        if (data.ok === true) game.restore();
      }
      if (data.answerId === game.openAfterAccept && data.ok === false) {
        game.openAfterAccept = null;
      }
      removeInvite();
      if (typeof data.text === 'string') showNotice(data.text.slice(0, 200));
      return;
    }

    if (data?.type !== 'uno-pending') return;

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

    const label = playing ? 'أونو · الطاولة جاهزة' : 'أونو';

    if (game.dock.dataset.label !== label) {
      unoLabel(game.dock, label);
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
