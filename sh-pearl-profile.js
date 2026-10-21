
(function () {
    "use strict";

    /* ==========================================
       SH PEARL PROFILE
       اللؤلؤة البيضاء | تصميم خاص للعضوة

       الاسم مطابق تماماً:
       ⠀ SH

       الأبيض اللؤلؤي + الشامبين الذهبي
       ========================================== */

    const TARGET_NAME = "⠀ SH";
    const PROFILE_CLASS = "sh-pearl-profile";
    const HEADER_CLASS = "sh-pearl-header";
    const STYLE_ID = "sh-pearl-style";

    function addStyle() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;

        style.textContent = `

        /* ==================================
           01 - جسم البروفايل
           ================================== */

        .th-upro-pro.sh-pearl-profile {
            --sh-ivory: #FCFAF7;
            --sh-white: #FFFFFF;
            --sh-gold: #BC9C6C;
            --sh-dark: #6A5548;
            --sh-border: #E6DCD0;

            background: #FCFAF7 !important;

            border: 1px solid #D8C8AE !important;
            border-radius: 12px !important;

            box-shadow:
                0 4px 16px rgba(100,80,56,.12),
                inset 0 1px 0 #FFFFFF !important;
        }

        .sh-pearl-profile
        .th-upro-profile-container {
            background: #FCFAF7 !important;
            border-radius: 10px !important;
        }

        /* ==================================
           02 - الغلاف والصورة
           ================================== */

        .sh-pearl-profile .th-upro-cover {
            border-bottom: 3px solid #BC9C6C !important;
        }

        .sh-pearl-profile .th-upro-picture {
            border: 3px solid #D8BC8F !important;
            border-radius: 50% !important;

            box-shadow:
                0 0 0 3px rgba(255,255,255,.95),
                0 3px 12px rgba(126,101,68,.18)
                !important;
        }

        /* ==================================
           03 - اسم العضوة
           ================================== */

        .sh-pearl-profile
        .th-upro-profile-content {
            background: #FFFDF9 !important;

            border-bottom:
                1px solid #E6DCD0 !important;

            padding-bottom: 6px;
        }

        .sh-pearl-profile
        .th-upro-profile-name {
            color: #7B6045 !important;

            font-size: 18px !important;
            font-weight: 800 !important;
            line-height: 1.65 !important;

            letter-spacing: .5px;

            text-shadow:
                0 1px 0 #FFFFFF,
                0 2px 4px rgba(130,105,72,.12)
                !important;
        }

        /* زخارف لؤلؤية خفيفة */

        .sh-pearl-profile
        .th-upro-name-wrap::before {
            content: "✧";
            color: #BC9C6C;

            margin-left: 7px;
            font-size: 15px;
        }

        .sh-pearl-profile
        .th-upro-name-wrap::after {
            content: "✧";
            color: #BC9C6C;

            margin-right: 7px;
            font-size: 15px;
        }

        /* ==================================
           04 - المشاهدات والنقاط
           ================================== */

        .sh-pearl-profile .thProfileStat {
            background: #FFFFFF !important;

            border: 1px solid #E6DCD0 !important;
            border-radius: 8px !important;

            box-shadow:
                0 2px 5px rgba(100,80,56,.06),
                inset 0 1px 0 #FFFFFF
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
           05 - الدولة ومعلومات العضوة
           ================================== */

        .sh-pearl-profile .th-upro-meta-label {
            background: #FCFAF7 !important;
        }

        /* ==================================
           06 - زر الغرفة الحالية
           ================================== */

        .sh-pearl-profile
        .th-upro-meta-label .roomh {
            background: #F5EEE4 !important;
            color: #6A5548 !important;

            border: 1px solid #CEB38B !important;
            border-radius: 7px !important;

            padding: 3px 7px !important;

            font-size: 11px !important;
            font-weight: 700 !important;
            line-height: 1.5 !important;

            box-shadow:
                0 1px 4px rgba(100,80,56,.08)
                !important;

            text-shadow: none !important;
        }

        .sh-pearl-profile
        .th-upro-meta-label .roomh:hover {
            background: #EBDFCF !important;
        }

        /* صورة الغرفة الأصلية */

        .sh-pearl-profile
        .th-upro-meta-label .roomh img {
            max-width: 24px !important;
            max-height: 24px !important;

            width: auto !important;
            height: auto !important;

            border-radius: 4px !important;
            vertical-align: middle !important;

            margin-left: 4px !important;
        }

        /* ==================================
           07 - النبذة الشخصية
           ================================== */

        .sh-pearl-profile .th-upro-bio {
            background: #FFFFFF !important;
            color: #756453 !important;

            border: 1px solid #E6DCD0 !important;
            border-right: 3px solid #BC9C6C !important;

            border-radius: 8px !important;

            padding: 9px !important;
            line-height: 1.65 !important;

            box-shadow:
                0 1px 4px rgba(100,80,56,.05)
                !important;
        }

        /* ==================================
           08 - ألعاب XO واللودو
           ================================== */

        .sh-pearl-profile .th-upro-game-xo,
        .sh-pearl-profile .th-upro-game-ludo {
            border-radius: 7px !important;
            box-shadow: none !important;
        }

        /* ==================================
           09 - أزرار البروفايل
           ================================== */

        .sh-pearl-profile .th-upro-action,
        .sh-pearl-profile .th-upro-action-no-margin {
            border-radius: 7px !important;

            font-weight: 700 !important;
            box-shadow: none !important;
        }

        /* المحادثة الخاصة */

        .sh-pearl-profile .upm {
            background: #8C7357 !important;
            color: #FFFFFF !important;

            border-color: #8C7357 !important;
        }

        /* التنبيه */

        .sh-pearl-profile .unot {
            background: #AA9175 !important;
            color: #FFFFFF !important;

            border-color: #AA9175 !important;
        }

        /* الإعجابات */

        .sh-pearl-profile .ulike {
            background: #C3979D !important;
            color: #FFFFFF !important;

            border-color: #C3979D !important;
        }

        /* الهدية */

        .sh-pearl-profile .ugift {
            background: #BC9C6C !important;
            color: #FFFFFF !important;

            border-color: #BC9C6C !important;
        }

        /* أزرار الإدارة تبقى بوظائفها وألوانها */

        /* ==================================
           10 - الشريط العلوي للبروفايل
           ================================== */

        .th-upro-header.sh-pearl-header {
            background: #F7F1E9 !important;
            color: #6A5548 !important;

            border: 0 !important;
            border-bottom:
                2px solid #BC9C6C !important;

            box-shadow:
                0 2px 7px rgba(100,80,56,.09)
                !important;

            padding: 7px 9px !important;
        }

        /* اسم العضوة بالشريط العلوي */

        .sh-pearl-header .th-upro-title {
            color: #6A5548 !important;

            font-size: 12px !important;
            font-weight: 700 !important;
            line-height: 1.5 !important;

            text-shadow: none !important;
        }

        /* الصور والزخارف الأصلية بالشريط */

        .sh-pearl-header .th-upro-title img {
            vertical-align: middle !important;
            border-radius: 4px !important;
            margin-left: 4px !important;
        }

        .sh-pearl-header .th-upro-title img.u-ico {
            max-height: 20px !important;
            width: auto;
        }

        /* زر إغلاق البروفايل */

        .sh-pearl-header .clickable.badge {
            background: #B99A70 !important;
            color: #FFFFFF !important;

            border: 1px solid #A8875B !important;
            border-radius: 6px !important;

            box-shadow: none !important;
            cursor: pointer !important;
        }

        .sh-pearl-header .clickable.badge:hover {
            background: #96764E !important;
        }

        .sh-pearl-header .clickable.badge .fa-times {
            color: #FFFFFF !important;
        }

        /* ==================================
           11 - الجوال
           ================================== */

        @media (max-width: 420px) {

            .sh-pearl-profile
            .th-upro-profile-name {
                font-size: 16px !important;
            }

            .sh-pearl-profile
            .th-upro-meta-label .roomh {
                font-size: 10px !important;
                padding: 3px 5px !important;
            }

            .th-upro-header.sh-pearl-header {
                padding: 6px 8px !important;
            }

            .sh-pearl-header .th-upro-title {
                font-size: 11px !important;
            }
        }
        `;

        document.head.appendChild(style);
    }

    /* ==========================================
       12 - التعرف على العضوة بالاسم الحرفي
       ========================================== */

    function isTarget(profile) {
        if (!profile) return false;

        const name = profile.querySelector(
            ".th-upro-profile-name"
        );

        if (!name) return false;

        /* لا نستخدم trim أو نحذف المسافة */
        return name.textContent === TARGET_NAME;
    }

    /* ==========================================
       13 - تطبيق التصميم
       ========================================== */

    function updateProfiles() {

        const profiles = document.querySelectorAll(
            ".th-upro-pro"
        );

        profiles.forEach(function (profile) {

            const matched = isTarget(profile);

            if (
                profile.classList.contains(
                    PROFILE_CLASS
                ) !== matched
            ) {
                profile.classList.toggle(
                    PROFILE_CLASS,
                    matched
                );
            }
        });

        /* تنسيق الشريط العلوي المرتبط بالبروفايل */

        document.querySelectorAll(
            ".th-upro-header"
        ).forEach(function (header) {

            const modal = header.closest(".modal");

            let matched = false;

            if (modal) {

                matched = Array.from(
                    modal.querySelectorAll(".th-upro-pro")
                ).some(isTarget);

            } else {

                const title = header.querySelector(
                    ".th-upro-title"
                );

                const targetVisible = Array.from(
                    profiles
                ).some(isTarget);

                matched = !!title &&
                    targetVisible &&
                    title.textContent.includes(
                        TARGET_NAME
                    );
            }

            if (
                header.classList.contains(
                    HEADER_CLASS
                ) !== matched
            ) {
                header.classList.toggle(
                    HEADER_CLASS,
                    matched
                );
            }
        });
    }

    /* ==========================================
       14 - التشغيل
       ========================================== */

    function init() {
        addStyle();
        updateProfiles();

        new MutationObserver(updateProfiles).observe(
            document.body,
            {
                childList: true,
                subtree: true,
                characterData: true
            }
        );
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
