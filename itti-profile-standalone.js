(function () {
    "use strict";

    const KEY = "__ITTI_TIGER_FINAL_V4__";
    if (window[KEY]) return;
    window[KEY] = true;

    const TARGET = "\u3164\u3164\u3164\u3164iTTi";
    const PROFILE = "itti-v4-profile";
    const SCOPE = "itti-v4-scope";
    const EMBLEM = "itti-v4-tiger";
    const STYLE_ID = "itti-v4-style";

    // شعار النمر مدمج، لا يحتاج رابط صورة خارجي.
    const TIGER =
        "data:image/webp;base64," +
        "UklGRt4KAABXRUJQVlA4WAoAAAAQAAAATwAATwAAQUxQSJkEAAABoEVb2/FIelPVZaNtu6tt27Zt27Zt27ZtjG1P20i+930ukt8ZXEbEBND/iWFh/iVr+mXfHGgU4Eca/fYYwPmx5f1G3G9gFsC9JbOfqP9B2Bt4eGhmy6QoouCs6RKiHbQPrAkAr+53bbf7yZMfbo3OGOyQ0K/ArJSXNwCBz5/Pt3BG7C9go8I+AVlfyuWAkC/BrPTpFLzdmtp+tBpsIfDV3Jw2K7fiM7GCGXg5OcAWgcUSiCjlSg/AVgOHy9iB8u7fNWvFjxC2I17Ut8gVS0SUOPslwLZUCi96WUP5++SNT1Nm8u/CdmFgeRpLqNFHD58LwDYWXM9kCSVN/1TYaqWPGZeDLEk1/YntGJvyWZA4+5Gw7RiPasealfQRwDZXzMx4tDzQnCp/gG3vg+GuYSwxqcIiFo/9fCrGqSyGwhutPjR96wexizIkqGzIe+hLYceinwkJBwF2rHyoYyziHBTbVhnD73GGXNNvfOR2EMuZ9EYKdGvzB+xjKu6l1OfKkXAX7GzsCdBFtBbsdMzTNwniOMEgH66UceGFdgIwpuzGeFPFi1IPvfgB+PYz5zF+z+VFlL5SvXJdv3AbciLuRPsgCqzRZ6WyQtmFMUojIDD7Y1hhXxzWoIDTYOsVMyt9yhDe1SOioDgiaiJiA2+ldBmWt62JiAJadMrT9iGYmZUlyoe1uEA+w+c+AQAPMyuHzfFFVGjB1x9vfyYW2VDeF9aiyMR8d8GOFEALR8h3+nyJqVv9AG/7CVb+LSwQZvyeVyO89d5v3/5xZc+uS4/th7U0SuT9yw/MW3OQzqD0WeLLbPntr2fKbvg4iioIOma5gu+CSacra48d1/cs+wLC9hbGYKKx2Oaii5hKugODM45jKLZcGWFGZwr+8lochf34dxp93i09Yp2JOOGquDmGqAi3JhP3wxbKyJeh0ZTVRcNHkInBtZRYo3wYxQGKmb6dXBnIzMgWB2GJYlYmyKt932AQmd3r1K9iEStmGGABfkllWsSdD8oKZlbM+OIDRBcLNyLzCz2GDqWhdPFb9y8DLzW9AV24E2oB1fgDWqYqPFy7sVwZ6vxWdI0jK0MbXlRWMMu8ymGhVOehvo2WBCZN/wWABYyLDQMoy1Gl60akFUSUsumud9BQrAzJu10VXDTwIfRsC7eIwmPLX4EvU+X1OKKkg27RwItOZHFo0ZEb5vwoYhrDM5Qiij2BB8ws8IyJt4qI8u9V/BwsJrF804Ai9h16/pIZ+GFcFNnRNRG3L+O5mPVdn3hKajC9x4YvD4zPlYxsOsHT8MSZpzBHYW0YUXyyiFSFXUFk3/lX8k+aAIgZ7vdoRE4cuaBQVPePPTAm7i37XpVyAhVqkIKCa34NZmH4EmFmWZ5+yM1IJxAFElH6O3j6kr+FMPP7Z24I46sUNLaBM3zmenh5sufQZkDk1dymWxiM2hTV3EE0a2rquhc6znznBv7IRl3eC6YTZXZS/SqBFJCaSi+Y9ztWEY0BthG5nJQrnHyHFv37uzCK+A7ryW+2fp+NaBUP9h/Bt3IRtfkhp/+gYTFE7SeR/3SlIIrrFuZHvOOC6J8WAFZQOCAeBgAAMBgAnQEqUABQAD7tXqROqaUjIjcaq2kwHYlsAMX8GE0TjnAqO1bw9EW2s54P0Z/4DfQt5C/vVAX5qQnW6ZI/sazJlZU1fyK/XHsEsbyM2SmcxwP0ca+evpX96O6Le5jf9aMaLgxf/GoLcQKGzTGjc+epBEjJ3jWgLoXDJRwURxmvlLWypoXwTOwWrGsW77EcCH9VOd+UmXR3emE7GDKMfwV1UcBhbU6s1wTDEURcWQeJ9pOMUb6Z3oUEQnZsvZ9ngaRXVTBJs20qIAD++0ARrlbCktsRlO9eZtGvx2CUmTLUPErMJ1sP+ilmlm8S6lIQk9TEkGKv7F0lcjeaGApec454dJ0jMJVm7FYlr7w02fHDA+BjBfZoUX01Wf0zFuXe+vunIO0Qacre6ClXYzAdSUSEhnDiVd00IbT1/rCBEZsf02DKsoXiAMm+R7Mbs0VfY/53Iru9ITeSjDl9/Q0Qh+1VPL4vqlhj4NIn5g0aib3HM54nb7nrid9MQVsMaby/rhDDjlQTxSgZiPz+/NgIp+AGmgsRNs4dkb7K6si/P8iVzqzRWEbSGj28TDhtGrkiDjjCKqixv4SIBkiVJQJ/77RkSidhb4KkOdiZWizG9G2vXB+8Lkb1wJ5ZKKxwy3P5yVBLAsleLcaoyoLwlz4GDcbrY8nri22kk9EfhpyUIn6ieRFO6EkpDhQeFCHjlqCKeJSWxQBESlMV3wU6TXPnQo8Nd89HpcjSNOSrI2Lie4gKz4MB1xAkiLeJDmkGp/oOAuztnT9p/dqP3C2m6EC+ned3N1tnb/zi4Ul/NTPfBqtAFhGmwej/eNSWGt/Xly3GA2/CSkcSDgEcTkF/kvmELDh9XcULGZIVqrgwRxbZyP6v6LtJdLRqZB5hq9CWvaoVupBqZvE2M8UYUK3G2kZWNxd+qHzczMrvG99WAif+OqtBdzaXRIOIKW6FAX8Xw5+VIgxTw71DiaOzo8gck56WUfraV2gIIX8KnNOBMuYu9dshqda75mvG8fGAG37UYNaX4Cj6G37XXH5PN3gZJXzrky7n5OmuNwY9BaazB92LhTPwxTFjhvvGtPwo6FJdCuZEyIsjCjYyGmy+0catUv3LufFEBbKSb8I2v697uIvvESeGMJceeyhgE24B6ZMd2eWnwXlGQAQYs5GTP6MT5giGunLgr7BH0QkUohgUwuSKCh9VIY3O5g52BwPRkPd5MxCzHCMxsrs9eXKWL0D7FD88EY/uOsK1sKvaVUFGBWvFbVI0QWtjUEVL4kPvhhwfbtLDpOQ4/sGYy2hgGuCXbcg6AXfhX2oJqwmrdkoY55Ayol19ggJma8fjNMvqVCkDsiXoN9RbcUxayI/XwxubhHL/etUt+DS3cwqleDoGY0XQPYz5wLhMt8sHstjbeyW41IksAXjqUdu4cB6zKs0oD7akt+elZamDDxM4Pxpg+7xFkQX/IpUy9CmR2hwtEZ8NHPYNrlZb6+PFuraDTaOU8WyBRizcT9IlXripZDoilYvI/bTUfjbi74gDSYF3l9551Qt/DGcI7TwTLt6F0J7xb0h6VdC99tph+4e7UZfPd4jny8eHW+lMovhSpS/b9d4MJJmcjAHTrwKUbsrLZzK8xw+9xCl8lXomC4EnFAElD2pmo9OF5kpXlZLiQ+wuGD7XsQg7IrWUznbazILuHJ1LjwAYq1stVVCtMJXPBY28DIcZfwLx31CdbEo0pHkmUUCACaCCwk6cP/M1SJn5uE1NNCfgSiIigFNYkP4tG52Kd3o+ODr7dzr+IDFMdnaGvGcT2kQEmnUvnGgxVOQ7igT/t7Xjh0X9n4BGHt+PpLu92kFYvIlH6FReo4NkjMhhiQ4XsihDSlZ6ZljImSL53spC9cpqdcPRJl+vEeMrR1pBFuFZ1QFRT6v99k524BF3HqRqEFbG0IrRFx0Ux9SE0YcLSCdJfDib/f11z74UXw9zl2tdohEZdjePz46/mAOAzStd0xy3Mcs22kcsX3jYwaxtD2BorYpjRuwOIHcMGkdmQKQ8bD3pm4MPqBlXpKPmZc9/cC/B8GxmINLrrD8oNdvTRUAhWcrGXkZKtZpAhTwAgAAA";

    function getScope(profile) {
        let parent = profile.parentElement;
        let nearest = null;

        while (
            parent &&
            parent !== document.body &&
            parent !== document.documentElement
        ) {
            if (
                parent.querySelector(".th-upro-header") &&
                parent.contains(profile)
            ) {
                if (!nearest) nearest = parent;

                if (
                    parent.querySelector(".th-upro-edit-box") ||
                    parent.querySelector(".th-upro-power-box") ||
                    parent.querySelector(".th-upro-room-box")
                ) {
                    return parent;
                }
            }

            if (
                parent.classList.contains("modal-content")
            ) {
                return parent;
            }

            parent = parent.parentElement;
        }

        return nearest ||
            profile.closest(".modal-content") ||
            profile;
    }

    function isTarget(profile) {
        const name = profile.querySelector(
            ".th-upro-profile-name"
        );

        if (!name) return false;

        return name.textContent.replace(
            /^[ \t\r\n]+|[ \t\r\n]+$/g,
            ""
        ) === TARGET;
    }

    function createTiger() {
        const box = document.createElement("div");
        box.className = EMBLEM;
        box.setAttribute("aria-hidden", "true");

        const image = document.createElement("img");
        image.src = TIGER;
        image.alt = "";
        image.width = 112;
        image.height = 112;
        image.decoding = "async";

        box.appendChild(image);
        return box;
    }

    function addStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement("style");
        style.id = STYLE_ID;

        style.textContent = `
        /* النافذة والحاويات خلف حقول الإدارة */

        .${SCOPE} {
            background: #141518 !important;
            color: #E9E6D9 !important;
            border-color: #655725 !important;
        }

        .${SCOPE} .modal-body,
        .${SCOPE} .modal-footer {
            background: #141518 !important;
            color: #E9E6D9 !important;
            border-color: #554B29 !important;
        }

        .${SCOPE} .modal-body {
            padding: 0 !important;
        }

        /* الشريط العلوي */

        .${SCOPE} .th-upro-header {
            background: linear-gradient(
                115deg, #101114, #29271B
            ) !important;
            color: #F5CC24 !important;
            border: 0 !important;
            border-bottom: 2px solid #F5CC24 !important;
            padding: 8px 10px !important;
            box-shadow: none !important;
        }

        .${SCOPE} .th-upro-title,
        .${SCOPE} .th-upro-header .fa-times {
            color: #F5CC24 !important;
        }

        .${SCOPE} .th-upro-header .clickable.badge {
            background: #29271C !important;
            color: #F5CC24 !important;
            border: 1px solid #77682E !important;
            border-radius: 6px !important;
        }

        /* جسم البروفايل */

        .th-upro-pro.${PROFILE} {
            background: #141518 !important;
            color: #E9E6D9 !important;
            border: 1px solid #786629 !important;
            border-radius: 12px !important;
            box-shadow: none !important;
        }

        .${PROFILE} .th-upro-profile-container {
            background: #141518 !important;
            color: #E9E6D9 !important;
            border-radius: 10px !important;
        }

        /* الصورة والغلاف الأصليان يبقيان */

        .${PROFILE} .th-upro-cover {
            border-bottom: 3px solid #F5CC24 !important;
        }

        .${PROFILE} .th-upro-picture {
            border: 3px solid #F5CC24 !important;
            border-radius: 50% !important;
            box-shadow:
                0 0 0 3px #141518,
                0 3px 12px rgba(0,0,0,.35) !important;
        }

        /* الاسم */

        .${PROFILE} .th-upro-profile-content {
            background: linear-gradient(
                #24241D, #141518
            ) !important;
            border-bottom: 1px solid #494125 !important;
            padding-bottom: 9px !important;
        }

        .${PROFILE} .th-upro-profile-name {
            color: #F5CC24 !important;
            font-size: 19px !important;
            font-weight: 800 !important;
            line-height: 1.7 !important;
            text-shadow: none !important;
        }

        /* النمر الجانبي */

        .${PROFILE} .${EMBLEM} {
            width: 126px;
            height: 126px;
            margin: 9px auto 5px;
            padding: 6px;
            box-sizing: border-box;
            border: 1px solid #716126;
            border-radius: 12px;
            background: radial-gradient(
                ellipse at center,
                #39351D,
                #17181B 75%
            );
            pointer-events: none;
            user-select: none;
        }

        .${PROFILE} .${EMBLEM} img {
            display: block;
            width: 100%;
            height: 100%;
            max-width: none;
            object-fit: contain;
            border: 0;
            border-radius: 0;
            filter: none;
        }

        /* المشاهدات والنقاط */

        .${PROFILE} .profile-card-modern,
        .${PROFILE} .th-upro-meta-label {
            background: #141518 !important;
            color: #E9E6D9 !important;
        }

        .${PROFILE} .thProfileStat {
            background: #20211F !important;
            border: 1px solid #554B29 !important;
            border-radius: 9px !important;
            box-shadow: none !important;
        }

        .${PROFILE} .thProfileStatShine,
        .${PROFILE} .NUMBER_TH,
        .${PROFILE} .thProfilePointsNum,
        .${PROFILE} .thProfileEye,
        .${PROFILE} .thProfilePointsIcon {
            color: #F5CC24 !important;
        }

        /* الدولة والغرفة */

        .${PROFILE} .th-upro-co,
        .${PROFILE} .th-upro-meta-label .roomh {
            background: #25251D !important;
            color: #EAD891 !important;
            border: 1px solid #695A29 !important;
            border-radius: 7px !important;
            padding: 4px 6px !important;
            font-size: 11px !important;
            text-shadow: none !important;
            box-shadow: none !important;
        }

        .${PROFILE} .th-upro-co img {
            max-width: 27px !important;
            height: auto !important;
            border-radius: 4px !important;
        }

        .${PROFILE} .roomh img {
            max-width: 24px !important;
            max-height: 24px !important;
            border-radius: 4px !important;
            vertical-align: middle !important;
        }

        /* النبذة والألعاب */

        .${PROFILE} .th-upro-bio {
            background: #1E1F21 !important;
            color: #E9E6D9 !important;
            border: 1px solid #49442B !important;
            border-right: 3px solid #F5CC24 !important;
            border-radius: 8px !important;
            padding: 9px !important;
            line-height: 1.7 !important;
            box-shadow: none !important;
        }

        .${PROFILE} .th-upro-game-xo,
        .${PROFILE} .th-upro-game-ludo {
            background: #29281D !important;
            color: #F5CC24 !important;
            border: 1px solid #78672C !important;
            border-radius: 7px !important;
            box-shadow: none !important;
        }

        /* الأزرار: نحافظ على ظهورها وصلاحياتها */

        .th-upro-pro.${PROFILE}
        > center > a.th-upro-action,
        .th-upro-pro.${PROFILE}
        > center > a.th-upro-action-no-margin {
            float: left !important;
            width: calc(33.333333% - 6px) !important;
            min-width: 0 !important;
            min-height: 37px !important;
            margin: 3px !important;
            padding: 7px 2px !important;
            box-sizing: border-box !important;
            background: linear-gradient(
                #2B291D, #1C1D19
            ) !important;
            border: 1px solid #77662B !important;
            border-radius: 7px !important;
            color: #F5CC24 !important;
            -webkit-text-fill-color: #F5CC24 !important;
            font-size: 12px !important;
            font-weight: 700 !important;
            line-height: 1.4 !important;
            text-align: center !important;
            text-shadow: none !important;
            box-shadow: none !important;
        }

        .${PROFILE} > center > a.th-upro-action::before,
        .${PROFILE} > center > a.th-upro-action-no-margin::before,
        .${PROFILE} > center > a.th-upro-action i,
        .${PROFILE} > center > a.th-upro-action-no-margin i {
            color: #F5CC24 !important;
            -webkit-text-fill-color: #F5CC24 !important;
        }

        .${PROFILE} > center::after {
            content: "";
            display: block;
            clear: both;
        }

        @media (hover: hover) {
            .${PROFILE} > center > a.th-upro-action:hover,
            .${PROFILE} > center > a.th-upro-action-no-margin:hover {
                background: #38321C !important;
                border-color: #F5CC24 !important;
            }
        }

        /* إدارة متصلة: بدون هوامش بيضاء */

        .${SCOPE} .th-upro-edit-box,
        .${SCOPE} .th-upro-power-box,
        .${SCOPE} .th-upro-room-box {
            float: none !important;
            clear: both !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10px !important;
            box-sizing: border-box !important;
            background: #191A1D !important;
            color: #E9E6D9 !important;
            border: 0 !important;
            border-top: 1px solid #4B4228 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
        }

        .${SCOPE} .th-upro-edit-box::after,
        .${SCOPE} .th-upro-power-box::after,
        .${SCOPE} .th-upro-room-box::after {
            content: "";
            display: block;
            clear: both;
        }

        .${SCOPE} .th-upro-edit-box.nickbox {
            margin-top: 0 !important;
            border-radius: 0 !important;
        }

        .${SCOPE} .th-upro-room-box.roomzbox {
            margin-bottom: 0 !important;
            border-radius: 0 0 11px 11px !important;
        }

        .${SCOPE} .th-upro-edit-box form {
            background: transparent !important;
        }

        .${SCOPE} .th-upro-edit-box label,
        .${SCOPE} .th-upro-power-box label,
        .${SCOPE} .th-upro-room-box label {
            color: #F5CC24 !important;
        }

        .${SCOPE} .th-upro-edit-label,
        .${SCOPE} .th-upro-like-label,
        .${SCOPE} .th-upro-eva-label {
            background: #302D1E !important;
            color: #F5CC24 !important;
            border: 1px solid #66582A !important;
            border-radius: 6px !important;
        }

        .${SCOPE} .th-upro-edit-box input,
        .${SCOPE} .th-upro-edit-box textarea,
        .${SCOPE} .th-upro-power-box input,
        .${SCOPE} .th-upro-power-box select,
        .${SCOPE} .th-upro-room-box input,
        .${SCOPE} .th-upro-room-box select {
            background: #101114 !important;
            color: #E9E6D9 !important;
            border: 1px solid #695B2D !important;
            border-radius: 6px !important;
            box-shadow: none !important;
        }

        .${SCOPE} .th-upro-edit-box input:focus,
        .${SCOPE} .th-upro-edit-box textarea:focus,
        .${SCOPE} .th-upro-power-box input:focus,
        .${SCOPE} .th-upro-power-box select:focus,
        .${SCOPE} .th-upro-room-box input:focus,
        .${SCOPE} .th-upro-room-box select:focus {
            outline: 2px solid rgba(245,204,36,.3) !important;
            outline-offset: 1px !important;
            border-color: #F5CC24 !important;
        }

        .${SCOPE} .th-upro-save-small,
        .${SCOPE} .th-upro-edit-box .u-nickc {
            background: #F5CC24 !important;
            color: #131416 !important;
            -webkit-text-fill-color: #131416 !important;
            border: 1px solid #F5CC24 !important;
            border-radius: 6px !important;
            text-shadow: none !important;
            box-shadow: none !important;
        }

        @media (max-width: 420px) {
            .${PROFILE} .th-upro-profile-name {
                font-size: 16px !important;
            }

            .th-upro-pro.${PROFILE}
            > center > a.th-upro-action,
            .th-upro-pro.${PROFILE}
            > center > a.th-upro-action-no-margin {
                font-size: 11px !important;
            }

            .${PROFILE} .${EMBLEM} {
                width: 112px;
                height: 112px;
            }
        }
        `;

        document.head.appendChild(style);
    }

    function updateProfiles() {
        const scopes = new Set();

        document.querySelectorAll(
            ".th-upro-pro"
        ).forEach(function (profile) {
            const matched = isTarget(profile);

            if (
                profile.classList.contains(PROFILE) !== matched
            ) {
                profile.classList.toggle(PROFILE, matched);
            }

            const tiger = profile.querySelector(
                "." + EMBLEM
            );

            if (matched) {
                scopes.add(getScope(profile));

                if (!tiger) {
                    const content = profile.querySelector(
                        ".th-upro-profile-content"
                    );

                    if (content) {
                        content.appendChild(createTiger());
                    }
                }
            } else if (tiger) {
                tiger.remove();
            }
        });

        document.querySelectorAll(
            "." + SCOPE
        ).forEach(function (element) {
            if (!scopes.has(element)) {
                element.classList.remove(SCOPE);
            }
        });

        scopes.forEach(function (element) {
            if (!element.classList.contains(SCOPE)) {
                element.classList.add(SCOPE);
            }
        });
    }

    function init() {
        addStyles();
        updateProfiles();

        let pending = false;

        const observer = new MutationObserver(function () {
            if (pending) return;
            pending = true;

            requestAnimationFrame(function () {
                pending = false;
                updateProfiles();
            });
        });

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
