(async function () {
  'use strict';

  const id = 'bein-chat-test';
  document.getElementById(id)?.remove();

  const host = document.createElement('div');
  host.id = id;
  host.style.cssText =
    'position:fixed;top:8%;right:3%;width:min(490px,94vw);' +
    'max-height:84vh;overflow:auto;z-index:2147483647;';
  document.body.appendChild(host);

  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
    <style>
      section{direction:rtl;background:#181326;color:white;padding:12px;
        border-radius:12px;font:14px Tahoma,sans-serif}
      header{display:flex;align-items:center;justify-content:space-between}
      video{display:block;width:100%;aspect-ratio:16/9;background:#000;margin:10px 0}
      nav{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}
      button{cursor:pointer;border:0;border-radius:6px;padding:8px}
      button[aria-pressed="true"]{background:#763db4;color:white}
      p{min-height:1.4em}
    </style>
    <section>
      <header><strong>beIN Sports · فحص البث</strong>
        <button type="button" data-close>إغلاق ✕</button></header>
      <div data-screen></div>
      <p role="status">جارٍ تحميل القائمة…</p>
      <nav></nav>
    </section>`;

  const screen = root.querySelector('[data-screen]');
  const status = root.querySelector('[role=status]');
  const nav = root.querySelector('nav');
  let video;
  let timer;

  function stop() {
    clearTimeout(timer);
    if (!video) return;
    video.onplaying = video.onerror = null;
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.remove();
    video = null;
  }

  function newVideo() {
    const player = document.createElement('video');
    player.controls = true;
    player.playsInline = true;
    screen.appendChild(player);
    return player;
  }

  video = newVideo();
  const observer = new MutationObserver(() => {
    if (!host.isConnected) {
      stop();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true });
  root.querySelector('[data-close]').onclick = () => host.remove();

  function test(name, address, button) {
    stop();
    for (const item of nav.children) {
      item.setAttribute('aria-pressed', String(item === button));
    }

    const url = new URL(address);
    url.protocol = 'https:';
    video = newVideo();
    const player = video;
    status.textContent = 'جارٍ تجربة ' + name + ' عبر HTTPS…';

    function fail(message) {
      if (video !== player) return;
      stop();
      video = newVideo();
      status.textContent = name + ' — ' + message;
    }

    player.onplaying = () => {
      clearTimeout(timer);
      status.textContent = name + ' — بدأ البث داخل الشات ✓';
    };
    player.onerror = () => fail('تعذّر تشغيل هذا الرابط داخل المتصفح.');
    timer = setTimeout(() => fail('ما بدأ البث خلال 20 ثانية.'), 20000);

    player.src = url.href;
    player.play().catch(error => {
      if (video !== player) return;
      if (error.name === 'NotAllowedError') {
        clearTimeout(timer);
        status.textContent = 'اضغط زر التشغيل داخل الفيديو.';
      } else {
        fail('تعذّر بدء البث.');
      }
    });
  }

  try {
    const response = await fetch(
      'https://gist.githubusercontent.com/regragi-younes/' +
      'a77b56c45b3c086cc166b79d5cc45e4a/raw/beinsport.m3u',
      { credentials: 'omit', signal: AbortSignal.timeout(15000) }
    );
    if (!response.ok) throw new Error();
    const text = await response.text();
    if (!host.isConnected) return;

    const channels = new Map();
    let name = '';
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (line.startsWith('#EXTINF:')) {
        name = line.slice(line.lastIndexOf(',') + 1).trim();
      } else if (line && !line.startsWith('#')) {
        if (/^(?:BeinSport-Sd(?:10|[1-9])|EN:BeinSport-11)$/i.test(name)
            && /^https?:\/\//i.test(line)) {
          channels.set(name, line);
        }
        name = '';
      }
    }

    for (const [label, address] of channels) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.onclick = () => test(label, address, button);
      nav.appendChild(button);
    }
    status.textContent = channels.size
      ? 'اختر قناة للفحص. عدد القنوات الموجودة بالقائمة: ' + channels.size
      : 'ما لقينا القنوات المطلوبة داخل القائمة.';
  } catch {
    status.textContent = 'تعذّر تحميل قائمة القنوات من GitHub.';
  }
})();
