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

  function open(recipient) {
    if (document.getElementById('domino-online-dialog')) return;
    const { siteName, accent, ink } = readTheme();
    const url = new URL(serviceUrl);
    url.searchParams.set('site', siteName);
    url.searchParams.set('accent', accent);
    url.searchParams.set('ink', ink);
    if (recipient) url.searchParams.set('name', recipient);
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
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'إغلاق دومينو';
    close.onclick = () => dialog.close();
    const frame = document.createElement('iframe');
    frame.title = heading;
    frame.src = url.href;
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    header.append(title, close);
    dialog.append(header, frame);
    dialog.addEventListener('close', () => dialog.remove(), {once:true});
    document.body.append(dialog);
    dialog.showModal();
  }

  function mount() {
    const cards = document.querySelector('#thGames .thGamesSection .thGamesCards');
    if (cards && !cards.querySelector('.domino-online-online-card')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'thGamesCard thGamesCardBot domino-online-online-card';
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
        secondRow.dataset.recipient = row.closest('.th-upro-profile-container').querySelector('.th-upro-profile-name')?.textContent.trim() || '';
        continue;
      }
      const extra = document.createElement('div');
      extra.className = 'games-duo-modern domino-online-row';
      extra.dataset.recipient = row.closest('.th-upro-profile-container').querySelector('.th-upro-profile-name')?.textContent.trim() || '';
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
  mount();
})();
