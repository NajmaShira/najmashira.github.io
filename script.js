const root = document.documentElement;

/* ----------------------------------------
   Theme
   ---------------------------------------- */
const themeColor = document.querySelector(
    'meta[name="theme-color"]'
);

const themeToggle = document.getElementById("theme-toggle");

function setTheme(theme) {
    root.dataset.theme = theme;

    if (themeColor) {
        themeColor.setAttribute(
            "content",
            theme === "dark"
                ? "#0d0f12"
                : "#f5f5f2"
        );
    }

    if (!themeToggle) {
        return;
    }

    const themeIcon = themeToggle.querySelector("span");
    const isLight = theme === "light";

    if (themeIcon) {
        themeIcon.textContent = isLight ? "☀" : "☾";
    }

    themeToggle.setAttribute(
        "aria-label",
        isLight
            ? "Switch to dark theme"
            : "Switch to light theme"
    );
}

const savedTheme = localStorage.getItem("theme");
const systemPrefersLight =
    window.matchMedia("(prefers-color-scheme: light)").matches;

const initialTheme =
    savedTheme || (systemPrefersLight ? "light" : "dark");

setTheme(initialTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme = root.dataset.theme || "dark";
        const nextTheme =
            currentTheme === "dark" ? "light" : "dark";

        setTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
    });
}


/* ----------------------------------------
   Mobile Navigation
   ---------------------------------------- */

const menuToggle = document.getElementById("menu-toggle");
const mobileNav = document.getElementById("mobile-nav");

if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mobileNav.classList.toggle("is-open");
        const menuIcon = menuToggle.querySelector("span");

        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

        if (menuIcon) {
            menuIcon.textContent = isOpen ? "×" : "☰";
        }
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mobileNav.classList.remove("is-open");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute(
                "aria-label",
                "Open navigation"
            );

            const menuIcon = menuToggle.querySelector("span");

            if (menuIcon) {
                menuIcon.textContent = "☰";
            }
        });
    });
}


/* ----------------------------------------
   Scroll Reveal
   ---------------------------------------- */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.05
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("is-visible");
    });
}



/* ----------------------------------------
   Smooth Anchor Scrolling
   ---------------------------------------- */

const anchorLinks = document.querySelectorAll(
    'a[href^="#"]'
);

anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        const header = document.querySelector("body > header");
        const headerHeight = header ? header.offsetHeight : 0;

        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight +85;
            // headerHeight -0;

        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;

        const duration = Math.min(
            850,
            Math.max(450, Math.abs(distance) * 0.5)
        );

        const startTime = performance.now();

        function easeInOutCubic(t) {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function animateScroll(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);

            window.scrollTo(
                0,
                startPosition + distance * easedProgress
            );

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }

        requestAnimationFrame(animateScroll);
    });
});