
(function () {
    "use strict";

    /* ==========================================
       SH PEARL PROFILE V6
       Crystal White Edition

       العضوة: ⠀ SH

       - ثلاثة أزرار بكل صف
       - خلفية كريستالية موحدة
       - ألوان النصوص والأيقونات متنوعة
       - عدم إظهار أزرار الزائر المخفية
       - حقول الإدارة متصلة
       ========================================== */

    const TARGET = "\u2800 SH";
    const BODY_CLASS = "sh-pearl-profile";
    const SCOPE_CLASS = "sh-pearl-scope";
    const STYLE_ID = "sh-pearl-style";

    /* تحديد العضوة بالاسم الأصلي */

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

    /* أقرب حاوية تشمل البروفايل والإدارة */

    function getScope(profile) {
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

        return profile;
    }

    /* ==========================================
       CSS
       ========================================== */

    function addStyles() {
        const old = document.getElementById(STYLE_ID);

        if (old) old.remove();

        const style = document.createElement("style");
        style.id = STYLE_ID;

        style.textContent = `

        /* =====================================
           01 - ألوان اللؤلؤة
           ===================================== */

        .sh-pearl-scope {
            --sp-white: #FFFFFF;
            --sp-bg: #F8FAFC;
            --sp-soft: #EDF3F7;
            --sp-border: #D5E0E9;
            --sp-text: #40576D;
            --sp-gold: #C4AC86;
        }

        /* =====================================
           02 - الشريط العلوي
           ===================================== */

        .sh-pearl-scope .th-upro-header {
            background:
                linear-gradient(
                    135deg,
                    #FFFFFF,
                    #EDF3F7
                ) !important;

            color: #40576D !important;

            border: 0 !important;
            border-bottom:
                2px solid #C4AC86 !important;

            padding: 7px 9px !important;
            box-shadow: none !important;
        }

        .sh-pearl-scope
        .th-upro-header .th-upro-title {
            color: #40576D !important;
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
            background: #E4ECF2 !important;
            color: #40576D !important;

            border: 1px solid #CBD8E2 !important;
            border-radius: 6px !important;

            box-shadow: none !important;
        }

        .sh-pearl-scope
        .th-upro-header .fa-times {
            color: #40576D !important;
        }

        /* =====================================
           03 - جسم البروفايل
           ===================================== */

        .th-upro-pro.sh-pearl-profile {
            background: #F8FAFC !important;
            color: #40576D !important;

            border: 1px solid #D5E0E9 !important;
            border-radius: 12px !important;

            box-shadow:
                0 3px 12px rgba(45,68,88,.08)
                !important;
        }

        .sh-pearl-profile
        .th-upro-profile-container {
            background: #F8FAFC !important;
            border-radius: 10px !important;
        }

        /* الغلاف */

        .sh-pearl-profile .th-upro-cover {
            border-bottom:
                3px solid #C4AC86 !important;
        }

        /* الصورة الشخصية */

        .sh-pearl-profile .th-upro-picture {
            border: 3px solid #E3D2B4 !important;
            border-radius: 50% !important;

            box-shadow:
                0 0 0 3px #FFFFFF,
                0 3px 10px rgba(45,68,88,.14)
                !important;
        }

        /* =====================================
           04 - الاسم والتوثيق
           ===================================== */

        .sh-pearl-profile
        .th-upro-profile-content {
            background: #FCFDFE !important;

            border-bottom:
                1px solid #E1E7ED !important;
        }

        .sh-pearl-profile
        .th-upro-profile-name {
            color: #40576D !important;

            font-size: 17px !important;
            font-weight: 800 !important;

            line-height: 1.6 !important;

            text-shadow:
                0 1px 0 #FFFFFF !important;
        }

        .sh-pearl-profile
        .th-upro-name-wrap::before,
        .sh-pearl-profile
        .th-upro-name-wrap::after {
            content: "✧";
            color: #BAA17C;

            font-size: 14px;
            margin: 0 5px;
        }

        /* =====================================
           05 - المشاهدات والنقاط
           ===================================== */

        .sh-pearl-profile .thProfileStat {
            background: #FFFFFF !important;

            border: 1px solid #DAE2E9 !important;
            border-radius: 9px !important;

            box-shadow:
                0 1px 4px rgba(45,68,88,.05)
                !important;
        }

        .sh-pearl-profile .thProfileStatShine,
        .sh-pearl-profile .NUMBER_TH,
        .sh-pearl-profile .thProfilePointsNum {
            color: #40576D !important;
            font-weight: 700 !important;
        }

        .sh-pearl-profile .thProfileEye {
            color: #8196A8 !important;
        }

        .sh-pearl-profile .thProfilePointsIcon {
            color: #BAA17C !important;
        }

        /* =====================================
           06 - الدولة والعلم
           ===================================== */

        .sh-pearl-profile
        .th-upro-meta-label {
            background: #F8FAFC !important;
        }

        .sh-pearl-profile .th-upro-co {
            background: #FFFFFF !important;
            color: #40576D !important;

            border: 1px solid #D7E0E8 !important;
            border-radius: 8px !important;

            padding: 3px 6px !important;

            font-size: 10px !important;
            font-weight: 700 !important;
        }

        .sh-pearl-profile .th-upro-co img {
            max-width: 27px !important;
            width: auto !important;
            height: auto !important;

            background: #FFFFFF !important;

            padding: 2px !important;
            margin: 0 3px !important;

            border: 1px solid #D8E1E8 !important;
            border-radius: 5px !important;
        }

        /* =====================================
           07 - الغرفة
           ===================================== */

        .sh-pearl-profile
        .th-upro-meta-label .roomh {
            background:
                linear-gradient(
                    135deg,
                    #FFFFFF,
                    #EAF1F5
                ) !important;

            color: #40576D !important;

            border: 1px solid #CCD8E2 !important;
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
            vertical-align: middle !important;

            border-radius: 5px !important;
        }

        /* =====================================
           08 - النبذة والألعاب
           ===================================== */

        .sh-pearl-profile .th-upro-bio {
            background: #FFFFFF !important;
            color: #566B7D !important;

            border: 1px solid #DBE4EB !important;
            border-right:
                3px solid #C4AC86 !important;

            border-radius: 8px !important;

            padding: 8px !important;
            line-height: 1.6 !important;

            box-shadow: none !important;
        }

        .sh-pearl-profile .th-upro-game-xo,
        .sh-pearl-profile .th-upro-game-ludo {
            background: #EDF3F7 !important;
            color: #40576D !important;

            border: 1px solid #CEDAE3 !important;
            border-radius: 8px !important;

            font-weight: 700 !important;
            box-shadow: none !important;
        }

        /* =====================================
           09 - شبكة الأزرار

           ثلاثة أزرار بكل صف
           مع المحافظة على float الأصلي

           لا نغيّر display نهائيًا
           ===================================== */

        .sh-pearl-profile > center >
        a.th-upro-action,
        .sh-pearl-profile > center >
        a.th-upro-action-no-margin {
            float: left !important;

            width: calc(33.333% - 6px) !important;
            min-width: 0 !important;

            height: 36px !important;
            min-height: 36px !important;

            box-sizing: border-box !important;

            margin: 2px 3px !important;
            padding: 5px 2px !important;

            background:
                linear-gradient(
                    145deg,
                    #FFFFFF 0%,
                    #EFF4F8 100%
                ) !important;

            color: #344A60 !important;

            border: 1px solid #D0DBE4 !important;
            border-radius: 5px !important;

            box-shadow:
                inset 0 1px 0 #FFFFFF
                !important;

            text-shadow: none !important;

            font-size: 11px !important;
            font-weight: 700 !important;
            line-height: 1.25 !important;

            text-align: center !important;
            overflow: hidden;
        }

        /*
           مهم جدًا:
           لا نستخدم display:inline-flex
           أو display:block هنا.

           حتى يبقى display:none
           الذي يضعه الشات على
           أزرار الزائر محفوظًا.
        */

        /* حماية إضافية للأزرار المخفية */

        .sh-pearl-profile
        a[style*="display: none"],
        .sh-pearl-profile
        a[style*="display:none"] {
            display: none !important;
        }

        /* =====================================
           10 - تلوين الكلمات والأيقونات

           الخلفيات كلها كريستالية
           ===================================== */

        /* المحادثة الخاصة والتنبيه */

        .sh-pearl-profile a.upm,
        .sh-pearl-profile a.unot {
            color: #294D70 !important;
        }

        /* الإعجابات */

        .sh-pearl-profile a.ulike {
            color: #B23D66 !important;
        }

        /* الهدايا */

        .sh-pearl-profile a.ugift {
            color: #7255B2 !important;
        }

        /* كشف النكات */

        .sh-pearl-profile a.uh {
            color: #344A60 !important;
        }

        /* الصورة والبنر */

        .sh-pearl-profile a.udelpic,
        .sh-pearl-profile a.ubnr {
            color: #B02B67 !important;
        }

        /* ترقية مراقب */

        .sh-pearl-profile a.thRoomMod {
            color: #18805B !important;
        }

        /* الطرد والباند */

        .sh-pearl-profile a.urkick,
        .sh-pearl-profile a.ukick,
        .sh-pearl-profile a.uban,
        .sh-pearl-profile a.ban20 {
            color: #B44250 !important;
        }

        /* الإسكات */

        .sh-pearl-profile a.meiut,
        .sh-pearl-profile a.meiutbc {
            color: #A75D28 !important;
        }

        /* الإطار والحالة والغلاف */

        .sh-pearl-profile a.DELAFT,
        .sh-pearl-profile a.DELMFT,
        .sh-pearl-profile a.Mcover {
            color: #365D91 !important;
        }

        /* تجاهل */

        .sh-pearl-profile a.umute {
            color: #C14339 !important;
        }

        /* إلغاء التجاهل */

        .sh-pearl-profile a.uunmute {
            color: #18805B !important;
        }

        /* مرور المؤشر */

        @media (hover: hover) {
            .sh-pearl-profile > center >
            a.th-upro-action:hover,
            .sh-pearl-profile > center >
            a.th-upro-action-no-margin:hover {
                background: #E6EFF5 !important;
                border-color: #AFC4D5 !important;
            }
        }

        /* =====================================
           11 - لوحة الإدارة المتصلة
           ===================================== */

        .sh-pearl-scope
        .th-upro-edit-box,
        .sh-pearl-scope
        .th-upro-power-box,
        .sh-pearl-scope
        .th-upro-room-box {
            /*
               لا نحدد display هنا
               حتى نحترم إخفاء النظام
            */

            float: none !important;
            clear: both !important;

            width: calc(100% - 12px) !important;

            box-sizing: border-box !important;

            margin: 0 6px !important;
            padding: 8px 10px !important;

            background: #FFFFFF !important;
            color: #40576D !important;

            border: 1px solid #D1DCE5 !important;
            border-bottom: 0 !important;

            border-radius: 0 !important;

            box-shadow: none !important;
        }

        /* أول صندوق */

        .sh-pearl-scope
        .th-upro-edit-box.nickbox {
            border-radius:
                11px 11px 0 0 !important;

            margin-top: 4px !important;
        }

        /* آخر صندوق */

        .sh-pearl-scope
        .th-upro-room-box.roomzbox {
            border-bottom:
                1px solid #D1DCE5 !important;

            border-radius:
                0 0 11px 11px !important;

            margin-bottom: 5px !important;
        }

        /*
           الحفاظ على إخفاء الصناديق
           إذا قام النظام بإخفائها
        */

        .sh-pearl-scope
        .th-upro-edit-box[style*="display: none"],
        .sh-pearl-scope
        .th-upro-edit-box[style*="display:none"],
        .sh-pearl-scope
        .th-upro-power-box[style*="display: none"],
        .sh-pearl-scope
        .th-upro-power-box[style*="display:none"],
        .sh-pearl-scope
        .th-upro-room-box[style*="display: none"],
        .sh-pearl-scope
        .th-upro-room-box[style*="display:none"] {
            display: none !important;
        }

        /* =====================================
           12 - عناوين وحقول الإدارة
           ===================================== */

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
            border-radius: 6px !important;

            padding: 4px 7px !important;
        }

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
            color: #40576D !important;

            border: 1px solid #D0DCE5 !important;
            border-radius: 6px !important;

            font-size: 11px !important;
            line-height: 1.5 !important;

            box-shadow: none !important;
        }

        /* عند الكتابة */

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
            border-color: #9CB1C3 !important;

            outline:
                2px solid rgba(156,177,195,.15)
                !important;

            outline-offset: 0 !important;
        }

        /* =====================================
           13 - الحفظ والتغيير والنقل
           ===================================== */

        .sh-pearl-scope
        .th-upro-save-small,
        .sh-pearl-scope
        .th-upro-edit-box .u-nickc {
            background:
                linear-gradient(
                    145deg,
                    #F6F9FB,
                    #E1EBF2
                ) !important;

            color: #36556F !important;

            border: 1px solid #C6D5E0 !important;
            border-radius: 7px !important;

            font-size: 11px !important;
            font-weight: 700 !important;

            box-shadow:
                inset 0 1px 0 #FFFFFF
                !important;
        }

        /* =====================================
           14 - الجوال
           ===================================== */

        @media (max-width: 420px) {

            .sh-pearl-profile
            .th-upro-profile-name {
                font-size: 15px !important;
            }

            .sh-pearl-profile > center >
            a.th-upro-action,
            .sh-pearl-profile > center >
            a.th-upro-action-no-margin {
                font-size: 10px !important;
                height: 35px !important;
                min-height: 35px !important;
            }

            .sh-pearl-scope
            .th-upro-edit-box,
            .sh-pearl-scope
            .th-upro-power-box,
            .sh-pearl-scope
            .th-upro-room-box {
                width: calc(100% - 10px) !important;

                margin-left: 5px !important;
                margin-right: 5px !important;

                padding: 7px !important;
            }
        }

        /* =====================================
           15 - تقليل الحركة
           ===================================== */

        @media (prefers-reduced-motion: reduce) {
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

    /* ==========================================
       تحديث البروفايل
       ========================================== */

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
                const scope = getScope(profile);

                if (scope) scopes.add(scope);
            }
        });

        /* إزالة الكلاس من النافذة السابقة */

        document.querySelectorAll(
            "." + SCOPE_CLASS
        ).forEach(function (element) {
            if (!scopes.has(element)) {
                element.classList.remove(
                    SCOPE_CLASS
                );
            }
        });

        /* ربطه بنافذة SH */

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

    /* ==========================================
       التشغيل
       ========================================== */

    function init() {
        if (window.__shPearlV6Started) return;

        window.__shPearlV6Started = true;

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
