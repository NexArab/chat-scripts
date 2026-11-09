
(function () {
  'use strict';

  const OWNER = 'NexArab';
  const REPO = 'chat-scripts';
  const BRANCH = 'main';

  const KEY = '__NEXARAB_AUTO_ALL_V2__';

  if (window[KEY]) return;

  window[KEY] = true;

  const API =
    'https://api.github.com/repos/' +
    OWNER + '/' + REPO +
    '/git/trees/' + BRANCH + '?recursive=1';

  const BASE =
    'https://nexarab.github.io/' +
    REPO + '/';

  const selfScript = document.currentScript;

  const SELF_URL = selfScript
    ? new URL(selfScript.src, location.href)
    : new URL(BASE + 'auto-loader.js');

  const loaded = new Set();

  function normalize(url) {
    try {
      const u = new URL(url, location.href);

      return u.origin + u.pathname;
    } catch (e) {
      return url;
    }
  }

  function alreadyLoaded(url) {
    const target = normalize(url);

    if (loaded.has(target)) {
      return true;
    }

    const scripts =
      document.querySelectorAll('script[src]');

    for (const script of scripts) {
      if (normalize(script.src) === target) {
        return true;
      }
    }

    return false;
  }

  function loadFile(path) {
    const url = BASE + path
      .split('/')
      .map(encodeURIComponent)
      .join('/');

    if (normalize(url) === normalize(SELF_URL.href)) {
      return;
    }

    if (alreadyLoaded(url)) {
      return;
    }

    loaded.add(normalize(url));

    const script = document.createElement('script');

    script.src = url;
    script.async = false;

    script.onerror = function () {
      loaded.delete(normalize(url));

      console.error(
        '[NexArab] تعذر تحميل الملف:',
        path
      );
    };

    document.head.appendChild(script);
  }

  async function loadAll() {
    try {
      const response = await fetch(API, {
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(
          'GitHub API Error: ' + response.status
        );
      }

      const data = await response.json();

      if (!Array.isArray(data.tree) || data.truncated) {
        throw new Error(
          'تعذر الحصول على قائمة المستودع كاملة'
        );
      }

      const files = data.tree
        .filter(function (item) {
          return (
            item.type === 'blob' &&
            /\.js$/i.test(item.path)
          );
        })
        .map(function (item) {
          return item.path;
        })
        .sort();

      console.log(
        '[NexArab] عدد ملفات JavaScript:',
        files.length
      );

      files.forEach(loadFile);

    } catch (error) {
      console.error(
        '[NexArab] فشل الاستدعاء الشامل:',
        error
      );
    }
  }

  loadAll();

})();
