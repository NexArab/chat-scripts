(function () {
  'use strict';

  var KEY = '__CHAT_TV_V1__';

  if (window[KEY] && typeof window[KEY].destroy === 'function') {
    window[KEY].destroy();
  }

  function installTVStyle() {
    if (document.getElementById('chat-tv-unified-style')) return;

    var style = document.createElement('style');
    style.id = 'chat-tv-unified-style';

    style.textContent = `
      #d0.chat-tv-bar > button.ae {
        padding-left: var(--tv-pad-left) !important;
        padding-right: var(--tv-pad-right) !important;
      }
      #d0.chat-tv-bar.chat-tv-tight > button.ae {
        box-sizing: border-box !important;
        min-width: 0 !important;
        width: var(--tv-nav-width) !important;
      }
      #d0 #chat-tv-open svg {
        position: relative;
        top: -4px;
      }
      #chat-tv,
      #chat-tv *,
      #chat-tv-floating,
      #chat-tv-floating * {
        box-sizing: border-box;
      }
      #chat-tv {
        direction: rtl;
        text-align: right;
        overflow-y: auto;
        padding: 10px !important;
        font: 13px/1.7 Tahoma, "Segoe UI", sans-serif;
      }
      #chat-tv .chat-tv-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 5px;
        margin-bottom: 9px;
      }
      #chat-tv .chat-tv-tag {
        font-size: 10px;
        opacity: .65;
      }
      #chat-tv .chat-tv-screen {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        min-height: 200px;
        background: #090b0f;
        color: #fff;
        border-radius: 9px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      #chat-tv [data-tv-placeholder] {
        padding: 20px;
        color: #eee;
        font-size: 13px;
      }
      #chat-tv [hidden],
      #chat-tv-floating [hidden] {
        display: none !important;
      }
      #chat-tv iframe {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: 0;
        display: block;
      }
      #chat-tv .chat-tv-tools {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
        margin-top: 9px;
      }
      #chat-tv button {
        float: none !important;
        position: static !important;
        min-width: 0 !important;
        white-space: normal !important;
        height: auto !important;
        margin: 0 !important;
        border-radius: 7px !important;
        font: 700 12px/1.6 Tahoma, sans-serif !important;
        cursor: pointer;
        min-height: 37px;
        padding: 7px !important;
      }
      #chat-tv button,
      #chat-tv button:hover,
      #chat-tv button:focus,
      #chat-tv button:active {
        color: #000 !important;
        background: #fff !important;
        text-shadow: none !important;
      }
      #chat-tv .chat-tv-choice {
        border-color: currentColor;
        border-color: color-mix(in srgb, currentColor 22%, transparent);
      }
      #chat-tv button[aria-pressed="true"],
      #chat-tv [data-tv-start] {
        border: 2px solid var(--tv-accent, currentColor) !important;
        box-shadow: inset 0 -3px 0 var(--tv-accent, currentColor) !important;
        background: #f1f3f5 !important;
        color: #000 !important;
      }
      #chat-tv button:disabled {
        opacity: 1;
        cursor: default;
        color: #666 !important;
        background: #f4f4f4 !important;
        box-shadow: none !important;
      }
      #chat-tv [data-tv-status] {
        font-size: 11px;
        margin: 8px 0;
        opacity: .85;
        overflow-wrap: anywhere;
      }
      #chat-tv .chat-tv-categories {
        display: flex;
        gap: 5px;
        padding: 9px 0;
        border-top: 1px solid #8884;
        flex-wrap: wrap;
      }
      #chat-tv .chat-tv-categories button {
        flex: 1 1 auto;
      }
      #chat-tv .chat-tv-channels {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 7px;
      }
      #chat-tv .chat-tv-channels button {
        width: 100% !important;
        text-align: right !important;
        min-height: 58px;
      }
      #chat-tv small {
        display: block;
        font-size: 9px;
        font-weight: 400;
        opacity: .75;
        margin-top: 3px;
      }
      #chat-tv button small {
        color: #333 !important;
        opacity: 1;
      }
      #chat-tv .chat-tv-help {
        font-size: 10px;
        opacity: .7;
        margin: 12px 0 3px;
      }
      #chat-tv button:focus-visible,
      #chat-tv a:focus-visible,
      #chat-tv-open:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
      }
      #chat-tv .chat-tv-dock-marker {
        padding: 20px 12px;
        border: 1px dashed #999;
        border-radius: 8px;
        text-align: center;
        font-size: 12px;
      }
      #chat-tv [data-tv-float] {
        grid-column: 1 / -1;
      }
      #dpnl.chat-tv-expanded {
        position: fixed !important;
        inset: 10px 10px 50px !important;
        width: auto !important;
        max-width: none !important;
        height: auto !important;
        z-index: 10000 !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
      }
      #dpnl.chat-tv-expanded > .th-dpnl-head {
        flex: 0 0 auto !important;
      }
      #dpnl.chat-tv-expanded > #chat-tv.active {
        flex: 1 1 0 !important;
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        margin: 0 !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        background: #fff !important;
      }
      #dpnl.chat-tv-expanded #chat-tv .chat-tv-screen {
        width: min(100%, 1100px);
        margin-inline: auto;
        max-height: calc(100dvh - 240px);
      }
      #chat-tv-floating {
        position: fixed !important;
        z-index: 10020 !important;
        width: 340px;
        max-width: calc(100vw - 16px);
        background: #111;
        color: #fff;
        border: 1px solid #666;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 8px 30px #0006;
        direction: rtl;
        font: 12px/1.5 Tahoma, sans-serif;
      }
      #chat-tv-floating.tv-float-small {
        width: 240px;
      }
      #chat-tv-floating .tv-float-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 5px;
        background: var(--tv-accent, #343a40);
        padding: 5px 7px;
        cursor: grab;
        touch-action: none;
        user-select: none;
        color: #fff;
      }
      #chat-tv-floating .tv-float-head strong {
        font: 700 11px/1.5 Tahoma, sans-serif;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      #chat-tv-floating .tv-float-head > div {
        display: flex;
        gap: 4px;
        flex-shrink: 0;
      }
      #chat-tv-floating button {
        position: static !important;
        float: none !important;
        width: 29px !important;
        height: 29px !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        display: inline-block !important;
        border: 1px solid #ffffff70 !important;
        border-radius: 5px !important;
        background: #fff !important;
        color: #111 !important;
        font: 700 18px/25px Tahoma, sans-serif !important;
        cursor: pointer;
      }
      #chat-tv-floating .chat-tv-screen {
        position: relative !important;
        width: 100% !important;
        height: 0 !important;
        min-height: 0 !important;
        max-height: none !important;
        aspect-ratio: auto !important;
        padding: 0 0 56.25% !important;
        margin: 0 !important;
        background: #090b0f !important;
        border-radius: 0 !important;
        overflow: hidden !important;
      }
      #chat-tv-floating iframe {
        position: absolute !important;
        inset: 0 !important;
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        border: 0 !important;
      }
      #chat-tv-floating .chat-tv-screen iframe {
        min-height: 0 !important;
        margin: 0 !important;
      }
      #chat-tv-floating [data-tv-placeholder] {
        color: #fff;
        text-align: center;
        padding: 20px;
      }
      #chat-tv .chat-tv-screen video,
      #chat-tv-floating .chat-tv-screen video {
        position: absolute !important;
        inset: 0 !important;
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        object-fit: contain !important;
        background: #000 !important;
      }
      #chat-tv-floating.tv-float-dragging video,
      #chat-tv-floating.tv-float-dragging iframe {
        pointer-events: none !important;
      }
      #chat-tv .chat-tv-screen:fullscreen,
      #chat-tv-floating .chat-tv-screen:fullscreen {
        width: 100vw !important;
        height: 100vh !important;
        min-height: 0 !important;
        max-height: none !important;
        padding: 0 !important;
        margin: 0 !important;
        border-radius: 0 !important;
        aspect-ratio: auto !important;
      }
      @media (max-width: 420px) {
        #chat-tv {
          padding: 7px !important;
        }
        #dpnl.chat-tv-expanded {
          inset: 0 0 48px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  var channels = [
    {
      id: 'oman',
      name: 'عُمان الرياضية',
      group: 'رياضة',
      embed: 'https://player.mangomolo.com/v1/live?id=MTY4&channelid=MTU5&countries=Q0M=&filter=DENY&signature=ecd647f9043ed63ed9db848eaf7b84a3&language=ar&fullscreen=yes&base_url=aHR0cHM6Ly9heW4ub20vbGl2ZS8xNTk=&autoplay=false&vast=true'
    },
    {
      id: 'morocco',
      name: 'الرياضية المغربية',
      group: 'رياضة',
      embed: 'https://snrt.player.easybroadcast.io/events/73_arryadia_k2tgcj0'
    },
    {
      id: 'live-7',
      name: 'الكويت الرياضية',
      group: 'رياضة',
      stream: 'https://kwtspta.cdn.mangomolo.com/sp/smil:sp.stream.smil/chunklist.m3u8'
    },
    {
      id: 'live-8',
      name: 'الكويت الرياضية بلس',
      group: 'رياضة',
      stream: 'https://kwtsplta.cdn.mangomolo.com/spl/smil:spl.stream.smil/chunklist.m3u8'
    },
    {
      id: 'live-12',
      name: 'البحرين الرياضية 1',
      group: 'رياضة',
      stream: 'https://5c7b683162943.streamlock.net/live/ngrp:sportsone_all/playlist.m3u8'
    },
    {
      id: 'aj',
      name: 'الجزيرة',
      group: 'أخبار',
      embed: 'https://www.youtube.com/embed/bNyUyrR0PHo?playsinline=1&autoplay=0'
    },
    {
      id: 'sky',
      name: 'سكاي نيوز عربية',
      group: 'أخبار',
      embed: 'https://www.youtube.com/embed/ppgTP8xQQsM?playsinline=1&autoplay=0'
    },
    {
      id: 'live-6',
      name: 'الكويت الإخبارية',
      group: 'أخبار',
      stream: 'https://kwtkbta.cdn.mangomolo.com/kb/smil:kb.stream.smil/chunklist.m3u8'
    },
    {
      id: 'live-18',
      name: 'الشرق للأخبار',
      group: 'أخبار',
      stream: 'https://live-news-v2.asharq.com/asharq.m3u8'
    },
    {
      id: 'doc',
      name: 'الجزيرة الوثائقية',
      group: 'وثائقي',
      embed: 'https://players.brightcove.net/665003304001/2sJRcHJYz_default/index.html?videoId=6368599111112'
    },
    {
      id: 'live-4',
      name: 'العربي الكويتية',
      group: 'وثائقي',
      stream: 'https://kwtktvata.cdn.mangomolo.com/ktva/smil:tktva.stream.smil/chunklist.m3u8'
    },
    {
      id: 'live-19',
      name: 'الشرق ديسكفري',
      group: 'وثائقي',
      stream: 'https://live-discovery.asharq.com/asharq.m3u8'
    },
    {
      id: 'live-20',
      name: 'الشرق الوثائقية',
      group: 'وثائقي',
      stream: 'https://live-documentary.asharq.com/asharq.m3u8'
    },
    {
      id: 'live-17',
      name: 'CNBC عربية',
      group: 'اقتصاد',
      stream: 'https://cnbc-live.akamaized.net/cnbc/master.m3u8'
    },
    {
      id: 'live-1',
      name: 'الكويت الأولى',
      group: 'برامج',
      stream: 'https://kwtktv1ta.cdn.mangomolo.com/ktv1/smil:ktv1.stream.smil/chunklist.m3u8'
    },
    {
      id: 'live-2',
      name: 'الكويت الثانية',
      group: 'برامج',
      stream: 'https://kwtktv2ta.cdn.mangomolo.com/ktv2/smil:ktv2.stream.smil/chunklist.m3u8'
    },
    {
      id: 'live-3',
      name: 'القرين',
      group: 'برامج',
      stream: 'https://kwtktvaqta.cdn.mangomolo.com/ktvaq/smil:tktvaq.stream.smil/chunklist.m3u8'
    },
    {
      id: 'live-15',
      name: 'الريان القديم',
      group: 'برامج',
      stream: 'https://alrayyancdn.vidgyor.com/pub-nooldraybinbdh/liveabr/playlist_dvr.m3u8'
    },
    {
      id: 'oman-general',
      name: 'عُمان العامة',
      group: 'برامج',
      embed: 'https://player.mangomolo.com/v1/live?id=MTY4&channelid=MTU4&countries=Q0M=&w=100%25&h=100%25&filter=DENY&signature=1e31e6c05f13059a6a4e332222972795&language=ar&app_id=&fullscreen=yes&player_profile=&base_url=aHR0cHM6Ly9heW4ub20vbGl2ZS8xNTg=&autoplay=false&vast=true'
    },
    {
      id: 'oman-live',
      name: 'عُمان مباشر',
      group: 'برامج',
      embed: 'https://player.mangomolo.com/v1/live?id=MTY4&channelid=MTYx&countries=Q0M=&w=100%25&h=100%25&filter=DENY&signature=3fd1e8dd84138a41bf33d93afd4a7f09&language=ar&app_id=&fullscreen=yes&player_profile=&base_url=aHR0cHM6Ly9heW4ub20vbGl2ZS8xNjE=&autoplay=false&vast=true'
    },
    {
      id: 'live-21',
      name: 'الثقافية',
      group: 'ثقافة',
      stream: 'https://live-thaqafeyah.asharq.com/asharq.m3u8'
    },
    {
      id: 'oman-culture',
      name: 'عُمان الثقافية',
      group: 'ثقافة',
      embed: 'https://player.mangomolo.com/v1/live?id=MTY4&channelid=MTYw&countries=Q0M=&w=100%25&h=100%25&filter=DENY&signature=515ec2eb016a3e614059a5261f4b8280&language=ar&app_id=&fullscreen=yes&player_profile=&base_url=aHR0cHM6Ly9heW4ub20vbGl2ZS8xNjA=&autoplay=false&vast=true'
    },
    {
      id: 'fnjan-backstage',
      name: 'فنجان — كواليس برامج ثمانية',
      group: 'بودكاست',
      embed: 'https://www.youtube.com/embed/sqv44Msl6rg?playsinline=1&autoplay=0',
      kind: 'حلقة مسجلة'
    },
    {
      id: 'fnjan-sudan',
      name: 'فنجان — السودان',
      group: 'بودكاست',
      embed: 'https://www.youtube.com/embed/sNdpKc9kjHM?playsinline=1&autoplay=0',
      kind: 'حلقة مسجلة'
    },
    {
      id: 'live-5',
      name: 'إثراء',
      group: 'دين',
      stream: 'https://kwtethta.cdn.mangomolo.com/eth/smil:eth.stream.smil/chunklist.m3u8'
    },
    {
      id: 'live-11',
      name: 'البحرين قرآن كريم',
      group: 'دين',
      stream: 'https://5c7b683162943.streamlock.net/live/ngrp:bahrainquran_all/playlist.m3u8'
    },
    {
      id: 'test-hyatv-eg',
      name: 'هي TV',
      group: 'ترفيه',
      stream: 'https://freem3u.xyz/api/live/play.m3u8?vid=187',
      sourceId: 'HyaTV.eg@SD',
      kind: 'بث تجريبي'
    },
    {
      id: 'test-ifilmarabic-ir',
      name: 'آي فيلم عربي',
      group: 'مسلسلات',
      stream: 'https://live.presstv.co.uk/hls/ifilmar.m3u8',
      sourceId: 'iFilmArabic.ir@SD',
      kind: 'بث تجريبي'
    },
    {
      id: 'test-jordansport-jo',
      name: 'الأردن الرياضية',
      group: 'رياضة',
      stream: 'https://jrtv-live.ercdn.net/jordansporthd/jordansporthd.m3u8',
      sourceId: 'JordanSport.jo@SD',
      kind: 'بث تجريبي · قد يكون محجوبًا ببلدك'
    },
    {
      id: 'test-mixhollywood-eg',
      name: 'Mix Hollywood',
      group: 'أفلام',
      stream: 'https://ml-pull-hwc.myco.io/MixTV/hls/index.m3u8',
      sourceId: 'MixHollywood.eg@SD',
      kind: 'بث تجريبي'
    },
    {
      id: 'test-prime-sy',
      name: 'Prime السورية',
      group: 'برامج',
      stream: 'https://cdn.bestream.io/prime/prime.m3u8',
      sourceId: 'Prime.sy@HD',
      kind: 'بث تجريبي · عامة ورياضة'
    },
    {
      id: 'extra-roya',
      name: 'رؤيا الأردنية',
      group: 'برامج',
      stream: 'https://live.kwikmotion.com/royatvpublic/royatv.smil/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'extra-spacetoon',
      name: 'سبيستون',
      group: 'أطفال',
      stream: 'https://live-uae-next.spacetoongo.com/ST_MENA_NEXT/hls/r9p2hjipmw2kl.m3u8',
      kind: 'بث تجريبي · قد يمنع المصدر التشغيل داخل الشات'
    },
    {
      id: 'extra-aghani-aghani',
      name: 'أغاني أغاني',
      group: 'أغاني',
      stream: 'https://cdn.streamlane.tv/hls/aghanitv/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'extra-alarabiya',
      name: 'العربية',
      group: 'أخبار',
      stream: 'https://live.alarabiya.net/alarabiapublish/alarabiya.smil/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-alhurra-iraq',
      name: 'الحرة عراق',
      group: 'أخبار',
      stream: 'https://mbnvvideoingest-i.akamaihd.net/hls/live/1004674/MBNV_ALHURRA_IRAQ/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-alhurra',
      name: 'الحرة',
      group: 'أخبار',
      stream: 'https://mbnvvideoingest-i.akamaihd.net/hls/live/1004673/MBNV_ALHURRA_MAIN/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-iraqiya',
      name: 'العراقية',
      group: 'برامج',
      stream: 'https://cdn.catiacast.video/abr/8d2ffb0aba244e8d9101a9488a7daa05/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-rafidain',
      name: 'الرافدين',
      group: 'أخبار',
      stream: 'https://cdg8.edge.technocdn.com/arrafidaintv/abr_live/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-rasheed',
      name: 'الرشيد',
      group: 'برامج',
      stream: 'https://media1.livaat.com/AL-RASHEED-HD/tracks-v1a1/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-sharqiya-news',
      name: 'الشرقية نيوز',
      group: 'أخبار',
      stream: 'https://5d94523502c2d.streamlock.net/alsharqiyalive/mystream/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-sharqiya',
      name: 'الشرقية',
      group: 'برامج',
      stream: 'https://5d94523502c2d.streamlock.net/home/mystream/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-dijlah-tarab',
      name: 'دجلة طرب',
      group: 'أغاني',
      stream: 'https://ghaasiflu.online/tarab/tracks-v1a1/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-dijlah',
      name: 'دجلة',
      group: 'برامج',
      stream: 'https://ghaasiflu.online/Dijlah/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-inews',
      name: 'آي نيوز',
      group: 'أخبار',
      stream: 'https://live.i-news.tv/hls/stream.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-iraq-future',
      name: 'عراق المستقبل',
      group: 'برامج',
      stream: 'https://viewmedia7219.bozztv.com/wmedia/viewmedia100/web_040/Stream/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-zagros',
      name: 'زاغروس',
      group: 'برامج',
      stream: 'https://5a3ed7a72ed4b.streamlock.net/zagrostv/SMIL:myStream.smil/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-alabbassia',
      name: 'العباسية',
      group: 'برامج',
      stream: 'https://stream.alabbassia.com/live/alabbassia/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-ghad-plus',
      name: 'الغد بلس',
      group: 'أخبار',
      stream: 'https://playlist.fasttvcdn.com/pl/ykvm3f2fhokwxqsurp9xcg/alghad-plus/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-ghad',
      name: 'الغد',
      group: 'أخبار',
      stream: 'https://eazyvwqssi.erbvr.com/alghadtv/alghadtv.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-qahera-news',
      name: 'القاهرة الإخبارية',
      group: 'أخبار',
      stream: 'https://bcovlive-a.akamaihd.net/d30cbb3350af4cb7a6e05b9eb1bfd850/eu-west-1/6057955906001/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-mbc-masr-2',
      name: 'MBC مصر 2',
      group: 'برامج',
      stream: 'https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-masr-2/754931856515075b0aabf0e583495c68/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-watan',
      name: 'وطن',
      group: 'برامج',
      stream: 'https://rp.tactivemedia.com/watantv_source/live/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-aghapy',
      name: 'أغابي',
      group: 'دين',
      stream: 'https://5b622f07944df.streamlock.net/aghapy.tv/aghapy.smil/playlist.m3u8',
      kind: 'بث تجريبي · مسيحية'
    },
    {
      id: 'ftv-alhayat',
      name: 'الحياة المسيحية',
      group: 'دين',
      stream: 'https://cdn3.wowza.com/5/OE5HREpIcEkySlNT/alhayat-live/ngrp:livestream_all/playlist.m3u8',
      kind: 'بث تجريبي · مسيحية'
    },
    {
      id: 'ftv-coptic',
      name: 'CTV القبطية',
      group: 'دين',
      stream: 'https://ctv.icopts.app/CTV/index.fmp4.m3u8',
      kind: 'بث تجريبي · مسيحية'
    },
    {
      id: 'ftv-koogi',
      name: 'كوجي',
      group: 'أطفال',
      stream: 'https://5d658d7e9f562.streamlock.net/koogi.tv/koogi.smil/playlist.m3u8',
      kind: 'بث تجريبي · أطفال ومحتوى مسيحي'
    },
    {
      id: 'ftv-mtv-lebanon',
      name: 'MTV اللبنانية',
      group: 'برامج',
      stream: 'https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mtv-lebanon/b8ebb2a5affb812f1541712adde10e26/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-tele-liban',
      name: 'تلفزيون لبنان',
      group: 'برامج',
      stream: 'https://cdn.catiacast.video/abr/ed8f807e2548db4507d2a6f4ba0c4a06/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-manar',
      name: 'المنار',
      group: 'أخبار',
      stream: 'https://edge.fastpublish.me/live/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-mayadeen',
      name: 'الميادين',
      group: 'أخبار',
      stream: 'https://mdnlv.cdn.octivid.com/almdn/smil:mpegts.stream.smil/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-voice-lebanon',
      name: 'صوت لبنان',
      group: 'برامج',
      stream: 'https://svs.itworkscdn.net/vdltvlive/vdltv.smil/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-noursat',
      name: 'نورسات',
      group: 'دين',
      stream: 'https://svs.itworkscdn.net/nour4satlive/livestream/playlist.m3u8',
      kind: 'بث تجريبي · مسيحية'
    },
    {
      id: 'ftv-nour-koddas',
      name: 'نور القداس',
      group: 'دين',
      stream: 'https://svs.itworkscdn.net/nour1satlive/livestream/playlist.m3u8',
      kind: 'بث تجريبي · مسيحية'
    },
    {
      id: 'ftv-nour-sharq',
      name: 'نور الشرق',
      group: 'دين',
      stream: 'https://svs.itworkscdn.net/nour8satlive/livestream/playlist.m3u8',
      kind: 'بث تجريبي · مسيحية'
    },
    {
      id: 'ftv-aliman',
      name: 'الإيمان',
      group: 'دين',
      stream: 'https://svs.itworkscdn.net/alimanlive/imantv.smil/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-falestinona',
      name: 'فلسطيننا',
      group: 'برامج',
      stream: 'https://ffs3.gulfsat.com/Falestinona-TV/index.fmp4.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-qatar-1',
      name: 'قطر',
      group: 'برامج',
      stream: 'https://qatartv.akamaized.net/hls/live/20000609/qtv1/master.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-qatar-2',
      name: 'قطر 2',
      group: 'برامج',
      stream: 'https://qatartv.akamaized.net/hls/live/20000611/qtv2/master.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-qatar-quran',
      name: 'قطر القرآن الكريم',
      group: 'دين',
      stream: 'https://qatartv.akamaized.net/hls/live/20000612/qtvquran/master1080p.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-rayyan',
      name: 'الريان',
      group: 'برامج',
      stream: 'https://alrayyancdn.vidgyor.com/pub-noalrayy3pwz0l/liveabr/playlist_dvr.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-aj-mubasher',
      name: 'الجزيرة مباشر',
      group: 'أخبار',
      stream: 'https://live-hls-web-ajm.getaj.net/AJM/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-aj-2',
      name: 'الجزيرة 2',
      group: 'أخبار',
      stream: 'https://live-hls-web-aja2-gcp.thehlive.com/AJA2/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-alaraby',
      name: 'التلفزيون العربي',
      group: 'أخبار',
      stream: 'https://live.kwikmotion.com/alaraby1live/alaraby_abr/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-saudiya',
      name: 'السعودية',
      group: 'برامج',
      stream: 'https://shd-gcp-live.edgenextcdn.net/live/bitmovin-saudi-tv/2ad66056b51fd8c1b624854623112e43/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-thikrayat',
      name: 'ذكريات',
      group: 'برامج',
      stream: 'https://shd-gcp-live.edgenextcdn.net/live/bitmovin-thikrayat/8cfa8fe0c96275735745b89c683b27e3/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-ekhbariya',
      name: 'الإخبارية السعودية',
      group: 'أخبار',
      stream: 'https://shd-gcp-live.edgenextcdn.net/live/bitmovin-al-ekhbaria/297b3ef1cd0633ad9cfba7473a686a06/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-saudi-now',
      name: 'السعودية الآن',
      group: 'برامج',
      stream: 'https://shd-gcp-live.edgenextcdn.net/live/bitmovin-ksa-now/71ed3aa814c643306c0a8bc4fcc7d17f/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-saudi-quran',
      name: 'القرآن الكريم السعودية',
      group: 'دين',
      stream: 'https://al-ekhbaria-prod-dub.shahid.net/out/v1/9885cab0a3ec4008b53bae57a27ca76b/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-rotana-classic-alt',
      name: 'روتانا كلاسيك',
      group: 'أفلام',
      stream: 'https://bcovlive-a.akamaihd.net/0debf5648e584e5fb795c3611c5c0252/eu-central-1/6057955906001/playlist.m3u8',
      kind: 'بث تجريبي · رابط بديل'
    },
    {
      id: 'ftv-rotana-clip',
      name: 'روتانا كليب',
      group: 'أغاني',
      stream: 'https://rotana.hibridcdn.net/rotananet/clip_net-7Y83PP5adWixDF93/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-alarabiya-business',
      name: 'العربية Business',
      group: 'اقتصاد',
      stream: 'https://live.alarabiya.net/alarabiapublish/aswaaq.smil/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-mbc-5',
      name: 'MBC 5',
      group: 'برامج',
      stream: 'https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-5/ee6b000cee0629411b666ab26cb13e9b/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-wanasah',
      name: 'وناسة',
      group: 'أغاني',
      stream: 'https://shd-gcp-live.edgenextcdn.net/live/bitmovin-wanasah/13e82ea6232fa647c43b26e8a41f173d/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-baynounah',
      name: 'بينونة',
      group: 'برامج',
      stream: 'https://vo-live.cdb.cdn.orange.com/Content/Channel/Baynounah/HLS/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-ajman',
      name: 'عجمان',
      group: 'برامج',
      stream: 'https://cdn1.logichost.in/ajmantv/live/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-alaan',
      name: 'الآن',
      group: 'برامج',
      stream: 'https://shls-live-ak.akamaized.net/out/v1/dfbdea4c1bf149629764e58c6ff314c8/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-dubai',
      name: 'دبي',
      group: 'برامج',
      stream: 'https://dmisxthvll.cdn.mgmlcdn.com/dubaitvht/smil:dubaitv.stream.smil/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-dubai-zaman',
      name: 'دبي زمان',
      group: 'برامج',
      stream: 'https://dmiffthvll.cdn.mangomolo.com/dubaizaman/smil:dubaizaman.stream.smil/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-sama-dubai',
      name: 'سما دبي',
      group: 'برامج',
      stream: 'https://dmieigthvll.cdn.mgmlcdn.com/samadubaiht/smil:samadubai.stream.smil/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-noor-dubai',
      name: 'نور دبي',
      group: 'دين',
      stream: 'https://dmiffthvll.cdn.mangomolo.com/noordubaitv/smil:noordubaitv.smil/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-sharjah',
      name: 'الشارقة',
      group: 'برامج',
      stream: 'https://live.kwikmotion.com/smc1live/smc1tv.smil/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-alwousta',
      name: 'الوسطى',
      group: 'برامج',
      stream: 'https://svs.itworkscdn.net/alwoustalive/alwoustatv.smil/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-hadath',
      name: 'الحدث',
      group: 'أخبار',
      stream: 'https://live.alarabiya.net/alarabiapublish/alhadath.smil/alarabiapublish/alhadath_1080p/chunks.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-dw-arabic',
      name: 'DW عربية',
      group: 'أخبار',
      stream: 'https://dwamdstream103.akamaized.net/hls/live/2015526/dwstream103/index.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-cgtn-arabic',
      name: 'CGTN العربية',
      group: 'أخبار',
      stream: 'https://arabic-livews.cgtn.com/hls/LSveq57bErWLinBnxosqjisZ220802LSTefTAS9zc9mpU08y3np9TH220802cd/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-rt-arabic',
      name: 'RT عربية',
      group: 'أخبار',
      stream: 'https://rt-arb.rttv.com/dvr/rtarab/playlist.m3u8',
      kind: 'بث تجريبي'
    },
    {
      id: 'ftv-sahara-24',
      name: 'صحراء 24',
      group: 'أخبار',
      stream: 'https://live.saharamedias.net:3317/live/shara24live.m3u8',
      kind: 'بث تجريبي'
    }
  ];

  var pane = null;
  var button = null;
  var host = null;
  var bar = null;

  var observer = null;
  var resizeObserver = null;
  var mountTimer = null;

  var fitFrame = null;
  var floatFrame = null;
  var openTimer = null;

  var visibilityTimer = null;
  var mediaDeadline = null;

  var hls = null;
  var hlsPromise = null;
  var generation = 0;

  var floatBox = null;
  var dockMarker = null;
  var dragging = null;

  var selected = null;
  var group = 'الكل';
  var dead = false;
  var expanded = false;
  var lastBarWidth = -1;

  var HLS_SCRIPT =
    'https://cdn.jsdelivr.net/npm/hls.js@1.6.13/dist/hls.min.js';

  function q(selector) {
    return (
      (pane && pane.querySelector(selector)) ||
      (floatBox && floatBox.querySelector(selector))
    );
  }

  function message(text) {
    var node = q('[data-tv-status]');
    if (node && node.textContent !== text) {
      node.textContent = text;
    }
  }

  function stop(text) {
    generation++;

    clearTimeout(mediaDeadline);
    clearInterval(visibilityTimer);

    mediaDeadline = null;
    visibilityTimer = null;

    if (hls) {
      hls.destroy();
      hls = null;
    }

    var video = q('video');

    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.remove();
    }

    var frame = q('iframe');
    if (frame) frame.remove();

    var placeholder = q('[data-tv-placeholder]');
    if (placeholder) placeholder.hidden = false;
    if (text) message(text);
  }

  function loadHls() {
    if (window.Hls) return Promise.resolve(window.Hls);
    if (hlsPromise) return hlsPromise;

    hlsPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      var settled = false;

      var timeout = setTimeout(function () {
        finish(false);
      }, 15000);

      function finish(ok) {
        if (settled) return;

        settled = true;
        clearTimeout(timeout);
        script.onload = null;
        script.onerror = null;

        if (ok && window.Hls) {
          resolve(window.Hls);
        } else {
          script.remove();
          hlsPromise = null;
          reject(new Error('HLS library unavailable'));
        }
      }

      script.async = true;
      script.src = HLS_SCRIPT;
      script.onload = function () {
        finish(true);
      };
      script.onerror = function () {
        finish(false);
      };

      document.head.appendChild(script);
    });

    return hlsPromise;
  }

  function collapse() {
    expanded = false;

    if (host) {
      host.classList.remove('chat-tv-expanded');
    }

    var control = q('[data-tv-expand]');

    if (control) {
      control.textContent = '⤢ تكبير';
      control.setAttribute('aria-pressed', 'false');
    }
  }

  function visible() {
    if (floatBox && floatBox.isConnected) return true;

    if (
      !pane ||
      !pane.isConnected ||
      !pane.classList.contains('active') ||
      !host
    ) {
      return false;
    }

    var style = getComputedStyle(host);

    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      host.getClientRects().length > 0
    );
  }

  function close() {
    stop('تم إيقاف التلفاز');

    if (floatBox) {
      dockScreen();
      return;
    }

    collapse();

    if (typeof window.TH_DPNL_HIDE_TIGERHOST === 'function') {
      window.TH_DPNL_HIDE_TIGERHOST();
    } else if (pane) {
      pane.classList.remove('active');
    }
  }

  function renderChannels() {
    var list = q('[data-tv-channels]');
    if (!list) return;

    var fragment = document.createDocumentFragment();

    channels.forEach(function (channel) {
      if (group !== 'الكل' && channel.group !== group) return;

      var control = document.createElement('button');
      control.type = 'button';
      control.className =
        'btn border ' +
        (selected === channel ? 'label-primary' : 'chat-tv-choice');

      control.dataset.tvChannel = channel.id;
      control.setAttribute(
        'aria-pressed',
        String(selected === channel)
      );

      control.textContent = channel.name;
      control.disabled = !channel.embed && !channel.stream;

      var small = document.createElement('small');

      small.textContent = control.disabled
        ? (channel.unavailableReason || 'غير متاحة داخل الشات حاليًا')
        : (channel.kind || 'بث مباشر');

      control.appendChild(small);
      fragment.appendChild(control);
    });

    list.replaceChildren(fragment);
  }

  function select(channel) {
    stop();
    selected = channel;

    q('[data-tv-name]').textContent = channel.name;
    q('[data-tv-start]').disabled = !channel.embed && !channel.stream;
    q('[data-tv-placeholder]').textContent =
      'اضغط «عرض القناة» ثم تشغيل داخل المشغّل';

    message('المشغّل جاهز للتحميل؛ التشغيل والتوفر يخضعان للمصدر.');
    renderChannels();
  }

  function start() {
    if (
      dead ||
      !selected ||
      !(selected.embed || selected.stream) ||
      !visible()
    ) {
      return;
    }

    stop();

    document.querySelectorAll(
      '#settings [data-kr-stop]'
    ).forEach(function (control) {
      control.click();
    });

    var ticket = generation;
    var channel = selected;

    function current() {
      return !dead && generation === ticket;
    }

    function fail(text) {
      if (current()) stop(text);
    }

    var screen = q('[data-tv-screen]');
    q('[data-tv-placeholder]').hidden = true;

    if (channel.embed) {
      var frame = document.createElement('iframe');

      frame.title = channel.name;
      frame.allow =
        'autoplay; fullscreen; picture-in-picture; encrypted-media';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.src = channel.embed;

      frame.addEventListener('error', function () {
        fail('تعذر تحميل المشغل. جرّب قناة أخرى.');
      });

      screen.appendChild(frame);

      message('اضغط تشغيل داخل المشغّل. الصوت والجودة من أدوات القناة.');
    } else {
      var video = document.createElement('video');

      video.controls = true;
      video.playsInline = true;
      video.preload = 'none';

      video.setAttribute('playsinline', '');
      video.setAttribute('aria-label', channel.name);

      video.style.cssText =
        'position:absolute!important;inset:0!important;' +
        'width:100%!important;height:100%!important;' +
        'min-height:0!important;object-fit:contain;' +
        'background:#000;display:block!important';

      screen.appendChild(video);
      message('جارٍ تحميل البث…');

      function playVideo() {
        if (!current()) return;

        try {
          var promise = video.play();

          if (promise && promise.catch) {
            promise.catch(function () {
              if (current()) {
                clearTimeout(mediaDeadline);
                message('اضغط ▶ داخل الفيديو لبدء المشاهدة.');
              }
            });
          }
        } catch (error) {
          if (current()) {
            message('اضغط ▶ داخل الفيديو لبدء المشاهدة.');
          }
        }
      }

      function deadline() {
        clearTimeout(mediaDeadline);

        mediaDeadline = setTimeout(function () {
          fail('تأخر البث. أعد المحاولة أو اختر قناة أخرى.');
        }, 30000);
      }

      video.addEventListener('playing', function () {
        if (current()) {
          clearTimeout(mediaDeadline);
          message('يعمل الآن · مشاهدة شخصية');
        }
      });

      video.addEventListener('waiting', function () {
        if (current()) {
          message('جارٍ تحميل الفيديو…');
          deadline();
        }
      });

      video.addEventListener('pause', function () {
        if (current()) {
          clearTimeout(mediaDeadline);
          message('متوقف مؤقتًا · اضغط تشغيل داخل الفيديو');
        }
      });

      video.addEventListener('error', function () {
        fail('تعذر تشغيل القناة. قد يكون البث متوقفًا أو غير متاح ببلدك.');
      });

      video.addEventListener('ended', function () {
        fail('انتهى البث. اضغط عرض القناة لإعادة الاتصال.');
      });

      deadline();

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = channel.stream;
        playVideo();
      } else {
        loadHls().then(function (Hls) {
          if (!current()) return;

          if (!Hls.isSupported()) {
            fail('هذا المتصفح لا يدعم تشغيل هذه القناة.');
            return;
          }

          hls = new Hls({
            enableWorker: true,
            capLevelToPlayerSize: true,
            maxBufferLength: 20,
            backBufferLength: 30
          });

          var instance = hls;
          var recoveries = 0;

          instance.on(Hls.Events.MEDIA_ATTACHED, function () {
            if (current()) {
              instance.loadSource(channel.stream);
            }
          });

          instance.on(Hls.Events.MANIFEST_PARSED, playVideo);

          instance.on(Hls.Events.ERROR, function (event, data) {
            if (!current() || !data.fatal) return;

            if (
              data.type === Hls.ErrorTypes.MEDIA_ERROR &&
              recoveries++ < 1
            ) {
              instance.recoverMediaError();
            } else {
              fail('تعذر تحميل البث. جرّب قناة أخرى أو أعد المحاولة.');
            }
          });

          instance.attachMedia(video);
        }).catch(function () {
          fail(
            'تعذر تحميل مشغل الفيديو. قد تمنع إعدادات الموقع المكتبة الخارجية.'
          );
        });
      }
    }

    visibilityTimer = setInterval(function () {
      if (!visible()) {
        stop('توقف البث عند مغادرة التلفاز');
        collapse();
      }
    }, 1000);
  }

  function open() {
    if (dead) return;

    if (typeof window.TIGERHOST_DPNL_BTN !== 'function') {
      message('دالة فتح القائمة غير متاحة. أعد المحاولة بعد دخول الشات.');
      return;
    }

    window.TIGERHOST_DPNL_BTN(button, 'chat-tv');
    scheduleFit();

    clearTimeout(openTimer);

    openTimer = setTimeout(function () {
      if (!dead && pane && !pane.classList.contains('active')) {
        message('لم يفعّل القالب تبويب التلفاز.');
      }
    }, 120);
  }

  function fullscreen() {
    var screen = q('[data-tv-screen]');

    if (!screen || !screen.querySelector('iframe,video')) {
      message('اعرض قناة أولًا');
      return;
    }

    var action;

    try {
      if (document.fullscreenElement) {
        action = document.exitFullscreen();
      } else if (screen.requestFullscreen) {
        action = screen.requestFullscreen();
      } else {
        message('استخدم زر ملء الشاشة الموجود داخل مشغّل القناة.');
        return;
      }

      if (action && action.catch) {
        action.catch(function () {
          message('استخدم زر ملء الشاشة الموجود داخل مشغّل القناة.');
        });
      }
    } catch (error) {
      message('استخدم زر ملء الشاشة الموجود داخل مشغّل القناة.');
    }
  }

  function clearBar() {
    if (!bar) return;

    bar.classList.remove('chat-tv-bar', 'chat-tv-tight');

    bar.querySelectorAll('button').forEach(function (control) {
      [
        '--tv-nav-width',
        '--tv-pad-left',
        '--tv-pad-right'
      ].forEach(function (name) {
        control.style.removeProperty(name);
      });
    });
  }

  function mounted() {
    return (
      pane &&
      button &&
      pane.parentNode === host &&
      button.parentNode === bar &&
      host &&
      host.isConnected &&
      bar &&
      bar.isConnected &&
      document.getElementById('dpnl') === host &&
      document.getElementById('d0') === bar
    );
  }

  function mount() {
    if (dead || mounted()) return;

    if (observer) observer.disconnect();
    if (resizeObserver) resizeObserver.disconnect();

    stop();
    dockScreen();
    collapse();

    if (pane) pane.remove();
    if (button) button.remove();

    pane = null;
    button = null;

    clearBar();

    host = document.getElementById('dpnl');
    bar = document.getElementById('d0');

    if (!host || !bar) {
      watchStructure();
      return;
    }

    bar.classList.add('chat-tv-bar');

    button = document.createElement('button');
    button.type = 'button';
    button.id = 'chat-tv-open';
    button.title = 'التلفاز';
    button.className = 'ae label label-primary th-d0-tv';
    button.setAttribute('data-key', 'chat-tv');

    var anchor = bar.querySelector('[data-key="settings"]');

    if (anchor) {
      button.className = anchor.className
        .replace(/fa-gear|fa-cog/g, 'fa-television')
        .replace(/th-d0-settings/g, 'th-d0-tv');

      var appearance = getComputedStyle(anchor);

      ['fontSize', 'lineHeight', 'height', 'borderRadius'].forEach(
        function (property) {
          button.style[property] = appearance[property];
        }
      );
    }

    button.classList.remove('fa', 'fa-television');

    button.innerHTML = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15" height="15" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true" focusable="false"
        style="display:inline-block!important;vertical-align:middle;margin-inline-end:4px;width:15px;height:15px"
      >
        <rect x="3" y="7" width="18" height="13" rx="2"></rect>
        <path d="M8 3l4 4 4-4M9 23h6"></path>
      </svg>تلفاز
    `;

    button.addEventListener('click', open);

    var lineBreak = bar.querySelector('br');
    bar.insertBefore(button, lineBreak || null);

    var paddings = Array.from(
      bar.querySelectorAll('button.ae')
    ).map(function (control) {
      var style = getComputedStyle(control);

      return [
        control,
        Math.max(0, (parseFloat(style.paddingLeft) || 0) - 1),
        Math.max(0, (parseFloat(style.paddingRight) || 0) - 1)
      ];
    });

    paddings.forEach(function (item) {
      item[0].style.setProperty('--tv-pad-left', item[1] + 'px');
      item[0].style.setProperty('--tv-pad-right', item[2] + 'px');
    });

    pane = document.createElement('div');
    pane.id = 'chat-tv';
    pane.className = 'break border light tab-pane';
    pane.dir = 'rtl';
    pane.lang = 'ar';

    pane.innerHTML = `
      <div class="chat-tv-top">
        <strong data-tv-name>اختر قناة</strong>
        <span class="chat-tv-tag">${channels.length} خيار مشاهدة · تجريبي</span>
      </div>

      <div data-tv-screen class="chat-tv-screen">
        <div data-tv-placeholder>اختر قناة من القائمة أدناه</div>
      </div>

      <div class="chat-tv-tools">
        <button type="button"
          class="btn label-primary border"
          data-tv-start disabled>▶ عرض القناة</button>

        <button type="button"
          class="btn border chat-tv-choice"
          data-tv-stop>■ إيقاف</button>

        <button type="button"
          class="btn border chat-tv-choice"
          data-tv-expand aria-pressed="false">⤢ تكبير</button>

        <button type="button"
          class="btn border chat-tv-choice"
          data-tv-full>⛶ ملء الشاشة</button>

        <button type="button"
          class="btn border chat-tv-choice"
          data-tv-float>▣ نافذة عائمة</button>
      </div>

      <p data-tv-status role="status" aria-live="polite">
        اختر قناة ثم اضغط عرض القناة.
      </p>

      <div class="chat-tv-categories" data-tv-categories
        role="group" aria-label="تصنيف القنوات"></div>

      <div data-tv-channels class="chat-tv-channels"></div>

      <p class="chat-tv-help">
        اسحب النافذة العائمة من شريطها العلوي للمشاهدة أثناء
        الكتابة. الصوت والجودة من مشغّل القناة.
      </p>
    `;

    host.appendChild(pane);

    var accent = anchor ? getComputedStyle(anchor).backgroundColor : '';

    if (accent && accent !== 'rgba(0, 0, 0, 0)') {
      pane.style.setProperty('--tv-accent', accent);
    }

    var groups = ['الكل'].concat(
      Array.from(new Set(channels.map(function (channel) {
        return channel.group;
      })))
    );

    groups.forEach(function (name) {
      var control = document.createElement('button');

      control.type = 'button';
      control.textContent = name;
      control.dataset.tvGroup = name;
      control.className =
        'btn border ' +
        (name === group ? 'label-primary' : 'chat-tv-choice');

      control.setAttribute('aria-pressed', String(name === group));
      q('[data-tv-categories]').appendChild(control);
    });

    pane.addEventListener('click', onPaneClick);

    if (selected) select(selected);
    else renderChannels();

    lastBarWidth = -1;
    watchStructure();
    scheduleFit();
  }

  function onPaneClick(event) {
    var control =
      event.target.closest && event.target.closest('button');

    if (!control || !pane.contains(control)) return;

    if (control.hasAttribute('data-tv-channel')) {
      var channel = channels.find(function (item) {
        return item.id === control.dataset.tvChannel;
      });

      if (channel) select(channel);
    } else if (control.hasAttribute('data-tv-group')) {
      group = control.dataset.tvGroup;

      q('[data-tv-categories]').querySelectorAll(
        'button'
      ).forEach(function (item) {
        var active = item.dataset.tvGroup === group;

        item.className =
          'btn border ' + (active ? 'label-primary' : 'chat-tv-choice');

        item.setAttribute('aria-pressed', String(active));
      });

      renderChannels();
    } else if (control.hasAttribute('data-tv-start')) {
      start();
    } else if (control.hasAttribute('data-tv-stop')) {
      stop('تم إيقاف التلفاز');
    } else if (control.hasAttribute('data-tv-full')) {
      fullscreen();
    } else if (control.hasAttribute('data-tv-float')) {
      floatScreen();
    } else if (control.hasAttribute('data-tv-expand')) {
      expanded = !expanded;
      host.classList.toggle('chat-tv-expanded', expanded);
      control.textContent = expanded ? '⤡ تصغير' : '⤢ تكبير';
      control.setAttribute('aria-pressed', String(expanded));

      if (typeof window.fixSize === 'function') {
        window.fixSize();
      }
    }
  }

  function moveScreen(parent, screen, before) {
    if (
      typeof parent.moveBefore === 'function' &&
      screen.isConnected &&
      parent.isConnected
    ) {
      try {
        parent.moveBefore(screen, before || null);
        return;
      } catch (error) {
        // الرجوع إلى النقل المعتاد.
      }
    }

    var video = screen.querySelector('video');
    var resume = video && !video.paused;

    parent.insertBefore(screen, before || null);

    if (resume) {
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    if (screen.querySelector('iframe')) {
      message('إذا توقف الفيديو بعد النقل، اضغط تشغيل داخل المشغّل.');
    }
  }

  function clampFloat() {
    if (!floatBox || dead) return;

    var viewport = window.visualViewport;
    var left = viewport ? viewport.offsetLeft : 0;
    var top = viewport ? viewport.offsetTop : 0;

    var width = viewport
      ? viewport.width
      : document.documentElement.clientWidth;

    var height = viewport ? viewport.height : window.innerHeight;
    var maxWidth = Math.max(100, width - 16) + 'px';

    if (floatBox.style.maxWidth !== maxWidth) {
      floatBox.style.maxWidth = maxWidth;
    }

    var rect = floatBox.getBoundingClientRect();
    var bottom = top + height - 10;

    if (bar && bar.isConnected) {
      var barRect = bar.getBoundingClientRect();

      if (barRect.top > top && barRect.top < bottom) {
        bottom = barRect.top - 48;
      }
    }

    var wantedX = dragging ? dragging.left : rect.left;
    var wantedY = dragging ? dragging.top : rect.top;

    floatBox.style.left = Math.max(
      left + 8,
      Math.min(wantedX, left + width - rect.width - 8)
    ) + 'px';

    floatBox.style.top = Math.max(
      top + 8,
      Math.min(wantedY, bottom - rect.height)
    ) + 'px';
  }

  function scheduleFloat() {
    if (dead || !floatBox || floatFrame !== null) return;

    floatFrame = requestAnimationFrame(function () {
      floatFrame = null;
      clampFloat();
    });
  }

  function dockScreen() {
    if (!floatBox) return;

    if (floatFrame !== null) {
      cancelAnimationFrame(floatFrame);
    }

    floatFrame = null;
    dragging = null;

    var screen = floatBox.querySelector('[data-tv-screen]');

    if (screen) {
      ['min-height', 'height', 'aspect-ratio', 'padding'].forEach(
        function (property) {
          screen.style.removeProperty(property);
        }
      );

      if (pane && pane.isConnected) {
        moveScreen(
          pane,
          screen,
          dockMarker && dockMarker.parentNode === pane ? dockMarker : null
        );
      }
    }

    floatBox.remove();
    floatBox = null;

    if (dockMarker) {
      dockMarker.remove();
      dockMarker = null;
    }

    var control = q('[data-tv-float]');
    if (control) control.textContent = '▣ نافذة عائمة';
  }

  function floatScreen() {
    if (floatBox) {
      dockScreen();
      return;
    }

    var screen = q('[data-tv-screen]');

    if (!screen || !screen.querySelector('iframe,video')) {
      message('اعرض قناة أولًا، ثم اختر نافذة عائمة.');
      return;
    }

    if (document.fullscreenElement) {
      message('اخرج من ملء الشاشة أولًا.');
      return;
    }

    collapse();

    dockMarker = document.createElement('div');
    dockMarker.className = 'chat-tv-dock-marker';
    dockMarker.textContent =
      'القناة تعمل بالنافذة العائمة. اضغط «إرجاع الشاشة» لاستعادتها هنا.';

    pane.insertBefore(dockMarker, screen);

    floatBox = document.createElement('section');
    floatBox.id = 'chat-tv-floating';
    floatBox.dir = 'rtl';
    floatBox.setAttribute('aria-label', 'نافذة التلفاز العائمة');

    var accent = pane.style.getPropertyValue('--tv-accent');

    if (accent) {
      floatBox.style.setProperty('--tv-accent', accent);
    }

    floatBox.innerHTML = `
      <div class="tv-float-head">
        <strong>التلفاز · اسحب هنا</strong>
        <div>
          <button type="button" data-float-size title="تغيير الحجم">⤢</button>
          <button type="button" data-float-dock title="إرجاع للقائمة">↩</button>
          <button type="button" data-float-close title="إغلاق وإيقاف">×</button>
        </div>
      </div>
    `;

    document.body.appendChild(floatBox);
    moveScreen(floatBox, screen, null);

    screen.style.setProperty('min-height', '0', 'important');
    screen.style.setProperty('height', '0', 'important');
    screen.style.setProperty('aspect-ratio', 'auto', 'important');
    screen.style.setProperty('padding', '0 0 56.25%', 'important');

    floatBox.style.left = '16px';
    floatBox.style.top = '80px';

    scheduleFloat();
    q('[data-tv-float]').textContent = '↩ إرجاع الشاشة';

    floatBox.querySelector('[data-float-dock]').addEventListener(
      'click',
      function () {
        dockScreen();
        open();
      }
    );

    floatBox.querySelector('[data-float-close]').addEventListener(
      'click',
      function () {
        stop('تم إيقاف التلفاز');
        dockScreen();
      }
    );

    floatBox.querySelector('[data-float-size]').addEventListener(
      'click',
      function () {
        floatBox.classList.toggle('tv-float-small');
        scheduleFloat();
      }
    );

    var handle = floatBox.querySelector('.tv-float-head');

    handle.addEventListener('pointerdown', function (event) {
      if (event.target.closest('button') || event.button !== 0) return;

      var rect = floatBox.getBoundingClientRect();

      dragging = {
        id: event.pointerId,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        left: rect.left,
        top: rect.top
      };

      handle.setPointerCapture(event.pointerId);
      floatBox.classList.add('tv-float-dragging');
      event.preventDefault();
    });

    handle.addEventListener('pointermove', function (event) {
      if (!dragging || dragging.id !== event.pointerId || !floatBox) return;

      dragging.left = event.clientX - dragging.x;
      dragging.top = event.clientY - dragging.y;

      scheduleFloat();
    });

    function finish() {
      if (dragging && floatBox) clampFloat();

      dragging = null;

      if (floatBox) {
        floatBox.classList.remove('tv-float-dragging');
      }
    }

    handle.addEventListener('pointerup', finish);
    handle.addEventListener('pointercancel', finish);
    handle.addEventListener('lostpointercapture', finish);

    if (typeof window.TH_DPNL_HIDE_TIGERHOST === 'function') {
      window.TH_DPNL_HIDE_TIGERHOST();
    }
  }

  function fitBar() {
    if (dead || !bar || !bar.isConnected || bar.clientWidth <= 0) return;

    bar.classList.remove('chat-tv-tight');

    var buttons = Array.from(bar.children).filter(function (node) {
      return node.tagName === 'BUTTON';
    });

    buttons.forEach(function (control) {
      control.style.removeProperty('--tv-nav-width');
    });

    var computed = getComputedStyle(bar);

    var available =
      bar.clientWidth -
      (parseFloat(computed.paddingLeft) || 0) -
      (parseFloat(computed.paddingRight) || 0);

    var fixed = 0;
    var flexible = 0;

    var widths = buttons.map(function (control) {
      var style = getComputedStyle(control);

      if (style.display === 'none') return null;

      var margin =
        (parseFloat(style.marginLeft) || 0) +
        (parseFloat(style.marginRight) || 0);

      var width = control.getBoundingClientRect().width;

      if (control.classList.contains('ae')) {
        flexible += width + margin;
      } else {
        fixed += width + margin;
      }

      return {
        button: control,
        width: width,
        margin: margin
      };
    }).filter(Boolean);

    if (available > 0 && flexible > 0 && fixed + flexible > available) {
      var ratio = Math.max(0, (available - fixed - 2) / flexible);

      widths.forEach(function (item) {
        if (item.button.classList.contains('ae')) {
          item.button.style.setProperty(
            '--tv-nav-width',
            Math.max(
              0,
              (item.width + item.margin) * ratio - item.margin
            ) + 'px'
          );
        }
      });

      bar.classList.add('chat-tv-tight');
    }
  }

  function scheduleFit() {
    if (dead || fitFrame !== null) return;

    fitFrame = requestAnimationFrame(function () {
      fitFrame = null;
      fitBar();
    });
  }

  function schedule(records) {
    if (dead) return;

    if (mounted()) {
      if (records && records.some(function (record) {
        return record.target === bar;
      })) {
        scheduleFit();
      }

      return;
    }

    if (mountTimer !== null) return;

    mountTimer = setTimeout(function () {
      mountTimer = null;
      mount();
    }, 150);
  }

  function watchStructure() {
    if (dead || !observer) return;

    observer.disconnect();

    if (resizeObserver) {
      resizeObserver.disconnect();
    }

    if (!mounted()) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      return;
    }

    var watched = new Set();

    [host, bar].forEach(function (node) {
      while (node && node.nodeType === 1) {
        if (!watched.has(node)) {
          observer.observe(node, { childList: true });
          watched.add(node);
        }
        node = node.parentElement;
      }
    });

    if (resizeObserver) {
      resizeObserver.observe(bar);
    }
  }

  function onClick(event) {
    var target = event.target;
    if (!target || !target.closest) return;

    var logout = target.closest('#settings .SERT');

    if (logout || target.closest('#dpnl .th-dpnl-close')) {
      if (logout) {
        stop('تم إيقاف التلفاز');
        dockScreen();
      } else if (!floatBox) {
        stop('تم إيقاف التلفاز');
      }

      collapse();
    }

    var navigation = target.closest('#d0 [data-key]');

    if (navigation && navigation !== button) {
      if (!floatBox) {
        stop('توقف البث عند مغادرة التلفاز');
      }
      collapse();
    }

    if (navigation) scheduleFit();

    if (target.closest('#settings [data-kr-play]')) {
      stop('توقف التلفاز عند تشغيل الراديو');
    }
  }

  function onKey(event) {
    if (
      event.key === 'Escape' &&
      visible() &&
      !document.fullscreenElement
    ) {
      close();
    }
  }

  function stopOnHide() {
    stop('تم إيقاف التلفاز');
    collapse();
  }

  function init() {
    if (dead || !document.body) return;

    installTVStyle();
    observer = new MutationObserver(schedule);

    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver(function (entries) {
        var width = entries[0].contentRect.width;

        if (Math.abs(width - lastBarWidth) > .5) {
          lastBarWidth = width;
          scheduleFit();
        }
      });
    }

    mount();
  }

  function destroy() {
    dead = true;

    clearTimeout(mountTimer);
    clearTimeout(openTimer);

    if (fitFrame !== null) cancelAnimationFrame(fitFrame);
    if (floatFrame !== null) cancelAnimationFrame(floatFrame);

    if (observer) observer.disconnect();
    if (resizeObserver) resizeObserver.disconnect();

    stop();
    dockScreen();
    collapse();

    if (pane) pane.remove();
    if (button) button.remove();

    clearBar();

    document.removeEventListener('click', onClick, true);
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('DOMContentLoaded', init);

    window.removeEventListener('pagehide', stopOnHide);
    window.removeEventListener('resize', scheduleFit);
    window.removeEventListener('resize', scheduleFloat);

    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', scheduleFloat);
      window.visualViewport.removeEventListener('scroll', scheduleFloat);
    }
  }

  window[KEY] = { destroy: destroy };

  document.addEventListener('click', onClick, true);
  document.addEventListener('keydown', onKey);

  window.addEventListener('pagehide', stopOnHide);
  window.addEventListener('resize', scheduleFit);
  window.addEventListener('resize', scheduleFloat);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleFloat);
    window.visualViewport.addEventListener('scroll', scheduleFloat);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
