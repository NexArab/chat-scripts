
(function () {
    "use strict";

    /*
       SAUDI ROSE PROFILE V1
       وردة السعودية

       العضوة: ⠀ˢʰ

       وردي غباري + أخضر سعودي
       + لمسات شامبين ذهبية

       مستقل عن تصميم SH وإستبرق
    */

    const TARGET = "\u2800\u02E2\u02B0";

    const BODY_CLASS = "saudi-rose-profile";
    const SCOPE_CLASS = "saudi-rose-scope";
    const EMBLEM_CLASS = "saudi-rose-emblem";
    const STYLE_ID = "saudi-rose-style";

    const EMBLEM_URL =
        "https://commons.wikimedia.org/wiki/Special:FilePath/Emblem_of_Saudi_Arabia_(2).svg";

    /* ==============================
       1 - مطابقة العضوة بدقة
       ============================== */

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

    /* ==============================
       2 - تحديد نافذة البروفايل
       ============================== */

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

    /* ==============================
       3 - شعار النخلة والسيفين
       ============================== */

    function createEmblem() {
        const ornament = document.createElement("div");

        ornament.className = EMBLEM_CLASS;
        ornament.setAttribute("aria-hidden", "true");

        const image = document.createElement("img");
        image.src = EMBLEM_URL;
        image.alt = "";
        image.loading = "lazy";
        image.decoding = "async";

        ornament.appendChild(image);

        return ornament;
    }

    /* ==============================
       4 - التصميم
       ============================== */

    function addStyles() {
        const old = document.getElementById(STYLE_ID);

        if (old) old.remove();

        const style = document.createElement("style");
        style.id = STYLE_ID;

        style.textContent = `

        /* =============================
           الهوية السعودية الوردية
           ============================= */

        .saudi-rose-scope {
            --sr-rose: #914F69;
            --sr-dark: #713A52;
            --sr-green: #17684B;
            --sr-green-dark: #10513B;
            --sr-gold: #D5B784;
            --sr-soft: #F3E3E9;
            --sr-bg: #FFF9FB;
            --sr-border: #E5CBD6;
            --sr-text: #61495A;
        }

        /* =============================
           الشريط العلوي
           ============================= */

        .saudi-rose-scope .th-upro-header {
            background: linear-gradient(
                120deg,
                #81455D,
                #A87088
            ) !important;

            color: #FFFFFF !important;

            border: 0 !important;
            border-bottom:
                2px solid #D5B784 !important;

            padding: 7px 9px !important;

            box-shadow: none !important;
        }

        .saudi-rose-scope
        .th-upro-header .th-upro-title {
            color: #FFFFFF !important;
            font-size: 12px !important;
            font-weight: 800 !important;
            line-height: 1.5 !important;
        }

        .saudi-rose-scope
        .th-upro-title img {
            border-radius: 5px !important;
            vertical-align: middle !important;
            margin-left: 4px !important;
        }

        .saudi-rose-scope
        .th-upro-header .clickable.badge {
            background: rgba(255,255,255,.16) !important;
            color: #FFFFFF !important;

            border: 1px solid rgba(
                255,255,255,.5
            ) !important;

            border-radius: 6px !important;
            box-shadow: none !important;
        }

        .saudi-rose-scope
        .th-upro-header .fa-times {
            color: #FFFFFF !important;
        }

        /* =============================
           جسم البروفايل
           ============================= */

        .th-upro-pro.saudi-rose-profile {
            background: #FFF9FB !important;
            color: #61495A !important;

            border: 1px solid #E5CBD6 !important;
            border-radius: 12px !important;

            box-shadow:
                0 4px 16px rgba(108,58,82,.10)
                !important;
        }

        .saudi-rose-profile
        .th-upro-profile-container {
            background: #FFF9FB !important;
            border-radius: 10px !important;
        }

        /* =============================
           الغلاف والصورة
           ============================= */

        .saudi-rose-profile .th-upro-cover {
            border-bottom:
                3px solid #D5B784 !important;
        }

        .saudi-rose-profile .th-upro-picture {
            border: 3px solid #D8B8C6 !important;
            border-radius: 50% !important;

            box-shadow:
                0 0 0 3px #FFFFFF,
                0 3px 12px rgba(108,58,82,.16)
                !important;
        }

        /* =============================
           الاسم والتوثيق
           ============================= */

        .saudi-rose-profile
        .th-upro-profile-content {
            background: #FCF0F5 !important;

            border-bottom:
                1px solid #E8D2DC !important;

            padding-bottom: 6px !important;
        }

        .saudi-rose-profile
        .th-upro-profile-name {
            color: #914F69 !important;

            font-size: 18px !important;
            font-weight: 800 !important;
            line-height: 1.65 !important;

            text-shadow:
                0 1px 0 #FFFFFF !important;
        }

        .saudi-rose-profile
        .th-upro-name-wrap::before,
        .saudi-rose-profile
        .th-upro-name-wrap::after {
            content: "✦";
            color: #C39C6A;
            font-size: 12px;
            margin: 0 6px;
        }

        /* =============================
           الشعار السعودي الأنيق
           ============================= */

        .saudi-rose-profile
        .saudi-rose-emblem {
            width: 58px;
            height: 65px;

            margin: 6px auto 7px;
            padding: 8px;

            box-sizing: border-box;

            background: linear-gradient(
                145deg,
                rgba(255,255,255,.96),
                rgba(235,246,239,.9)
            );

            border: 1px solid #D6BEA1;
            border-radius: 15px;

            box-shadow:
                inset 0 1px 0 #FFFFFF,
                0 2px 7px rgba(107,68,82,.09);

            pointer-events: none;
        }

        .saudi-rose-profile
        .saudi-rose-emblem img {
            display: block;
            width: 100%;
            height: 100%;

            object-fit: contain;
        }

        /* =============================
           المشاهدات والنقاط
           ============================= */

        .saudi-rose-profile .thProfileStat {
            background: #FFFFFF !important;

            border: 1px solid #E7D2DC !important;
            border-radius: 9px !important;

            box-shadow:
                0 1px 4px rgba(108,58,82,.05)
                !important;
        }

        .saudi-rose-profile .thProfileStatShine,
        .saudi-rose-profile .NUMBER_TH,
        .saudi-rose-profile .thProfilePointsNum {
            color: #914F69 !important;
            font-weight: 700 !important;
        }

        .saudi-rose-profile .thProfileEye {
            color: #A77A8C !important;
        }

        .saudi-rose-profile .thProfilePointsIcon {
            color: #BA9865 !important;
        }

        /* =============================
           الدولة والعلم
           ============================= */

        .saudi-rose-profile
        .th-upro-meta-label {
            background: #FFF9FB !important;
        }

        .saudi-rose-profile .th-upro-co {
            background: #F4EDF0 !important;
            color: #17684B !important;

            border: 1px solid #D9C6CF !important;
            border-radius: 8px !important;

            padding: 3px 6px !important;

            font-size: 11px !important;
            font-weight: 700 !important;
        }

        .saudi-rose-profile .th-upro-co img {
            max-width: 27px !important;

            width: auto !important;
            height: auto !important;

            padding: 2px !important;
            margin: 0 3px !important;

            background: #FFFFFF !important;

            border: 1px solid #C7D9CB !important;
            border-radius: 5px !important;
        }

        /* =============================
           الغرفة الحالية
           ============================= */

        .saudi-rose-profile
        .th-upro-meta-label .roomh {
            background: linear-gradient(
                145deg,
                #FFFFFF,
                #EAF3ED
            ) !important;

            color: #17684B !important;

            border: 1px solid #B8D2C2 !important;
            border-radius: 8px !important;

            padding: 3px 6px !important;

            font-size: 11px !important;
            font-weight: 700 !important;

            box-shadow: none !important;
            text-shadow: none !important;
        }

        .saudi-rose-profile
        .th-upro-meta-label .roomh img {
            max-width: 24px !important;
            max-height: 24px !important;

            width: auto !important;
            height: auto !important;

            margin-left: 4px !important;
            vertical-align: middle !important;

            border-radius: 5px !important;
        }

        /* =============================
           النبذة الشخصية
           ============================= */

        .saudi-rose-profile .th-upro-bio {
            background: #FFFFFF !important;
            color: #73586A !important;

            border: 1px solid #E6D0DB !important;
            border-right:
                3px solid #17684B !important;

            border-radius: 8px !important;

            padding: 8px !important;
            line-height: 1.65 !important;

            box-shadow: none !important;
        }

        /* =============================
           ألعاب XO واللودو
           ============================= */

        .saudi-rose-profile .th-upro-game-xo,
        .saudi-rose-profile .th-upro-game-ludo {
            background: #E8F2EB !important;
            color: #17684B !important;

            border: 1px solid #BBD4C4 !important;
            border-radius: 8px !important;

            font-weight: 700 !important;
            box-shadow: none !important;
        }

        /* =============================
           شبكة أزرار البروفايل

           ثلاثة أزرار بكل صف
           بدون تغيير display
           ============================= */

        .th-upro-pro.saudi-rose-profile
        > center > a.th-upro-action,
        .th-upro-pro.saudi-rose-profile
        > center > a.th-upro-action-no-margin {
            float: left !important;

            width: calc(33.333333% - 6px)
                !important;

            min-width: 0 !important;

            height: 36px !important;
            min-height: 36px !important;

            margin: 2px 3px !important;
            padding: 5px 2px !important;

            box-sizing: border-box !important;

            background: linear-gradient(
                145deg,
                #FFFFFF,
                #F7EDF2
            ) !important;

            border: 1px solid #E4CCD7 !important;
            border-radius: 7px !important;

            box-shadow:
                inset 0 1px 0 #FFFFFF
                !important;

            text-shadow: none !important;

            font-size: 12px !important;
            font-weight: 700 !important;
            line-height: 1.25 !important;

            text-align: center !important;
            overflow: hidden;

            color: var(
                --sr-btn-color,
                #914F69
            ) !important;

            -webkit-text-fill-color: var(
                --sr-btn-color,
                #914F69
            ) !important;
        }

        /* =============================
           ألوان النصوص والأيقونات
           ============================= */

        /* المحادثة الخاصة */

        .saudi-rose-profile a.upm {
            --sr-btn-color: #17684B;
        }

        /* التنبيه */

        .saudi-rose-profile a.unot {
            --sr-btn-color: #78587B;
        }

        /* الإعجابات */

        .saudi-rose-profile a.ulike {
            --sr-btn-color: #BB4470;
        }

        /* الهدية */

        .saudi-rose-profile a.ugift {
            --sr-btn-color: #9B7438;
        }

        /* كشف النكات */

        .saudi-rose-profile a.uh {
            --sr-btn-color: #526D5F;
        }

        /* الصورة والبنر */

        .saudi-rose-profile a.udelpic,
        .saudi-rose-profile a.ubnr {
            --sr-btn-color: #9D5279;
        }

        /* ترقية مراقب */

        .saudi-rose-profile a.thRoomMod,
        .saudi-rose-profile a.uunmute {
            --sr-btn-color: #087E57;
        }

        /* الطرد والباند */

        .saudi-rose-profile a.urkick,
        .saudi-rose-profile a.ukick,
        .saudi-rose-profile a.uban,
        .saudi-rose-profile a.ban20 {
            --sr-btn-color: #B2475B;
        }

        /* الإسكات */

        .saudi-rose-profile a.meiut,
        .saudi-rose-profile a.meiutbc {
            --sr-btn-color: #A56843;
        }

        /* الإطار وبنر الحالة والغلاف */

        .saudi-rose-profile a.DELAFT,
        .saudi-rose-profile a.DELMFT,
        .saudi-rose-profile a.Mcover {
            --sr-btn-color: #527360;
        }

        /* تجاهل */

        .saudi-rose-profile a.umute {
            --sr-btn-color: #B44758;
        }

        /* تطبيق لون الأيقونة والنص */

        .th-upro-pro.saudi-rose-profile
        > center > a.th-upro-action,
        .th-upro-pro.saudi-rose-profile
        > center > a.th-upro-action-no-margin,
        .th-upro-pro.saudi-rose-profile
        > center > a.th-upro-action::before,
        .th-upro-pro.saudi-rose-profile
        > center > a.th-upro-action-no-margin::before,
        .th-upro-pro.saudi-rose-profile
        > center > a.th-upro-action i,
        .th-upro-pro.saudi-rose-profile
        > center > a.th-upro-action-no-margin i {
            color: var(
                --sr-btn-color,
                #914F69
            ) !important;

            -webkit-text-fill-color: var(
                --sr-btn-color,
                #914F69
            ) !important;
        }

        /* الأزرار المخفية تبقى مخفية */

        .saudi-rose-profile
        a[style*="display:none"],
        .saudi-rose-profile
        a[style*="display: none"] {
            display: none !important;
        }

        @media (hover: hover) {
            .saudi-rose-profile
            > center > a.th-upro-action:hover,
            .saudi-rose-profile
            > center > a.th-upro-action-no-margin:hover {
                background: #F1E0E8 !important;
                border-color: #D8AFBF !important;
            }
        }

        /* =============================
           حقول إدارة متصلة بصريًا
           ============================= */

        .saudi-rose-scope
        .th-upro-edit-box,
        .saudi-rose-scope
        .th-upro-power-box,
        .saudi-rose-scope
        .th-upro-room-box {
            float: none !important;
            clear: both !important;

            width: calc(100% - 12px) !important;

            margin: 0 6px !important;
            padding: 8px 10px !important;

            box-sizing: border-box !important;

            background: #FFFBFD !important;
            color: #61495A !important;

            border: 1px solid #E5CBD6 !important;
            border-bottom: 0 !important;

            border-radius: 0 !important;
            box-shadow: none !important;
        }

        .saudi-rose-scope
        .th-upro-edit-box.nickbox {
            border-radius:
                11px 11px 0 0 !important;

            margin-top: 4px !important;
        }

        .saudi-rose-scope
        .th-upro-room-box.roomzbox {
            border-bottom:
                1px solid #E5CBD6 !important;

            border-radius:
                0 0 11px 11px !important;

            margin-bottom: 5px !important;
        }

        /* عناوين الإدارة */

        .saudi-rose-scope
        .th-upro-edit-box label,
        .saudi-rose-scope
        .th-upro-power-box label,
        .saudi-rose-scope
        .th-upro-room-box label {
            color: #914F69 !important;

            font-size: 12px !important;
            font-weight: 700 !important;
        }

        .saudi-rose-scope
        .th-upro-edit-label,
        .saudi-rose-scope
        .th-upro-like-label,
        .saudi-rose-scope
        .th-upro-eva-label {
            background: #F3E3E9 !important;
            color: #914F69 !important;

            border: 1px solid #DDC3CF !important;
            border-radius: 6px !important;

            padding: 4px 7px !important;
        }

        /* الحقول والقوائم */

        .saudi-rose-scope
        .th-upro-edit-box input,
        .saudi-rose-scope
        .th-upro-edit-box textarea,
        .saudi-rose-scope
        .th-upro-power-box input,
        .saudi-rose-scope
        .th-upro-room-box input,
        .saudi-rose-scope
        .th-upro-power-box select,
        .saudi-rose-scope
        .th-upro-room-box select {
            background: #FFFFFF !important;
            color: #61495A !important;

            border: 1px solid #E0CCD5 !important;
            border-radius: 6px !important;

            font-size: 12px !important;
            line-height: 1.5 !important;

            box-shadow: none !important;
        }

        /* التركيز */

        .saudi-rose-scope
        .th-upro-edit-box input:focus,
        .saudi-rose-scope
        .th-upro-edit-box textarea:focus,
        .saudi-rose-scope
        .th-upro-power-box input:focus,
        .saudi-rose-scope
        .th-upro-room-box input:focus,
        .saudi-rose-scope
        .th-upro-power-box select:focus,
        .saudi-rose-scope
        .th-upro-room-box select:focus {
            border-color: #B98BA1 !important;

            outline:
                2px solid rgba(185,139,161,.15)
                !important;

            outline-offset: 0 !important;
        }

        /* أزرار الحفظ */

        .saudi-rose-scope
        .th-upro-save-small,
        .saudi-rose-scope
        .th-upro-edit-box .u-nickc {
            background: linear-gradient(
                145deg,
                #FFFFFF,
                #EEDCE5
            ) !important;

            color: #914F69 !important;

            border: 1px solid #D9BCCA !important;
            border-radius: 7px !important;

            font-size: 12px !important;
            font-weight: 700 !important;

            box-shadow: none !important;
        }

        /* عدم إظهار الحقول المخفية */

        .saudi-rose-scope
        .th-upro-edit-box[style*="display:none"],
        .saudi-rose-scope
        .th-upro-edit-box[style*="display: none"],
        .saudi-rose-scope
        .th-upro-power-box[style*="display:none"],
        .saudi-rose-scope
        .th-upro-power-box[style*="display: none"],
        .saudi-rose-scope
        .th-upro-room-box[style*="display:none"],
        .saudi-rose-scope
        .th-upro-room-box[style*="display: none"] {
            display: none !important;
        }

        /* الجوال */

        @media (max-width: 420px) {
            .saudi-rose-profile
            .th-upro-profile-name {
                font-size: 15px !important;
            }

            .th-upro-pro.saudi-rose-profile
            > center > a.th-upro-action,
            .th-upro-pro.saudi-rose-profile
            > center > a.th-upro-action-no-margin {
                height: 35px !important;
                min-height: 35px !important;
                font-size: 11px !important;
            }

            .saudi-rose-scope
            .th-upro-edit-box,
            .saudi-rose-scope
            .th-upro-power-box,
            .saudi-rose-scope
            .th-upro-room-box {
                width: calc(100% - 10px) !important;

                margin-left: 5px !important;
                margin-right: 5px !important;

                padding: 7px !important;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .saudi-rose-profile a.th-upro-action,
            .saudi-rose-profile
            a.th-upro-action-no-margin {
                transition: none !important;
            }
        }
        `;

        document.head.appendChild(style);
    }

    /* ==============================
       5 - تحديث البروفايل
       ============================== */

    function updateProfiles() {
        const scopes = new Set();

        document.querySelectorAll(
            ".th-upro-pro"
        ).forEach(function (profile) {

            const matched = isTarget(profile);

            profile.classList.toggle(
                BODY_CLASS,
                matched
            );

            /* إزالة الزخرفة السابقة */

            const oldEmblem = profile.querySelector(
                ".saudi-emerald-emblem"
            );

            if (oldEmblem && matched) {
                oldEmblem.remove();
            }

            const newEmblem = profile.querySelector(
                "." + EMBLEM_CLASS
            );

            if (matched) {
                const scope = getScope(profile);

                if (scope) scopes.add(scope);

                if (!newEmblem) {
                    const content = profile.querySelector(
                        ".th-upro-profile-content"
                    );

                    if (content) {
                        content.appendChild(
                            createEmblem()
                        );
                    }
                }
            } else if (newEmblem) {
                newEmblem.remove();
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
            if (!scope.classList.contains(
                SCOPE_CLASS
            )) {
                scope.classList.add(
                    SCOPE_CLASS
                );
            }
        });
    }

    /* ==============================
       6 - التشغيل
       ============================== */

    function init() {
        if (window.__saudiRoseProfileStarted) return;

        window.__saudiRoseProfileStarted = true;

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
