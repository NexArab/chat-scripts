(function () {
    "use strict";

    if (window.__ittiHideLikesStarted) return;
    window.__ittiHideLikesStarted = true;

    const TARGET = "\u3164\u3164\u3164\u3164iTTi";
    const previous = new Map();
    let pending = false;

    function restore(button, state) {
        if (state.value) {
            button.style.setProperty(
                "display",
                state.value,
                state.priority
            );
        } else {
            button.style.removeProperty("display");
        }
    }

    function check() {
        pending = false;
        const hidden = new Set();

        document.querySelectorAll(".th-upro-pro").forEach(function (profile) {
            const name = profile.querySelector(".th-upro-profile-name");
            const button = profile.querySelector(".ulike");

            if (!name || !button) return;

            const text = name.textContent.replace(
                /^[ \t\r\n]+|[ \t\r\n]+$/g,
                ""
            );

            if (text !== TARGET) return;

            hidden.add(button);

            if (!previous.has(button)) {
                previous.set(button, {
                    value: button.style.getPropertyValue("display"),
                    priority: button.style.getPropertyPriority("display")
                });
            }

            button.style.setProperty("display", "none", "important");
        });

        previous.forEach(function (state, button) {
            if (!hidden.has(button)) {
                restore(button, state);
                previous.delete(button);
            }
        });
    }

    function schedule() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(check);
    }

    new MutationObserver(schedule).observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true
    });

    check();
})();
