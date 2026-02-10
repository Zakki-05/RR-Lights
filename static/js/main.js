document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Drawer Logic (Split System) ---
    const menuBtn = document.getElementById('menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const closeBtn = document.getElementById('close-drawer');

    function toggleDrawer(show) {
        if (show) {
            mobileDrawer.classList.add('active');
            document.body.classList.add('menu-open');
        } else {
            mobileDrawer.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }

    if (menuBtn && mobileDrawer) {
        // Open
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDrawer(true);
        });

        // Close Button
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toggleDrawer(false);
            });
        }

        // Close on Outside Click
        document.addEventListener('click', (e) => {
            if (mobileDrawer.classList.contains('active') &&
                !mobileDrawer.contains(e.target) &&
                !menuBtn.contains(e.target)) {
                toggleDrawer(false);
            }
        });

        // Close on Link Click (Optional, for better UX)
        const drawerLinks = mobileDrawer.querySelectorAll('a');
        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleDrawer(false);
            });
        });
    }

    // --- Dark/Light Mode Toggle (Universal) ---
    const themeBtns = document.querySelectorAll('#theme-btn, .theme-btn-mobile, .theme-btn-mobile-nav');
    const html = document.documentElement;

    // Check LocalStorage
    // Default to 'dark' if no theme is saved
    const savedTheme = localStorage.getItem('theme') || 'dark';

    // Explicitly set if missing -> unlikely needed but safe
    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'dark');
    }

    html.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
        });
    });

    function updateThemeIcons(theme) {
        themeBtns.forEach(btn => {
            const icon = btn.querySelector('i');
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }

    // --- Intersection Observer for Animations ---
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up, .scale-in');
    animatedElements.forEach(el => observer.observe(el));

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});
