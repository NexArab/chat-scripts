
(function () {
    "use strict";

    /* ==========================================
       SH PEARL PROFILE V8
       White Crystal + Black Saudi Emblem

       العضوة: ⠀ SH
       شعار النخلة والسيفين بالأسود
       ========================================== */

    const NAME = "\u2800 SH";
    const BODY = "sh-pearl-profile";
    const SCOPE = "sh-pearl-scope";
    const STYLE = "sh-pearl-style";
    const EMBLEM = "sh-pearl-saudi-emblem";

    const ICON_URL =
        "https://commons.wikimedia.org/wiki/Special:FilePath/Emblem_of_Saudi_Arabia_(2).svg";

    /* تحديد العضوة */

    function isTarget(profile) {
        const name = profile.querySelector(
            ".th-upro-profile-name"
        );

        return !!name &&
            name.textContent.replace(
                /^[ \t\r\n]+|[ \t\r\n]+$/g,
                ""
            ) === NAME;
    }

    /* تحديد النافذة المشتركة */

    function getScope(profile) {
        const modal = profile.closest(".modal");

        if (modal) return modal;

        let el = profile.parentElement;

        while (
            el &&
            el !== document.body &&
            el !== document.documentElement
        ) {
            if (
                el.querySelector(".th-upro-header") &&
                el.querySelector(".th-upro-pro")
            ) {
                return el;
            }

            el = el.parentElement;
        }

        return profile;
    }

    /* ==========================================
       CSS الكامل
       ========================================== */

    function addStyles() {
        const old = document.getElementById(STYLE);

        if (old) old.remove();

        const style = document.createElement("style");
        style.id = STYLE;

        style.textContent = `

        /* =====================================
           الهوية الكريستالية
           ===================================== */

        .sh-pearl-scope {
            --sp-main: #40576D;
            --sp-bg: #F8FAFC;
            --sp-border: #D5E0E9;
            --sp-gold: #C4AC86;
        }

        /* الشريط العلوي */

        .sh-pearl-scope .th-upro-header {
            background:
                linear-gradient(135deg,#FFF,#EDF3F7)
                !important;

            color: #40576D !important;
            border: 0 !important;

            border-bottom:
                2px solid #C4AC86 !important;

            padding: 7px 9px !important;
            box-shadow: none !important;
        }

        .sh-pearl-scope .th-upro-title {
            color: #40576D !important;
            font-size: 12px !important;
            font-weight: 800 !important;
        }

        .sh-pearl-scope .th-upro-title img {
            vertical-align: middle !important;
            border-radius: 5px !important;
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
           جسم البروفايل
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

        /* الغلاف والصورة */

        .sh-pearl-profile .th-upro-cover {
            border-bottom:
                3px solid #C4AC86 !important;
        }

        .sh-pearl-profile .th-upro-picture {
            border: 3px solid #E3D2B4 !important;
            border-radius: 50% !important;

            box-shadow:
                0 0 0 3px #FFF,
                0 3px 10px rgba(45,68,88,.14)
                !important;
        }

        /* الاسم */

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
            text-shadow: 0 1px 0 #FFF !important;
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
           شعار المملكة الأسود
           ===================================== */

        .sh-pearl-profile
        .sh-pearl-saudi-emblem {
            display: flex;
            align-items: center;
            justify-content: center;

            width: 65px;
            height: 64px;

            padding: 9px;
            margin: 5px auto 9px;

            box-sizing: border-box;

            background:
                linear-gradient(
                    145deg,
                    #FFFFFF,
                    #EEF2F6
                );

            border: 1px solid #D4DCE3;
            border-radius: 13px;

            box-shadow:
                inset 0 1px 0 #FFFFFF,
                0 2px 7px rgba(30,46,60,.08);

            pointer-events: none;
        }

        .sh-pearl-profile
        .sh-pearl-saudi-emblem img {
            display: block;
            width: 100%;
            height: 100%;

            object-fit: contain;

            filter:
                grayscale(1) brightness(0)
                !important;

            -webkit-filter:
                grayscale(1) brightness(0)
                !important;
        }

        /* =====================================
           المشاهدات والنقاط
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
           الدولة والعلم
           ===================================== */

        .sh-pearl-profile .th-upro-meta-label {
            background: #F8FAFC !important;
        }

        .sh-pearl-profile .th-upro-co {
            background: #FFFFFF !important;
            color: #40576D !important;

            border: 1px solid #D7E0E8 !important;
            border-radius: 8px !important;

            padding: 3px 6px !important;
            font-size: 11px !important;
            font-weight: 700 !important;
        }

        .sh-pearl-profile .th-upro-co img {
            max-width: 27px !important;
            width: auto !important;
            height: auto !important;

            padding: 2px !important;
            margin: 0 3px !important;

            background: #FFFFFF !important;
            border: 1px solid #D8E1E8 !important;
            border-radius: 5px !important;
        }

        /* =====================================
           الغرفة
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

            font-size: 11px !important;
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
           النبذة
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

        /* =====================================
           ألعاب XO واللودو
           ===================================== */

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
           شبكة الأزرار - ثلاثة في كل صف
           ===================================== */

        .th-upro-pro.sh-pearl-profile
        > center > a.th-upro-action,
        .th-upro-pro.sh-pearl-profile
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
                    #FFFFFF,
                    #EFF4F8
                ) !important;

            background-color: #F4F8FB !important;

            border: 1px solid #D0DBE4 !important;
            border-radius: 5px !important;

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
                var(--sp-button-color,#344A60)
                !important;

            -webkit-text-fill-color:
                var(--sp-button-color,#344A60)
                !important;
        }

        /* ألوان كل زر */

        .th-upro-pro.sh-pearl-profile
        > center > a.upm,
        .th-upro-pro.sh-pearl-profile
        > center > a.unot {
            --sp-button-color: #24547B;
        }

        .th-upro-pro.sh-pearl-profile
        > center > a.ulike {
            --sp-button-color: #BB346A;
        }

        .th-upro-pro.sh-pearl-profile
        > center > a.ugift {
            --sp-button-color: #7446B2;
        }

        .th-upro-pro.sh-pearl-profile
        > center > a.uh {
            --sp-button-color: #455A70;
        }

        .th-upro-pro.sh-pearl-profile
        > center > a.udelpic,
        .th-upro-pro.sh-pearl-profile
        > center > a.ubnr {
            --sp-button-color: #AD2968;
        }

        .th-upro-pro.sh-pearl-profile
        > center > a.thRoomMod,
        .th-upro-pro.sh-pearl-profile
        > center > a.uunmute {
            --sp-button-color: #087B52;
        }

        .th-upro-pro.sh-pearl-profile
        > center > a.urkick,
        .th-upro-pro.sh-pearl-profile
        > center > a.ukick,
        .th-upro-pro.sh-pearl-profile
        > center > a.uban,
        .th-upro-pro.sh-pearl-profile
        > center > a.ban20 {
            --sp-button-color: #B52E42;
        }

        .th-upro-pro.sh-pearl-profile
        > center > a.meiut,
        .th-upro-pro.sh-pearl-profile
        > center > a.meiutbc {
            --sp-button-color: #A85C21;
        }

        .th-upro-pro.sh-pearl-profile
        > center > a.DELAFT,
        .th-upro-pro.sh-pearl-profile
        > center > a.DELMFT,
        .th-upro-pro.sh-pearl-profile
        > center > a.Mcover {
            --sp-button-color: #305DA0;
        }

        .th-upro-pro.sh-pearl-profile
        > center > a.umute {
            --sp-button-color: #C03A35;
        }

        /* تلوين أيقونات Font Awesome */

        .th-upro-pro.sh-pearl-profile
        > center > a.th-upro-action::before,
        .th-upro-pro.sh-pearl-profile
        > center > a.th-upro-action-no-margin::before,
        .th-upro-pro.sh-pearl-profile
        > center > a.th-upro-action i,
        .th-upro-pro.sh-pearl-profile
        > center > a.th-upro-action-no-margin i {
            color:
                var(--sp-button-color,#344A60)
                !important;

            -webkit-text-fill-color:
                var(--sp-button-color,#344A60)
                !important;
        }

        /* احترام الأزرار المخفية */

        .th-upro-pro.sh-pearl-profile
        a[style*="display: none"],
        .th-upro-pro.sh-pearl-profile
        a[style*="display:none"] {
            display: none !important;
        }

        /* تأثير المرور */

        @media (hover:hover) {
            .th-upro-pro.sh-pearl-profile
            > center > a.th-upro-action:hover,
            .th-upro-pro.sh-pearl-profile
            > center > a.th-upro-action-no-margin:hover {
                background: #E7F0F6 !important;
                border-color: #B1C5D5 !important;
            }
        }

        /* =====================================
           صناديق الأدمن المتصلة
           ===================================== */

        .sh-pearl-scope .th-upro-edit-box,
        .sh-pearl-scope .th-upro-power-box,
        .sh-pearl-scope .th-upro-room-box {
            float: none !important;
            clear: both !important;

            width:
                calc(100% - 12px) !important;

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

        /* عناوين الإدارة */

        .sh-pearl-scope
        .th-upro-edit-box label,
        .sh-pearl-scope
        .th-upro-power-box label,
        .sh-pearl-scope
        .th-upro-room-box label {
            color: #455D72 !important;

            font-size: 12px !important;
            font-weight: 700 !important;
        }

        .sh-pearl-scope
        .th-upro-edit-label,
        .sh-pearl-scope
        .th-upro-like-label,
        .sh-pearl-scope
        .th-upro-eva-label {
            background: #EDF3F7 !important;
            color: #455D72 !important;

            border: 1px solid #D6E0E8 !important;
            border-radius: 6px !important;

            padding: 4px 7px !important;
        }

        /* حقول الإدخال */

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

            font-size: 12px !important;
            line-height: 1.5 !important;

            box-shadow: none !important;
        }

        /* التركيز على الحقول */

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

        /* أزرار الحفظ والتعديل والنقل */

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

            font-size: 12px !important;
            font-weight: 700 !important;

            box-shadow:
                inset 0 1px 0 #FFFFFF
                !important;
        }

        /* احترام إخفاء صناديق الإدارة */

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
           الجوال
           ===================================== */

        @media (max-width: 420px) {

            .sh-pearl-profile
            .th-upro-profile-name {
                font-size: 15px !important;
            }

            .th-upro-pro.sh-pearl-profile
            > center > a.th-upro-action,
            .th-upro-pro.sh-pearl-profile
            > center > a.th-upro-action-no-margin {
                font-size: 11px !important;

                height: 35px !important;
                min-height: 35px !important;
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

                padding: 7px !important;
            }
        }

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
       تحديث البروفايل وإضافة الشعار
       ========================================== */

    function updateProfiles() {
        const scopes = new Set();

        document.querySelectorAll(
            ".th-upro-pro"
        ).forEach(function (profile) {

            const matched = isTarget(profile);

            if (
                profile.classList.contains(BODY)
                !== matched
            ) {
                profile.classList.toggle(
                    BODY,
                    matched
                );
            }

            const oldEmblem = profile.querySelector(
                "." + EMBLEM
            );

            if (matched) {
                const scope = getScope(profile);

                if (scope) {
                    scopes.add(scope);
                }

                if (!oldEmblem) {
                    const content = profile.querySelector(
                        ".th-upro-profile-content"
                    );

                    if (content) {
                        const badge = document.createElement(
                            "span"
                        );

                        badge.className = EMBLEM;
                        badge.setAttribute(
                            "aria-hidden",
                            "true"
                        );

                        const image = document.createElement(
                            "img"
                        );

                        image.src = ICON_URL;
                        image.alt = "";
                        image.loading = "lazy";
                        image.decoding = "async";

                        image.addEventListener(
                            "error",
                            function () {
                                badge.style.display = "none";
                            },
                            { once: true }
                        );

                        badge.appendChild(image);
                        content.appendChild(badge);
                    }
                }
            } else if (oldEmblem) {
                oldEmblem.remove();
            }
        });

        /* إزالة التصميم عن أي نافذة سابقة */

        document.querySelectorAll(
            "." + SCOPE
        ).forEach(function (element) {
            if (!scopes.has(element)) {
                element.classList.remove(SCOPE);
            }
        });

        /* تطبيق التصميم على نافذة SH */

        scopes.forEach(function (scope) {
            if (!scope.classList.contains(SCOPE)) {
                scope.classList.add(SCOPE);
            }
        });
    }

    /* ==========================================
       تشغيل السكربت
       ========================================== */

    function init() {
        if (window.__shPearlV8Started) {
            return;
        }

        window.__shPearlV8Started = true;

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
