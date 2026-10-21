
(function () {
    "use strict";

    /* ==========================================
       SH PEARL PROFILE V3
       اللؤلؤة البيضاء - التصميم المتكامل

       الاسم الدقيق: U+2800 ثم مسافة ثم SH
       يشمل الزوار والإدارة
       ========================================== */

    const TARGET_NAME = "\u2800 SH";
    const PROFILE_CLASS = "sh-pearl-profile";
    const SCOPE_CLASS = "sh-pearl-scope";
    const STYLE_ID = "sh-pearl-style";

    /* ==========================================
       1 - التأكد من اسم العضوة
       ========================================== */

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

    /* ==========================================
       2 - تحديد النافذة الكاملة
       ========================================== */

    function getScope(profile) {
        if (!profile) return null;

        const modal = profile.closest(
            ".modal-content, .modal"
        );

        if (modal) return modal;

        /* دعم القوالب التي لا تستخدم modal-content */

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

    /* ==========================================
       3 - CSS كامل
       ========================================== */

    function addStyle() {
        const old = document.getElementById(STYLE_ID);

        if (old) old.remove();

        const style = document.createElement("style");
        style.id = STYLE_ID;

        style.textContent = `

        /* ======================================
           الهوية الرئيسية
           ====================================== */

        .sh-pearl-scope {
            --sh-white: #FFFFFF;
            --sh-ivory: #FCFAF7;
            --sh-cream: #F7F1E9;
            --sh-soft: #F2EADF;
            --sh-gold: #BC9C6C;
            --sh-gold-dark: #987A53;
            --sh-text: #6A5548;
            --sh-border: #E3D7C8;
        }

        /* ======================================
           جسم البروفايل
           ====================================== */

        .th-upro-pro.sh-pearl-profile {
            background: #FCFAF7 !important;
            color: #6A5548 !important;

            border: 1px solid #D8C8AE !important;
            border-radius: 11px !important;

            box-shadow:
                0 3px 12px rgba(110,87,61,.10)
                !important;
        }

        .sh-pearl-profile
        .th-upro-profile-container {
            background: #FCFAF7 !important;
            border-radius: 10px !important;
        }

        /* ======================================
           الشريط العلوي للنافذة
           ====================================== */

        .sh-pearl-scope .th-upro-header {
            background: #F2EADF !important;
            color: #6A5548 !important;

            border: 0 !important;
            border-bottom:
                2px solid #BC9C6C !important;

            padding: 7px 9px !important;

            box-shadow:
                0 2px 5px rgba(110,87,61,.08)
                !important;
        }

        .sh-pearl-scope
        .th-upro-header .th-upro-title {
            color: #6A5548 !important;
            font-size: 12px !important;
            font-weight: 800 !important;
            line-height: 1.5 !important;
            text-shadow: none !important;
        }

        .sh-pearl-scope
        .th-upro-header .th-upro-title img {
            vertical-align: middle !important;
            border-radius: 4px !important;
            margin-left: 4px !important;
        }

        .sh-pearl-scope
        .th-upro-header .th-upro-title img.u-ico {
            max-height: 20px !important;
            width: auto;
        }

        /* زر الإغلاق */

        .sh-pearl-scope
        .th-upro-header .clickable.badge {
            background: #B69A75 !important;
            color: #FFFFFF !important;

            border: 1px solid #A78960 !important;
            border-radius: 5px !important;

            box-shadow: none !important;
        }

        .sh-pearl-scope
        .th-upro-header .clickable.badge i {
            color: #FFFFFF !important;
        }

        /* ======================================
           الغلاف وصورة العضوة
           ====================================== */

        .sh-pearl-profile .th-upro-cover {
            border-bottom:
                3px solid #BC9C6C !important;
        }

        .sh-pearl-profile .th-upro-picture {
            border: 3px solid #D8BC8F !important;
            border-radius: 50% !important;

            box-shadow:
                0 0 0 3px #FFFFFF,
                0 3px 10px rgba(110,87,61,.15)
                !important;
        }

        /* ======================================
           الاسم والتوثيق
           ====================================== */

        .sh-pearl-profile
        .th-upro-profile-content {
            background: #FFFDF9 !important;
            border-bottom:
                1px solid #E6DCD0 !important;
        }

        .sh-pearl-profile
        .th-upro-profile-name {
            color: #7B6045 !important;
            font-size: 17px !important;
            font-weight: 800 !important;
            line-height: 1.6 !important;

            text-shadow:
                0 1px 0 #FFFFFF,
                0 2px 4px rgba(110,87,61,.10)
                !important;
        }

        .sh-pearl-profile
        .th-upro-name-wrap::before,
        .sh-pearl-profile
        .th-upro-name-wrap::after {
            content: "✧";
            color: #BC9C6C;
            font-size: 14px;
        }

        .sh-pearl-profile
        .th-upro-name-wrap::before {
            margin-left: 5px;
        }

        .sh-pearl-profile
        .th-upro-name-wrap::after {
            margin-right: 5px;
        }

        /* التوثيق يحتفظ بصورته الأصلية */

        .sh-pearl-profile
        .th-upro-verification:not([src=""]) {
            filter: drop-shadow(
                0 1px 2px rgba(110,87,61,.15)
            );
        }

        /* ======================================
           المشاهدات والنقاط
           ====================================== */

        .sh-pearl-profile .thProfileStat {
            background: #FFFFFF !important;

            border: 1px solid #E6DCD0 !important;
            border-radius: 8px !important;

            box-shadow:
                0 1px 4px rgba(110,87,61,.05)
                !important;
        }

        .sh-pearl-profile .thProfileStatShine,
        .sh-pearl-profile .NUMBER_TH,
        .sh-pearl-profile .thProfilePointsNum {
            color: #6A5548 !important;
            font-weight: 700 !important;
        }

        .sh-pearl-profile .thProfileEye {
            color: #A58D73 !important;
        }

        .sh-pearl-profile .thProfilePointsIcon {
            color: #BC9C6C !important;
        }

        /* ======================================
           الدولة والعلم
           ====================================== */

        .sh-pearl-profile .th-upro-meta-label {
            background: #FCFAF7 !important;
        }

        .sh-pearl-profile .th-upro-co {
            background: #F7F1E9 !important;
            color: #6A5548 !important;

            border: 1px solid #E3D7C8 !important;
            border-radius: 6px !important;

            padding: 3px 5px !important;
            font-size: 10px !important;
            font-weight: 700 !important;
            line-height: 1.5 !important;

            box-shadow: none !important;
        }

        /* علم الدولة */

        .sh-pearl-profile .th-upro-co img {
            vertical-align: middle !important;

            width: auto !important;
            max-width: 27px !important;
            height: auto !important;

            padding: 2px !important;
            margin: 0 3px !important;

            background: #FFFFFF !important;

            border: 1px solid #DDCDB7 !important;
            border-radius: 4px !important;

            box-shadow:
                0 1px 3px rgba(110,87,61,.09)
                !important;
        }

        /* ======================================
           زر الغرفة الحالية
           ====================================== */

        .sh-pearl-profile
        .th-upro-meta-label .roomh {
            background: #F2EADF !important;
            color: #6A5548 !important;

            border: 1px solid #CEB38B !important;
            border-radius: 6px !important;

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
            vertical-align: middle !important;
            border-radius: 4px !important;
        }

        /* ======================================
           النبذة الشخصية
           ====================================== */

        .sh-pearl-profile .th-upro-bio {
            background: #FFFFFF !important;
            color: #756453 !important;

            border: 1px solid #E6DCD0 !important;
            border-right:
                3px solid #BC9C6C !important;

            border-radius: 7px !important;

            padding: 8px !important;
            line-height: 1.6 !important;
            box-shadow: none !important;
        }

        /* ======================================
           ألعاب XO واللودو
           ====================================== */

        .sh-pearl-profile .th-upro-game-xo,
        .sh-pearl-profile .th-upro-game-ludo {
            background: #F6F0E7 !important;
            color: #6A5548 !important;

            border: 1px solid #D9C5A9 !important;
            border-radius: 7px !important;

            font-weight: 700 !important;
            box-shadow: none !important;
        }

        /* ======================================
           أزرار البروفايل العامة
           ====================================== */

        .sh-pearl-profile .th-upro-action,
        .sh-pearl-profile
        .th-upro-action-no-margin {
            border-radius: 6px !important;
            font-weight: 700 !important;
            box-shadow: none !important;
        }

        .sh-pearl-profile a.upm {
            background: #8C7357 !important;
            color: #FFFFFF !important;
            border-color: #8C7357 !important;
        }

        .sh-pearl-profile a.unot {
            background: #AA9175 !important;
            color: #FFFFFF !important;
            border-color: #AA9175 !important;
        }

        .sh-pearl-profile a.ulike {
            background: #C3979D !important;
            color: #FFFFFF !important;
            border-color: #C3979D !important;
        }

        .sh-pearl-profile a.ugift {
            background: #BC9C6C !important;
            color: #FFFFFF !important;
            border-color: #BC9C6C !important;
        }

        /* أدوات الإدارة */

        .sh-pearl-profile a.uh,
        .sh-pearl-profile a.udelpic,
        .sh-pearl-profile a.ubnr,
        .sh-pearl-profile a.DELAFT,
        .sh-pearl-profile a.DELMFT,
        .sh-pearl-profile a.Mcover {
            background: #9A8062 !important;
            color: #FFFFFF !important;
            border-color: #BC9C6C !important;
        }

        /* ترقية مراقب */

        .sh-pearl-profile a.thRoomMod {
            background: #477865 !important;
            color: #FFFFFF !important;
            border-color: #477865 !important;
        }

        /* طرد وباند */

        .sh-pearl-profile a.urkick,
        .sh-pearl-profile a.ukick,
        .sh-pearl-profile a.uban,
        .sh-pearl-profile a.ban20 {
            background: #994D56 !important;
            color: #FFFFFF !important;
            border-color: #853F48 !important;
        }

        /* الإسكات */

        .sh-pearl-profile a.meiut,
        .sh-pearl-profile a.meiutbc {
            background: #B06A55 !important;
            color: #FFFFFF !important;
            border-color: #985643 !important;
        }

        /* تجاهل وإلغاء التجاهل */

        .sh-pearl-profile a.umute {
            background: #A07162 !important;
            color: #FFFFFF !important;
            border-color: #A07162 !important;
        }

        .sh-pearl-profile a.uunmute {
            background: #477865 !important;
            color: #FFFFFF !important;
            border-color: #477865 !important;
        }

        /* ======================================
           جديد: صناديق تعديل الأدمن
           ====================================== */

        .sh-pearl-scope .th-upro-edit-box,
        .sh-pearl-scope .th-upro-power-box,
        .sh-pearl-scope .th-upro-room-box {
            background: #FCFAF7 !important;

            border: 1px solid #E3D7C8 !important;
            border-radius: 8px !important;

            margin-top: 5px !important;
            margin-bottom: 5px !important;

            padding: 7px !important;

            color: #6A5548 !important;

            box-shadow:
                0 1px 4px rgba(110,87,61,.05)
                !important;
        }

        /* عناوين صناديق التعديل */

        .sh-pearl-scope .th-upro-edit-box label,
        .sh-pearl-scope .th-upro-power-box label,
        .sh-pearl-scope .th-upro-room-box label {
            color: #795F45 !important;
            font-size: 11px !important;
            font-weight: 700 !important;
        }

        /* العناوين الملونة الافتراضية */

        .sh-pearl-scope
        .th-upro-edit-box .th-upro-edit-label,
        .sh-pearl-scope
        .th-upro-edit-box .th-upro-like-label,
        .sh-pearl-scope
        .th-upro-edit-box .th-upro-eva-label {
            background: #EFE3D1 !important;
            color: #795F45 !important;

            border: 1px solid #D9C5A9 !important;
            border-radius: 5px !important;

            padding: 3px 6px !important;
        }

        /* ======================================
           حقول إدخال الأدمن
           ====================================== */

        .sh-pearl-scope .th-upro-edit-box input,
        .sh-pearl-scope .th-upro-edit-box textarea,
        .sh-pearl-scope .th-upro-power-box input,
        .sh-pearl-scope .th-upro-room-box input,
        .sh-pearl-scope .th-upro-power-box select,
        .sh-pearl-scope .th-upro-room-box select {
            background: #FFFFFF !important;
            color: #6A5548 !important;

            border: 1px solid #DCCAB2 !important;
            border-radius: 5px !important;

            font-size: 11px !important;
            line-height: 1.45 !important;

            box-shadow: none !important;
        }

        /* التركيز أثناء التعديل */

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
            border-color: #BC9C6C !important;

            outline: 2px solid
                rgba(188,156,108,.15) !important;

            outline-offset: 0 !important;
        }

        /* ======================================
           أزرار الحفظ والتغيير والنقل
           ====================================== */

        .sh-pearl-scope .th-upro-save-small,
        .sh-pearl-scope .th-upro-edit-box .u-nickc {
            background: #977A55 !important;
            color: #FFFFFF !important;

            border: 1px solid #896D4B !important;
            border-radius: 5px !important;

            font-size: 11px !important;
            font-weight: 700 !important;

            box-shadow: none !important;
        }

        @media (hover: hover) {
            .sh-pearl-scope
            .th-upro-save-small:hover,
            .sh-pearl-scope
            .th-upro-edit-box .u-nickc:hover {
                background: #806545 !important;
            }
        }

        /* ======================================
           البحث والصلاحيات
           ====================================== */

        .sh-pearl-scope
        .th-upro-power-search {
            background: #FFFFFF !important;
            color: #6A5548 !important;
        }

        .sh-pearl-scope
        .th-upro-power-select,
        .sh-pearl-scope
        .th-upro-room-select {
            background: #FFFFFF !important;
            color: #6A5548 !important;

            border: 1px solid #D9C5A9 !important;
            border-radius: 6px !important;
        }

        /* لا نغير الخيارات أو الصلاحيات */

        /* ======================================
           الهواتف الصغيرة
           ====================================== */

        @media (max-width: 420px) {

            .sh-pearl-profile
            .th-upro-profile-name {
                font-size: 15px !important;
            }

            .sh-pearl-profile
            .th-upro-co {
                font-size: 10px !important;
            }

            .sh-pearl-profile
            .th-upro-meta-label .roomh {
                font-size: 10px !important;
            }

            .sh-pearl-scope .th-upro-edit-box,
            .sh-pearl-scope .th-upro-power-box,
            .sh-pearl-scope .th-upro-room-box {
                padding: 5px !important;
            }
        }

        /* ======================================
           نهاية التصميم
           لا نغير display أو position
           لوظائف الأزرار أو الحقول
           ====================================== */
        `;

        document.head.appendChild(style);
    }

    /* ==========================================
       4 - تحديث الحاويات
       ========================================== */

    function updateProfiles() {
        const profiles = document.querySelectorAll(
            ".th-upro-pro"
        );

        const activeScopes = new Set();

        profiles.forEach(function (profile) {
            const matched = isTarget(profile);

            profile.classList.toggle(
                PROFILE_CLASS,
                matched
            );

            if (matched) {
                const scope = getScope(profile);
                if (scope) activeScopes.add(scope);
            }
        });

        /* إزالة الهوية من أي نافذة سابقة */

        document.querySelectorAll(
            "." + SCOPE_CLASS
        ).forEach(function (element) {
            if (!activeScopes.has(element)) {
                element.classList.remove(
                    SCOPE_CLASS
                );
            }
        });

        /* ربط الهوية بالنافذة كاملة */

        activeScopes.forEach(function (element) {
            element.classList.add(
                SCOPE_CLASS
            );
        });
    }

    /* ==========================================
       5 - تشغيل خفيف دون تكرار المراقبة
       ========================================== */

    function init() {
        if (window.__shPearlV3Started) return;

        window.__shPearlV3Started = true;

        addStyle();
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
