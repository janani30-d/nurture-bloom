

document.addEventListener("DOMContentLoaded", function () {

    const body = document.body;
    const html = document.documentElement;

    const sidebar = document.getElementById("dashSidebar");
    const menuToggle = document.getElementById("dashMenuToggle");
    const overlay = document.getElementById("dashSidebarOverlay");

    const darkToggle = document.getElementById("dashDarkToggle");
    const rtlToggle = document.getElementById("dashRtlToggle");

    const notificationToggle =
        document.getElementById("dashNotificationToggle");

    const notificationPanel =
        document.getElementById("dashNotificationPanel");

    const profileToggle =
        document.getElementById("dashProfileToggle");

    const profilePanel =
        document.getElementById("dashProfilePanel");


    /* =====================================
       RESPONSIVE SIDEBAR
    ====================================== */

    function isMobileLayout() {
        return window.matchMedia("(max-width: 1199px)").matches;
    }

    function openSidebar() {
        if (!sidebar || !isMobileLayout()) return;

        sidebar.classList.add("is-open");
        menuToggle?.classList.add("is-open");
        overlay?.classList.add("is-visible");

        menuToggle?.setAttribute("aria-expanded", "true");
        menuToggle?.setAttribute("aria-label", "Close navigation menu");

        body.style.overflow = "hidden";
    }

    function closeSidebar() {
        sidebar?.classList.remove("is-open");
        menuToggle?.classList.remove("is-open");
        overlay?.classList.remove("is-visible");

        menuToggle?.setAttribute("aria-expanded", "false");
        menuToggle?.setAttribute("aria-label", "Open navigation menu");

        body.style.overflow = "";
    }

    menuToggle?.addEventListener("click", function () {
        const isOpen = sidebar?.classList.contains("is-open");

        if (isOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    overlay?.addEventListener("click", closeSidebar);

    sidebar?.querySelectorAll(".dash-nav-link, .dash-logout-link")
        .forEach(function (link) {
            link.addEventListener("click", closeSidebar);
        });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeSidebar();
            closeDropdowns();
        }
    });

    window.addEventListener("resize", function () {
        if (!isMobileLayout()) {
            closeSidebar();
        }
    });


    /* =====================================
       DARK MODE
    ====================================== */

    function updateDarkModeButton() {
        if (!darkToggle) return;

        const isDark = body.classList.contains("nb-dark");

        darkToggle.setAttribute(
            "aria-pressed",
            isDark ? "true" : "false"
        );

        darkToggle.setAttribute(
            "title",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    darkToggle?.addEventListener("click", function () {
        body.classList.toggle("nb-dark");
        updateDarkModeButton();
    });

    updateDarkModeButton();


    /* =====================================
       RTL TOGGLE
    ====================================== */

    rtlToggle?.addEventListener("click", function () {
        const isRtl = html.getAttribute("dir") === "rtl";

        html.setAttribute("dir", isRtl ? "ltr" : "rtl");

        rtlToggle.setAttribute(
            "aria-pressed",
            isRtl ? "false" : "true"
        );

        closeSidebar();
        closeDropdowns();
    });


    /* =====================================
       DROPDOWNS
    ====================================== */

    function closeDropdowns(exceptPanel = null) {

        if (notificationPanel && notificationPanel !== exceptPanel) {
            notificationPanel.hidden = true;
            notificationToggle?.setAttribute("aria-expanded", "false");
        }

        if (profilePanel && profilePanel !== exceptPanel) {
            profilePanel.hidden = true;
            profileToggle?.setAttribute("aria-expanded", "false");
        }
    }

    notificationToggle?.addEventListener("click", function (event) {
        event.stopPropagation();

        const shouldOpen = notificationPanel?.hidden;

        closeDropdowns();

        if (notificationPanel && shouldOpen) {
            notificationPanel.hidden = false;
            notificationToggle.setAttribute("aria-expanded", "true");
        }
    });

    profileToggle?.addEventListener("click", function (event) {
        event.stopPropagation();

        const shouldOpen = profilePanel?.hidden;

        closeDropdowns();

        if (profilePanel && shouldOpen) {
            profilePanel.hidden = false;
            profileToggle.setAttribute("aria-expanded", "true");
        }
    });

    notificationPanel?.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    profilePanel?.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    document.addEventListener("click", function () {
        closeDropdowns();
    });


    /* =====================================
       CLOSE MENU AFTER NAVIGATION
    ====================================== */

    document.querySelectorAll(".dash-nav-link").forEach(function (link) {
        link.addEventListener("click", function () {
            document.querySelectorAll(".dash-nav-link").forEach(function (item) {
                item.classList.remove("active");
                item.removeAttribute("aria-current");
            });

            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        });
    });

});












document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("logoutModal");
    const triggers = document.querySelectorAll(
        ".dash-logout-link, [data-logout-trigger]"
    );

    const closeBtn = document.getElementById("logoutCloseBtn");
    const cancelBtn = document.getElementById("logoutCancelBtn");
    const confirmBtn = document.getElementById("logoutConfirmBtn");

    if (!modal) {
        console.error("Logout popup not found: check #logoutModal HTML.");
        return;
    }

    function openModal(event) {
        event.preventDefault();
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("logout-modal-open");
    }

    function closeModal() {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("logout-modal-open");
    }

    triggers.forEach(function (trigger) {
        trigger.addEventListener("click", openModal);
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", function (event) {
        if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeModal();
    });

    if (confirmBtn) {
        confirmBtn.addEventListener("click", function () {
            window.location.href = "login.html";
        });
    }

    console.log("Logout popup initialized. Triggers:", triggers.length);
});























