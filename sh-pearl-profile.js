
(function () {
    "use strict";

    /*
     * SH PEARL PROFILE V5
     * White Crystal Edition
     *
     * العضوة: ⠀ SH
     * تصميم البروفايل والإدارة بالكامل
     * دون تغيير وظائف الشات
     */

    const TARGET = "\u2800 SH";
    const BODY_CLASS = "sh-pearl-profile";
    const SCOPE_CLASS = "sh-pearl-scope";
    const STYLE_ID = "sh-pearl-style";

    /* ===============================
       1 - التعرف على العضوة
       =============================== */

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

    /* ===============================
       2 - الحاوية الكاملة
       =============================== */

    function getScope(profile) {
        const modal = profile.closest(".modal");

        if (modal) return modal;

        let el = profile.parentElement;

        while (
            el &&
            el !== document.body
        ) {
            if (
                el.querySelector(".th-upro-header") &&
                el.querySelector(".th-upro-pro") &&
                (
                    el.querySelector(".th-upro-edit-box") ||
                    el.querySelector(".th-upro-power-box")
                )
            ) {
                return el;
            }

            el = el.parentElement;
        }

        return profile.closest(".modal-content") ||
               profile;
    }

    /* ===============================
       3 - تصميم اللؤلؤة الكريستالية
       =============================== */

    function addStyles() {
        const existing = document.getElementById(
            STYLE_ID
        );

        if (existing) existing.remove();

        const style = document.createElement("style");
        style.id = STYLE_ID;

        style.textContent = `

        /* ===================================
           الألوان الأساسية
           =================================== */

        .sh-pearl-scope {
            --sp-bg: #F8FAFC;
            --sp-white: #FFFFFF;
            --sp-soft: #EDF2F6;
            --sp-border: #CCD7E1;
            --sp-text: #344A60;
            --sp-muted: #687D90;
            --sp-gold: #C3AB85;
        }

        /* ===================================
           النافذة والشريط العلوي
           =================================== */

        .sh-pearl-scope .th-upro-header {
            background:
                linear-gradient(
                    135deg,
                    #FFFFFF 0%,
                    #EDF3F7 100%
                ) !important;

            color: #344A60 !important;

            border: 0 !important;
            border-bottom:
                2px solid #C3AB85 !important;

            padding: 7px 9px !important;
            box-shadow: none !important;
        }

        .sh-pearl-scope
        .th-upro-header .th-upro-title {
            color: #344A60 !important;
            font-size: 12px !important;
            font-weight: 800 !important;
        }

        .sh-pearl-scope
        .th-upro-title img {
            border-radius: 5px !important;
            vertical-align: middle !important;
            margin-left: 4px !important;
        }

        .sh-pearl-scope
        .th-upro-header .clickable.badge {
            background: #DFE8EF !important;
            color: #344A60 !important;

            border: 1px solid #C2CED9 !important;
            border-radius: 6px !important;

            box-shadow: none !important;
        }

        .sh-pearl-scope
        .th-upro-header .fa-times {
            color: #344A60 !important;
        }

        /* ===================================
           جسم البروفايل
           =================================== */

        .th-upro-pro.sh-pearl-profile {
            background: #F8FAFC !important;
            color: #344A60 !important;

            border: 1px solid #D4DEE6 !important;
            border-radius: 12px !important;

            box-shadow:
                0 3px 14px rgba(44,67,87,.08)
                !important;
        }

        .sh-pearl-profile
        .th-upro-profile-container {
            background: #F8FAFC !important;
            border-radius: 10px !important;
        }

        /* ===================================
           الغلاف والصورة
           =================================== */

        .sh-pearl-profile .th-upro-cover {
            border-bottom:
                3px solid #C3AB85 !important;
        }

        .sh-pearl-profile .th-upro-picture {
            border: 3px solid #E5D5B8 !important;
            border-radius: 50% !important;

            box-shadow:
                0 0 0 3px #FFFFFF,
                0 3px 12px rgba(44,67,87,.14)
                !important;
        }

        /* ===================================
           الاسم والتوثيق
           =================================== */

        .sh-pearl-profile
        .th-upro-profile-content {
            background: #FCFDFE !important;
            border-bottom:
                1px solid #E0E6EB !important;
        }

        .sh-pearl-profile
        .th-upro-profile-name {
            color: #405A71 !important;
            font-size: 17px !important;
            font-weight: 800 !important;
            line-height: 1.6 !important;

            text-shadow:
                0 1px 0 #FFFFFF
                !important;
        }

        .sh-pearl-profile
        .th-upro-name-wrap::before,
        .sh-pearl-profile
        .th-upro-name-wrap::after {
            content: "✧";
            color: #B9A17D;
            font-size: 14px;
            margin: 0 5px;
        }

        /* ===================================
           المشاهدات والنقاط
           =================================== */

        .sh-pearl-profile .thProfileStat {
            background: #FFFFFF !important;

            border: 1px solid #DAE2E8 !important;
            border-radius: 9px !important;

            box-shadow:
                0 1px 4px rgba(44,67,87,.05)
                !important;
        }

        .sh-pearl-profile .thProfileStatShine,
        .sh-pearl-profile .NUMBER_TH,
        .sh-pearl-profile .thProfilePointsNum {
            color: #405A71 !important;
            font-weight: 700 !important;
        }

        .sh-pearl-profile .thProfileEye {
            color: #8198AA !important;
        }

        .sh-pearl-profile .thProfilePointsIcon {
            color: #BCA27C !important;
        }

        /* ===================================
           الدولة والعلم
           =================================== */

        .sh-pearl-profile
        .th-upro-meta-label {
            background: #F8FAFC !important;
        }

        .sh-pearl-profile .th-upro-co {
            background: #FFFFFF !important;
            color: #40566A !important;

            border: 1px solid #D4DEE6 !important;
            border-radius: 8px !important;

            padding: 3px 6px !important;
            font-size: 10px !important;
            font-weight: 700 !important;

            box-shadow: none !important;
        }

        .sh-pearl-profile .th-upro-co img {
            width: auto !important;
            max-width: 27px !important;
            height: auto !important;

            padding: 2px !important;
            margin: 0 3px !important;

            background: #FFFFFF !important;

            border: 1px solid #D6E0E8 !important;
            border-radius: 5px !important;

            vertical-align: middle !important;
        }

        /* ===================================
           الغرفة الحالية
           =================================== */

        .sh-pearl-profile
        .th-upro-meta-label .roomh {
            background:
                linear-gradient(
                    135deg,
                    #FFFFFF,
                    #EAF0F5
                ) !important;

            color: #344A60 !important;

            border: 1px solid #CBD6DF !important;
            border-radius: 8px !important;

            padding: 3px 6px !important;

            font-size: 10px !important;
            font-weight: 700 !important;

            text-shadow: none !important;
            box-shadow: none !important;
        }

        .sh-pearl-profile
        .th-upro-meta-label .roomh img {
            max-width: 24px !important;
            max-height: 24px !important;

            width: auto !important;
            height: auto !important;

            margin-left: 4px !important;
            border-radius: 5px !important;

            vertical-align: middle !important;
        }

        /* ===================================
           النبذة الشخصية
           =================================== */

        .sh-pearl-profile .th-upro-bio {
            background: #FFFFFF !important;
            color: #566B7D !important;

            border: 1px solid #DCE4EA !important;
            border-right:
                3px solid #C3AB85 !important;

            border-radius: 9px !important;

            padding: 8px !important;

            line-height: 1.6 !important;
            box-shadow: none !important;
        }

        /* ===================================
           الألعاب
           =================================== */

        .sh-pearl-profile .th-upro-game-xo,
        .sh-pearl-profile .th-upro-game-ludo {
            background: #EDF3F7 !important;
            color: #40576C !important;

            border: 1px solid #C9D6E0 !important;
            border-radius: 8px !important;

            font-weight: 700 !important;
            box-shadow: none !important;
        }

        /* ===================================
           أزرار البروفايل الكريستالية

           اللون نفسه لكل الأزرار
           نحافظ على عرضها وترتيبها الأصلي
           =================================== */

        .sh-pearl-profile a.th-upro-action,
        .sh-pearl-profile
        a.th-upro-action-no-margin {
            background:
                linear-gradient(
                    145deg,
                    #FFFFFF 0%,
                    #E5EDF3 100%
                ) !important;

            background-color: #EAF0F5 !important;

            color: #344A60 !important;

            border:
                1px solid #C7D4DF !important;

            border-radius: 9px !important;

            box-shadow:
                inset 0 1px 0 #FFFFFF,
                0 1px 3px rgba(44,67,87,.06)
                !important;

            text-shadow: none !important;

            font-weight: 700 !important;
            line-height: 1.45 !important;
        }

        /*
           إلغاء الألوان القديمة لجميع
           أنواع الأزرار دون تغيير وظائفها
        */

        .sh-pearl-profile a.upm,
        .sh-pearl-profile a.unot,
        .sh-pearl-profile a.ulike,
        .sh-pearl-profile a.ugift,
        .sh-pearl-profile a.uh,
        .sh-pearl-profile a.udelpic,
        .sh-pearl-profile a.ubnr,
        .sh-pearl-profile a.urkick,
        .sh-pearl-profile a.thRoomMod,
        .sh-pearl-profile a.ukick,
        .sh-pearl-profile a.uban,
        .sh-pearl-profile a.ban20,
        .sh-pearl-profile a.meiut,
        .sh-pearl-profile a.meiutbc,
        .sh-pearl-profile a.DELAFT,
        .sh-pearl-profile a.DELMFT,
        .sh-pearl-profile a.Mcover,
        .sh-pearl-profile a.umute,
        .sh-pearl-profile a.uunmute {
            background:
                linear-gradient(
                    145deg,
                    #FFFFFF,
                    #E5EDF3
                ) !important;

            background-color: #EAF0F5 !important;
            color: #344A60 !important;

            border-color: #C7D4DF !important;
            border-radius: 9px !important;

            box-shadow:
                inset 0 1px 0 #FFFFFF,
                0 1px 3px rgba(44,67,87,.06)
                !important;
        }

        /* لمسة تحذير صغيرة لأزرار العقوبات
           دون تغيير اللون الأساسي */

        .sh-pearl-profile a.urkick,
        .sh-pearl-profile a.ukick,
        .sh-pearl-profile a.uban,
        .sh-pearl-profile a.ban20,
        .sh-pearl-profile a.meiut,
        .sh-pearl-profile a.meiutbc {
            border-bottom:
                2px solid #C9A7A7 !important;
        }

        @media (hover: hover) {
            .sh-pearl-profile
            a.th-upro-action:hover,
            .sh-pearl-profile
            a.th-upro-action-no-margin:hover {
                background: #DDE8F0 !important;
                color: #243F55 !important;
            }
        }

        /* ===================================
           لوحة الإدارة الموحدة

           لا ننقل أي عنصر في DOM
           حتى تبقى وظائف الأزرار كما هي
           =================================== */

        .sh-pearl-scope .th-upro-edit-box,
        .sh-pearl-scope .th-upro-power-box,
        .sh-pearl-scope .th-upro-room-box {

            display: block !important;
            float: none !important;
            clear: both !important;

            width: calc(100% - 12px) !important;

            box-sizing: border-box !important;

            margin: 0 6px !important;
            padding: 9px 10px !important;

            background: rgba(
                255,255,255,.97
            ) !important;

            color: #344A60 !important;

            border: 1px solid #CDD8E1 !important;
            border-bottom: 0 !important;

            border-radius: 0 !important;

            box-shadow: none !important;
        }

        /*
           بداية لوحة الإدارة:
           الزخرفة
        */

        .sh-pearl-scope
        .th-upro-edit-box.nickbox {
            border-top-left-radius:
                12px !important;

            border-top-right-radius:
                12px !important;

            margin-top: 4px !important;
        }

        /*
           نهاية لوحة الإدارة:
           الغرفة
        */

        .sh-pearl-scope
        .th-upro-room-box.roomzbox {
            border-bottom:
                1px solid #CDD8E1 !important;

            border-bottom-left-radius:
                12px !important;

            border-bottom-right-radius:
                12px !important;

            margin-bottom: 5px !important;
        }

        /* فاصل ناعم بين كل قسم */

        .sh-pearl-scope
        .th-upro-edit-box + .th-upro-edit-box,
        .sh-pearl-scope
        .th-upro-edit-box + .th-upro-power-box,
        .sh-pearl-scope
        .th-upro-power-box + .th-upro-room-box {
            border-top-color: #E0E7ED !important;
        }

        /* ===================================
           عناوين الإدارة
           =================================== */

        .sh-pearl-scope
        .th-upro-edit-box label,
        .sh-pearl-scope
        .th-upro-power-box label,
        .sh-pearl-scope
        .th-upro-room-box label {
            color: #455D72 !important;
            font-size: 11px !important;
            font-weight: 700 !important;
        }

        .sh-pearl-scope .th-upro-edit-label,
        .sh-pearl-scope .th-upro-like-label,
        .sh-pearl-scope .th-upro-eva-label {
            background: #EDF3F7 !important;
            color: #455D72 !important;

            border: 1px solid #D6E0E8 !important;
            border-radius: 7px !important;

            padding: 4px 7px !important;
        }

        /* ===================================
           الحقول والقوائم
           =================================== */

        .sh-pearl-scope
        .th-upro-edit-box input,
        .sh-pearl-scope
        .th-upro-edit-box textarea,
        .sh-pearl-scope
        .th-upro-power-box input,
        .sh-pearl-scope
        .th-upro-room-box input,
        .sh-pearl-scope
        .th-upro-power-box select,
        .sh-pearl-scope
        .th-upro-room-box select {

            background: #F9FBFD !important;
            color: #344A60 !important;

            border: 1px solid #D0DBE4 !important;
            border-radius: 7px !important;

            font-size: 11px !important;
            line-height: 1.5 !important;

            box-shadow: none !important;
        }

        .sh-pearl-scope
        .th-upro-edit-box input:focus,
        .sh-pearl-scope
        .th-upro-edit-box textarea:focus,
        .sh-pearl-scope
        .th-upro-power-box input:focus,
        .sh-pearl-scope
        .th-upro-room-box input:focus,
        .sh-pearl-scope
        .th-upro-power-box select:focus,
        .sh-pearl-scope
        .th-upro-room-box select:focus {

            background: #FFFFFF !important;
            border-color: #95AABD !important;

            outline:
                2px solid rgba(149,170,189,.15)
                !important;

            outline-offset: 0 !important;
        }

        /* ===================================
           أزرار الحفظ والتغيير والنقل
           =================================== */

        .sh-pearl-scope
        .th-upro-save-small,
        .sh-pearl-scope
        .th-upro-edit-box .u-nickc {

            background:
                linear-gradient(
                    145deg,
                    #F5F8FA,
                    #DCE7EF
                ) !important;

            color: #344A60 !important;

            border:
                1px solid #BFCFDB !important;

            border-radius: 8px !important;

            font-size: 11px !important;
            font-weight: 700 !important;

            box-shadow:
                inset 0 1px 0 #FFFFFF
                !important;
        }

        /* ===================================
           الجوال
           =================================== */

        @media (max-width: 420px) {

            .sh-pearl-profile
            .th-upro-profile-name {
                font-size: 15px !important;
            }

            .sh-pearl-scope
            .th-upro-edit-box,
            .sh-pearl-scope
            .th-upro-power-box,
            .sh-pearl-scope
            .th-upro-room-box {
                width:
                    calc(100% - 10px) !important;

                margin-left: 5px !important;
                margin-right: 5px !important;

                padding: 8px !important;
            }

            .sh-pearl-scope .th-upro-header {
                padding: 6px 8px !important;
            }
        }

        /* ===================================
           تقليل الحركة
           =================================== */

        @media (
            prefers-reduced-motion: reduce
        ) {
            .sh-pearl-profile
            a.th-upro-action,
            .sh-pearl-profile
            a.th-upro-action-no-margin {
                transition: none !important;
            }
        }

        `;

        document.head.appendChild(style);
    }

    /* ===============================
       4 - تحديث البروفايل
       =============================== */

    function updateProfiles() {
        const profiles = document.querySelectorAll(
            ".th-upro-pro"
        );

        const scopes = new Set();

        profiles.forEach(function (profile) {
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

            if (matched) {
                scopes.add(getScope(profile));
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

        scopes.forEach(function (element) {
            if (
                element &&
                !element.classList.contains(
                    SCOPE_CLASS
                )
            ) {
                element.classList.add(
                    SCOPE_CLASS
                );
            }
        });
    }

    /* ===============================
       5 - تشغيل السكربت
       =============================== */

    function init() {
        if (window.__shPearlV5Started) return;

        window.__shPearlV5Started = true;

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
