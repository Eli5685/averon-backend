// Chart.js configurations and functions
let salesChart = null;
let revenueChart = null;
let categoryChart = null;
let userGrowthChart = null;
let orderStatusChart = null;

// Chart color scheme
const chartColors = {
    primary: '#e94560',
    secondary: '#ff6b85',
    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#ef4444',
    info: '#3b82f6',
    light: '#f8fafc',
    dark: '#1e293b'
};

// Default chart options
const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#ffffff',
                font: {
                    size: 12
                }
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#b8c5d6'
            },
            grid: {
                color: '#2d3748'
            }
        },
        y: {
            ticks: {
                color: '#b8c5d6'
            },
            grid: {
                color: '#2d3748'
            }
        }
    }
};

function updateSalesChart(data) {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    // Destroy existing chart
    if (salesChart) {
        salesChart.destroy();
    }

    const labels = data.map(item => new Date(item.date).toLocaleDateString('ru-RU'));
    const orders = data.map(item => item.orders);
    const revenue = data.map(item => item.revenue);

    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Orders',
                    data: orders,
                    borderColor: chartColors.primary,
                    backgroundColor: chartColors.primary + '20',
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'Revenue (₽)',
                    data: revenue,
                    borderColor: chartColors.success,
                    backgroundColor: chartColors.success + '20',
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            ...defaultChartOptions,
            scales: {
                ...defaultChartOptions.scales,
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    ticks: {
                        color: '#b8c5d6'
                    },
                    grid: {
                        drawOnChartArea: false,
                        color: '#2d3748'
                    }
                }
            }
        }
    });
}

function updateRevenueChart(data) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    if (revenueChart) {
        revenueChart.destroy();
    }

    const labels = data.map(item => new Date(item.date).toLocaleDateString('ru-RU'));
    const revenue = data.map(item => item.revenue);

    revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue (₽)',
                data: revenue,
                backgroundColor: chartColors.primary,
                borderColor: chartColors.secondary,
                borderWidth: 1
            }]
        },
        options: defaultChartOptions
    });
}

function updateCategoryChart(data) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    if (categoryChart) {
        categoryChart.destroy();
    }

    const labels = data.map(item => item.category);
    const counts = data.map(item => item.count);
    
    // Generate colors for each category
    const colors = labels.map((_, index) => {
        const colorKeys = Object.keys(chartColors);
        return chartColors[colorKeys[index % colorKeys.length]];
    });

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: colors,
                borderColor: '#1e2749',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 12
                        },
                        padding: 20
                    }
                }
            }
        }
    });
}

function updateUserGrowthChart(data) {
    const ctx = document.getElementById('userGrowthChart');
    if (!ctx) return;

    if (userGrowthChart) {
        userGrowthChart.destroy();
    }

    const labels = data.map(item => new Date(item.date).toLocaleDateString('ru-RU'));
    const counts = data.map(item => item.count);

    userGrowthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'New Users',
                data: counts,
                borderColor: chartColors.info,
                backgroundColor: chartColors.info + '20',
                fill: true,
                tension: 0.4
            }]
        },
        options: defaultChartOptions
    });
}

function updateOrderStatusChart(orderStats) {
    const ctx = document.getElementById('orderStatusChart');
    if (!ctx) return;

    if (orderStatusChart) {
        orderStatusChart.destroy();
    }

    const labels = Object.keys(orderStats);
    const data = Object.values(orderStats);
    
    const statusColors = {
        'processing': chartColors.warning,
        'shipped': chartColors.info,
        'completed': chartColors.success,
        'cancelled': chartColors.danger
    };

    const colors = labels.map(status => statusColors[status] || chartColors.primary);

    orderStatusChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels.map(status => status.charAt(0).toUpperCase() + status.slice(1)),
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: '#1e2749',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 12
                        },
                        padding: 20
                    }
                }
            }
        }
    });
}

// Initialize empty charts on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts with empty data
    setTimeout(() => {
        initializeEmptyCharts();
    }, 100);
});

function initializeEmptyCharts() {
    // Initialize sales chart with empty data
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx && !salesChart) {
        salesChart = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: defaultChartOptions
        });
    }

    // Initialize other charts similarly
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx && !revenueChart) {
        revenueChart = new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: []
            },
            options: defaultChartOptions
        });
    }

    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx && !categoryChart) {
        categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }

    const userGrowthCtx = document.getElementById('userGrowthChart');
    if (userGrowthCtx && !userGrowthChart) {
        userGrowthChart = new Chart(userGrowthCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: defaultChartOptions
        });
    }

    const orderStatusCtx = document.getElementById('orderStatusChart');
    if (orderStatusCtx && !orderStatusChart) {
        orderStatusChart = new Chart(orderStatusCtx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }
}
