document.addEventListener('DOMContentLoaded', () => {
    // Mobile Sidebar Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    const content = document.getElementById('admin-content');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            content.classList.toggle('blur'); // Optional blur effect
        });
    }

    // Tab Navigation (SPA Feel)
    const links = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.content-section');

    function switchTab(targetId) {
        // Remove active class from all links and sections
        links.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        // Add active to target
        const link = document.querySelector(`.sidebar-nav a[href="#${targetId}"]`);
        const section = document.getElementById(targetId);

        if (link) link.classList.add('active');
        if (section) section.classList.add('active');

        // Save state
        localStorage.setItem('activeAdminTab', targetId);

        // Close sidebar on mobile
        if (window.innerWidth < 768) {
            sidebar.classList.remove('active');
        }
    }

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            if (target === 'logout') {
                window.location.href = '/logout';
                return;
            }
            switchTab(target);
        });
    });

    // Restore State
    const savedTab = localStorage.getItem('activeAdminTab') || 'dashboard';
    switchTab(savedTab);

    // --- Theme Toggle Logic ---
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check saved theme or default (e.g. 'light' for admin if preferred, or 'dark' to match site)
    // If main site defaults to dark, let's use 'dark' as default here too for consistency
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeBtn) return;
        const icon = themeBtn.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun'); // Sun icon for dark mode (switch to light)
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon'); // Moon icon for light mode (switch to dark)
        }
    }

    // Initialize Charts (if on Dashboard)
    initCharts();
});

function initCharts() {
    const ctx1 = document.getElementById('inquiryChart');
    const ctx2 = document.getElementById('productChart');

    if (ctx1 && typeof Chart !== 'undefined') {
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Inquiries',
                    data: [12, 19, 3, 5, 2, 3], // Mock data
                    borderColor: '#3498DB',
                    tension: 0.3,
                    fill: true,
                    backgroundColor: 'rgba(52, 152, 219, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // Calculate dynamic product categories from table if possible, else mock
    // For now, simple mock or pass data from backend via template
    if (ctx2 && typeof Chart !== 'undefined') {
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['LED', 'Fancy', 'Fans', 'Switches'],
                datasets: [{
                    data: [30, 50, 20, 10], // Mock data
                    backgroundColor: ['#3498DB', '#F1C40F', '#2ECC71', '#E74C3C']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
}
