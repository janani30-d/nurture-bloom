
/* =====================================================
   NURTURE & BLOOM — GLOBAL SETTINGS
   Fix: Main Pages + Login + Register + Dashboard
===================================================== */

(function () {
    "use strict";

    const THEME_KEY = "nb-theme";
    const RTL_KEY = "nb-direction";

    const THEME_SELECTORS = [
        "#nbThemeToggle",
        "#loginDarkToggle",
        "#registerDarkToggle",
        "#dashDarkToggle",
        "#dashboardDarkToggle"
    ].join(",");

    const RTL_SELECTORS = [
        "#nbRtlToggle",
        "#loginRtlToggle",
        "#registerRtlToggle",
        "#dashRtlToggle",
        "#dashboardRtlToggle"
    ].join(",");

    function read(key, fallback) {
        try {
            return localStorage.getItem(key) || fallback;
        } catch (error) {
            return fallback;
        }
    }

    function save(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.warn("Could not save setting:", error);
        }
    }

    function applyTheme(theme) {
        const isDark = theme === "dark";

        document.body.classList.toggle("nb-dark", isDark);

        document.querySelectorAll(THEME_SELECTORS).forEach(function (button) {
            button.setAttribute("aria-pressed", String(isDark));
            button.setAttribute(
                "title",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );

            const icon = button.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-moon", !isDark);
                icon.classList.toggle("fa-sun", isDark);
            }
        });
    }

    function applyRTL(direction) {
        const isRTL = direction === "rtl";

        document.documentElement.setAttribute("dir", direction);

        document.querySelectorAll(RTL_SELECTORS).forEach(function (button) {
            button.setAttribute("aria-pressed", String(isRTL));
            button.setAttribute(
                "title",
                isRTL ? "Switch to LTR" : "Switch to RTL"
            );
        });
    }

    function initialize() {
        applyTheme(read(THEME_KEY, "light"));
        applyRTL(read(RTL_KEY, "ltr"));
    }

    /*
       CAPTURE PHASE:
       Handle toggles before old page-specific handlers.
    */
    document.addEventListener("click", function (event) {
        if (!(event.target instanceof Element)) return;

        const themeButton = event.target.closest(THEME_SELECTORS);
        const rtlButton = event.target.closest(RTL_SELECTORS);

        if (!themeButton && !rtlButton) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (themeButton) {
            const current = read(
                THEME_KEY,
                document.body.classList.contains("nb-dark")
                    ? "dark"
                    : "light"
            );

            const next = current === "dark" ? "light" : "dark";

            save(THEME_KEY, next);
            applyTheme(next);
            return;
        }

        const current = read(
            RTL_KEY,
            document.documentElement.getAttribute("dir") || "ltr"
        );

        const next = current === "rtl" ? "ltr" : "rtl";

        save(RTL_KEY, next);
        applyRTL(next);
    }, true);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize, {
            once: true
        });
    } else {
        initialize();
    }
})();
