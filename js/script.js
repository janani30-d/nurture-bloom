/* =====================================================
   NURTURE & BLOOM
   PART 4 — MAIN JAVASCRIPT
   File: js/script.js
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       1. ELEMENTS
    ========================================= */

    const html = document.documentElement;
    const body = document.body;

    const navigation = document.getElementById("nbNavigation");
    const menuToggle = document.getElementById("nbMenuToggle");
    const menuClose = document.getElementById("nbMenuClose");
    const menuOverlay = document.getElementById("nbMenuOverlay");

    const homeToggle = document.getElementById("nbHomeToggle");
    const homeDropdown = document.querySelector(".nb-home-dropdown");

    const rtlToggle = document.getElementById("nbRtlToggle");
    const themeToggle = document.getElementById("nbThemeToggle");

    const mobileQuery = window.matchMedia("(max-width: 1199px)");

    /* =========================================
       2. SAFE LOCAL STORAGE
    ========================================= */

    function getPreference(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function savePreference(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            // The feature still works if storage is unavailable.
        }
    }

    /* =========================================
       3. RESPONSIVE MENU
    ========================================= */

    function setMenuOpen(open, returnFocus = false) {

        if (!navigation || !menuToggle || !menuOverlay) {
            return;
        }

        // The dropdown navigation is used only on tablet/mobile.
        if (open && !mobileQuery.matches) {
            return;
        }

        body.classList.toggle("nb-menu-open", open);

        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute(
            "aria-label",
            open ? "Navigation menu open" : "Open navigation menu"
        );

        menuOverlay.setAttribute("aria-hidden", String(!open));

        /*
         * Keep desktop navigation accessible.
         * Apply hidden/inert only when the responsive menu is closed.
         */
        if (mobileQuery.matches) {
            navigation.setAttribute("aria-hidden", String(!open));
            navigation.inert = !open;
        } else {
            navigation.removeAttribute("aria-hidden");
            navigation.inert = false;
        }

        // Always keep the hamburger icon as bars.
        const hamburgerIcon = menuToggle.querySelector("i");

        if (hamburgerIcon) {
            hamburgerIcon.classList.remove("fa-xmark");
            hamburgerIcon.classList.add("fa-bars");
        }

        if (open && menuClose) {
            requestAnimationFrame(function () {
                menuClose.focus();
            });
        } else if (returnFocus && mobileQuery.matches) {
            menuToggle.focus();
        }
    }

    if (navigation && menuToggle && menuClose && menuOverlay) {

        menuToggle.addEventListener("click", function () {
            const isOpen = body.classList.contains("nb-menu-open");
            setMenuOpen(!isOpen);
        });

        menuClose.addEventListener("click", function () {
            setMenuOpen(false, true);
        });

        menuOverlay.addEventListener("click", function () {
            setMenuOpen(false, true);
        });

        // Close responsive menu when selecting a normal navigation link.
        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {

                // Home 1 and Home 2 are normal links too.
                setMenuOpen(false);
                closeHomeDropdown();
            });
        });
    }

    /* =========================================
       4. HOME DROPDOWN
    ========================================= */

    function closeHomeDropdown() {

        if (!homeDropdown || !homeToggle) {
            return;
        }

        homeDropdown.classList.remove("nb-dropdown-open");
        homeToggle.setAttribute("aria-expanded", "false");
    }

    function toggleHomeDropdown() {

        if (!homeDropdown || !homeToggle) {
            return;
        }

        const isOpen =
            homeDropdown.classList.contains("nb-dropdown-open");

        homeDropdown.classList.toggle("nb-dropdown-open", !isOpen);
        homeToggle.setAttribute("aria-expanded", String(!isOpen));
    }

    if (homeToggle && homeDropdown) {

        homeToggle.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            toggleHomeDropdown();
        });

        // Close when clicking outside the Home dropdown.
        document.addEventListener("click", function (event) {

            if (!homeDropdown.contains(event.target)) {
                closeHomeDropdown();
            }
        });
    }

    /* =========================================
       5. DARK MODE / LIGHT MODE
    ========================================= */

    function applyTheme(theme) {

        const isDark = theme === "dark";

        body.classList.toggle("nb-dark", isDark);

        if (!themeToggle) {
            return;
        }

        const icon = themeToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-moon", !isDark);
            icon.classList.toggle("fa-sun", isDark);
        }

        themeToggle.setAttribute("aria-pressed", String(isDark));

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Enable light mode" : "Enable dark mode"
        );

        themeToggle.setAttribute(
            "title",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    // Light mode is the default unless dark mode was explicitly saved.
    const savedTheme = getPreference("nb-theme");

    applyTheme(savedTheme === "dark" ? "dark" : "light");

    if (themeToggle) {

        themeToggle.addEventListener("click", function () {

            const currentlyDark =
                body.classList.contains("nb-dark");

            const nextTheme = currentlyDark ? "light" : "dark";

            applyTheme(nextTheme);
            savePreference("nb-theme", nextTheme);
        });
    }

    /* =========================================
       6. RTL / LTR DIRECTION
    ========================================= */

    function applyDirection(direction) {

        const isRTL = direction === "rtl";

        html.setAttribute("dir", isRTL ? "rtl" : "ltr");

        if (!rtlToggle) {
            return;
        }

        rtlToggle.setAttribute("aria-pressed", String(isRTL));

        rtlToggle.setAttribute(
            "aria-label",
            isRTL
                ? "Switch to left-to-right layout"
                : "Switch to right-to-left layout"
        );

        rtlToggle.setAttribute(
            "title",
            isRTL ? "Switch to LTR" : "Switch to RTL"
        );
    }

    // Restore saved direction; otherwise use the HTML default.
    const savedDirection = getPreference("nb-direction");

    applyDirection(
        savedDirection === "rtl" ? "rtl" : "ltr"
    );

    if (rtlToggle) {

        rtlToggle.addEventListener("click", function () {

            const currentDirection = html.getAttribute("dir");
            const nextDirection =
                currentDirection === "rtl" ? "ltr" : "rtl";

            applyDirection(nextDirection);
            savePreference("nb-direction", nextDirection);
        });
    }

    /* =========================================
       7. ESCAPE KEY
    ========================================= */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            const menuWasOpen =
                body.classList.contains("nb-menu-open");

            closeHomeDropdown();

            if (menuWasOpen) {
                setMenuOpen(false, true);
            }
        }
    });

    /* =========================================
       8. RESPONSIVE BREAKPOINT CHANGES
    ========================================= */

    function handleBreakpointChange() {

        // Always close the mobile menu when switching layouts.
        setMenuOpen(false);

        closeHomeDropdown();

        if (navigation) {
            if (mobileQuery.matches) {
                navigation.setAttribute("aria-hidden", "true");
                navigation.inert = true;
            } else {
                navigation.removeAttribute("aria-hidden");
                navigation.inert = false;
            }
        }
    }

    if (typeof mobileQuery.addEventListener === "function") {
        mobileQuery.addEventListener("change", handleBreakpointChange);
    } else {
        // Compatibility with older Safari.
        mobileQuery.addListener(handleBreakpointChange);
    }

    /* =========================================
       9. INITIAL STATE
    ========================================= */

    closeHomeDropdown();

    if (navigation && menuToggle && menuOverlay) {
        body.classList.remove("nb-menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuOverlay.setAttribute("aria-hidden", "true");

        if (mobileQuery.matches) {
            navigation.setAttribute("aria-hidden", "true");
            navigation.inert = true;
        } else {
            navigation.removeAttribute("aria-hidden");
            navigation.inert = false;
        }
    }

});

