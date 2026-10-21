
(function () {
    "use strict";

    /* ============================================
       SH PEARL PROFILE V4
       اللؤلؤة البيضاء - التصميم الكامل
       للزائر والأدمن

       العضوة: ⠀ SH
       اللون: Pearl White + Champagne
       ============================================ */

    const TARGET_NAME = "\u2800 SH";
    const BODY_CLASS = "sh-pearl-profile";
    const SCOPE_CLASS = "sh-pearl-scope";
    const STYLE_ID = "sh-pearl-style";

    /* ============================================
       تحديد العضوة بدقة
       ============================================ */

    function isTarget(profile) {
        if (!profile) return false;

        const name = profile.querySelector(
            ".th-upro-profile-name"
        );

        if (!name) return false;

        // المحافظة على المسافة الخاصة U+2800
        const value = name.textContent.replace(
            /^[ \t\r\n]+|[ \t\r\n]+$/g,
            ""
        );

        return value === TARGET_NAME;
    }

    /* ============================================
       تحديد الحاوية الكاملة للبروفايل
       بما فيها صناديق الإدارة
       ============================================ */

    function getScope(profile) {
        if (!profile) return null;

        const modal = profile.closest(".modal");

        if (modal) {
            const content = profile.closest(
                ".modal-content"
            );

            // نتأكد أن الحاوية تشمل حقول الإدارة
            if (content) return content;

            return modal;
        }

        let parent = profile.parentElement;

        while (
            parent &&
            parent !== document.body
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

    /* ============================================
       التصميم الكامل
       ============================================ */

    function addStyles() {
        const old = document.getElementById(STYLE_ID);

        if (old) old.remove();

        const style = document.createElement("style");
        style.id = STYLE_ID;

        style.textContent = `

        /* ==================================
           الألوان الرئيسية
           ================================== */

        .sh-pearl-scope {
            --sh-main: #947857;
            --sh-hover: #806647;
            --sh-gold: #BC9C6C;
            --sh-dark: #6A5548;
            --sh-ivory: #FCFAF7;
            --sh-soft: #F2EADF;
            --sh-border: #E3D7C8;
        }

        /* ==================================
           جسم البروفايل
           ================================== */

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

        /* ==================================
           الشريط العلوي
           ================================== */

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

        /* زر الإغلاق */

        .sh-pearl-scope
        .th-upro-header .clickable.badge {
            background: #947857 !important;
            color: #FFFFFF !important;

            border: 1px solid #BC9C6C !important;
            border-radius: 6px !important;

            box-shadow: none !important;
        }

        .sh-pearl-scope
        .th-upro-header .clickable.badge i {
            color: #FFFFFF !important;
        }

        /* ==================================
           الغلاف والصورة الشخصية
           ================================== */

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

        /* ==================================
           الاسم والتوثيق
           ================================== */

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

        /* زخارف الاسم */

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

        /* ==================================
           المشاهدات والنقاط
           ================================== */

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

        /* ==================================
           الدولة والعلم
           ================================== */

        .sh-pearl-profile
        .th-upro-meta-label {
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

            box-shadow: none !important;
        }

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
        }

        /* ==================================
           الغرفة الحالية
           ================================== */

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

        /* ==================================
           النبذة الشخصية
           ================================== */

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

        /* ==================================
           ألعاب XO واللودو
           ================================== */

        .sh-pearl-profile .th-upro-game-xo,
        .sh-pearl-profile .th-upro-game-ludo {
            background: #F6F0E7 !important;
            color: #6A5548 !important;

            border: 1px solid #D9C5A9 !important;
            border-radius: 7px !important;

            font-weight: 700 !important;
            box-shadow: none !important;
        }

        /* ==================================
           جميع أزرار البروفايل
           لون واحد موحد
           ================================== */

        .sh-pearl-profile a.th-upro-action,
        .sh-pearl-profile
        a.th-upro-action-no-margin {
            background: #947857 !important;
            background-image: none !important;

            color: #FFFFFF !important;

            border: 1px solid #B59A76 !important;
            border-radius: 7px !important;

            box-shadow: none !important;
            text-shadow: none !important;

            font-weight: 700 !important;
            line-height: 1.45 !important;

            transition:
                background-color .15s ease,
                border-color .15s ease;
        }

        /*
           توحيد ألوان كل الأزرار:
           الخاص - التنبيه - اللايك
           الهدية - كشف النكات - الصورة
           البنر - الطرد - الباند
           الإسكات - الإطار - تجاهل
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
            background: #947857 !important;
            background-image: none !important;

            color: #FFFFFF !important;
            border-color: #B59A76 !important;

            border-radius: 7px !important;

            box-shadow: none !important;
            text-shadow: none !important;
        }

        /* تأثير خفيف عند المرور */

        @media (hover: hover) {
            .sh-pearl-profile
            a.th-upro-action:hover,
            .sh-pearl-profile
            a.th-upro-action-no-margin:hover {
                background: #806647 !important;
                border-color: #A78C68 !important;
            }
        }

        /*
           لا نستخدم display أو visibility
           لا نلمس onclick أو الصلاحيات
        */

        /* ==================================
           صناديق إدارة العضوة
           ================================== */

        .sh-pearl-scope .th-upro-edit-box,
        .sh-pearl-scope .th-upro-power-box,
        .sh-pearl-scope .th-upro-room-box {
            background: #FCFAF7 !important;
            color: #6A5548 !important;

            border: 1px solid #E3D7C8 !important;
            border-radius: 7px !important;

            /*
               إزالة الفراغات الكبيرة
               بين صناديق الإدارة
            */

            margin-top: 1px !important;
            margin-bottom: 1px !important;

            padding: 5px 6px !important;

            box-shadow: none !important;
        }

        /* المحافظة على ترتيب القالب الأصلي */

        .sh-pearl-scope
        .th-upro-edit-box,
        .sh-pearl-scope
        .th-upro-power-box,
        .sh-pearl-scope
        .th-upro-room-box {
            box-sizing: border-box !important;
        }

        /* ==================================
           عناوين الحقول
           ================================== */

        .sh-pearl-scope
        .th-upro-edit-box label,
        .sh-pearl-scope
        .th-upro-power-box label,
        .sh-pearl-scope
        .th-upro-room-box label {
            color: #795F45 !important;

            font-size: 11px !important;
            font-weight: 700 !important;
        }

        /* عناوين الزخرفة واللايكات والنقاط */

        .sh-pearl-scope
        .th-upro-edit-label,
        .sh-pearl-scope
        .th-upro-like-label,
        .sh-pearl-scope
        .th-upro-eva-label {
            background: #EFE3D1 !important;
            color: #795F45 !important;

            border: 1px solid #D9C5A9 !important;
            border-radius: 5px !important;

            padding: 3px 6px !important;
        }

        /* ==================================
           حقول النصوص والأرقام
           ================================== */

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
            background: #FFFFFF !important;
            color: #6A5548 !important;

            border: 1px solid #DCCAB2 !important;
            border-radius: 6px !important;

            font-size: 11px !important;
            line-height: 1.45 !important;

            box-shadow: none !important;
        }

        /* عند تحديد الحقل */

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

        /* ==================================
           أزرار حفظ الإدارة
           ================================== */

        .sh-pearl-scope .th-upro-save-small,
        .sh-pearl-scope
        .th-upro-edit-box .u-nickc {
            background: #947857 !important;
            color: #FFFFFF !important;

            border: 1px solid #B59A76 !important;
            border-radius: 6px !important;

            font-size: 11px !important;
            font-weight: 700 !important;

            box-shadow: none !important;
        }

        @media (hover: hover) {
            .sh-pearl-scope
            .th-upro-save-small:hover,
            .sh-pearl-scope
            .th-upro-edit-box .u-nickc:hover {
                background: #806647 !important;
            }
        }

        /* ==================================
           قوائم الصلاحيات والغرف
           ================================== */

        .sh-pearl-scope
        .th-upro-power-search,
        .sh-pearl-scope
        .th-upro-power-select,
        .sh-pearl-scope
        .th-upro-room-select {
            background: #FFFFFF !important;
            color: #6A5548 !important;

            border: 1px solid #D9C5A9 !important;
            border-radius: 6px !important;
        }

        /* ==================================
           تقارب الصناديق على الجوال
           ================================== */

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
                margin-top: 1px !important;
                margin-bottom: 1px !important;

                padding: 5px !important;
            }

            .sh-pearl-scope
            .th-upro-header {
                padding: 6px 8px !important;
            }

            .sh-pearl-scope
            .th-upro-header .th-upro-title {
                font-size: 11px !important;
            }
        }

        /* ==================================
           تقليل الحركة
           ================================== */

        @media (prefers-reduced-motion: reduce) {
            .sh-pearl-profile
            a.th-upro-action,
            .sh-pearl-profile
            a.th-upro-action-no-margin {
                transition: none !important;
            }
        }

        /* ==================================
           نهاية CSS
           ================================== */
        `;

        document.head.appendChild(style);
    }

    /* ============================================
       تحديث البروفايل والحاوية
       ============================================ */

    function updateProfiles() {
        const profiles = document.querySelectorAll(
            ".th-upro-pro"
        );

        const activeScopes = new Set();

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
                const scope = getScope(profile);

                if (scope) {
                    activeScopes.add(scope);
                }
            }
        });

        /* إزالة الكلاس من النوافذ القديمة */

        document.querySelectorAll(
            "." + SCOPE_CLASS
        ).forEach(function (element) {
            if (!activeScopes.has(element)) {
                element.classList.remove(
                    SCOPE_CLASS
                );
            }
        });

        /* إضافة الكلاس للنافذة الصحيحة */

        activeScopes.forEach(function (scope) {
            if (!scope.classList.contains(SCOPE_CLASS)) {
                scope.classList.add(SCOPE_CLASS);
            }
        });
    }

    /* ============================================
       تشغيل ومراقبة تغييرات البروفايل
       ============================================ */

    function init() {
        if (window.__shPearlV4Started) return;

        window.__shPearlV4Started = true;

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
