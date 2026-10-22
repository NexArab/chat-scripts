
(function () {
    "use strict";

    /*
    ============================================
       FEX GOLDEN MELODY PROFILE V1
       موسيقى الزمن الجميل

       العضو: ⠀⠀ Fex

       هوية:
       عاجي + بني خشبي + ذهب معتق

       عود حقيقي بصيغة SVG
       ثلاثة أزرار لكل صف
       حقول إدارة متصلة
       احترام صلاحيات الشات
    ============================================
    */

    const TARGET = "\u2800\u2800 Fex";

    const BODY_CLASS = "fex-golden-profile";
    const SCOPE_CLASS = "fex-golden-scope";
    const STYLE_ID = "fex-golden-style";
    const OUD_CLASS = "fex-golden-oud";
    const MUSIC_CLASS = "fex-golden-music";

    /*
       رسم عود عربي SVG
       المصدر: FreeSVG / OpenClipart
    */

    const OUD_URL =
        "https://freesvg.org/download/12188";

    /* ======================================
       تحديد صاحب البروفايل
       ====================================== */

    function isTarget(profile) {
        if (!profile) return false;

        const name = profile.querySelector(
            ".th-upro-profile-name"
        );

        if (!name) return false;

        return name.textContent.replace(
            /^[ \t\r\n]+|[ \t\r\n]+$/g,
            ""
        ) === TARGET;
    }

    /* ======================================
       العثور على الحاوية المشتركة
       ====================================== */

    function getScope(profile) {
        let parent = profile.parentElement;
        let fallback = null;

        while (
            parent &&
            parent !== document.body &&
            parent !== document.documentElement
        ) {
            if (
                parent.querySelector(".th-upro-header") &&
                parent.querySelector(".th-upro-pro")
            ) {
                fallback = parent;

                if (
                    parent.querySelector(".th-upro-edit-box") ||
                    parent.querySelector(".th-upro-power-box") ||
                    parent.querySelector(".th-upro-room-box")
                ) {
                    return parent;
                }
            }

            parent = parent.parentElement;
        }

        return fallback ||
            profile.closest(".modal-content") ||
            profile.closest(".modal") ||
            profile;
    }

    /* ======================================
       زخرفة العود
       ====================================== */

    function createOud() {
        const badge = document.createElement("div");

        badge.className = OUD_CLASS;
        badge.setAttribute("aria-hidden", "true");

        const image = document.createElement("img");

        image.src = OUD_URL;
        image.alt = "";
        image.decoding = "async";
        image.loading = "lazy";

        image.addEventListener(
            "error",
            function () {
                badge.style.display = "none";
            },
            { once: true }
        );

        badge.appendChild(image);

        return badge;
    }

    /* ======================================
       زخرفة النوتات الموسيقية
       ====================================== */

    function createMusic() {
        const ornament = document.createElement("div");

        ornament.className = MUSIC_CLASS;
        ornament.setAttribute("aria-hidden", "true");

        ornament.innerHTML = [
            '<span>♪</span>',
            '<span>♫</span>',
            '<span>♬</span>',
            '<span>♪</span>',
            '<span>♫</span>'
        ].join("");

        return ornament;
    }

    /* ======================================
       CSS - التصميم الكامل
       ====================================== */

    function addStyles() {
        const old = document.getElementById(STYLE_ID);

        if (old) old.remove();

        const style = document.createElement("style");

        style.id = STYLE_ID;

        style.textContent = `

        /* ==================================
           الهوية الموسيقية
           ================================== */

        .fex-golden-scope {
            --fg-brown: #6F482F;
            --fg-dark: #3B271D;
            --fg-gold: #C5A06B;
            --fg-ivory: #FFF8EB;
            --fg-soft: #F4E8D6;
            --fg-border: #D9C3A4;
        }

        /* ==================================
           الشريط العلوي
           ================================== */

        .fex-golden-scope .th-upro-header {
            background:
                linear-gradient(
                    125deg,
                    #3B271D,
                    #745037
                ) !important;

            color: #F9E8C7 !important;

            border: 0 !important;
            border-bottom:
                2px solid #C5A06B !important;

            padding: 7px 9px !important;

            box-shadow: none !important;
        }

        .fex-golden-scope .th-upro-title {
            color: #F9E8C7 !important;

            font-size: 12px !important;
            font-weight: 800 !important;
        }

        .fex-golden-scope .th-upro-title img {
            vertical-align: middle !important;
            border-radius: 5px !important;
            margin-left: 4px !important;
        }

        .fex-golden-scope
        .th-upro-header .clickable.badge {
            background: #694832 !important;

            color: #FFE9BF !important;

            border: 1px solid #C5A06B !important;
            border-radius: 6px !important;

            box-shadow: none !important;
        }

        .fex-golden-scope
        .th-upro-header .fa-times {
            color: #FFE9BF !important;
        }

        /* ==================================
           جسم البروفايل
           ================================== */

        .th-upro-pro.fex-golden-profile {
            background:
                #FFF8EB !important;

            color: #634530 !important;

            border:
                1px solid #D8BB90 !important;

            border-radius: 12px !important;

            box-shadow:
                0 4px 16px rgba(74,45,25,.13)
                !important;
        }

        .fex-golden-profile
        .th-upro-profile-container {
            background: #FFF8EB !important;

            border-radius: 10px !important;
        }

        /* ==================================
           الغلاف والصورة الأصلية
           ================================== */

        .fex-golden-profile .th-upro-cover {
            border-bottom:
                3px solid #C5A06B !important;
        }

        .fex-golden-profile
        .th-upro-picture {
            border:
                3px solid #C5A06B !important;

            border-radius: 50% !important;

            box-shadow:
                0 0 0 3px #FFF8EB,
                0 4px 12px rgba(66,39,23,.19)
                !important;
        }

        /* ==================================
           الاسم
           ================================== */

        .fex-golden-profile
        .th-upro-profile-content {
            background:
                linear-gradient(
                    180deg,
                    #FFFDF7,
                    #F2E5D0
                ) !important;

            border-bottom:
                1px solid #D8C09B !important;

            padding-bottom: 8px !important;
        }

        .fex-golden-profile
        .th-upro-profile-name {
            color: #68422B !important;

            font-size: 19px !important;
            font-weight: 800 !important;

            line-height: 1.65 !important;

            text-shadow:
                0 1px 0 #FFFFFF !important;
        }

        .fex-golden-profile
        .th-upro-name-wrap::before,
        .fex-golden-profile
        .th-upro-name-wrap::after {
            content: "♫";

            color: #B38956;
            font-size: 14px;

            margin: 0 7px;
        }

        /* ==================================
           العود الحقيقي SVG
           ================================== */

        .fex-golden-profile
        .fex-golden-oud {
            width: 106px;
            height: 133px;

            margin: 8px auto 3px;
            padding: 9px;

            box-sizing: border-box;

            display: flex;
            justify-content: center;
            align-items: center;

            background:
                radial-gradient(
                    circle at 45% 25%,
                    #FFFFFF,
                    #F1E0C6
                );

            border:
                1px solid #D5B98B;

            border-radius:
                48% 48% 12px 12px;

            box-shadow:
                inset 0 1px 0 #FFFFFF,
                0 3px 9px rgba(74,45,25,.09);

            pointer-events: none;
        }

        .fex-golden-profile
        .fex-golden-oud img {
            display: block;

            width: 100%;
            height: 100%;

            object-fit: contain;

            filter:
                sepia(.24)
                saturate(.86);

            -webkit-filter:
                sepia(.24)
                saturate(.86);
        }

        /* ==================================
           النوتات الموسيقية
           ================================== */

        .fex-golden-profile
        .fex-golden-music {
            display: flex;
            justify-content: center;
            align-items: center;

            gap: 13px;

            width: fit-content;
            max-width: 90%;

            margin: 5px auto 7px;
            padding: 3px 19px;

            color: #9E784C;

            border-top:
                1px solid #E1CCAA;

            border-bottom:
                1px solid #E1CCAA;

            border-radius: 6px;

            pointer-events: none;
        }

        .fex-golden-profile
        .fex-golden-music span {
            display: inline-block;

            font-size: 13px;
            line-height: 1.4;
        }

        .fex-golden-profile
        .fex-golden-music span:nth-child(2),
        .fex-golden-profile
        .fex-golden-music span:nth-child(4) {
            color: #C09A64;
            font-size: 16px;
        }

        /* ==================================
           المشاهدات والنقاط
           ================================== */

        .fex-golden-profile .thProfileStat {
            background: #FFFDF8 !important;

            border:
                1px solid #E0CBAA !important;

            border-radius: 9px !important;

            box-shadow:
                0 1px 4px rgba(74,45,25,.07)
                !important;
        }

        .fex-golden-profile
        .thProfileStatShine,
        .fex-golden-profile
        .NUMBER_TH,
        .fex-golden-profile
        .thProfilePointsNum {
            color: #6F482F !important;

            font-weight: 700 !important;
        }

        .fex-golden-profile .thProfileEye {
            color: #94734E !important;
        }

        .fex-golden-profile
        .thProfilePointsIcon {
            color: #B48950 !important;
        }

        /* ==================================
           الدولة والعلم
           ================================== */

        .fex-golden-profile
        .th-upro-meta-label {
            background: #FFF8EB !important;
        }

        .fex-golden-profile .th-upro-co {
            background: #FFFDF8 !important;

            color: #725036 !important;

            border:
                1px solid #DCC5A3 !important;

            border-radius: 8px !important;

            padding: 3px 6px !important;

            font-size: 11px !important;
            font-weight: 700 !important;
        }

        .fex-golden-profile
        .th-upro-co img {
            max-width: 27px !important;

            width: auto !important;
            height: auto !important;

            padding: 2px !important;
            margin: 0 3px !important;

            background: #FFFFFF !important;

            border:
                1px solid #E0CBAA !important;

            border-radius: 5px !important;
        }

        /* ==================================
           الغرفة
           ================================== */

        .fex-golden-profile
        .th-upro-meta-label .roomh {
            background:
                linear-gradient(
                    135deg,
                    #FFFFFF,
                    #F2E5D0
                ) !important;

            color: #6F482F !important;

            border:
                1px solid #D7BC95 !important;

            border-radius: 8px !important;

            padding: 3px 6px !important;

            font-size: 11px !important;
            font-weight: 700 !important;

            text-shadow: none !important;
            box-shadow: none !important;
        }

        .fex-golden-profile
        .th-upro-meta-label .roomh img {
            max-width: 24px !important;
            max-height: 24px !important;

            width: auto !important;
            height: auto !important;

            margin-left: 4px !important;

            vertical-align: middle !important;

            border-radius: 5px !important;
        }

        /* ==================================
           النبذة الشخصية
           ================================== */

        .fex-golden-profile .th-upro-bio {
            background: #FFFDF8 !important;

            color: #78563C !important;

            border:
                1px solid #E1CBAB !important;

            border-right:
                3px solid #B58B55 !important;

            border-radius: 9px !important;

            padding: 8px !important;

            line-height: 1.7 !important;

            box-shadow: none !important;
        }

        /* ==================================
           لعبة XO واللودو
           ================================== */

        .fex-golden-profile
        .th-upro-game-xo,
        .fex-golden-profile
        .th-upro-game-ludo {
            background:
                linear-gradient(
                    135deg,
                    #FFF9ED,
                    #EDE0CB
                ) !important;

            color: #67442E !important;

            border:
                1px solid #D5BE99 !important;

            border-radius: 8px !important;

            font-weight: 700 !important;

            box-shadow: none !important;
        }

        /* ==================================
           شبكة الأزرار
           ثلاثة في كل صف
           ================================== */

        .th-upro-pro.fex-golden-profile
        > center > a.th-upro-action,
        .th-upro-pro.fex-golden-profile
        > center > a.th-upro-action-no-margin {
            float: left !important;

            width:
                calc(33.333333% - 6px) !important;

            min-width: 0 !important;

            height: 36px !important;
            min-height: 36px !important;

            box-sizing: border-box !important;

            margin: 2px 3px !important;
            padding: 5px 2px !important;

            background:
                linear-gradient(
                    145deg,
                    #FFFDF7,
                    #F2E5D0
                ) !important;

            border:
                1px solid #D8BE98 !important;

            border-radius: 6px !important;

            box-shadow:
                inset 0 1px 0 #FFFFFF
                !important;

            text-shadow: none !important;

            font-size: 12px !important;
            font-weight: 700 !important;

            line-height: 1.25 !important;
            text-align: center !important;

            overflow: hidden;

            color:
                var(
                    --fg-btn,
                    #6F482F
                ) !important;

            -webkit-text-fill-color:
                var(
                    --fg-btn,
                    #6F482F
                ) !important;
        }

        /* ==================================
           ألوان كل زر
           ================================== */

        /* الخاص والتنبيه */

        .fex-golden-profile a.upm,
        .fex-golden-profile a.unot {
            --fg-btn: #725037;
        }

        /* الإعجاب */

        .fex-golden-profile a.ulike {
            --fg-btn: #A4506A;
        }

        /* الهدية */

        .fex-golden-profile a.ugift {
            --fg-btn: #AA772D;
        }

        /* كشف النكات */

        .fex-golden-profile a.uh {
            --fg-btn: #685D4B;
        }

        /* الصور والبنر */

        .fex-golden-profile a.udelpic,
        .fex-golden-profile a.ubnr {
            --fg-btn: #916344;
        }

        /* المراقبة وإلغاء التجاهل */

        .fex-golden-profile a.thRoomMod,
        .fex-golden-profile a.uunmute {
            --fg-btn: #4D7C5D;
        }

        /* الطرد والحظر */

        .fex-golden-profile a.urkick,
        .fex-golden-profile a.ukick,
        .fex-golden-profile a.uban,
        .fex-golden-profile a.ban20 {
            --fg-btn: #AE4040;
        }

        /* الإسكات */

        .fex-golden-profile a.meiut,
        .fex-golden-profile a.meiutbc {
            --fg-btn: #A35E25;
        }

        /* الإطار والغلاف */

        .fex-golden-profile a.DELAFT,
        .fex-golden-profile a.DELMFT,
        .fex-golden-profile a.Mcover {
            --fg-btn: #6C7690;
        }

        /* التجاهل */

        .fex-golden-profile a.umute {
            --fg-btn: #A54848;
        }

        /* تلوين Font Awesome */

        .th-upro-pro.fex-golden-profile
        > center > a.th-upro-action::before,
        .th-upro-pro.fex-golden-profile
        > center > a.th-upro-action-no-margin::before,
        .th-upro-pro.fex-golden-profile
        > center > a.th-upro-action i,
        .th-upro-pro.fex-golden-profile
        > center > a.th-upro-action-no-margin i {
            color:
                var(
                    --fg-btn,
                    #6F482F
                ) !important;

            -webkit-text-fill-color:
                var(
                    --fg-btn,
                    #6F482F
                ) !important;
        }

        /* لا نُظهر أزرارًا مخفية */

        .fex-golden-profile
        a[style*="display:none"],
        .fex-golden-profile
        a[style*="display: none"] {
            display: none !important;
        }

        /* تأثير مرور الفأرة */

        @media (hover:hover) {
            .fex-golden-profile
            > center > a.th-upro-action:hover,
            .fex-golden-profile
            > center > a.th-upro-action-no-margin:hover {
                background: #EBD7B8 !important;

                border-color:
                    #BC955E !important;
            }
        }

        /* ==================================
           صناديق الإدارة المتصلة
           ================================== */

        .fex-golden-scope
        .th-upro-edit-box,
        .fex-golden-scope
        .th-upro-power-box,
        .fex-golden-scope
        .th-upro-room-box {
            float: none !important;
            clear: both !important;

            width:
                calc(100% - 12px) !important;

            box-sizing: border-box !important;

            margin: 0 6px !important;
            padding: 8px 10px !important;

            background: #FFFDF8 !important;
            color: #6F482F !important;

            border:
                1px solid #D9C2A1 !important;

            border-bottom: 0 !important;

            border-radius: 0 !important;

            box-shadow: none !important;
        }

        /* بداية لوحة الإدارة */

        .fex-golden-scope
        .th-upro-edit-box.nickbox {
            border-radius:
                11px 11px 0 0 !important;

            margin-top: 4px !important;
        }

        /* نهاية لوحة الإدارة */

        .fex-golden-scope
        .th-upro-room-box.roomzbox {
            border-bottom:
                1px solid #D9C2A1 !important;

            border-radius:
                0 0 11px 11px !important;

            margin-bottom: 5px !important;
        }

        /* عناوين الإدارة */

        .fex-golden-scope
        .th-upro-edit-box label,
        .fex-golden-scope
        .th-upro-power-box label,
        .fex-golden-scope
        .th-upro-room-box label {
            color: #674830 !important;

            font-size: 12px !important;
            font-weight: 700 !important;
        }

        .fex-golden-scope
        .th-upro-edit-label,
        .fex-golden-scope
        .th-upro-like-label,
        .fex-golden-scope
        .th-upro-eva-label {
            background: #F2E5D0 !important;
            color: #674830 !important;

            border:
                1px solid #DAC3A1 !important;

            border-radius: 6px !important;

            padding: 4px 7px !important;
        }

        /* حقول الإدارة */

        .fex-golden-scope
        .th-upro-edit-box input,
        .fex-golden-scope
        .th-upro-edit-box textarea,
        .fex-golden-scope
        .th-upro-power-box input,
        .fex-golden-scope
        .th-upro-room-box input,
        .fex-golden-scope
        .th-upro-power-box select,
        .fex-golden-scope
        .th-upro-room-box select {
            background: #FFFFFF !important;
            color: #6F482F !important;

            border:
                1px solid #DCC7AA !important;

            border-radius: 6px !important;

            font-size: 12px !important;
            line-height: 1.5 !important;

            box-shadow: none !important;
        }

        /* التركيز على الحقول */

        .fex-golden-scope
        .th-upro-edit-box input:focus,
        .fex-golden-scope
        .th-upro-edit-box textarea:focus,
        .fex-golden-scope
        .th-upro-power-box input:focus,
        .fex-golden-scope
        .th-upro-room-box input:focus,
        .fex-golden-scope
        .th-upro-power-box select:focus,
        .fex-golden-scope
        .th-upro-room-box select:focus {
            background: #FFFFFF !important;

            border-color:
                #B79665 !important;

            outline:
                2px solid rgba(
                    183,150,101,.17
                ) !important;

            outline-offset: 0 !important;
        }

        /* أزرار الحفظ */

        .fex-golden-scope
        .th-upro-save-small,
        .fex-golden-scope
        .th-upro-edit-box .u-nickc {
            background:
                linear-gradient(
                    145deg,
                    #FFF9ED,
                    #EBDAC0
                ) !important;

            color: #6F482F !important;

            border:
                1px solid #D2B68E !important;

            border-radius: 7px !important;

            font-size: 12px !important;
            font-weight: 700 !important;

            box-shadow:
                inset 0 1px 0 #FFFFFF
                !important;
        }

        /* الحفاظ على الخانات المخفية */

        .fex-golden-scope
        .th-upro-edit-box[style*="display:none"],
        .fex-golden-scope
        .th-upro-edit-box[style*="display: none"],
        .fex-golden-scope
        .th-upro-power-box[style*="display:none"],
        .fex-golden-scope
        .th-upro-power-box[style*="display: none"],
        .fex-golden-scope
        .th-upro-room-box[style*="display:none"],
        .fex-golden-scope
        .th-upro-room-box[style*="display: none"] {
            display: none !important;
        }

        /* ==================================
           الجوال
           ================================== */

        @media (max-width:420px) {

            .fex-golden-profile
            .th-upro-profile-name {
                font-size: 16px !important;
            }

            .fex-golden-profile
            .fex-golden-oud {
                width: 91px;
                height: 116px;
            }

            .th-upro-pro.fex-golden-profile
            > center > a.th-upro-action,
            .th-upro-pro.fex-golden-profile
            > center > a.th-upro-action-no-margin {
                height: 35px !important;
                min-height: 35px !important;

                font-size: 11px !important;
            }

            .fex-golden-scope
            .th-upro-edit-box,
            .fex-golden-scope
            .th-upro-power-box,
            .fex-golden-scope
            .th-upro-room-box {
                width:
                    calc(100% - 10px) !important;

                margin-left: 5px !important;
                margin-right: 5px !important;

                padding: 7px !important;
            }
        }

        @media (prefers-reduced-motion:reduce) {
            .fex-golden-profile
            a.th-upro-action,
            .fex-golden-profile
            a.th-upro-action-no-margin {
                transition: none !important;
            }
        }
        `;

        document.head.appendChild(style);
    }

    /* ======================================
       تطبيق الهوية على Fex فقط
       ====================================== */

    function updateProfiles() {
        const scopes = new Set();

        document.querySelectorAll(
            ".th-upro-pro"
        ).forEach(function (profile) {

            const matched = isTarget(profile);

            if (
                profile.classList.contains(
                    BODY_CLASS
                ) !== matched
            ) {
                profile.classList.toggle(
                    BODY_CLASS,
                    matched
                );
            }

            const oldOud = profile.querySelector(
                "." + OUD_CLASS
            );

            const oldMusic = profile.querySelector(
                "." + MUSIC_CLASS
            );

            if (matched) {
                const scope = getScope(profile);

                if (scope) {
                    scopes.add(scope);
                }

                const content = profile.querySelector(
                    ".th-upro-profile-content"
                );

                if (content) {
                    if (!oldOud) {
                        content.appendChild(
                            createOud()
                        );
                    }

                    if (!oldMusic) {
                        content.appendChild(
                            createMusic()
                        );
                    }
                }
            } else {
                if (oldOud) oldOud.remove();
                if (oldMusic) oldMusic.remove();
            }
        });

        /* إزالة الكلاس عن النوافذ السابقة */

        document.querySelectorAll(
            "." + SCOPE_CLASS
        ).forEach(function (element) {
            if (!scopes.has(element)) {
                element.classList.remove(
                    SCOPE_CLASS
                );
            }
        });

        /* إضافة الكلاس للنافذة المستهدفة */

        scopes.forEach(function (scope) {
            if (!scope.classList.contains(
                SCOPE_CLASS
            )) {
                scope.classList.add(
                    SCOPE_CLASS
                );
            }
        });
    }

    /* ======================================
       تشغيل ومراقبة تغيّر البروفايل
       ====================================== */

    function init() {
        if (window.__fexGoldenMelodyStarted) {
            return;
        }

        window.__fexGoldenMelodyStarted = true;

        addStyles();
        updateProfiles();

        let pending = false;

        const observer = new MutationObserver(
            function () {
                if (pending) return;

                pending = true;

                requestAnimationFrame(function () {
                    pending = false;
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
