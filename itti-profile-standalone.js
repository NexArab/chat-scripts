(function () {
    "use strict";

    const KEY = "__ITTI_BLACK_YELLOW_V2__";

    if (window[KEY]) return;
    window[KEY] = true;

    // أربع مسافات مخفية ثم اسم العضو.
    const TARGET = "\u3164\u3164\u3164\u3164iTTi";

    const PROFILE = "itti-black-yellow";
    const SCOPE = "itti-black-yellow-scope";
    const EMBLEM = "itti-tiger-emblem";
    const STYLE_ID = "itti-black-yellow-style";

    /*
     * شعار متجهي مدمج:
     * لا يحتاج رفع صورة أو رابط خارجي.
     */
    const TIGER = `
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 240 240"
         width="112"
         height="112"
         aria-hidden="true"
         focusable="false">
      <defs>
        <linearGradient id="ittiTigerGoldV2"
                        x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#FFE56B"/>
          <stop offset=".55" stop-color="#F5CC24"/>
          <stop offset="1" stop-color="#C6960A"/>
        </linearGradient>
      </defs>

      <g stroke="#F5CC24"
         stroke-width="3"
         stroke-linejoin="round">
        <path fill="#101114"
          d="M48 87
             Q24 52 43 27
             Q66 24 84 50
             Q120 34 156 50
             Q174 24 197 27
             Q216 52 192 87
             L207 118
             L196 139
             L204 162
             L182 166
             L181 190
             L156 187
             L145 210
             L120 228
             L95 210
             L84 187
             L59 190
             L58 166
             L36 162
             L44 139
             L33 118 Z"/>
      </g>

      <g fill="url(#ittiTigerGoldV2)">
        <path d="M46 38 Q61 37 73 56
                 L57 67 Q42 55 46 38Z"/>
        <path d="M194 38 Q179 37 167 56
                 L183 67 Q198 55 194 38Z"/>

        <path d="M115 48 L125 48
                 L122 91 L120 105 L118 91Z"/>

        <path d="M88 55 L109 64
                 L112 83 L91 71 L75 70Z"/>
        <path d="M152 55 L131 64
                 L128 83 L149 71 L165 70Z"/>

        <path d="M67 77 L102 91
                 L109 108 L79 96 L58 95Z"/>
        <path d="M173 77 L138 91
                 L131 108 L161 96 L182 95Z"/>

        <path d="M47 111 L75 109
                 L94 122 L68 121 L49 130Z"/>
        <path d="M193 111 L165 109
                 L146 122 L172 121 L191 130Z"/>

        <path d="M49 143 L73 132
                 L82 141 L61 153 L48 156Z"/>
        <path d="M191 143 L167 132
                 L158 141 L179 153 L192 156Z"/>

        <path d="M67 162 L85 148
                 L93 158 L77 180 L66 180Z"/>
        <path d="M173 162 L155 148
                 L147 158 L163 180 L174 180Z"/>

        <path d="M91 175 L104 187
                 L112 211 L97 201Z"/>
        <path d="M149 175 L136 187
                 L128 211 L143 201Z"/>
      </g>

      <g fill="#FFE66B">
        <path d="M72 103
                 Q88 102 102 117
                 Q85 121 72 103Z"/>
        <path d="M168 103
                 Q152 102 138 117
                 Q155 121 168 103Z"/>
      </g>

      <g fill="#101114">
        <path d="M87 105 L90 116 L94 114 L92 108Z"/>
        <path d="M153 105 L150 116 L146 114 L148 108Z"/>
      </g>

      <g fill="#F5CC24">
        <path d="M102 123
                 Q120 115 138 123
                 L132 137 L120 143
                 L108 137Z"/>

        <path d="M97 137
                 Q79 137 80 154
                 Q84 171 105 162
                 L120 153
                 L135 162
                 Q156 171 160 154
                 Q161 137 143 137
                 L135 148
                 L120 153
                 L105 148Z"/>

        <path d="M95 165
                 Q120 179 145 165
                 Q144 192 120 205
                 Q96 192 95 165Z"/>
      </g>

      <path fill="#08090B"
        d="M104 171
           Q120 180 136 171
           L131 187 L120 195 L109 187Z"/>

      <g fill="#FFF0AA">
        <path d="M100 162 L108 166 L104 182Z"/>
        <path d="M140 162 L132 166 L136 182Z"/>
      </g>

      <g fill="none"
         stroke="#E7C65C"
         stroke-width="1.5"
         stroke-linecap="round">
        <path d="M84 146 L38 138"/>
        <path d="M84 153 L29 153"/>
        <path d="M87 160 L40 171"/>
        <path d="M156 146 L202 138"/>
        <path d="M156 153 L211 153"/>
        <path d="M153 160 L200 171"/>
      </g>
    </svg>`;

    const CSS = `
    .${SCOPE} {
        --itti-yellow: #F5CC24;
        --itti-text: #E9E7DF;
        --itti-border: #5E5229;
    }

    /* الشريط العلوي */

    .${SCOPE} .th-upro-header {
        background: linear-gradient(
            115deg, #101114, #29271B
        ) !important;
        color: #F5CC24 !important;
        border: 0 !important;
        border-bottom: 2px solid #F5CC24 !important;
        padding: 8px 10px !important;
        box-shadow: none !important;
    }

    .${SCOPE} .th-upro-title,
    .${SCOPE} .th-upro-header .fa-times {
        color: #F5CC24 !important;
    }

    .${SCOPE} .th-upro-header .clickable.badge {
        background: #24241D !important;
        color: #F5CC24 !important;
        border: 1px solid #77682E !important;
        border-radius: 6px !important;
    }

    /* جسم البروفايل */

    .th-upro-pro.${PROFILE} {
        background: #141518 !important;
        color: #E9E7DF !important;
        border: 1px solid #786629 !important;
        border-radius: 13px !important;
        box-shadow: 0 5px 22px rgba(0,0,0,.28) !important;
    }

    .${PROFILE} .th-upro-profile-container {
        background: #141518 !important;
        color: #E9E7DF !important;
        border-radius: 11px !important;
    }

    /* المحافظة على صورة العضو والغلاف */

    .${PROFILE} .th-upro-cover {
        border-bottom: 3px solid #F5CC24 !important;
    }

    .${PROFILE} .th-upro-picture {
        border: 3px solid #F5CC24 !important;
        border-radius: 50% !important;
        box-shadow:
            0 0 0 3px #141518,
            0 4px 15px rgba(0,0,0,.35) !important;
    }

    /* الاسم */

    .${PROFILE} .th-upro-profile-content {
        background: linear-gradient(
            #24241D, #141518
        ) !important;
        border-bottom: 1px solid #494125 !important;
        padding-bottom: 10px !important;
    }

    .${PROFILE} .th-upro-profile-name {
        color: #F5CC24 !important;
        font-size: 19px !important;
        font-weight: 800 !important;
        line-height: 1.7 !important;
        text-shadow: none !important;
    }

    /* شعار النمر */

    .${PROFILE} .${EMBLEM} {
        width: 118px;
        height: 118px;
        margin: 9px auto 5px;
        padding: 3px;
        box-sizing: border-box;
        border: 1px solid #716126;
        border-radius: 14px;
        background: radial-gradient(
            ellipse at center,
            #39351D,
            #191A1D 72%
        );
        pointer-events: none;
        user-select: none;
    }

    .${PROFILE} .${EMBLEM} svg {
        display: block;
        width: 100%;
        height: 100%;
    }

    /* المشاهدات والنقاط */

    .${PROFILE} .profile-card-modern,
    .${PROFILE} .th-upro-meta-label {
        background: #141518 !important;
        color: #E9E7DF !important;
    }

    .${PROFILE} .thProfileStat {
        background: #20211F !important;
        border: 1px solid #554B29 !important;
        border-radius: 9px !important;
        box-shadow: none !important;
    }

    .${PROFILE} .thProfileStatShine,
    .${PROFILE} .NUMBER_TH,
    .${PROFILE} .thProfilePointsNum,
    .${PROFILE} .thProfileEye,
    .${PROFILE} .thProfilePointsIcon {
        color: #F5CC24 !important;
    }

    /* الدولة والغرفة */

    .${PROFILE} .th-upro-co,
    .${PROFILE} .th-upro-meta-label .roomh {
        background: #25251D !important;
        color: #EAD891 !important;
        border: 1px solid #695A29 !important;
        border-radius: 7px !important;
        padding: 4px 6px !important;
        font-size: 11px !important;
        text-shadow: none !important;
        box-shadow: none !important;
    }

    .${PROFILE} .th-upro-co img {
        max-width: 27px !important;
        height: auto !important;
        border-radius: 4px !important;
    }

    .${PROFILE} .roomh img {
        max-width: 24px !important;
        max-height: 24px !important;
        border-radius: 4px !important;
        vertical-align: middle !important;
    }

    /* النبذة والألعاب */

    .${PROFILE} .th-upro-bio {
        background: #1E1F21 !important;
        color: #E9E7DF !important;
        border: 1px solid #49442B !important;
        border-right: 3px solid #F5CC24 !important;
        border-radius: 8px !important;
        padding: 9px !important;
        line-height: 1.7 !important;
        box-shadow: none !important;
    }

    .${PROFILE} .th-upro-game-xo,
    .${PROFILE} .th-upro-game-ludo {
        background: #29281D !important;
        color: #F5CC24 !important;
        border: 1px solid #78672C !important;
        border-radius: 7px !important;
        box-shadow: none !important;
    }

    /* الأزرار: لا نغير display أو الوظائف */

    .th-upro-pro.${PROFILE}
    > center > a.th-upro-action,
    .th-upro-pro.${PROFILE}
    > center > a.th-upro-action-no-margin {
        float: left !important;
        width: calc(33.333333% - 6px) !important;
        min-width: 0 !important;
        min-height: 37px !important;
        margin: 3px !important;
        padding: 7px 2px !important;
        box-sizing: border-box !important;
        background: linear-gradient(
            #2B291D, #1C1D19
        ) !important;
        border: 1px solid #77662B !important;
        border-radius: 7px !important;
        color: #F5CC24 !important;
        -webkit-text-fill-color: #F5CC24 !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        line-height: 1.4 !important;
        text-align: center !important;
        text-shadow: none !important;
        box-shadow: none !important;
    }

    .${PROFILE} > center > a.th-upro-action::before,
    .${PROFILE} > center > a.th-upro-action-no-margin::before,
    .${PROFILE} > center > a.th-upro-action i,
    .${PROFILE} > center > a.th-upro-action-no-margin i {
        color: #F5CC24 !important;
        -webkit-text-fill-color: #F5CC24 !important;
    }

    .${PROFILE} > center::after {
        content: "";
        display: block;
        clear: both;
    }

    @media (hover: hover) {
        .${PROFILE} > center > a.th-upro-action:hover,
        .${PROFILE} > center > a.th-upro-action-no-margin:hover {
            background: #38321C !important;
            border-color: #F5CC24 !important;
        }
    }

    /* صناديق الإدارة الخارجية */

    .${SCOPE} .th-upro-edit-box,
    .${SCOPE} .th-upro-power-box,
    .${SCOPE} .th-upro-room-box {
        float: none !important;
        clear: both !important;
        width: calc(100% - 12px) !important;
        margin: 0 6px !important;
        padding: 9px !important;
        box-sizing: border-box !important;
        background: #1B1C1F !important;
        color: #E9E7DF !important;
        border: 1px solid #554B29 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
    }

    .${SCOPE} .th-upro-edit-box.nickbox {
        margin-top: 5px !important;
        border-radius: 10px 10px 0 0 !important;
    }

    .${SCOPE} .th-upro-room-box.roomzbox {
        margin-bottom: 6px !important;
        border-radius: 0 0 10px 10px !important;
    }

    .${SCOPE} .th-upro-edit-box label,
    .${SCOPE} .th-upro-power-box label,
    .${SCOPE} .th-upro-room-box label {
        color: #F5CC24 !important;
    }

    .${SCOPE} .th-upro-edit-label,
    .${SCOPE} .th-upro-like-label,
    .${SCOPE} .th-upro-eva-label {
        background: #302D1E !important;
        color: #F5CC24 !important;
        border: 1px solid #66582A !important;
        border-radius: 6px !important;
    }

    .${SCOPE} .th-upro-edit-box input,
    .${SCOPE} .th-upro-edit-box textarea,
    .${SCOPE} .th-upro-power-box input,
    .${SCOPE} .th-upro-power-box select,
    .${SCOPE} .th-upro-room-box input,
    .${SCOPE} .th-upro-room-box select {
        background: #101114 !important;
        color: #E9E7DF !important;
        border: 1px solid #695B2D !important;
        border-radius: 6px !important;
        box-shadow: none !important;
    }

    .${SCOPE} .th-upro-edit-box input:focus,
    .${SCOPE} .th-upro-edit-box textarea:focus,
    .${SCOPE} .th-upro-power-box input:focus,
    .${SCOPE} .th-upro-power-box select:focus,
    .${SCOPE} .th-upro-room-box input:focus,
    .${SCOPE} .th-upro-room-box select:focus {
        outline: 2px solid rgba(245,204,36,.3) !important;
        outline-offset: 1px !important;
        border-color: #F5CC24 !important;
    }

    .${SCOPE} .th-upro-save-small,
    .${SCOPE} .th-upro-edit-box .u-nickc {
        background: #F5CC24 !important;
        color: #131416 !important;
        border: 1px solid #F5CC24 !important;
        border-radius: 6px !important;
        text-shadow: none !important;
        box-shadow: none !important;
    }

    @media (max-width: 420px) {
        .${PROFILE} .th-upro-profile-name {
            font-size: 16px !important;
        }

        .th-upro-pro.${PROFILE}
        > center > a.th-upro-action,
        .th-upro-pro.${PROFILE}
        > center > a.th-upro-action-no-margin {
            font-size: 11px !important;
        }

        .${PROFILE} .${EMBLEM} {
            width: 104px;
            height: 104px;
        }
    }
    `;

    function isTarget(profile) {
        const name = profile.querySelector(
            ".th-upro-profile-name"
        );

        if (!name) return false;

        // لا نحذف المسافات المخفية من الاسم.
        return name.textContent.replace(
            /^[ \t\r\n]+|[ \t\r\n]+$/g,
            ""
        ) === TARGET;
    }

    function getScope(profile) {
        /*
         * نبدأ بأقرب نافذة فعلية حتى لا يمتد
         * التصميم إلى الشات أو بروفايلات أخرى.
         */
        const modal = profile.closest(".modal-content");

        if (modal) return modal;

        let parent = profile.parentElement;

        while (
            parent &&
            parent !== document.body &&
            parent !== document.documentElement
        ) {
            if (
                parent.querySelector(".th-upro-header") &&
                parent.querySelector(".th-upro-pro")
            ) {
                return parent;
            }

            parent = parent.parentElement;
        }

        return profile;
    }

    function createEmblem() {
        const element = document.createElement("div");

        element.className = EMBLEM;
        element.setAttribute("aria-hidden", "true");
        element.innerHTML = TIGER;

        return element;
    }

    function updateProfiles() {
        const scopes = new Set();

        document.querySelectorAll(
            ".th-upro-pro"
        ).forEach(function (profile) {
            const matched = isTarget(profile);

            if (
                profile.classList.contains(PROFILE) !== matched
            ) {
                profile.classList.toggle(PROFILE, matched);
            }

            const emblem = profile.querySelector(
                "." + EMBLEM
            );

            if (matched) {
                scopes.add(getScope(profile));

                if (!emblem) {
                    const content = profile.querySelector(
                        ".th-upro-profile-content"
                    );

                    if (content) {
                        content.appendChild(createEmblem());
                    }
                }
            } else if (emblem) {
                emblem.remove();
            }
        });

        document.querySelectorAll(
            "." + SCOPE
        ).forEach(function (element) {
            if (!scopes.has(element)) {
                element.classList.remove(SCOPE);
            }
        });

        scopes.forEach(function (element) {
            if (!element.classList.contains(SCOPE)) {
                element.classList.add(SCOPE);
            }
        });
    }

    function init() {
        if (!document.getElementById(STYLE_ID)) {
            const style = document.createElement("style");

            style.id = STYLE_ID;
            style.textContent = CSS;

            document.head.appendChild(style);
        }

        updateProfiles();

        let pending = false;

        const observer = new MutationObserver(function () {
            if (pending) return;

            pending = true;

            requestAnimationFrame(function () {
                pending = false;
                updateProfiles();
            });
        });

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
