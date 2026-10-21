
(function () {
    "use strict";

    /*
     * ISTABRAQ ROYAL PROFILE V3
     * تصميم خاص بإستبرق فقط
     *
     * Royal Rose Crystal
     * وردي مخملي + ذهبي شامبين
     *
     * تصميم كامل للزائر والأدمن
     * الحفاظ على الأزرار والصلاحيات
     */

    const TARGET = "إستبــــــــــــرق";
    const BODY_CLASS = "istabraq-royal";
    const SCOPE_CLASS = "istabraq-royal-scope";
    const STYLE_ID = "istabraq-royal-style-v3";

    /* =====================================
       1 - مطابقة اسم العضوة
       ===================================== */

    function isTarget(profile) {
        if (!profile) return false;

        const name = profile.querySelector(
            ".th-upro-profile-name"
        );

        return !!name &&
            name.textContent.trim() === TARGET;
    }

    /* =====================================
       2 - تحديد حاوية النافذة كاملة
       ===================================== */

    function getScope(profile) {
        if (!profile) return null;

        const modal = profile.closest(".modal");

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

        return profile.closest(".modal-content") ||
            profile;
    }

    /* =====================================
       3 - تنسيق التصميم الملكي
       ===================================== */

    function addStyles() {
        [
            "istabraq-royal-style",
            STYLE_ID
        ].forEach(function (id) {
            const old = document.getElementById(id);
            if (old) old.remove();
        });

        const style = document.createElement("style");
        style.id = STYLE_ID;

        style.textContent = `

        /* ==================================
           01 - متغيرات الهوية
           ================================== */

        .istabraq-royal-scope {
            --ir-main: #80546D;
            --ir-dark: #613A52;
            --ir-rose: #B7869E;
            --ir-gold: #C9A77B;
            --ir-bg: #FCF7FA;
            --ir-white: #FFFFFF;
            --ir-soft: #F6EDF2;
            --ir-border: #E6D3DF;
            --ir-text: #684C60;
        }

        /* ==================================
           02 - الشريط العلوي
           ================================== */

        .istabraq-royal-scope .th-upro-header {
            background: linear-gradient(
                135deg,
                #70435D,
                #916B80
            ) !important;

            color: #FFFFFF !important;

            border: 0 !important;
            border-bottom: 2px solid #C9A77B
                !important;

            padding: 7px 9px !important;

            box-shadow:
                0 2px 8px rgba(90,50,76,.12)
                !important;
        }

        .istabraq-royal-scope
        .th-upro-header .th-upro-title {
            color: #FFFFFF !important;

            font-size: 12px !important;
            font-weight: 800 !important;
            line-height: 1.5 !important;

            text-shadow: none !important;
        }

        .istabraq-royal-scope
        .th-upro-title img {
            vertical-align: middle !important;
            border-radius: 5px !important;
            margin-left: 4px !important;
        }

        .istabraq-royal-scope
        .th-upro-title img.u-ico {
            max-height: 20px !important;
            width: auto;
        }

        /* زر الإغلاق */

        .istabraq-royal-scope
        .th-upro-header .clickable.badge {
            background: rgba(255,255,255,.18)
                !important;

            color: #FFFFFF !important;

            border: 1px solid rgba(
                255,255,255,.45
            ) !important;

            border-radius: 6px !important;
            box-shadow: none !important;
        }

        .istabraq-royal-scope
        .th-upro-header .fa-times {
            color: #FFFFFF !important;
        }

        /* ==================================
           03 - جسم البروفايل
           ================================== */

        .th-upro-pro.istabraq-royal {
            background: #FCF7FA !important;
            color: #684C60 !important;

            border: 1px solid #DFC9D7 !important;
            border-radius: 12px !important;

            box-shadow:
                0 4px 16px rgba(91,55,73,.10)
                !important;
        }

        .istabraq-royal
        .th-upro-profile-container {
            background: #FCF7FA !important;
            border-radius: 10px !important;
        }

        /* ==================================
           04 - الغلاف والصورة
           ================================== */

        .istabraq-royal .th-upro-cover {
            border-bottom: 3px solid #C9A77B
                !important;
        }

        .istabraq-royal .th-upro-picture {
            border: 3px solid #E3C494 !important;
            border-radius: 50% !important;

            box-shadow:
                0 0 0 3px rgba(255,255,255,.95),
                0 3px 12px rgba(91,55,73,.17)
                !important;
        }

        /* ==================================
           05 - الاسم والتوثيق
           ================================== */

        .istabraq-royal
        .th-upro-profile-content {
            background: #F9F0F5 !important;

            border-bottom: 1px solid #E7D1DB
                !important;
        }

        .istabraq-royal
        .th-upro-profile-name {
            color: #80546D !important;

            font-size: 17px !important;
            font-weight: 800 !important;
            line-height: 1.65 !important;

            text-shadow:
                0 1px 0 #FFFFFF,
                0 2px 4px rgba(104,62,83,.10)
                !important;
        }

        /* الزخارف الملكية */

        .istabraq-royal
        .th-upro-name-wrap::before,
        .istabraq-royal
        .th-upro-name-wrap::after {
            content: "✦";
            color: #BE9863;
            font-size: 13px;
            margin: 0 6px;
        }

        /* التوثيق يبقى بألوانه الأصلية */

        .istabraq-royal
        .th-upro-verification:not([src=""]) {
            filter: drop-shadow(
                0 1px 2px rgba(91,55,73,.12)
            );
        }

        /* ==================================
           06 - المشاهدات والنقاط
           ================================== */

        .istabraq-royal .thProfileStat {
            background: #FFFFFF !important;

            border: 1px solid #E8D6DE !important;
            border-radius: 9px !important;

            box-shadow:
                0 1px 4px rgba(91,55,73,.05)
                !important;
        }

        .istabraq-royal .thProfileStatShine,
        .istabraq-royal .NUMBER_TH,
        .istabraq-royal .thProfilePointsNum {
            color: #80546D !important;
            font-weight: 700 !important;
        }

        .istabraq-royal .thProfileEye {
            color: #B7869E !important;
        }

        .istabraq-royal .thProfilePointsIcon {
            color: #B99864 !important;
        }

        /* ==================================
           07 - الدولة والعلم
           ================================== */

        .istabraq-royal .th-upro-meta-label {
            background: #FCF7FA !important;
        }

        .istabraq-royal .th-upro-co {
            background: #FFFDFE !important;
            color: #80546D !important;

            border: 1px solid #E4CFDA !important;
            border-radius: 8px !important;

            padding: 3px 6px !important;

            font-size: 11px !important;
            font-weight: 700 !important;

            box-shadow: none !important;
        }

        .istabraq-royal .th-upro-co img {
            max-width: 27px !important;
            width: auto !important;
            height: auto !important;

            padding: 2px !important;
            margin: 0 3px !important;

            background: #FFFFFF !important;

            border: 1px solid #DFC9D7 !important;
            border-radius: 5px !important;
        }

        /* ==================================
           08 - زر الغرفة
           ================================== */

        .istabraq-royal
        .th-upro-meta-label .roomh {
            background: linear-gradient(
                135deg,
                #FFFFFF,
                #F0DFE8
            ) !important;

            color: #80546D !important;

            border: 1px solid #D4B8C8 !important;
            border-radius: 8px !important;

            padding: 3px 6px !important;

            font-size: 11px !important;
            font-weight: 700 !important;

            text-shadow: none !important;
            box-shadow: none !important;
        }

        .istabraq-royal
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
           09 - النبذة والألعاب
           ================================== */

        .istabraq-royal .th-upro-bio {
            background: #FFFFFF !important;
            color: #735868 !important;

            border: 1px solid #E7D2DD !important;
            border-right: 3px solid #C9A77B
                !important;

            border-radius: 8px !important;

            padding: 8px !important;
            line-height: 1.65 !important;

            box-shadow: none !important;
        }

        .istabraq-royal .th-upro-game-xo,
        .istabraq-royal .th-upro-game-ludo {
            background: #F7EEF3 !important;
            color: #80546D !important;

            border: 1px solid #DFC9D7 !important;
            border-radius: 8px !important;

            font-weight: 700 !important;
            box-shadow: none !important;
        }

        /* ==================================
           10 - شبكة أزرار البروفايل
           3 أعمدة مع المحافظة على صلاحياتها
           ================================== */

        .th-upro-pro.istabraq-royal > center >
        a.th-upro-action,
        .th-upro-pro.istabraq-royal > center >
        a.th-upro-action-no-margin {
            float: left !important;

            width: calc(33.333333% - 6px)
                !important;

            min-width: 0 !important;

            height: 36px !important;
            min-height: 36px !important;

            box-sizing: border-box !important;

            margin: 2px 3px !important;
            padding: 5px 2px !important;

            background: linear-gradient(
                145deg,
                #FFFFFF,
                #F5EAF1
            ) !important;

            background-color: #FCF7FA !important;

            border: 1px solid #E1CBD8 !important;
            border-radius: 6px !important;

            box-shadow:
                inset 0 1px 0 #FFFFFF,
                0 1px 2px rgba(95,55,79,.04)
                !important;

            text-shadow: none !important;

            font-size: 12px !important;
            font-weight: 700 !important;
            line-height: 1.25 !important;
            text-align: center !important;

            overflow: hidden;

            color: var(
                --ist-btn-color,
                #80546D
            ) !important;

            -webkit-text-fill-color: var(
                --ist-btn-color,
                #80546D
            ) !important;
        }

        /* ==================================
           11 - ألوان الكلمات والأيقونات
           ================================== */

        /* المحادثة الخاصة */

        .th-upro-pro.istabraq-royal
        > center > a.upm {
            --ist-btn-color: #75436A;
        }

        /* التنبيه */

        .th-upro-pro.istabraq-royal
        > center > a.unot {
            --ist-btn-color: #785B8B;
        }

        /* الإعجابات */

        .th-upro-pro.istabraq-royal
        > center > a.ulike {
            --ist-btn-color: #BD4276;
        }

        /* الهدية */

        .th-upro-pro.istabraq-royal
        > center > a.ugift {
            --ist-btn-color: #A17A3E;
        }

        /* كشف النكات */

        .th-upro-pro.istabraq-royal
        > center > a.uh {
            --ist-btn-color: #60547B;
        }

        /* الصورة والبنر */

        .th-upro-pro.istabraq-royal
        > center > a.udelpic,
        .th-upro-pro.istabraq-royal
        > center > a.ubnr {
            --ist-btn-color: #A24E80;
        }

        /* ترقية مراقب */

        .th-upro-pro.istabraq-royal
        > center > a.thRoomMod {
            --ist-btn-color: #28755C;
        }

        /* الطرد والباند */

        .th-upro-pro.istabraq-royal
        > center > a.urkick,
        .th-upro-pro.istabraq-royal
        > center > a.ukick,
        .th-upro-pro.istabraq-royal
        > center > a.uban,
        .th-upro-pro.istabraq-royal
        > center > a.ban20 {
            --ist-btn-color: #B14B62;
        }

        /* الإسكات */

        .th-upro-pro.istabraq-royal
        > center > a.meiut,
        .th-upro-pro.istabraq-royal
        > center > a.meiutbc {
            --ist-btn-color: #A66A46;
        }

        /* الإطار وبنر الحالة والغلاف */

        .th-upro-pro.istabraq-royal
        > center > a.DELAFT,
        .th-upro-pro.istabraq-royal
        > center > a.DELMFT,
        .th-upro-pro.istabraq-royal
        > center > a.Mcover {
            --ist-btn-color: #6C668E;
        }

        /* تجاهل */

        .th-upro-pro.istabraq-royal
        > center > a.umute {
            --ist-btn-color: #B94D51;
        }

        /* إلغاء التجاهل */

        .th-upro-pro.istabraq-royal
        > center > a.uunmute {
            --ist-btn-color: #28755C;
        }

        /* تلوين النص وأيقونات Font Awesome */

        .th-upro-pro.istabraq-royal
        > center > a.th-upro-action,
        .th-upro-pro.istabraq-royal
        > center > a.th-upro-action-no-margin,
        .th-upro-pro.istabraq-royal
        > center > a.th-upro-action::before,
        .th-upro-pro.istabraq-royal
        > center > a.th-upro-action-no-margin::before,
        .th-upro-pro.istabraq-royal
        > center > a.th-upro-action i,
        .th-upro-pro.istabraq-royal
        > center > a.th-upro-action-no-margin i {
            color: var(
                --ist-btn-color,
                #80546D
            ) !important;

            -webkit-text-fill-color: var(
                --ist-btn-color,
                #80546D
            ) !important;
        }

        /* الحفاظ على الأزرار المخفية */

        .th-upro-pro.istabraq-royal
        a[style*="display: none"],
        .th-upro-pro.istabraq-royal
        a[style*="display:none"] {
            display: none !important;
        }

        /* تأثير المرور */

        @media (hover: hover) {
            .th-upro-pro.istabraq-royal
            > center > a.th-upro-action:hover,
            .th-upro-pro.istabraq-royal
            > center > a.th-upro-action-no-margin:hover {
                background: #EEDCE7 !important;
                border-color: #CDAEC1 !important;
            }
        }

        /* ==================================
           12 - لوحة الأدمن المتصلة
           ================================== */

        .istabraq-royal-scope
        .th-upro-edit-box,
        .istabraq-royal-scope
        .th-upro-power-box,
        .istabraq-royal-scope
        .th-upro-room-box {
            float: none !important;
            clear: both !important;

            width: calc(100% - 12px)
                !important;

            box-sizing: border-box !important;

            margin: 0 6px !important;
            padding: 8px 10px !important;

            background: #FFFDFE !important;
            color: #684C60 !important;

            border: 1px solid #E3CFDB !important;
            border-bottom: 0 !important;

            border-radius: 0 !important;
            box-shadow: none !important;
        }

        /* أول صندوق: الزخرفة */

        .istabraq-royal-scope
        .th-upro-edit-box.nickbox {
            border-radius:
                11px 11px 0 0 !important;

            margin-top: 4px !important;
        }

        /* آخر صندوق: الغرفة */

        .istabraq-royal-scope
        .th-upro-room-box.roomzbox {
            border-bottom:
                1px solid #E3CFDB !important;

            border-radius:
                0 0 11px 11px !important;

            margin-bottom: 5px !important;
        }

        /* لا نُظهر الصناديق المخفية */

        .istabraq-royal-scope
        .th-upro-edit-box[style*="display: none"],
        .istabraq-royal-scope
        .th-upro-edit-box[style*="display:none"],
        .istabraq-royal-scope
        .th-upro-power-box[style*="display: none"],
        .istabraq-royal-scope
        .th-upro-power-box[style*="display:none"],
        .istabraq-royal-scope
        .th-upro-room-box[style*="display: none"],
        .istabraq-royal-scope
        .th-upro-room-box[style*="display:none"] {
            display: none !important;
        }

        /* ==================================
           13 - عناوين الإدارة
           ================================== */

        .istabraq-royal-scope
        .th-upro-edit-box label,
        .istabraq-royal-scope
        .th-upro-power-box label,
        .istabraq-royal-scope
        .th-upro-room-box label {
            color: #80546D !important;

            font-size: 12px !important;
            font-weight: 700 !important;
        }

        .istabraq-royal-scope
        .th-upro-edit-label,
        .istabraq-royal-scope
        .th-upro-like-label,
        .istabraq-royal-scope
        .th-upro-eva-label {
            background: #F7EDF2 !important;
            color: #80546D !important;

            border: 1px solid #E2CBD7 !important;
            border-radius: 6px !important;

            padding: 4px 7px !important;
        }

        /* ==================================
           14 - حقول الإدارة
           ================================== */

        .istabraq-royal-scope
        .th-upro-edit-box input,
        .istabraq-royal-scope
        .th-upro-edit-box textarea,
        .istabraq-royal-scope
        .th-upro-power-box input,
        .istabraq-royal-scope
        .th-upro-room-box input,
        .istabraq-royal-scope
        .th-upro-power-box select,
        .istabraq-royal-scope
        .th-upro-room-box select {
            background: #FFFCFE !important;
            color: #684C60 !important;

            border: 1px solid #DDC6D4 !important;
            border-radius: 6px !important;

            font-size: 12px !important;
            line-height: 1.5 !important;

            box-shadow: none !important;
        }

        /* التركيز على الحقول */

        .istabraq-royal-scope
        .th-upro-edit-box input:focus,
        .istabraq-royal-scope
        .th-upro-edit-box textarea:focus,
        .istabraq-royal-scope
        .th-upro-power-box input:focus,
        .istabraq-royal-scope
        .th-upro-room-box input:focus,
        .istabraq-royal-scope
        .th-upro-power-box select:focus,
        .istabraq-royal-scope
        .th-upro-room-box select:focus {
            background: #FFFFFF !important;
            border-color: #B7869E !important;

            outline:
                2px solid rgba(183,134,158,.15)
                !important;

            outline-offset: 0 !important;
        }

        /* ==================================
           15 - أزرار الحفظ والتغيير والنقل
           ================================== */

        .istabraq-royal-scope
        .th-upro-save-small,
        .istabraq-royal-scope
        .th-upro-edit-box .u-nickc {
            background: linear-gradient(
                145deg,
                #FFFFFF,
                #EEDCE7
            ) !important;

            color: #80546D !important;

            border: 1px solid #D7BACB !important;
            border-radius: 7px !important;

            font-size: 12px !important;
            font-weight: 700 !important;

            box-shadow:
                inset 0 1px 0 #FFFFFF
                !important;
        }

        /* ==================================
           16 - توافق الجوال
           ================================== */

        @media (max-width: 420px) {
            .istabraq-royal
            .th-upro-profile-name {
                font-size: 15px !important;
            }

            .th-upro-pro.istabraq-royal
            > center > a.th-upro-action,
            .th-upro-pro.istabraq-royal
            > center > a.th-upro-action-no-margin {
                font-size: 11px !important;
                height: 35px !important;
                min-height: 35px !important;
            }

            .istabraq-royal-scope
            .th-upro-edit-box,
            .istabraq-royal-scope
            .th-upro-power-box,
            .istabraq-royal-scope
            .th-upro-room-box {
                width: calc(100% - 10px)
                    !important;

                margin-left: 5px !important;
                margin-right: 5px !important;
                padding: 7px !important;
            }
        }

        /* تقليل الحركة */

        @media (prefers-reduced-motion: reduce) {
            .istabraq-royal
            a.th-upro-action,
            .istabraq-royal
            a.th-upro-action-no-margin {
                transition: none !important;
            }
        }

        `;

        document.head.appendChild(style);
    }

    /* =====================================
       4 - تحديث البروفايل والحاوية
       ===================================== */

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

            if (matched) {
                const scope = getScope(profile);
                if (scope) scopes.add(scope);
            }
        });

        /* إزالة الكلاس من نافذة أخرى */

        document.querySelectorAll(
            "." + SCOPE_CLASS
        ).forEach(function (element) {
            if (!scopes.has(element)) {
                element.classList.remove(
                    SCOPE_CLASS
                );
            }
        });

        /* إضافة التصميم لنافذة إستبرق */

        scopes.forEach(function (scope) {
            if (
                !scope.classList.contains(
                    SCOPE_CLASS
                )
            ) {
                scope.classList.add(
                    SCOPE_CLASS
                );
            }
        });
    }

    /* =====================================
       5 - التشغيل والمراقبة
       ===================================== */

    function init() {
        if (window.__istabraqRoyalV3Started) {
            return;
        }

        window.__istabraqRoyalV3Started = true;

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
