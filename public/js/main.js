document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link");
    const pages = document.querySelectorAll(".content .page");

    // Navigation functionality
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            const targetId = link.getAttribute("data-target");

            // Hide all pages
            pages.forEach(page => {
                page.style.display = "none";
            });

            // Show target page
            const targetPage = document.getElementById(targetId);
            if (targetPage) {
                targetPage.style.display = "block";
            }

            // Update active nav link
            navLinks.forEach(navLink => {
                navLink.classList.remove("active");
            });
            link.classList.add("active");

            // Load page-specific data
            loadPageData(targetId);
        });
    });

    // Set default active link and load dashboard
    const dashboardLink = document.querySelector(".nav-link[data-target='dashboard']");
    if (dashboardLink) {
        dashboardLink.classList.add("active");
        loadPageData('dashboard');
    }

    // Update time display
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 1000);

    // Initialize API base URL in settings
    document.getElementById('apiBaseUrl').value = window.location.origin + '/api';
});

function updateTimeDisplay() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString();
    }
}

function loadPageData(pageId) {
    switch (pageId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'products':
            loadProductsData();
            break;
        case 'orders':
            loadOrdersData();
            break;
        case 'users':
            loadUsersData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function refreshDashboard() {
    loadDashboardData();
}

function showAddProductModal() {
    alert('Add Product functionality will be implemented here');
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('ru-RU');
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('ru-RU');
}');

