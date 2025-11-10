// API Configuration
const API_BASE_URL = '/api';

// Global State
let authToken = null;
let currentUser = null;
let dashboardData = null;
let charts = {};

// Table State
let tableState = {
    page: 1,
    pageSize: 10,
    sortBy: 'date',
    sortOrder: 'desc',
    searchTerm: ''
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            navigateToPage(page);
        });
    });

    // Mobile menu
    document.getElementById('mobileMenuToggle').addEventListener('click', toggleMobileMenu);

    // Table search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            tableState.searchTerm = searchInput.value;
            tableState.page = 1;
            loadTransactions();
        }, 500));
    }

    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadTransactions();
        });
    }

    // Table sorting
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const sortBy = th.getAttribute('data-sort');
            if (tableState.sortBy === sortBy) {
                tableState.sortOrder = tableState.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                tableState.sortBy = sortBy;
                tableState.sortOrder = 'asc';
            }
            tableState.page = 1;
            loadTransactions();
        });
    });
}

// Authentication
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');

    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        showDashboard();
    } else {
        showLogin();
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await response.json();
        authToken = data.token;
        currentUser = {
            username: data.username,
            email: data.email,
            role: data.role
        };

        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        showDashboard();
    } catch (error) {
        errorElement.textContent = error.message;
        errorElement.classList.add('show');
    }
}

function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = null;
    destroyCharts();
    showLogin();
}

function showLogin() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboardPage').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboardPage').style.display = 'flex';

    // Set user info
    document.getElementById('userName').textContent = currentUser.username;
    document.getElementById('userRole').textContent = currentUser.role;

    // Load initial data
    navigateToPage('overview');
}

// Navigation
function navigateToPage(page) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');

    // Hide all pages
    document.querySelectorAll('.content-page').forEach(p => {
        p.style.display = 'none';
    });

    // Show selected page
    const pageElement = document.getElementById(`${page}Page`);
    if (pageElement) {
        pageElement.style.display = 'block';
    }

    // Update page title
    const titles = {
        overview: 'Dashboard Overview',
        transactions: 'Transactions',
        analytics: 'Analytics'
    };
    document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';

    // Load page data
    if (page === 'overview') {
        loadDashboardStats();
    } else if (page === 'transactions') {
        loadTransactions();
    } else if (page === 'analytics') {
        loadAnalytics();
    }

    // Close mobile menu
    document.querySelector('.sidebar').classList.remove('show');
}

// Dashboard Stats
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load dashboard stats');
        }

        dashboardData = await response.json();
        updateStatsCards();
        renderCharts();
        updateLastUpdated();
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        if (error.message.includes('401')) {
            handleLogout();
        }
    }
}

function updateStatsCards() {
    document.getElementById('totalUsers').textContent = dashboardData.totalUsers.toLocaleString();
    document.getElementById('totalRevenue').textContent = `$${dashboardData.totalRevenue.toLocaleString()}`;
    document.getElementById('totalOrders').textContent = dashboardData.totalOrders.toLocaleString();
    document.getElementById('conversionRate').textContent = `${dashboardData.conversionRate}%`;
}

function renderCharts() {
    // Destroy existing charts
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    charts.revenue = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: dashboardData.revenueData.map(d => d.label),
            datasets: [{
                label: 'Revenue',
                data: dashboardData.revenueData.map(d => d.value),
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    // User Growth Chart
    const userGrowthCtx = document.getElementById('userGrowthChart').getContext('2d');
    charts.userGrowth = new Chart(userGrowthCtx, {
        type: 'bar',
        data: {
            labels: dashboardData.userGrowthData.map(d => d.label),
            datasets: [{
                label: 'Users',
                data: dashboardData.userGrowthData.map(d => d.value),
                backgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    charts.category = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: dashboardData.categoryData.map(d => d.category),
            datasets: [{
                data: dashboardData.categoryData.map(d => d.count),
                backgroundColor: [
                    '#4f46e5',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Transactions
async function loadTransactions() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/transactions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tableState)
        });

        if (!response.ok) {
            throw new Error('Failed to load transactions');
        }

        const data = await response.json();
        renderTransactionsTable(data);
        renderPagination(data);
        updateLastUpdated();
    } catch (error) {
        console.error('Error loading transactions:', error);
        if (error.message.includes('401')) {
            handleLogout();
        }
    }
}

function renderTransactionsTable(data) {
    const tbody = document.getElementById('transactionsBody');
    tbody.innerHTML = '';

    if (data.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No transactions found</td></tr>';
        return;
    }

    data.data.forEach(transaction => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.customerName}</td>
            <td>${transaction.product}</td>
            <td>$${transaction.amount.toFixed(2)}</td>
            <td><span class="status-badge status-${transaction.status.toLowerCase()}">${transaction.status}</span></td>
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderPagination(data) {
    const pagination = document.getElementById('pagination');
    const start = (data.currentPage - 1) * tableState.pageSize + 1;
    const end = Math.min(data.currentPage * tableState.pageSize, data.totalRecords);

    pagination.innerHTML = `
        <div class="pagination-info">
            Showing ${start} to ${end} of ${data.totalRecords} entries
        </div>
        <div class="pagination-buttons">
            <button class="page-btn" onclick="changePage(${data.currentPage - 1})" ${data.currentPage === 1 ? 'disabled' : ''}>
                Previous
            </button>
            ${renderPageNumbers(data.currentPage, data.totalPages)}
            <button class="page-btn" onclick="changePage(${data.currentPage + 1})" ${data.currentPage === data.totalPages ? 'disabled' : ''}>
                Next
            </button>
        </div>
    `;
}

function renderPageNumbers(currentPage, totalPages) {
    let html = '';
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }

    return html;
}

function changePage(page) {
    tableState.page = page;
    loadTransactions();
}

// Analytics
function loadAnalytics() {
    if (!dashboardData) {
        loadDashboardStats().then(() => renderAnalyticsCharts());
    } else {
        renderAnalyticsCharts();
    }
}

function renderAnalyticsCharts() {
    // Revenue Trend Chart
    if (charts.analyticsRevenue) {
        charts.analyticsRevenue.destroy();
    }

    const analyticsRevenueCtx = document.getElementById('analyticsRevenueChart').getContext('2d');
    charts.analyticsRevenue = new Chart(analyticsRevenueCtx, {
        type: 'line',
        data: {
            labels: dashboardData.revenueData.map(d => d.label),
            datasets: [{
                label: 'Revenue',
                data: dashboardData.revenueData.map(d => d.value),
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    // Category Performance Chart
    if (charts.analyticsCategory) {
        charts.analyticsCategory.destroy();
    }

    const analyticsCategoryCtx = document.getElementById('analyticsCategoryChart').getContext('2d');
    charts.analyticsCategory = new Chart(analyticsCategoryCtx, {
        type: 'bar',
        data: {
            labels: dashboardData.categoryData.map(d => d.category),
            datasets: [{
                label: 'Sales Count',
                data: dashboardData.categoryData.map(d => d.count),
                backgroundColor: [
                    '#4f46e5',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Utility Functions
function toggleMobileMenu() {
    document.querySelector('.sidebar').classList.toggle('show');
}

function updateLastUpdated() {
    const now = new Date();
    document.getElementById('lastUpdated').textContent = `Last updated: ${now.toLocaleTimeString()}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function destroyCharts() {
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};
}
