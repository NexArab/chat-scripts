(function () {
    "use strict";

    /* SH PEARL PROFILE V8 — العضوية المسجّلة SH */

    const ACCOUNT_NAME = "SH";
    const MEMBER_LID = "jdqp31emi90vutw6edfgte9lefrwgi9";
    const BODY = "sh-pearl-profile";
    const SCOPE = "sh-pearl-scope";
    const STYLE = "sh-pearl-style";
    const EMBLEM = "sh-pearl-saudi-emblem";

    const ICON_URL =
        "https://commons.wikimedia.org/wiki/Special:FilePath/Emblem_of_Saudi_Arabia_(2).svg";

    function isTarget(profile) {
        const panel = profile.closest("#upro");
        if (!panel) return false;

        const openUserId = typeof TH_UPRO_OPEN_USER_TIGERHOST !== "undefined"
            ? TH_UPRO_OPEN_USER_TIGERHOST
            : "";
        const userId = String(
            profile.querySelector(".xo-challenge[data-xo-target]")?.dataset.xoTarget ||
            profile.querySelector(".lusoSendForUser[data-ludoid]")?.dataset.ludoid ||
            profile.querySelector(".pool-profile-challenge[data-recipient]")?.dataset.recipient ||
            profile.querySelector(".domino-online-row[data-recipient]")?.dataset.recipient ||
            openUserId || ""
        );
        if (!userId) return false;

        const member = typeof GET_USERS_TIGERHOST === "function"
            ? GET_USERS_TIGERHOST(userId)
            : null;
        if (String(member?.lid ?? "") === MEMBER_LID ||
            String(member?.username ?? "").trim() === ACCOUNT_NAME) {
            return true;
        }

        const row = document.querySelector(
            '[data-th-upro="' + CSS.escape(userId) + '"][data-th-lid]'
        );
        return row?.dataset.thLid === MEMBER_LID;
    }

    const pressTimers = new WeakMap();

    function showActionPress(event) {
        const action = event.target.closest?.(
            ".th-upro-pro.sh-pearl-profile a.upm, .th-upro-pro.sh-pearl-profile a.ulike"
        );

        if (!action || action.classList.contains("disabled") ||
            action.getAttribute("aria-disabled") === "true") {
            return;
        }

        clearTimeout(pressTimers.get(action));
        action.classList.add("sh-pearl-action-pressed");

        pressTimers.set(action, setTimeout(function () {
            action.classList.remove("sh-pearl-action-pressed");
            pressTimers.delete(action);
        }, 300));
    }

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

    function addStyles() {
        const old = document.getElementById(STYLE);

        if (old) old.remove();

        const style = document.createElement("style");
        style.id = STYLE;

        style.textContent = `
        .sh-pearl-scope {
            --sp-main: #40576D;
            --sp-bg: #F8FAFC;
            --sp-border: #D5E0E9;
            --sp-gold: #C4AC86;
        }

        .sh-pearl-scope .th-upro-header {
            background: linear-gradient(135deg, #FFF, #EDF3F7) !important;
            color: #40576D !important;
            border: 0 !important;
            border-bottom: 2px solid #C4AC86 !important;
            padding: 7px 9px !important;
            box-shadow: none !important;
        }

        .sh-pearl-scope .th-upro-title {
            color: #40576D !important;
            font-size: 14px !important;
            font-weight: 800 !important;
        }

        .sh-pearl-scope .th-upro-title img {
            vertical-align: middle !important;
            border-radius: 5px !important;
            margin-left: 4px !important;
        }

        .sh-pearl-scope .th-upro-header .clickable.badge {
            background: #E4ECF2 !important;
            color: #40576D !important;
            border: 1px solid #CBD8E2 !important;
            border-radius: 6px !important;
            box-shadow: none !important;
        }

        .sh-pearl-scope .th-upro-header .fa-times {
            color: #40576D !important;
        }

        .th-upro-pro.sh-pearl-profile {
            background: #F8FAFC !important;
            color: #40576D !important;
            border: 1px solid #D5E0E9 !important;
            border-radius: 12px !important;
            box-shadow: 0 3px 12px rgba(45, 68, 88, .08) !important;
        }

        .sh-pearl-profile .th-upro-profile-container {
            background: #F8FAFC !important;
            border-radius: 10px !important;
        }

        .sh-pearl-profile .th-upro-cover {
            position: relative;
            border-bottom: 3px solid #C4AC86 !important;
        }

        .sh-pearl-profile .th-upro-picture {
            border: 3px solid #E3D2B4 !important;
            border-radius: 50% !important;
            box-shadow: 0 0 0 3px #FFF, 0 3px 10px rgba(45, 68, 88, .14) !important;
        }

        .sh-pearl-profile .th-upro-profile-content {
            background: #FCFDFE !important;
            border-bottom: 1px solid #E1E7ED !important;
        }

        .sh-pearl-profile .th-upro-profile-name {
            color: #40576D !important;
            font-size: 17px !important;
            font-weight: 800 !important;
            line-height: 1.6 !important;
            text-shadow: 0 1px 0 #FFF !important;
        }

        .sh-pearl-profile .th-upro-name-wrap::before,
        .sh-pearl-profile .th-upro-name-wrap::after {
            content: "✧";
            color: #BAA17C;
            font-size: 14px;
            margin: 0 5px;
        }

        .sh-pearl-profile .sh-pearl-saudi-emblem {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 65px;
            height: 64px;
            padding: 9px;
            margin: 5px auto 9px;
            box-sizing: border-box;
            background: linear-gradient(145deg, #FFFFFF, #EEF2F6);
            border: 1px solid #D4DCE3;
            border-radius: 13px;
            box-shadow: inset 0 1px 0 #FFFFFF, 0 2px 7px rgba(30, 46, 60, .08);
            pointer-events: none;
        }

        .sh-pearl-profile .sh-pearl-saudi-emblem img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: grayscale(1) brightness(0) !important;
            -webkit-filter: grayscale(1) brightness(0) !important;
        }

        .sh-pearl-profile .thProfileStat {
            background: #FFFFFF !important;
            border: 1px solid #DAE2E9 !important;
            border-radius: 9px !important;
            box-shadow: 0 1px 4px rgba(45, 68, 88, .05) !important;
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

        .sh-pearl-profile .th-upro-meta-label {
            background: #F8FAFC !important;
        }

        .sh-pearl-profile .th-upro-co {
            background: #FFFFFF !important;
            color: #40576D !important;
            border: 1px solid #D7E0E8 !important;
            border-radius: 8px !important;
            padding: 3px 6px !important;
            font-size: 13px !important;
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

        .sh-pearl-profile .th-upro-meta-label .roomh {
            background: linear-gradient(135deg, #FFFFFF, #EAF1F5) !important;
            color: #40576D !important;
            border: 1px solid #CCD8E2 !important;
            border-radius: 8px !important;
            padding: 3px 6px !important;
            font-size: 11px !important;
            font-weight: 700 !important;
            text-shadow: none !important;
            box-shadow: none !important;
        }

        .sh-pearl-profile .th-upro-meta-label .roomh img {
            max-width: 24px !important;
            max-height: 24px !important;
            width: auto !important;
            height: auto !important;
            margin-left: 4px !important;
            vertical-align: middle !important;
            border-radius: 5px !important;
        }

        .sh-pearl-profile .th-upro-bio {
            background: #FFFFFF !important;
            color: #566B7D !important;
            border: 1px solid #DBE4EB !important;
            border-right: 3px solid #C4AC86 !important;
            border-radius: 8px !important;
            padding: 8px !important;
            line-height: 1.6 !important;
            box-shadow: none !important;
        }

        .sh-pearl-profile .th-upro-game-xo,
        .sh-pearl-profile .th-upro-game-ludo,
        #upro .th-upro-pro.sh-pearl-profile .games-duo-modern.domino-online-row > button.game-btn,
        #upro .th-upro-pro.sh-pearl-profile .games-duo-modern.pool-online-row > button.game-btn,
        #upro .th-upro-pro.sh-pearl-profile button.game-btn.pool-profile-challenge {
            background: #EDF3F7 !important;
            color: #40576D !important;
            border: 1px solid #CEDAE3 !important;
            border-radius: 8px !important;
            font-weight: 700 !important;
            box-shadow: none !important;
        }

        .th-upro-pro.sh-pearl-profile > center > a.th-upro-action,
        .th-upro-pro.sh-pearl-profile > center > a.th-upro-action-no-margin {
            float: left !important;
            width: calc(33.333333% - 6px) !important;
            min-width: 0 !important;
            height: 36px !important;
            min-height: 36px !important;
            box-sizing: border-box !important;
            margin: 2px 3px !important;
            padding: 5px 2px !important;
            background: linear-gradient(145deg, #FFFFFF, #EFF4F8) !important;
            background-color: #F4F8FB !important;
            border: 1px solid #D0DBE4 !important;
            border-radius: 5px !important;
            box-shadow: inset 0 1px 0 #FFFFFF !important;
            text-shadow: none !important;
            font-size: 12px !important;
            font-weight: 700 !important;
            line-height: 1.25 !important;
            text-align: center !important;
            overflow: hidden;
            color: var(--sp-button-color, #344A60) !important;
            -webkit-text-fill-color: var(--sp-button-color, #344A60) !important;
        }

        .th-upro-pro.sh-pearl-profile > center > a.upm,
        .th-upro-pro.sh-pearl-profile > center > a.unot {
            --sp-button-color: #24547B;
        }

        .th-upro-pro.sh-pearl-profile > center > a.ulike {
            --sp-button-color: #BB346A;
            --sp-pressed-bg: #F9DBE7;
        }

        .th-upro-pro.sh-pearl-profile > center > a.upm {
            --sp-pressed-bg: #D8E8F3;
        }

        .th-upro-pro.sh-pearl-profile > center > a:is(.upm, .ulike):is(:active, .sh-pearl-action-pressed) {
            background: var(--sp-pressed-bg) !important;
            border-color: var(--sp-button-color) !important;
            box-shadow: inset 0 2px 4px rgba(45, 68, 88, .18) !important;
        }

        .th-upro-pro.sh-pearl-profile > center > a:is(.upm, .ulike):focus-visible {
            outline: 2px solid var(--sp-button-color);
            outline-offset: -3px;
        }

        .th-upro-pro.sh-pearl-profile > center > a.ugift {
            --sp-button-color: #7446B2;
        }

        .th-upro-pro.sh-pearl-profile > center > a.uh {
            --sp-button-color: #455A70;
        }

        .th-upro-pro.sh-pearl-profile > center > a.udelpic,
        .th-upro-pro.sh-pearl-profile > center > a.ubnr {
            --sp-button-color: #AD2968;
        }

        .th-upro-pro.sh-pearl-profile > center > a.thRoomMod,
        .th-upro-pro.sh-pearl-profile > center > a.uunmute {
            --sp-button-color: #087B52;
        }

        .th-upro-pro.sh-pearl-profile > center > a.urkick,
        .th-upro-pro.sh-pearl-profile > center > a.ukick,
        .th-upro-pro.sh-pearl-profile > center > a.uban,
        .th-upro-pro.sh-pearl-profile > center > a.ban20 {
            --sp-button-color: #B52E42;
        }

        .th-upro-pro.sh-pearl-profile > center > a.meiut,
        .th-upro-pro.sh-pearl-profile > center > a.meiutbc {
            --sp-button-color: #A85C21;
        }

        .th-upro-pro.sh-pearl-profile > center > a.DELAFT,
        .th-upro-pro.sh-pearl-profile > center > a.DELMFT,
        .th-upro-pro.sh-pearl-profile > center > a.Mcover {
            --sp-button-color: #305DA0;
        }

        .th-upro-pro.sh-pearl-profile > center > a.umute {
            --sp-button-color: #C03A35;
        }

        .th-upro-pro.sh-pearl-profile > center > a.th-upro-action::before,
        .th-upro-pro.sh-pearl-profile > center > a.th-upro-action-no-margin::before,
        .th-upro-pro.sh-pearl-profile > center > a.th-upro-action i,
        .th-upro-pro.sh-pearl-profile > center > a.th-upro-action-no-margin i {
            color: var(--sp-button-color, #344A60) !important;
            -webkit-text-fill-color: var(--sp-button-color, #344A60) !important;
        }

        .th-upro-pro.sh-pearl-profile a[style*="display: none"],
        .th-upro-pro.sh-pearl-profile a[style*="display:none"] {
            display: none !important;
        }

        @media (hover: hover) {
            .th-upro-pro.sh-pearl-profile > center > a.th-upro-action:hover,
            .th-upro-pro.sh-pearl-profile > center > a.th-upro-action-no-margin:hover {
                background: #E7F0F6 !important;
                border-color: #B1C5D5 !important;
            }
        }

        .sh-pearl-scope .th-upro-edit-box,
        .sh-pearl-scope .th-upro-power-box,
        .sh-pearl-scope .th-upro-room-box {
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

        .sh-pearl-scope .th-upro-edit-box.nickbox {
            border-radius: 11px 11px 0 0 !important;
            margin-top: 4px !important;
        }

        .sh-pearl-scope .th-upro-room-box.roomzbox {
            border-bottom: 1px solid #D1DCE5 !important;
            border-radius: 0 0 11px 11px !important;
            margin-bottom: 5px !important;
        }

        .sh-pearl-scope .th-upro-edit-box label,
        .sh-pearl-scope .th-upro-power-box label,
        .sh-pearl-scope .th-upro-room-box label {
            color: #455D72 !important;
            font-size: 12px !important;
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

        .sh-pearl-scope .th-upro-edit-box input,
        .sh-pearl-scope .th-upro-edit-box textarea,
        .sh-pearl-scope .th-upro-power-box input,
        .sh-pearl-scope .th-upro-room-box input,
        .sh-pearl-scope .th-upro-power-box select,
        .sh-pearl-scope .th-upro-room-box select {
            background: #F9FBFD !important;
            color: #40576D !important;
            border: 1px solid #D0DCE5 !important;
            border-radius: 6px !important;
            font-size: 12px !important;
            line-height: 1.5 !important;
            box-shadow: none !important;
        }

        .sh-pearl-scope .th-upro-edit-box input:focus,
        .sh-pearl-scope .th-upro-edit-box textarea:focus,
        .sh-pearl-scope .th-upro-power-box input:focus,
        .sh-pearl-scope .th-upro-room-box input:focus,
        .sh-pearl-scope .th-upro-power-box select:focus,
        .sh-pearl-scope .th-upro-room-box select:focus {
            background: #FFFFFF !important;
            border-color: #9CB1C3 !important;
            outline: 2px solid rgba(156, 177, 195, .15) !important;
            outline-offset: 0 !important;
        }

        .sh-pearl-scope .th-upro-save-small,
        .sh-pearl-scope .th-upro-edit-box .u-nickc {
            background: linear-gradient(145deg, #F6F9FB, #E1EBF2) !important;
            color: #36556F !important;
            border: 1px solid #C6D5E0 !important;
            border-radius: 7px !important;
            font-size: 12px !important;
            font-weight: 700 !important;
            box-shadow: inset 0 1px 0 #FFFFFF !important;
        }

        .sh-pearl-scope .th-upro-edit-box[style*="display: none"],
        .sh-pearl-scope .th-upro-edit-box[style*="display:none"],
        .sh-pearl-scope .th-upro-power-box[style*="display: none"],
        .sh-pearl-scope .th-upro-power-box[style*="display:none"],
        .sh-pearl-scope .th-upro-room-box[style*="display: none"],
        .sh-pearl-scope .th-upro-room-box[style*="display:none"] {
            display: none !important;
        }

        @media (max-width: 420px) {
            .sh-pearl-profile .th-upro-profile-name {
                font-size: 15px !important;
            }

            .th-upro-pro.sh-pearl-profile > center > a.th-upro-action,
            .th-upro-pro.sh-pearl-profile > center > a.th-upro-action-no-margin {
                font-size: 11px !important;
                height: 35px !important;
                min-height: 35px !important;
            }

            .sh-pearl-scope .th-upro-edit-box,
            .sh-pearl-scope .th-upro-power-box,
            .sh-pearl-scope .th-upro-room-box {
                width: calc(100% - 10px) !important;
                margin-left: 5px !important;
                margin-right: 5px !important;
                padding: 7px !important;
            }
        }

        .sh-pearl-stars {
            position: absolute;
            inset: 0;
            z-index: 2;
            overflow: hidden;
            pointer-events: none;
        }

        .sh-pearl-star {
            position: absolute;
            top: 0;
            left: var(--star-left);
            color: #fff4d6;
            font-size: var(--star-size);
            line-height: 1;
            text-shadow: 0 0 6px #fff, 0 0 12px #ffd78d;
            animation: sh-pearl-star-fall var(--star-time) ease-in var(--star-delay) both;
        }

        @keyframes sh-pearl-star-fall {
            0% {
                opacity: 0;
                transform: translate3d(0, -16px, 0) scale(.5);
            }

            22% {
                opacity: 1;
                transform: translate3d(3px, calc(var(--star-fall) * .18), 0) scale(1.15);
            }

            52% {
                opacity: .35;
                transform: translate3d(-3px, calc(var(--star-fall) * .46), 0) scale(.8);
            }

            70% {
                opacity: .95;
                transform: translate3d(4px, calc(var(--star-fall) * .68), 0) scale(1);
            }

            100% {
                opacity: 0;
                transform: translate3d(0, var(--star-fall), 0) scale(.55);
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .sh-pearl-profile a.th-upro-action,
            .sh-pearl-profile a.th-upro-action-no-margin {
                transition: none !important;
            }
        }
        `;

        document.head.appendChild(style);
    }

    const starredProfiles = new WeakSet();
    const watchedStarPanels = new WeakSet();

    function syncProfileStars(profile, matched) {
        const panel = profile.closest("#upro");
        if (!panel) return;

        if (!watchedStarPanels.has(panel)) {
            watchedStarPanels.add(panel);
            new MutationObserver(updateProfiles).observe(panel, {
                attributes: true,
                attributeFilter: ["class", "style", "aria-hidden"]
            });
        }

        const visible = panel.getClientRects().length > 0 &&
            panel.getAttribute("aria-hidden") !== "true";

        if (!matched || !visible) {
            starredProfiles.delete(profile);
            profile.querySelector(".sh-pearl-stars")?.remove();
            return;
        }

        if (starredProfiles.has(profile) ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const cover = profile.querySelector(".th-upro-cover");
        if (!cover || !cover.clientHeight) return;

        starredProfiles.add(profile);

        const layer = document.createElement("div");
        layer.className = "sh-pearl-stars";
        layer.setAttribute("aria-hidden", "true");
        layer.style.setProperty("--star-fall", cover.clientHeight + "px");

        for (let i = 0; i < 12; i++) {
            const star = document.createElement("span");
            star.className = "sh-pearl-star";
            star.textContent = i % 3 === 0 ? "✦" : "✧";
            star.style.setProperty("--star-left", (5 + Math.random() * 88) + "%");
            star.style.setProperty("--star-size", (10 + Math.random() * 12) + "px");
            star.style.setProperty("--star-time", (1500 + Math.random() * 550) + "ms");
            star.style.setProperty("--star-delay", (Math.random() * 400) + "ms");
            layer.appendChild(star);
        }

        cover.appendChild(layer);
        setTimeout(function () {
            layer.remove();
        }, 2500);
    }

    function updateProfiles() {
        const scopes = new Set();

        document.querySelectorAll(".th-upro-pro").forEach(function (profile) {
            const matched = isTarget(profile);

            if (profile.classList.contains(BODY) !== matched) {
                profile.classList.toggle(BODY, matched);
            }

            syncProfileStars(profile, matched);

            const oldEmblem = profile.querySelector("." + EMBLEM);

            if (matched) {
                const scope = getScope(profile);

                if (scope) {
                    scopes.add(scope);
                }

                if (!oldEmblem) {
                    const content = profile.querySelector(".th-upro-profile-content");

                    if (content) {
                        const badge = document.createElement("span");
                        badge.className = EMBLEM;
                        badge.setAttribute("aria-hidden", "true");

                        const image = document.createElement("img");
                        image.src = ICON_URL;
                        image.alt = "";
                        image.loading = "lazy";
                        image.decoding = "async";

                        image.addEventListener("error", function () {
                            badge.style.display = "none";
                        }, { once: true });

                        badge.appendChild(image);
                        content.appendChild(badge);
                    }
                }
            } else if (oldEmblem) {
                oldEmblem.remove();
            }
        });

        document.querySelectorAll("." + SCOPE).forEach(function (element) {
            if (!scopes.has(element)) {
                element.classList.remove(SCOPE);
            }
        });

        scopes.forEach(function (scope) {
            if (!scope.classList.contains(SCOPE)) {
                scope.classList.add(SCOPE);
            }
        });
    }

    function init() {
        if (window.__shPearlV8Started) {
            return;
        }

        window.__shPearlV8Started = true;

        addStyles();
        updateProfiles();
        document.addEventListener("click", showActionPress, true);

        let scheduled = false;

        const observer = new MutationObserver(function () {
            if (scheduled) return;

            scheduled = true;

            requestAnimationFrame(function () {
                scheduled = false;
                updateProfiles();
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ["data-xo-target", "data-ludoid", "data-recipient", "data-th-upro", "data-th-lid"]
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
