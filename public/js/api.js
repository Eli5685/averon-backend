// API utility functions
const API_BASE = window.location.origin + '/api';

async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Dashboard data loading
async function loadDashboardData() {
    try {
        showLoading();
        
        // Load dashboard stats
        const stats = await apiRequest('/analytics/dashboard');
        
        if (stats.success) {
            updateDashboardStats(stats.data);
        }

        // Load sales chart data
        const salesData = await apiRequest('/analytics/sales?days=30');
        if (salesData.success) {
            updateSalesChart(salesData.data);
        }

        // Load top products
        const topProducts = await apiRequest('/analytics/products/top?limit=5');
        if (topProducts.success) {
            updateTopProductsList(topProducts.data);
        }

    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showError('Failed to load dashboard data');
    } finally {
        hideLoading();
    }
}

function updateDashboardStats(data) {
    document.getElementById('totalUsers').textContent = data.totalUsers || 0;
    document.getElementById('totalProducts').textContent = data.totalProducts || 0;
    document.getElementById('totalOrders').textContent = data.totalOrders || 0;
    document.getElementById('totalRevenue').textContent = formatCurrency(data.totalRevenue || 0);
}

function updateTopProductsList(products) {
    const container = document.getElementById('topProductsList');
    
    if (!products || products.length === 0) {
        container.innerHTML = '<p>No products data available</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-item">
            <div>
                <div class="product-name">${product.name}</div>
                <div class="product-sales">${product.total_sold} sold</div>
            </div>
            <div class="product-revenue">${formatCurrency(product.total_revenue)}</div>
        </div>
    `).join('');
}

// Products data loading
async function loadProductsData() {
    try {
        showLoading();
        
        const response = await apiRequest('/products');
        
        if (response.success) {
            updateProductsTable(response.data);
        }
    } catch (error) {
        console.error('Failed to load products:', error);
        showError('Failed to load products data');
    } finally {
        hideLoading();
    }
}

function updateProductsTable(products) {
    const tbody = document.querySelector('#productsTable tbody');
    
    if (!products || products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No products found</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category || 'N/A'}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.stock_rf || 0} / ${product.stock_china || 0}</td>
            <td><span class="status-badge">${product.is_active ? 'Active' : 'Inactive'}</span></td>
            <td>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Orders data loading
async function loadOrdersData() {
    try {
        showLoading();
        
        const response = await apiRequest('/orders');
        
        if (response.success) {
            updateOrdersTable(response.data);
        }
    } catch (error) {
        console.error('Failed to load orders:', error);
        showError('Failed to load orders data');
    } finally {
        hideLoading();
    }
}

function updateOrdersTable(orders) {
    const tbody = document.querySelector('#ordersTable tbody');
    
    if (!orders || orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No orders found</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.order_number}</td>
            <td>${order.users ? `${order.users.first_name} ${order.users.last_name}` : 'N/A'}</td>
            <td>${formatDate(order.created_at)}</td>
            <td>${formatCurrency(order.total_amount)}</td>
            <td><span class="status-badge">${order.status}</span></td>
            <td>
                <button onclick="viewOrder(${order.id})">View</button>
                <button onclick="updateOrderStatus(${order.id})">Update</button>
            </td>
        </tr>
    `).join('');
}

// Users data loading
async function loadUsersData() {
    try {
        showLoading();
        
        const response = await apiRequest('/users');
        
        if (response.success) {
            updateUsersTable(response.data);
        }
    } catch (error) {
        console.error('Failed to load users:', error);
        showError('Failed to load users data');
    } finally {
        hideLoading();
    }
}

function updateUsersTable(users) {
    const tbody = document.querySelector('#usersTable tbody');
    
    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No users found</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.first_name} ${user.last_name}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${formatDate(user.created_at)}</td>
            <td>${user.last_sign_in_at ? formatDateTime(user.last_sign_in_at) : 'Never'}</td>
            <td>
                <button onclick="viewUser(${user.id})">View</button>
                <button onclick="editUser(${user.id})">Edit</button>
            </td>
        </tr>
    `).join('');
}

// Analytics data loading
async function loadAnalyticsData() {
    try {
        showLoading();
        
        // Load various analytics data
        const [salesData, categoryData, userGrowthData] = await Promise.all([
            apiRequest('/analytics/sales?days=30'),
            apiRequest('/analytics/categories'),
            apiRequest('/analytics/users')
        ]);

        if (salesData.success) {
            updateRevenueChart(salesData.data);
        }

        if (categoryData.success) {
            updateCategoryChart(categoryData.data);
        }

        if (userGrowthData.success) {
            updateUserGrowthChart(userGrowthData.data);
        }

    } catch (error) {
        console.error('Failed to load analytics:', error);
        showError('Failed to load analytics data');
    } finally {
        hideLoading();
    }
}

// Settings data loading
async function loadSettingsData() {
    try {
        showLoading();
        
        // Load system health
        const health = await apiRequest('/health');
        
        if (health.status === 'OK') {
            document.getElementById('dbStatus').textContent = 'Connected';
            document.getElementById('dbStatus').className = 'status-badge';
            document.getElementById('serverUptime').textContent = formatUptime(health.uptime);
            document.getElementById('lastUpdated').textContent = formatDateTime(health.timestamp);
        }

    } catch (error) {
        console.error('Failed to load settings:', error);
        document.getElementById('dbStatus').textContent = 'Error';
        document.getElementById('dbStatus').className = 'status-badge error';
    } finally {
        hideLoading();
    }
}

function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

// Action functions
function editProduct(id) {
    alert(`Edit product ${id} - functionality to be implemented`);
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        alert(`Delete product ${id} - functionality to be implemented`);
    }
}

function viewOrder(id) {
    alert(`View order ${id} - functionality to be implemented`);
}

function updateOrderStatus(id) {
    alert(`Update order status ${id} - functionality to be implemented`);
}

function viewUser(id) {
    alert(`View user ${id} - functionality to be implemented`);
}

function editUser(id) {
    alert(`Edit user ${id} - functionality to be implemented`);
}

function showError(message) {
    // Simple error display - could be enhanced with a proper notification system
    console.error(message);
    alert(message);
}
