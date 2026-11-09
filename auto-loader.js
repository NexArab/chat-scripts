
/* NexArab - Automatic JavaScript Loader */

(function () {
  'use strict';

  var KEY = '__NEXARAB_AUTO_LOADER_V2__';

  if (window[KEY]) return;
  window[KEY] = true;

  var API =
    'https://api.github.com/repos/NexArab/chat-scripts/git/trees/main?recursive=1';

  var BASE =
    'https://nexarab.github.io/chat-scripts/';

  var SELF = 'auto-loader.js';

  var versions = {
    'radio-unified-v1.js': '12',
    'cinema-unified-v2.js': '4',
    'domino-online.js': '12',
    'pool-online.js': '20261108-8ball'
  };

  var ids = {
    'tv-unified-v1.js': 'chat-tv-loader',
    'youtube-unified-v1.js': 'chat-youtube-loader',
    'radio-unified-v1.js': 'chat-radio-loader',
    'cinema-unified-v2.js': 'chat-cinema-loader',
    'domino-online.js': 'domino-online-loader',
    'pool-online.js': 'pool-online-loader'
  };

  function alreadyLoaded(url, id) {
    if (id && document.getElementById(id)) {
      return true;
    }

    var target = new URL(url, document.baseURI);

    return Array.prototype.some.call(
      document.querySelectorAll('script[src]'),
      function (script) {
        try {
          var current = new URL(
            script.src,
            document.baseURI
          );

          return (
            current.origin === target.origin &&
            current.pathname === target.pathname
          );
        } catch (error) {
          return false;
        }
      }
    );
  }

  function loadScript(path) {
    var filename = path.split('/').pop();

    var url = BASE + path
      .split('/')
      .map(encodeURIComponent)
      .join('/');

    if (versions[filename]) {
      url += '?v=' +
        encodeURIComponent(versions[filename]);
    }

    var id = ids[filename];

    if (alreadyLoaded(url, id)) {
      return;
    }

    var script = document.createElement('script');

    script.src = url;
    script.async = false;

    if (id) {
      script.id = id;
    }

    if (filename === 'pool-online.js') {
      script.dataset.poolService =
        'https://pool-server-y7ra.onrender.com';
    }

    script.onerror = function () {
      console.error(
        '[NexArab] Failed to load:',
        path
      );

      script.remove();
    };

    document.head.appendChild(script);
  }

  fetch(API, {
    mode: 'cors',
    cache: 'no-store'
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error(
          'GitHub API error: ' + response.status
        );
      }

      return response.json();
    })
    .then(function (data) {
      if (!Array.isArray(data.tree) || data.truncated) {
        throw new Error(
          'Repository file list unavailable'
        );
      }

      var files = data.tree.filter(function (item) {
        if (item.type !== 'blob') {
          return false;
        }

        if (!/\.js$/i.test(item.path)) {
          return false;
        }

        if (item.path.split('/').pop() === SELF) {
          return false;
        }

        if (
          /(^|\/)(node_modules|test|tests|dist|vendor)\//i
            .test(item.path)
        ) {
          return false;
        }

        return true;
      });

      files.sort(function (a, b) {
        return a.path.localeCompare(b.path);
      });

      files.forEach(function (item) {
        loadScript(item.path);
      });
    })
    .catch(function (error) {
      console.error(
        '[NexArab] Auto loader error:',
        error
      );
    });

})();
