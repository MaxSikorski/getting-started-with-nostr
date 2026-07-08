/* ============================================================
   Getting Started with Nostr — page script
   Theme toggle, scroll reveals, TOC highlighting.
   No dependencies; works from file://.
   ============================================================ */

(function () {
    'use strict';

    // === Theme Toggle ===
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    const sunPath = 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z';
    const moonPath = 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z';

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    let isDark = savedTheme ? savedTheme === 'dark' : prefersDark.matches;

    const applyTheme = (dark) => {
        document.body.setAttribute('data-theme', dark ? 'dark' : 'light');
        localStorage.setItem('theme', dark ? 'dark' : 'light');

        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) metaTheme.content = dark ? '#000000' : '#f5f5f7';

        const pathNode = themeIcon && themeIcon.querySelector('path');
        if (pathNode) pathNode.setAttribute('d', dark ? sunPath : moonPath);
    };

    applyTheme(isDark);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            isDark = !isDark;
            applyTheme(isDark);
        });
    }

    prefersDark.addEventListener('change', (e) => {
        isDark = e.matches;
        applyTheme(isDark);
    });

    // === TOC hamburger toggle ===
    const tocBtn = document.getElementById('toc-toggle');
    const toc = document.getElementById('toc');
    const mobileView = window.matchMedia('(max-width: 1000px)');

    const tocIsOpen = () => mobileView.matches
        ? document.body.classList.contains('toc-drawer')
        : !document.body.classList.contains('toc-collapsed');

    if (tocBtn && toc) {
        tocBtn.setAttribute('aria-expanded', String(tocIsOpen()));

        tocBtn.addEventListener('click', () => {
            if (mobileView.matches) {
                document.body.classList.toggle('toc-drawer');
            } else {
                document.body.classList.toggle('toc-collapsed');
            }
            tocBtn.setAttribute('aria-expanded', String(tocIsOpen()));
        });

        // Tapping a TOC link on mobile closes the drawer
        toc.addEventListener('click', (e) => {
            if (e.target.closest('a') && mobileView.matches) {
                document.body.classList.remove('toc-drawer');
                tocBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Esc closes the mobile drawer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileView.matches) {
                document.body.classList.remove('toc-drawer');
                tocBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Leaving mobile width clears the drawer state
        mobileView.addEventListener('change', () => {
            document.body.classList.remove('toc-drawer');
            tocBtn.setAttribute('aria-expanded', String(tocIsOpen()));
        });
    }

    // === Scroll reveals ===
    const parts = document.querySelectorAll('.part');
    const reveal = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                reveal.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });
    parts.forEach(p => reveal.observe(p));

    // === TOC highlighting (scrollspy) ===
    const tocLinks = Array.from(document.querySelectorAll('.toc a'));
    const targets = tocLinks
        .map(a => document.getElementById(a.getAttribute('href').slice(1)))
        .filter(Boolean);

    const setActive = (id) => {
        tocLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    };

    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setActive(entry.target.id);
        });
    }, { rootMargin: '-20% 0px -70% 0px' });
    targets.forEach(t => spy.observe(t));

})();