/* =========================================
   FOOTER — SCROLL TO TOP FUNCTIONALITY
========================================= */

const scrollTopButton = document.getElementById("nbScrollTop");

if (scrollTopButton) {

    function updateScrollTopButton() {
        scrollTopButton.classList.toggle(
            "nb-scroll-visible",
            window.scrollY > 300
        );
    }

    window.addEventListener("scroll", updateScrollTopButton, {
        passive: true
    });

    scrollTopButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    updateScrollTopButton();
}


/* =========================================
   HOME 1 — TWO-SLIDE HERO
   Numeric indicators only
========================================= */

const home1Hero = document.getElementById("home1Hero");

if (home1Hero) {
    const slides = Array.from(
        home1Hero.querySelectorAll(".h1-hero-slide")
    );

    const numbers = Array.from(
        home1Hero.querySelectorAll(".h1-hero-number")
    );

    let activeSlide = 0;
    let sliderTimer;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function showHome1Slide(index) {
        if (!slides.length) return;

        activeSlide = (index + slides.length) % slides.length;

        slides.forEach(function (slide, i) {
            const isActive = i === activeSlide;

            slide.classList.toggle(
                "h1-hero-slide-active",
                isActive
            );

            slide.setAttribute(
                "aria-hidden",
                String(!isActive)
            );

            slide.querySelectorAll("a").forEach(function (link) {
                link.tabIndex = isActive ? 0 : -1;
            });
        });

        numbers.forEach(function (button, i) {
            const isActive = i === activeSlide;

            button.classList.toggle(
                "h1-hero-number-active",
                isActive
            );

            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );
        });
    }

    function startHome1Slider() {
        clearInterval(sliderTimer);

        if (reduceMotion || slides.length < 2) return;

        sliderTimer = setInterval(function () {
            showHome1Slide(activeSlide + 1);
        }, 6000);
    }

    numbers.forEach(function (button) {
        button.addEventListener("click", function () {
            const index = Number(button.dataset.slide);

            if (!Number.isInteger(index) || !slides[index]) return;

            showHome1Slide(index);
            startHome1Slider();
        });
    });

    showHome1Slide(0);
    startHome1Slider();

    home1Hero.addEventListener("mouseenter", function () {
        clearInterval(sliderTimer);
    });

    home1Hero.addEventListener("mouseleave", function () {
        startHome1Slider();
    });

    home1Hero.addEventListener("focusin", function () {
        clearInterval(sliderTimer);
    });

    home1Hero.addEventListener("focusout", function (event) {
        if (!home1Hero.contains(event.relatedTarget)) {
            startHome1Slider();
        }
    });
}









