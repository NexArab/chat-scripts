
(function () {
    "use strict";

    /*
       SAUDI BLACK EMERALD PROFILE V1
       تصميم سعودي زمردي للعضوة: ⠀ˢʰ
       مستقل تماماً عن تصاميم SH وإستبرق
    */

    const TARGET_NAME = "\u2800\u02E2\u02B0";
    const BODY_CLASS = "saudi-emerald-profile";
    const SCOPE_CLASS = "saudi-emerald-scope";
    const STYLE_ID = "saudi-emerald-style";
    const EMBLEM_CLASS = "saudi-emerald-emblem";

    function isTarget(profile) {
        if (!profile) return false;

        const name = profile.querySelector(
            ".th-upro-profile-name"
        );

        if (!name) return false;

        return name.textContent.replace(
            /^[ \t\r\n]+|[ \t\r\n]+$/g,
            ""
        ) === TARGET_NAME;
    }

    function getScope(profile) {
        const modal = profile.closest(".modal");
        if (modal) return modal;

        let el = profile.parentElement;

        while (
            el &&
            el !== document.body &&
            el !== document.documentElement
        ) {
            if (
                el.querySelector(".th-upro-header") &&
                el.querySelector(".th-upro-pro")
            ) {
                return el;
            }

            el = el.parentElement;
        }

        return profile;
    }

    /* شعار زخرفي مرسوم، وليس تغييراً لشعار رسمي */

    function emblemHTML() {
        return `
        <span class="${EMBLEM_CLASS}"
              aria-hidden="true">
          <svg viewBox="0 0 140 105"
               xmlns="http://www.w3.org/2000/svg"
               fill="none">

            <g stroke="currentColor"
               stroke-width="3"
               stroke-linecap="round"
               stroke-linejoin="round">

              <!-- سعف النخلة -->

              <path d="M70 16
                       Q46 0 14 25
                       Q46 20 68 36"/>

              <path d="M70 16
                       Q94 0 126 25
                       Q94 20 72 36"/>

              <path d="M69 20
                       Q47 -2 35 6
                       Q55 12 69 35"/>

              <path d="M71 20
                       Q93 -2 105 6
                       Q85 12 71 35"/>

              <path d="M70 26
                       Q53 7 47 18"/>

              <path d="M70 26
                       Q87 7 93 18"/>

              <!-- جذع النخلة -->

              <path d="M70 34V70"/>
              <path d="M65 42H75
                       M65 51H75
                       M65 60H75"/>

              <!-- السيفان المتقاطعان -->

              <path d="M18 75
                       Q57 99 117 80"/>

              <path d="M122 75
                       Q83 99 23 80"/>

              <path d="M18 75L10 69
                       M122 75L130 69"/>

              <path d="M34 79L29 87
                       M106 79L111 87"/>

            </g>
          </svg>
        </span>`;
    }

    function addStyles() {
        const old = document.getElementById(STYLE_ID);
        if (old) old.remove();

        const style = document.createElement("style");
        style.id = STYLE_ID;

        style.textContent = `

        /* ==============================
           الهوية الزمردية
           ============================== */

        .saudi-emerald-scope {
            --se-dark: #0C1F1B;
            --se-green: #143D31;
            --se-green-light: #245944;
            --se-gold: #D6BD83;
            --se-ivory: #F5EAD0;
            --se-border: #517A61;
        }

        /* الشريط العلوي */

        .saudi-emerald-scope .th-upro-header {
            background:
                linear-gradient(
                    135deg,
                    #0C1F1B,
                    #1A4939
                ) !important;

            border: 0 !important;
            border-bottom:
                2px solid #BCA46E !important;

            color: #F5EAD0 !important;
            box-shadow: none !important;
            padding: 7px 9px !important;
        }

        .saudi-emerald-scope
        .th-upro-header .th-upro-title {
            color: #F5EAD0 !important;
            font-size: 12px !important;
            font-weight: 800 !important;
        }

        .saudi-emerald-scope
        .th-upro-title img {
            vertical-align: middle !important;
            border-radius: 5px !important;
            margin-left: 4px !important;
        }

        .saudi-emerald-scope
        .th-upro-header .clickable.badge {
            background: #23513E !important;
            color: #F5EAD0 !important;

            border: 1px solid #BCA46E !important;
            border-radius: 6px !important;
            box-shadow: none !important;
        }

        .saudi-emerald-scope
        .th-upro-header .fa-times {
            color: #F5EAD0 !important;
        }

        /* جسم البروفايل */

        .th-upro-pro.saudi-emerald-profile {
            background: #102B23 !important;
            color: #F5EAD0 !important;

            border: 1px solid #6F865B !important;
            border-radius: 12px !important;

            box-shadow:
                0 4px 16px rgba(4,25,17,.20)
                !important;
        }

        .saudi-emerald-profile
        .th-upro-profile-container {
            background: #102B23 !important;
            border-radius: 10px !important;
        }

        /* الغلاف وصورة العضوة الأصلية */

        .saudi-emerald-profile .th-upro-cover {
            border-bottom:
                3px solid #D6BD83 !important;
        }

        .saudi-emerald-profile .th-upro-picture {
            border: 3px solid #D6BD83 !important;
            border-radius: 50% !important;

            box-shadow:
                0 0 0 3px rgba(255,255,255,.88),
                0 4px 12px rgba(0,0,0,.22)
                !important;
        }

        /* الاسم */

        .saudi-emerald-profile
        .th-upro-profile-content {
            background: #14382D !important;
            border-bottom:
                1px solid #54765C !important;
            padding-bottom: 7px !important;
        }

        .saudi-emerald-profile
        .th-upro-profile-name {
            color: #F6E5BC !important;
            font-size: 18px !important;
            font-weight: 800 !important;
            line-height: 1.65 !important;

            text-shadow:
                0 1px 3px rgba(0,0,0,.25)
                !important;
        }

        .saudi-emerald-profile
        .th-upro-name-wrap::before,
        .saudi-emerald-profile
        .th-upro-name-wrap::after {
            content: "✦";
            color: #D6BD83;
            font-size: 13px;
            margin: 0 6px;
        }

        /* ==============================
           النخلة والسيفان داخل البروفايل
           ============================== */

        .saudi-emerald-profile
        .saudi-emerald-emblem {
            display: block;
            width: 114px;
            height: 91px;

            margin: 5px auto 8px;
            padding: 5px;

            color: #E1CA91;

            background:
                radial-gradient(
                    circle,
                    #245944 0%,
                    #123226 75%
                );

            border: 1px solid #BCA46E;
            border-radius: 45%;

            box-shadow:
                inset 0 1px 5px rgba(255,255,255,.10),
                0 2px 8px rgba(0,0,0,.18);

            box-sizing: border-box;
            pointer-events: none;
        }

        .saudi-emerald-profile
        .saudi-emerald-emblem svg {
            display: block;
            width: 100%;
            height: 100%;
        }

        /* المشاهدات والنقاط */

        .saudi-emerald-profile .thProfileStat {
            background: #194334 !important;

            border: 1px solid #557F62 !important;
            border-radius: 9px !important;

            box-shadow: none !important;
        }

        .saudi-emerald-profile .thProfileStatShine,
        .saudi-emerald-profile .NUMBER_TH,
        .saudi-emerald-profile .thProfilePointsNum {
            color: #F5EAD0 !important;
            font-weight: 700 !important;
        }

        .saudi-emerald-profile .thProfileEye {
            color: #A5D4B4 !important;
        }

        .saudi-emerald-profile .thProfilePointsIcon {
            color: #D6BD83 !important;
        }

        /* الدولة والعلم */

        .saudi-emerald-profile
        .th-upro-meta-label {
            background: #102B23 !important;
        }

        .saudi-emerald-profile .th-upro-co {
            background: #1C4637 !important;
            color: #F5EAD0 !important;

            border: 1px solid #6B8C69 !important;
            border-radius: 8px !important;

            padding: 3px 6px !important;

            font-size: 10px !important;
            font-weight: 700 !important;
        }

        .saudi-emerald-profile .th-upro-co img {
            max-width: 27px !important;
            width: auto !important;
            height: auto !important;

            background: #FFFFFF !important;
            padding: 2px !important;
            margin: 0 3px !important;

            border: 1px solid #D6BD83 !important;
            border-radius: 5px !important;
        }

        /* زر الغرفة */

        .saudi-emerald-profile
        .th-upro-meta-label .roomh {
            background:
                linear-gradient(
                    145deg,
                    #1D4A39,
                    #103126
                ) !important;

            color: #F5EAD0 !important;

            border: 1px solid #BCA46E !important;
            border-radius: 8px !important;

            padding: 3px 6px !important;

            font-size: 10px !important;
            font-weight: 700 !important;

            text-shadow: none !important;
            box-shadow: none !important;
        }

        .saudi-emerald-profile
        .th-upro-meta-label .roomh img {
            max-width: 24px !important;
            max-height: 24px !important;

            width: auto !important;
            height: auto !important;

            margin-left: 4px !important;
            vertical-align: middle !important;
            border-radius: 5px !important;
        }

        /* النبذة */

        .saudi-emerald-profile .th-upro-bio {
            background: #1B4335 !important;
            color: #E7EBD7 !important;

            border: 1px solid #557C60 !important;
            border-right:
                3px solid #D6BD83 !important;

            border-radius: 8px !important;
            padding: 8px !important;
            line-height: 1.65 !important;

            box-shadow: none !important;
        }

        /* الألعاب */

        .saudi-emerald-profile .th-upro-game-xo,
        .saudi-emerald-profile .th-upro-game-ludo {
            background: #24513F !important;
            color: #F5EAD0 !important;

            border: 1px solid #749375 !important;
            border-radius: 8px !important;

            font-weight: 700 !important;
            box-shadow: none !important;
        }

        /* ==============================
           أزرار البروفايل 3 بكل صف
           ============================== */

        .th-upro-pro.saudi-emerald-profile
        > center > a.th-upro-action,
        .th-upro-pro.saudi-emerald-profile
        > center > a.th-upro-action-no-margin {
            float: left !important;

            width: calc(33.333333% - 6px)
                !important;

            min-width: 0 !important;

            height: 36px !important;
            min-height: 36px !important;

            box-sizing: border-box !important;

            margin: 2px 3px !important;
            padding: 5px 2px !important;

            background:
                linear-gradient(
                    145deg,
                    #1D493A,
                    #15352A
                ) !important;

            border: 1px solid #5C816A !important;
            border-radius: 6px !important;

            box-shadow:
                inset 0 1px 0 rgba(255,255,255,.07)
                !important;

            text-shadow: none !important;
            font-size: 11px !important;
            font-weight: 700 !important;
            line-height: 1.25 !important;

            text-align: center !important;
            overflow: hidden;

            color: var(
                --se-btn-color,
                #F5EAD0
            ) !important;

            -webkit-text-fill-color: var(
                --se-btn-color,
                #F5EAD0
            ) !important;
        }

        /* ألوان النصوص والأيقونات */

        .saudi-emerald-profile a.upm,
        .saudi-emerald-profile a.unot {
            --se-btn-color: #EDE4CC;
        }

        .saudi-emerald-profile a.ulike {
            --se-btn-color: #F3A5BD;
        }

        .saudi-emerald-profile a.ugift {
            --se-btn-color: #E6CD8D;
        }

        .saudi-emerald-profile a.uh {
            --se-btn-color: #C6D9C5;
        }

        .saudi-emerald-profile a.udelpic,
        .saudi-emerald-profile a.ubnr {
            --se-btn-color: #DCB3D6;
        }

        .saudi-emerald-profile a.thRoomMod,
        .saudi-emerald-profile a.uunmute {
            --se-btn-color: #9DDEB7;
        }

        .saudi-emerald-profile a.urkick,
        .saudi-emerald-profile a.ukick,
        .saudi-emerald-profile a.uban,
        .saudi-emerald-profile a.ban20 {
            --se-btn-color: #F0ACAF;
        }

        .saudi-emerald-profile a.meiut,
        .saudi-emerald-profile a.meiutbc {
            --se-btn-color: #F0C18E;
        }

        .saudi-emerald-profile a.DELAFT,
        .saudi-emerald-profile a.DELMFT,
        .saudi-emerald-profile a.Mcover {
            --se-btn-color: #B5D9D3;
        }

        .saudi-emerald-profile a.umute {
            --se-btn-color: #E8A3A0;
        }

        /* تلوين أيقونات Font Awesome */

        .th-upro-pro.saudi-emerald-profile
        > center > a.th-upro-action,
        .th-upro-pro.saudi-emerald-profile
        > center > a.th-upro-action-no-margin,
        .th-upro-pro.saudi-emerald-profile
        > center > a.th-upro-action::before,
        .th-upro-pro.saudi-emerald-profile
        > center > a.th-upro-action-no-margin::before,
        .th-upro-pro.saudi-emerald-profile
        > center > a.th-upro-action i,
        .th-upro-pro.saudi-emerald-profile
        > center > a.th-upro-action-no-margin i {
            color: var(
                --se-btn-color,
                #F5EAD0
            ) !important;

            -webkit-text-fill-color: var(
                --se-btn-color,
                #F5EAD0
            ) !important;
        }

        /* احترام أزرار الزائر المخفية */

        .saudi-emerald-profile
        a[style*="display:none"],
        .saudi-emerald-profile
        a[style*="display: none"] {
            display: none !important;
        }

        @media (hover:hover) {
            .saudi-emerald-profile
            > center > a.th-upro-action:hover,
            .saudi-emerald-profile
            > center > a.th-upro-action-no-margin:hover {
                background: #275D47 !important;
                border-color: #C9B27E !important;
            }
        }

        /* ==============================
           صناديق الأدمن متصلة
           ============================== */

        .saudi-emerald-scope
        .th-upro-edit-box,
        .saudi-emerald-scope
        .th-upro-power-box,
        .saudi-emerald-scope
        .th-upro-room-box {
            float: none !important;
            clear: both !important;

            width: calc(100% - 12px) !important;
            box-sizing: border-box !important;

            margin: 0 6px !important;
            padding: 8px 10px !important;

            background: #15382B !important;
            color: #F5EAD0 !important;

            border: 1px solid #5B8067 !important;
            border-bottom: 0 !important;
            border-radius: 0 !important;

            box-shadow: none !important;
        }

        .saudi-emerald-scope
        .th-upro-edit-box.nickbox {
            border-radius: 11px 11px 0 0 !important;
            margin-top: 4px !important;
        }

        .saudi-emerald-scope
        .th-upro-room-box.roomzbox {
            border-bottom:
                1px solid #5B8067 !important;

            border-radius: 0 0 11px 11px !important;
            margin-bottom: 5px !important;
        }

        /* عناوين صناديق الإدارة */

        .saudi-emerald-scope
        .th-upro-edit-box label,
        .saudi-emerald-scope
        .th-upro-power-box label,
        .saudi-emerald-scope
        .th-upro-room-box label {
            color: #E9DBB7 !important;
            font-size: 11px !important;
            font-weight: 700 !important;
        }

        .saudi-emerald-scope
        .th-upro-edit-label,
        .saudi-emerald-scope
        .th-upro-like-label,
        .saudi-emerald-scope
        .th-upro-eva-label {
            background: #24513F !important;
            color: #F5EAD0 !important;

            border: 1px solid #789471 !important;
            border-radius: 6px !important;

            padding: 4px 7px !important;
        }

        /* الحقول والقوائم */

        .saudi-emerald-scope
        .th-upro-edit-box input,
        .saudi-emerald-scope
        .th-upro-edit-box textarea,
        .saudi-emerald-scope
        .th-upro-power-box input,
        .saudi-emerald-scope
        .th-upro-room-box input,
        .saudi-emerald-scope
        .th-upro-power-box select,
        .saudi-emerald-scope
        .th-upro-room-box select {
            background: #F7FAF7 !important;
            color: #183B2D !important;

            border: 1px solid #AFC4B2 !important;
            border-radius: 6px !important;

            font-size: 11px !important;
            line-height: 1.5 !important;

            box-shadow: none !important;
        }

        /* أزرار الحفظ */

        .saudi-emerald-scope
        .th-upro-save-small,
        .saudi-emerald-scope
        .th-upro-edit-box .u-nickc {
            background:
                linear-gradient(
                    145deg,
                    #27634B,
                    #194432
                ) !important;

            color: #F5EAD0 !important;

            border: 1px solid #C4AC86 !important;
            border-radius: 7px !important;

            font-size: 11px !important;
            font-weight: 700 !important;

            box-shadow: none !important;
        }

        /* عدم تجاوز إخفاء النظام */

        .saudi-emerald-scope
        .th-upro-edit-box[style*="display:none"],
        .saudi-emerald-scope
        .th-upro-edit-box[style*="display: none"],
        .saudi-emerald-scope
        .th-upro-power-box[style*="display:none"],
        .saudi-emerald-scope
        .th-upro-power-box[style*="display: none"],
        .saudi-emerald-scope
        .th-upro-room-box[style*="display:none"],
        .saudi-emerald-scope
        .th-upro-room-box[style*="display: none"] {
            display: none !important;
        }

        /* الجوال */

        @media(max-width:420px) {
            .saudi-emerald-profile
            .th-upro-profile-name {
                font-size: 15px !important;
            }

            .th-upro-pro.saudi-emerald-profile
            > center > a.th-upro-action,
            .th-upro-pro.saudi-emerald-profile
            > center > a.th-upro-action-no-margin {
                font-size: 10px !important;
                height: 35px !important;
                min-height: 35px !important;
            }

            .saudi-emerald-scope
            .th-upro-edit-box,
            .saudi-emerald-scope
            .th-upro-power-box,
            .saudi-emerald-scope
            .th-upro-room-box {
                width: calc(100% - 10px) !important;
                margin-left: 5px !important;
                margin-right: 5px !important;
                padding: 7px !important;
            }
        }

        @media(prefers-reduced-motion:reduce) {
            .saudi-emerald-profile
            a.th-upro-action,
            .saudi-emerald-profile
            a.th-upro-action-no-margin {
                transition: none !important;
            }
        }

        `;

        document.head.appendChild(style);
    }

    function updateProfiles() {
        const scopes = new Set();

        document.querySelectorAll(
            ".th-upro-pro"
        ).forEach(function (profile) {
            const matched = isTarget(profile);

            if (
                profile.classList.contains(BODY_CLASS)
                !== matched
            ) {
                profile.classList.toggle(
                    BODY_CLASS,
                    matched
                );
            }

            const oldEmblem = profile.querySelector(
                "." + EMBLEM_CLASS
            );

            if (matched) {
                const scope = getScope(profile);
                if (scope) scopes.add(scope);

                if (!oldEmblem) {
                    const content = profile.querySelector(
                        ".th-upro-profile-content"
                    );

                    if (content) {
                        content.insertAdjacentHTML(
                            "beforeend",
                            emblemHTML()
                        );
                    }
                }
            } else if (oldEmblem) {
                oldEmblem.remove();
            }
        });

        document.querySelectorAll(
            "." + SCOPE_CLASS
        ).forEach(function (element) {
            if (!scopes.has(element)) {
                element.classList.remove(
                    SCOPE_CLASS
                );
            }
        });

        scopes.forEach(function (scope) {
            if (!scope.classList.contains(SCOPE_CLASS)) {
                scope.classList.add(SCOPE_CLASS);
            }
        });
    }

    function init() {
        if (window.__saudiEmeraldProfileStarted) return;

        window.__saudiEmeraldProfileStarted = true;

        addStyles();
        updateProfiles();

        let scheduled = false;

        const observer = new MutationObserver(
            function () {
                if (scheduled) return;

                scheduled = true;

                requestAnimationFrame(function () {
                    scheduled = false;
                    updateProfiles();
                });
            }
        );

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            init,
            { once: true }
        );
    } else {
        init();
    }

})();
