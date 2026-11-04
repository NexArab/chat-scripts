(function () {
  'use strict';

  const id = 'bein-chat-test';
  const playlist =
    'https://raw.githubusercontent.com/miragedz/tv/' +
    'dffaed182bea8fec54ca878ba7c1cbc29ebb3efc/4kplus.info.TV.m3u';

  function start() {
    document.getElementById(id)?.remove();

    const host = document.createElement('div');
    host.id = id;
    host.style.cssText =
      'position:fixed;top:6%;right:3%;width:min(490px,94vw);' +
      'z-index:2147483647;text-align:right;';
    document.body.appendChild(host);

    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        * { box-sizing:border-box }
        section {
          direction:rtl; background:#181326; color:white;
          border-radius:12px; padding:12px; font:14px Tahoma,sans-serif;
          max-height:88vh; max-height:88dvh; display:flex;
          flex-direction:column; gap:8px; overflow:auto;
        }
        header,.tools {
          display:flex; align-items:center; justify-content:space-between; gap:8px;
        }
        button,input,.file,a { font:inherit }
        button,.file,a {
          border:0; border-radius:6px; padding:7px 9px; cursor:pointer;
        }
        button,.file { color:#201a2c; background:#f0edf4 }
        button[aria-pressed="true"] { color:white; background:#763db4 }
        video {
          display:block; width:100%; aspect-ratio:16/9;
          max-height:38vh; background:#000;
        }
        p { margin:0; line-height:1.5 }
        a { color:#fff; background:#503465; text-decoration:none }
        [hidden] { display:none!important }
        input[type="search"] {
          width:100%; padding:8px; border-radius:6px; border:0;
        }
        nav {
          display:grid; grid-template-columns:repeat(3,minmax(0,1fr));
          gap:5px; overflow:auto; min-height:0;
        }
        nav button { overflow-wrap:anywhere }
      </style>
      <section>
        <header>
          <strong>beIN Sports · فحص القنوات</strong>
          <button type="button" data-close>إغلاق ✕</button>
        </header>
        <div data-screen></div>
        <p data-status role="status">جارٍ تحميل قائمة 4kplus…</p>
        <div class="tools">
          <label class="file">
            اختيار ملف القائمة
            <input data-file type="file" accept=".m3u,.m3u8,.txt" hidden>
          </label>
          <a data-original target="_blank" rel="noopener noreferrer"
             referrerpolicy="no-referrer" hidden>فحص الرابط الأصلي ↗</a>
        </div>
        <input data-search type="search" placeholder="ابحث باسم القناة أو الجودة">
        <small data-count></small>
        <nav aria-label="قنوات beIN"></nav>
      </section>`;

    const screen = root.querySelector('[data-screen]');
    const status = root.querySelector('[data-status]');
    const original = root.querySelector('[data-original]');
    const search = root.querySelector('[data-search]');
    const count = root.querySelector('[data-count]');
    const fileInput = root.querySelector('[data-file]');
    const nav = root.querySelector('nav');
    const controller = new AbortController();

    let channels = [];
    let selected = null;
    let player;
    let timer;
    let listVersion = 0;

    function clearPlayer() {
      clearTimeout(timer);
      if (!player) return;
      player.onplaying = null;
      player.onerror = null;
      player.pause();
      player.removeAttribute('src');
      player.load();
      player.remove();
      player = null;
    }

    function newPlayer() {
      const video = document.createElement('video');
      video.controls = true;
      video.playsInline = true;
      video.preload = 'none';
      screen.appendChild(video);
      player = video;
      return video;
    }

    function stopWith(message) {
      clearPlayer();
      newPlayer();
      status.textContent = message;
    }

    function play(channel) {
      clearPlayer();
      selected = channel;
      for (const button of nav.children) {
        button.setAttribute('aria-pressed', String(button.channel === channel));
      }

      original.href = channel.address;
      original.hidden = false;

      const url = new URL(channel.address);
      const upgraded = location.protocol === 'https:' && url.protocol === 'http:';
      if (upgraded) url.protocol = 'https:';

      const video = newPlayer();
      status.textContent = upgraded
        ? channel.name + ' — جارٍ تجربة HTTPS…'
        : channel.name + ' — جارٍ الاتصال…';

      function fail(message) {
        if (player === video) stopWith(channel.name + ' — ' + message);
      }

      function armTimer() {
        clearTimeout(timer);
        timer = setTimeout(() => fail('ما بدأ البث خلال 20 ثانية.'), 20000);
      }

      video.onplaying = () => {
        if (player !== video) return;
        clearTimeout(timer);
        status.textContent = channel.name + ' — بدأ البث داخل الشات ✓';
      };

      video.onerror = () => fail('تعذّر تشغيل الرابط داخل المتصفح.');
      video.addEventListener('play', armTimer, { once:true });
      video.referrerPolicy = 'no-referrer';
      video.src = url.href;
      armTimer();

      video.play().catch(error => {
        if (player !== video) return;
        if (error.name === 'NotAllowedError') {
          clearTimeout(timer);
          status.textContent = 'اضغط زر التشغيل داخل الفيديو.';
        } else {
          fail('تعذّر بدء البث.');
        }
      });
    }

    function parse(text) {
      const entries = [];
      let name = '';

      for (const raw of text.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line) continue;

        if (line.startsWith('#EXTINF:')) {
          const info = line.match(/^#EXTINF:(?:[^",]|"[^"]*")*,(.*)$/i);
          name = info ? info[1].trim() : '';
          continue;
        }

        if (line.startsWith('#')) continue;

        if (name && /^https?:\/\//i.test(line)) {
          try {
            entries.push({ name, address:new URL(line).href });
          } catch {
            // تجاهل السطر إذا كان عنوانه تالفًا.
          }
        }
        name = '';
      }
      return entries;
    }

    function normalize(text) {
      return text.normalize('NFKC').replace(/⚽/g, 'o').toLowerCase();
    }

    function draw() {
      const query = normalize(search.value.trim());
      const visible = channels.filter(item => normalize(item.name).includes(query));
      const fragment = document.createDocumentFragment();

      for (const channel of visible) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = channel.name;
        button.channel = channel;
        button.setAttribute('aria-pressed', String(selected === channel));
        button.onclick = () => play(channel);
        fragment.appendChild(button);
      }

      nav.replaceChildren(fragment);
      count.textContent = query
        ? 'نتائج البحث: ' + visible.length + ' من ' + channels.length
        : 'عدد مداخل البث، مع الجودات والنسخ: ' + channels.length;
    }

    function useList(text) {
      const next = parse(text);
      if (!next.length) throw new Error('Empty playlist');
      clearPlayer();
      newPlayer();
      channels = next;
      selected = null;
      original.hidden = true;
      original.removeAttribute('href');
      search.value = '';
      draw();
      status.textContent = 'اختَر القناة والجودة حتى تجرّب البث.';
    }

    fileInput.onchange = async () => {
      const file = fileInput.files[0];
      if (!file) return;
      const version = ++listVersion;
      controller.abort();
      try {
        const text = await file.text();
        if (host.isConnected && version === listVersion) useList(text);
      } catch {
        if (host.isConnected && version === listVersion) {
          status.textContent = 'تعذّرت قراءة القائمة. اختَر ملف M3U أو TXT الصحيح.';
        }
      }
      fileInput.value = '';
    };

    search.oninput = draw;
    root.querySelector('[data-close]').onclick = () => host.remove();

    const observer = new MutationObserver(() => {
      if (host.isConnected) return;
      observer.disconnect();
      controller.abort();
      clearPlayer();
    });
    observer.observe(document.body, { childList:true });

    newPlayer();

    const version = listVersion;
    const deadline = setTimeout(() => controller.abort(), 15000);
    (async () => {
      try {
        const response = await fetch(playlist, {
          credentials:'omit',
          signal:controller.signal
        });
        if (!response.ok) throw new Error('Playlist unavailable');
        const text = await response.text();
        if (host.isConnected && version === listVersion) useList(text);
      } catch {
        if (host.isConnected && version === listVersion) {
          status.textContent =
            'تعذّر تحميل القائمة من GitHub. اضغط «اختيار ملف القائمة» واختَر الملف اللي عندك.';
        }
      } finally {
        clearTimeout(deadline);
      }
    })();
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once:true });
})();
