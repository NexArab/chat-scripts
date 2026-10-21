
(function () {
    "use strict";

    /* ========================================
       تصميم ملكي خاص - إستبرق
       يؤثر على بروفايل واحد فقط
       ======================================== */

    const TARGET_NAME = "إستبــــــــــــرق";
    const STYLE_ID = "istabraq-royal-style";
    const PROFILE_CLASS = "istabraq-royal";

    function addStyle() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;

        style.textContent = `

        /* الحاوية العامة */

        .th-upro-pro.istabraq-royal {
            background: #FAF5F7 !important;
            border: 1px solid #DFC9D4 !important;
            border-radius: 12px !important;
            box-shadow:
                0 4px 16px rgba(91,55,73,.12) !important;
            overflow: hidden;
        }

        /* الحاوية الداخلية */

        .istabraq-royal .th-upro-profile-container {
            background: #FAF5F7 !important;
            border-radius: 10px;
            overflow: hidden;
        }

        /* الغلاف - نحتفظ بصورة العضوة */

        .istabraq-royal .th-upro-cover {
            border-bottom: 3px solid #C9A77B !important;
        }

        /* الصورة الشخصية */

        .istabraq-royal .th-upro-picture {
            border: 3px solid #E3C494 !important;
            border-radius: 50% !important;

            box-shadow:
                0 0 0 3px rgba(255,255,255,.85),
                0 3px 12px rgba(91,55,73,.17) !important;
        }

        /* منطقة الاسم */

        .istabraq-royal .th-upro-profile-content {
            background: #F8EDF2 !important;
            border-bottom: 1px solid #E7D1DB;
            padding-bottom: 6px;
        }

        /* الاسم الملكي */

        .istabraq-royal .th-upro-profile-name {
            color: #80546D !important;
            font-weight: 800 !important;
            font-size: 17px !important;
            line-height: 1.65 !important;
            text-shadow:
                0 1px 0 #FFFFFF,
                0 2px 4px rgba(104,62,83,.12);
        }

        /* زخرفة بسيطة حول الاسم */

        .istabraq-royal .th-upro-name-wrap::before {
            content: "✦";
            color: #BE9863;
            margin-left: 6px;
            font-size: 13px;
        }

        .istabraq-royal .th-upro-name-wrap::after {
            content: "✦";
            color: #BE9863;
            margin-right: 6px;
            font-size: 13px;
        }

        /* المشاهدات والنقاط */

        .istabraq-royal .thProfileStat {
            background: #FFFFFF !important;
            border: 1px solid #E8D6DE !important;
            border-radius: 8px !important;

            box-shadow:
                0 1px 4px rgba(91,55,73,.05) !important;
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

        /* المعلومات والغرفة */

        .istabraq-royal .th-upro-meta-label {
            background: #FAF5F7 !important;
        }

        /* النبذة الشخصية */

        .istabraq-royal .th-upro-bio {
            background: #FFFFFF !important;
            color: #735868 !important;

            border: 1px solid #E7D2DD !important;
            border-right: 3px solid #C69DAF !important;
            border-radius: 8px !important;

            padding: 9px !important;
            line-height: 1.65 !important;
            box-shadow: none !important;
        }

        /* ألعاب XO واللودو */

        .istabraq-royal .th-upro-game-xo,
        .istabraq-royal .th-upro-game-ludo {
            border-radius: 7px !important;
            box-shadow: none !important;
        }

        /* أزرار البروفايل */

        .istabraq-royal .th-upro-action,
        .istabraq-royal .th-upro-action-no-margin {
            border-radius: 7px !important;
            box-shadow: none !important;
            font-weight: 700 !important;
        }

        /* الخاص */

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

        /* زر الإعجابات */

        .istabraq-royal .ulike {
            background: #BD7695 !important;
            color: #FFFFFF !important;
            border-color: #BD7695 !important;
        }

        /* زر الهدية */

        .istabraq-royal .ugift {
            background: #B99864 !important;
            color: #FFFFFF !important;
            border-color: #B99864 !important;
        }

        /* لا نعدل أزرار الإدارة والحظر */

        @media (max-width: 420px) {
            .istabraq-royal .th-upro-profile-name {
                font-size: 15px !important;
            }
        }
        `;

        document.head.appendChild(style);
    }

    function updateProfile() {
        document.querySelectorAll(
            ".th-upro-pro"
        ).forEach(function (profile) {

            const name = profile.querySelector(
                ".th-upro-profile-name"
            );

            if (!name) {
                profile.classList.remove(PROFILE_CLASS);
                return;
            }

            const isTarget =
                name.textContent.trim() === TARGET_NAME;

            profile.classList.toggle(
                PROFILE_CLASS,
                isTarget
            );
        });
    }

    function init() {
        addStyle();
        updateProfile();

        new MutationObserver(updateProfile).observe(
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