/* ==========================================
   ABOUT STATS — COUNTING ANIMATION
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const statsSection = document.querySelector("#aboutStats");

    if (!statsSection) return;

    const counters = statsSection.querySelectorAll(
        ".about-stats-number[data-count]"
    );

    if (!counters.length) return;

    const duration = 1800;
    let animationStarted = false;

    function animateCounter(counter) {
        const target = Number(counter.dataset.count);
        const suffix = counter.dataset.suffix || "";
        const prefix = counter.dataset.prefix || "";

        if (!Number.isFinite(target)) return;

        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out animation
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(
                easedProgress * target
            );

            counter.textContent =
                prefix + currentValue.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent =
                    prefix + target.toLocaleString() + suffix;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    function startCounters() {
        if (animationStarted) return;
        animationStarted = true;

        counters.forEach(function (counter) {
            animateCounter(counter);
        });
    }

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        startCounters();
                        observer.disconnect();
                    }
                });
            },
            {
                threshold: 0.25
            }
        );

        observer.observe(statsSection);
    } else {
        // Fallback for older browsers
        startCounters();
    }
});













/* ==========================================
   NURTURE & BLOOM — LOGIN INTERACTIONS
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ======================================
       SHOW / HIDE PASSWORD
    ====================================== */

    const passwordInput = document.getElementById("loginPassword");
    const passwordToggle = document.getElementById("loginPasswordToggle");

    if (passwordInput && passwordToggle) {
        passwordToggle.addEventListener("click", function () {

            const isPassword = passwordInput.type === "password";

            passwordInput.type = isPassword ? "text" : "password";

            passwordToggle.setAttribute(
                "aria-label",
                isPassword ? "Hide password" : "Show password"
            );

            passwordToggle.setAttribute(
                "aria-pressed",
                String(isPassword)
            );

        });
    }


    /* ======================================
       RTL TOGGLE
    ====================================== */

    const rtlToggle = document.getElementById("loginRtlToggle");

    if (rtlToggle) {
        rtlToggle.addEventListener("click", function () {

            const root = document.documentElement;

            const newDirection =
                root.getAttribute("dir") === "rtl" ? "ltr" : "rtl";

            root.setAttribute("dir", newDirection);

            rtlToggle.setAttribute(
                "aria-pressed",
                String(newDirection === "rtl")
            );

        });
    }


    /* ======================================
       DARK MODE TOGGLE
    ====================================== */

    const darkToggle = document.getElementById("loginDarkToggle");

    if (darkToggle) {
        darkToggle.addEventListener("click", function () {

            document.body.classList.toggle("nb-dark");

            const darkModeEnabled =
                document.body.classList.contains("nb-dark");

            darkToggle.setAttribute(
                "aria-pressed",
                String(darkModeEnabled)
            );

            darkToggle.setAttribute(
                "aria-label",
                darkModeEnabled ? "Switch to light mode" : "Switch to dark mode"
            );

        });
    }

});













