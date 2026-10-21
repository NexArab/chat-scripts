
(function () {
    "use strict";

    /* ==========================================
       ISTABRAQ ROYAL PROFILE - V2
       تصميم ملكي خاص بإستبرق

       وردي غباري + شامبين ذهبي
       بروفايل الزائر والأدمن
       الغرفة + الشريط العلوي + الأزرار
       ========================================== */

    const TARGET_NAME = "إستبــــــــــــرق";
    const PROFILE_CLASS = "istabraq-royal";
    const HEADER_CLASS = "istabraq-royal-header";
    const STYLE_ID = "istabraq-royal-style";

    /* ==========================================
       1 - تنسيق التصميم
       ========================================== */

    function addStyle() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;

        style.textContent = `

        /* =====================================
           الهوية الملكية
           ===================================== */

        .th-upro-pro.istabraq-royal {
            --ist-main: #80546D;
            --ist-dark: #684157;
            --ist-rose: #B7869E;
            --ist-gold: #C9A77B;
            --ist-light: #FAF5F7;
            --ist-border: #E7D2DD;

            background: #FAF5F7 !important;

            border: 1px solid #DFC9D4 !important;
            border-radius: 12px !important;

            box-shadow:
                0 4px 16px rgba(91,55,73,.12) !important;

            overflow: hidden;
        }

        /* الحاوية الداخلية */

        .istabraq-royal
        .th-upro-profile-container {
            background: #FAF5F7 !important;
            border-radius: 10px;
            overflow: hidden;
        }

        /* =====================================
           الغلاف والصورة الشخصية
           ===================================== */

        .istabraq-royal .th-upro-cover {
            border-bottom:
                3px solid #C9A77B !important;
        }

        .istabraq-royal .th-upro-picture {
            border:
                3px solid #E3C494 !important;

            border-radius: 50% !important;

            box-shadow:
                0 0 0 3px rgba(255,255,255,.85),
                0 3px 12px rgba(91,55,73,.17)
                !important;
        }

        /* =====================================
           الاسم الملكي
           ===================================== */

        .istabraq-royal
        .th-upro-profile-content {
            background: #F8EDF2 !important;
            border-bottom:
                1px solid #E7D1DB !important;

            padding-bottom: 6px;
        }

        .istabraq-royal
        .th-upro-profile-name {
            color: #80546D !important;

            font-size: 17px !important;
            font-weight: 800 !important;
            line-height: 1.65 !important;

            text-shadow:
                0 1px 0 #FFFFFF,
                0 2px 4px rgba(104,62,83,.12);
        }

        /* زخرفة الاسم */

        .istabraq-royal
        .th-upro-name-wrap::before {
            content: "✦";
            color: #BE9863;
            margin-left: 6px;
            font-size: 13px;
        }

        .istabraq-royal
        .th-upro-name-wrap::after {
            content: "✦";
            color: #BE9863;
            margin-right: 6px;
            font-size: 13px;
        }

        /* =====================================
           المشاهدات والنقاط
           ===================================== */

        .istabraq-royal .thProfileStat {
            background: #FFFFFF !important;

            border:
                1px solid #E8D6DE !important;
            border-radius: 8px !important;

            box-shadow:
                0 1px 4px rgba(91,55,73,.05)
                !important;
        }

        .istabraq-royal .thProfileStatShine,
        .istabraq-royal .NUMBER_TH,
        .istabraq-royal .thProfilePointsNum {
            color: #80546D !important;
        }

        .istabraq-royal .thProfileEye {
            color: #B7869E !important;
        }

        .istabraq-royal .thProfilePointsIcon {
            color: #B99864 !important;
        }

        /* =====================================
           المعلومات والدولة
           ===================================== */

        .istabraq-royal
        .th-upro-meta-label {
            background: #FAF5F7 !important;
        }

        /* =====================================
           جديد: الغرفة الحالية
           ===================================== */

        .istabraq-royal
        .th-upro-meta-label .roomh {
            background: #80546D !important;
            color: #FFFFFF !important;

            border:
                1px solid #C9A77B !important;
            border-radius: 7px !important;

            padding: 3px 7px !important;

            font-size: 11px !important;
            font-weight: 700 !important;
            line-height: 1.5 !important;

            box-shadow:
                0 2px 5px rgba(91,55,73,.10)
                !important;

            text-shadow: none !important;
        }

        /* صورة الغرفة الأصلية */

        .istabraq-royal
        .th-upro-meta-label .roomh img {
            max-width: 24px !important;
            max-height: 24px !important;

            width: auto !important;
            height: auto !important;

            vertical-align: middle !important;
            margin-left: 4px !important;

            border-radius: 4px !important;
            border: 0 !important;
        }

        .istabraq-royal
        .th-upro-meta-label .roomh:hover {
            background: #94677E !important;
        }

        /* =====================================
           النبذة الشخصية
           ===================================== */

        .istabraq-royal .th-upro-bio {
            background: #FFFFFF !important;
            color: #735868 !important;

            border:
                1px solid #E7D2DD !important;
            border-right:
                3px solid #C69DAF !important;

            border-radius: 8px !important;

            padding: 9px !important;
            line-height: 1.65 !important;

            box-shadow: none !important;
        }

        /* =====================================
           ألعاب XO واللودو
           ===================================== */

        .istabraq-royal .th-upro-game-xo,
        .istabraq-royal .th-upro-game-ludo {
            border-radius: 7px !important;
            box-shadow: none !important;
        }

        /* =====================================
           أزرار البروفايل
           ===================================== */

        .istabraq-royal .th-upro-action,
        .istabraq-royal
        .th-upro-action-no-margin {
            border-radius: 7px !important;
            box-shadow: none !important;
            font-weight: 700 !important;
        }

        /* المحادثة الخاصة */

        .istabraq-royal .upm {
            background: #80546D !important;
            color: #FFFFFF !important;
            border-color: #80546D !important;
        }

        /* التنبيه */

        .istabraq-royal .unot {
            background: #9D7489 !important;
            color: #FFFFFF !important;
            border-color: #9D7489 !important;
        }

        /* الإعجابات */

        .istabraq-royal .ulike {
            background: #BD7695 !important;
            color: #FFFFFF !important;
            border-color: #BD7695 !important;
        }

        /* الهدية */

        .istabraq-royal .ugift {
            background: #B99864 !important;
            color: #FFFFFF !important;
            border-color: #B99864 !important;
        }

        /* =====================================
           جديد: الشريط العلوي للبروفايل
           خارج حاوية .th-upro-pro
           ===================================== */

        .th-upro-header.istabraq-royal-header {
            background: #80546D !important;

            color: #FFFFFF !important;

            border: 0 !important;
            border-bottom:
                2px solid #C9A77B !important;

            box-shadow:
                0 2px 7px rgba(91,55,73,.13)
                !important;

            padding: 7px 9px !important;
        }

        /* اسم إستبرق في الشريط العلوي */

        .istabraq-royal-header
        .th-upro-title {
            color: #FFFFFF !important;

            font-size: 12px !important;
            font-weight: 700 !important;
            line-height: 1.5 !important;

            text-shadow: none !important;
        }

        /* صورة البروفايل الصغيرة */

        .istabraq-royal-header
        .th-upro-title img {
            vertical-align: middle !important;

            border-radius: 4px !important;

            margin-left: 4px !important;
        }

        /* الحفاظ على أبعاد الصور الأصلية */

        .istabraq-royal-header
        .th-upro-title img.u-ico {
            max-height: 20px !important;
            width: auto;
        }

        /* زر الإغلاق */

        .istabraq-royal-header
        .clickable.badge {
            background: #9E7489 !important;
            color: #FFFFFF !important;

            border:
                1px solid #C9A77B !important;
            border-radius: 6px !important;

            box-shadow: none !important;

            cursor: pointer !important;
        }

        .istabraq-royal-header
        .clickable.badge:hover {
            background: #684157 !important;
        }

        .istabraq-royal-header
        .clickable.badge .fa-times {
            color: #FFFFFF !important;
        }

        /* =====================================
           توافق الجوال
           ===================================== */

        @media (max-width: 420px) {

            .istabraq-royal
            .th-upro-profile-name {
                font-size: 15px !important;
            }

            .istabraq-royal
            .th-upro-meta-label .roomh {
                font-size: 10px !important;
                padding: 3px 5px !important;
            }

            .th-upro-header.istabraq-royal-header {
                padding: 6px 8px !important;
            }

            .istabraq-royal-header
            .th-upro-title {
                font-size: 11px !important;
            }
        }
        `;

        document.head.appendChild(style);
    }

    /* ==========================================
       2 - تحديد العضوة
       ========================================== */

    function isIstabraq(profile) {
        if (!profile) return false;

        const name = profile.querySelector(
            ".th-upro-profile-name"
        );

        return !!name &&
            name.textContent.trim() === TARGET_NAME;
    }

    /* ==========================================
       3 - تحديث البروفايل والشريط العلوي
       ========================================== */

    function updateProfiles() {

        const profiles = document.querySelectorAll(
            ".th-upro-pro"
        );

        profiles.forEach(function (profile) {

            const matched = isIstabraq(profile);

            /* تصميم جسم البروفايل */

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

        /* الشريط العلوي موجود خارج جسم البروفايل */

        document.querySelectorAll(
            ".th-upro-header"
        ).forEach(function (header) {

            const modal =
                header.closest(".modal") ||
                header.closest(".modal-content");

            let matched = false;

            if (modal) {
                const profile = modal.querySelector(
                    ".th-upro-pro"
                );

                matched = isIstabraq(profile);
            } else {
                /* احتياط للقوالب التي لا تستخدم modal */

                const title = header.querySelector(
                    ".th-upro-title"
                );

                const visibleTarget =
                    Array.from(profiles).some(
                        isIstabraq
                    );

                matched = !!title &&
                    visibleTarget &&
                    title.textContent.trim()
                        .includes(TARGET_NAME);
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
       4 - التشغيل والمراقبة
       ========================================== */

    function init() {
        addStyle();
        updateProfiles();

        const observer = new MutationObserver(
            updateProfiles
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