/* ==========================================
   NURTURE & BLOOM — REGISTER INTERACTIONS
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ======================================
       SHOW / HIDE PASSWORDS
    ====================================== */

    const passwordToggles = document.querySelectorAll(
        "#registerPage [data-password-target]"
    );

    passwordToggles.forEach(function (toggle) {

        toggle.addEventListener("click", function () {

            const targetId = toggle.getAttribute("data-password-target");
            const input = document.getElementById(targetId);

            if (!input) return;

            const shouldShow = input.type === "password";

            input.type = shouldShow ? "text" : "password";

            toggle.setAttribute(
                "aria-label",
                shouldShow ? "Hide password" : "Show password"
            );

            toggle.setAttribute(
                "aria-pressed",
                String(shouldShow)
            );

        });

    });


    /* ======================================
       CONFIRM PASSWORD VALIDATION
    ====================================== */

    const registerForm = document.getElementById("registerForm");
    const password = document.getElementById("registerPassword");
    const confirmPassword = document.getElementById(
        "registerConfirmPassword"
    );

    if (registerForm && password && confirmPassword) {

        function validatePasswordMatch() {

            if (
                confirmPassword.value &&
                password.value !== confirmPassword.value
            ) {
                confirmPassword.setCustomValidity(
                    "Passwords do not match."
                );
            } else {
                confirmPassword.setCustomValidity("");
            }

        }

        password.addEventListener("input", validatePasswordMatch);
        confirmPassword.addEventListener("input", validatePasswordMatch);

        registerForm.addEventListener("submit", function (event) {

            validatePasswordMatch();

            if (!registerForm.checkValidity()) {
                event.preventDefault();
                registerForm.reportValidity();
            }

        });

    }


    /* ======================================
       RTL TOGGLE
    ====================================== */

    const rtlToggle = document.getElementById("registerRtlToggle");

    if (rtlToggle) {

        rtlToggle.addEventListener("click", function () {

            const root = document.documentElement;

            const newDirection =
                root.getAttribute("dir") === "rtl" ? "ltr" : "rtl";

            root.setAttribute("dir", newDirection);

            rtlToggle.setAttribute(
                "aria-pressed",
                String(newDirection === "rtl")
            );

        });

    }


    /* ======================================
       DARK MODE TOGGLE
    ====================================== */

    const darkToggle = document.getElementById("registerDarkToggle");

    if (darkToggle) {

        darkToggle.addEventListener("click", function () {

            document.body.classList.toggle("nb-dark");

            const isDark = document.body.classList.contains("nb-dark");

            darkToggle.setAttribute(
                "aria-pressed",
                String(isDark)
            );

            darkToggle.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );

        });

    }

});















