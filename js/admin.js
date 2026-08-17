// ============================================
// ADMIN DASHBOARD LOGIC
// ============================================

// ============================================
// DATA
// ============================================
const adminData = {
    buses: [
        { id: 1, name: 'Green Line', type: 'government', typeLabel: 'Government Bus', route: 'Clifton → Saddar', capacity: 60, status: 'active', driver: 'Muhammad Ali' },
        { id: 2, name: 'City Express', type: 'private', typeLabel: 'Private Bus', route: 'Gulshan → Saddar', capacity: 45, status: 'active', driver: 'Usman Khan' },
        { id: 3, name: 'Karachi Coach', type: 'intercity', typeLabel: 'Intercity Coach', route: 'Karachi → Hyderabad', capacity: 50, status: 'active', driver: 'Ahmed Raza' },
        { id: 4, name: 'Red Line', type: 'government', typeLabel: 'Government Bus', route: 'Clifton → Tower', capacity: 55, status: 'active', driver: 'Sara Khan' },
        { id: 5, name: 'Blue Line', type: 'private', typeLabel: 'Private Bus', route: 'Malir → Saddar', capacity: 40, status: 'inactive', driver: 'N/A' },
        { id: 6, name: 'Orange Line', type: 'government', typeLabel: 'Government Bus', route: 'Gulshan → Tower', capacity: 50, status: 'maintenance', driver: 'N/A' },
        { id: 7, name: 'Silver Coach', type: 'intercity', typeLabel: 'Intercity Coach', route: 'Karachi → Lahore', capacity: 55, status: 'active', driver: 'Bilal Ahmed' },
        { id: 8, name: 'Express Line', type: 'private', typeLabel: 'Private Bus', route: 'Saddar → Clifton', capacity: 42, status: 'active', driver: 'Zara Malik' },
    ],
    drivers: [
        { id: 'DRV-001', name: 'Muhammad Ali', bus: 'Green Line', route: 'Clifton → Saddar', status: 'online', trips: 5 },
        { id: 'DRV-002', name: 'Usman Khan', bus: 'City Express', route: 'Gulshan → Saddar', status: 'online', trips: 4 },
        { id: 'DRV-003', name: 'Ahmed Raza', bus: 'Karachi Coach', route: 'Karachi → Hyderabad', status: 'online', trips: 3 },
        { id: 'DRV-004', name: 'Sara Khan', bus: 'Red Line', route: 'Clifton → Tower', status: 'offline', trips: 2 },
        { id: 'DRV-005', name: 'Bilal Ahmed', bus: 'Silver Coach', route: 'Karachi → Lahore', status: 'online', trips: 4 },
        { id: 'DRV-006', name: 'Zara Malik', bus: 'Express Line', route: 'Saddar → Clifton', status: 'online', trips: 3 },
    ],
    routes: [
        { id: 1, name: 'Green Line', start: 'Clifton', end: 'Saddar', stops: ['Clifton', 'Zamzama', 'Tariq Road', 'Saddar'], schedule: '6:00 AM - 10:00 PM', frequency: '15 min' },
        { id: 2, name: 'City Express', start: 'Gulshan', end: 'Saddar', stops: ['Gulshan', 'Shahrah-e-Faisal', 'Saddar'], schedule: '7:00 AM - 9:00 PM', frequency: '20 min' },
        { id: 3, name: 'Karachi Coach', start: 'Karachi', end: 'Hyderabad', stops: ['Karachi', 'Thatta', 'Hyderabad'], schedule: '5:00 AM - 11:00 PM', frequency: '30 min' },
        { id: 4, name: 'Red Line', start: 'Clifton', end: 'Tower', stops: ['Clifton', 'Zamzama', 'Tower'], schedule: '6:30 AM - 10:30 PM', frequency: '15 min' },
        { id: 5, name: 'Orange Line', start: 'Gulshan', end: 'Tower', stops: ['Gulshan', 'Tariq Road', 'Tower'], schedule: '7:30 AM - 9:30 PM', frequency: '20 min' },
    ],
    bookings: [
        { id: 1, passenger: 'Ahmed Raza', bus: 'Green Line', amount: 80, method: 'JazzCash', date: '2026-08-13', status: 'confirmed' },
        { id: 2, passenger: 'Sara Khan', bus: 'City Express', amount: 100, method: 'Easypaisa', date: '2026-08-13', status: 'confirmed' },
        { id: 3, passenger: 'Usman Ali', bus: 'Green Line', amount: 80, method: 'Credit Card', date: '2026-08-12', status: 'completed' },
        { id: 4, passenger: 'Fatima Noor', bus: 'Karachi Coach', amount: 350, method: 'Wallet', date: '2026-08-12', status: 'completed' },
        { id: 5, passenger: 'Hassan Raza', bus: 'Red Line', amount: 70, method: 'Cash', date: '2026-08-12', status: 'completed' },
        { id: 6, passenger: 'Ayesha Khan', bus: 'City Express', amount: 100, method: 'JazzCash', date: '2026-08-11', status: 'completed' },
    ],
    popularRoutes: [
        { name: 'Green Line', riders: 2847, percentage: 85 },
        { name: 'City Express', riders: 2134, percentage: 65 },
        { name: 'Red Line', riders: 1876, percentage: 55 },
        { name: 'Karachi Coach', riders: 1543, percentage: 45 },
        { name: 'Orange Line', riders: 982, percentage: 30 },
    ]
};

// ============================================
// STATE
// ============================================
let currentPage = 'dashboard';
let chartInstances = {};

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('👨‍💼 Admin Dashboard Loaded');
    console.log(`🚍 ${adminData.buses.length} buses`);
    console.log(`👤 ${adminData.drivers.length} drivers`);
    console.log(`📊 ${adminData.routes.length} routes`);
    
    renderDashboard();
    renderBusesTable();
    renderDriversTable();
    renderRoutesGrid();
    renderTrackingItems();
    renderRecentBookings();
    renderPopularRoutes();
    renderPaymentsTable();
    initCharts();
    setupNavigation();
});

// ============================================
// NAVIGATION
// ============================================
function setupNavigation() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            navigateTo(page);
        });
    });
    
    // Update badges
    document.getElementById('busCount').textContent = adminData.buses.length;
    document.getElementById('driverCount').textContent = adminData.drivers.length;
    document.getElementById('routeCount').textContent = adminData.routes.length;
    document.getElementById('paymentCount').textContent = adminData.bookings.length;
}

function navigateTo(page) {
    // Update sidebar
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });
    
    // Update page content
    document.querySelectorAll('.page-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update title
    const pageTitles = {
        dashboard: 'Dashboard',
        buses: 'Bus Management',
        drivers: 'Driver Management',
        routes: 'Route Management',
        tracking: 'Live Tracking',
        analytics: 'Analytics',
        payments: 'Payments',
        settings: 'Settings'
    };
    document.getElementById('pageTitle').textContent = pageTitles[page] || 'Dashboard';
    
    currentPage = page;
    
    // Re-render charts if analytics
    if (page === 'analytics') {
        setTimeout(() => initAnalyticsCharts(), 100);
    }
}

// ============================================
// SIDEBAR TOGGLE
// ============================================
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// ============================================
// LOGOUT
// ============================================
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        alert('👋 Logged out successfully!');
        // In production: redirect to login
        window.location.href = '../index.html';
    }
}

// ============================================
// DASHBOARD RENDER
// ============================================
function renderDashboard() {
    // Update stats
    const totalBuses = adminData.buses.length;
    const activeBuses = adminData.buses.filter(b => b.status === 'active').length;
    const totalPassengers = 2847;
    const dailyRevenue = 182400;
    const activeRoutes = adminData.routes.length;
    
    document.getElementById('statTotalBuses').textContent = totalBuses;
    document.getElementById('statActiveBuses').textContent = activeBuses;
    document.getElementById('statTotalPassengers').textContent = totalPassengers.toLocaleString();
    document.getElementById('statDailyRevenue').textContent = `Rs.${dailyRevenue.toLocaleString()}`;
    document.getElementById('statActiveRoutes').textContent = activeRoutes;
}

// ============================================
// BUS MANAGEMENT
// ============================================
function renderBusesTable(filteredBuses) {
    const buses = filteredBuses || adminData.buses;
    const tbody = document.getElementById('busTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = buses.map(bus => `
        <tr>
            <td><strong>${bus.name}</strong></td>
            <td><span class="status-badge ${bus.type}">${bus.typeLabel}</span></td>
            <td>${bus.route}</td>
            <td>${bus.capacity}</td>
            <td><span class="status-badge ${bus.status}">${bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}</span></td>
            <td>${bus.driver}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn edit" onclick="editBus(${bus.id})"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteBus(${bus.id})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterBuses() {
    const typeFilter = document.getElementById('busTypeFilter').value;
    const statusFilter = document.getElementById('busStatusFilter').value;
    const searchQuery = document.getElementById('busSearch').value.toLowerCase();
    
    let filtered = adminData.buses;
    
    if (typeFilter !== 'all') {
        filtered = filtered.filter(b => b.type === typeFilter);
    }
    
    if (statusFilter !== 'all') {
        filtered = filtered.filter(b => b.status === statusFilter);
    }
    
    if (searchQuery) {
        filtered = filtered.filter(b => 
            b.name.toLowerCase().includes(searchQuery) ||
            b.route.toLowerCase().includes(searchQuery) ||
            b.driver.toLowerCase().includes(searchQuery)
        );
    }
    
    renderBusesTable(filtered);
}

function openAddBusModal() {
    document.getElementById('addBusModal').classList.add('active');
}

function addBus(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const newBus = {
        id: adminData.buses.length + 1,
        name: formData.get('name') || 'New Bus',
        type: formData.get('type') || 'government',
        typeLabel: formData.get('type') === 'government' ? 'Government Bus' : 
                   formData.get('type') === 'private' ? 'Private Bus' : 'Intercity Coach',
        route: formData.get('route') || 'Unknown Route',
        capacity: parseInt(formData.get('capacity')) || 50,
        status: 'active',
        driver: formData.get('driver') || 'Unassigned'
    };
    
    adminData.buses.push(newBus);
    renderBusesTable();
    closeModal('addBusModal');
    alert(`✅ Bus "${newBus.name}" added successfully!`);
}

function editBus(id) {
    const bus = adminData.buses.find(b => b.id === id);
    if (bus) {
        alert(`✏️ Edit Bus: ${bus.name}\n\nCurrent details:\nType: ${bus.typeLabel}\nRoute: ${bus.route}\nCapacity: ${bus.capacity}\nStatus: ${bus.status}\nDriver: ${bus.driver}\n\n(Edit functionality would open a form)`);
    }
}

function deleteBus(id) {
    if (confirm('Are you sure you want to delete this bus?')) {
        adminData.buses = adminData.buses.filter(b => b.id !== id);
        renderBusesTable();
        alert('🗑️ Bus deleted successfully!');
    }
}

// ============================================
// DRIVER MANAGEMENT
// ============================================
function renderDriversTable() {
    const tbody = document.getElementById('driverTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = adminData.drivers.map(driver => `
        <tr>
            <td><strong>${driver.id}</strong></td>
            <td>${driver.name}</td>
            <td>${driver.bus}</td>
            <td>${driver.route}</td>
            <td><span class="status-badge ${driver.status}">${driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}</span></td>
            <td>${driver.trips}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn edit" onclick="editDriver('${driver.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteDriver('${driver.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddDriverModal() {
    document.getElementById('addDriverModal').classList.add('active');
}

function addDriver(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const newDriver = {
        id: formData.get('employeeId') || `DRV-${String(adminData.drivers.length + 1).padStart(3, '0')}`,
        name: formData.get('name') || 'New Driver',
        bus: formData.get('bus') || 'Unassigned',
        route: 'Assigned Route',
        status: 'offline',
        trips: 0
    };
    
    adminData.drivers.push(newDriver);
    renderDriversTable();
    closeModal('addDriverModal');
    alert(`✅ Driver "${newDriver.name}" added successfully!`);
}

function editDriver(id) {
    const driver = adminData.drivers.find(d => d.id === id);
    if (driver) {
        alert(`✏️ Edit Driver: ${driver.name}\n\nCurrent details:\nID: ${driver.id}\nBus: ${driver.bus}\nRoute: ${driver.route}\nStatus: ${driver.status}\nTrips: ${driver.trips}`);
    }
}

function deleteDriver(id) {
    if (confirm('Are you sure you want to delete this driver?')) {
        adminData.drivers = adminData.drivers.filter(d => d.id !== id);
        renderDriversTable();
        alert('🗑️ Driver deleted successfully!');
    }
}

// ============================================
// ROUTE MANAGEMENT
// ============================================
function renderRoutesGrid() {
    const grid = document.getElementById('routesGrid');
    if (!grid) return;
    
    grid.innerHTML = adminData.routes.map(route => `
        <div class="route-card-item">
            <h3>${route.name}</h3>
            <div class="route-path">${route.start} → ${route.end}</div>
            <div class="route-details">
                <div class="detail">
                    <span class="label">Stops</span>
                    <span class="value">${route.stops.length}</span>
                </div>
                <div class="detail">
                    <span class="label">Schedule</span>
                    <span class="value">${route.schedule}</span>
                </div>
                <div class="detail">
                    <span class="label">Frequency</span>
                    <span class="value">${route.frequency}</span>
                </div>
            </div>
            <div style="margin-top:12px;padding-top:12px;border-top:1px solid #f3f4f6;display:flex;gap:8px;">
                <button class="action-btn edit" onclick="editRoute(${route.id})"><i class="fas fa-edit"></i> Edit</button>
                <button class="action-btn delete" onclick="deleteRoute(${route.id})"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `).join('');
}

function openAddRouteModal() {
    document.getElementById('addRouteModal').classList.add('active');
}

function addRoute(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const stops = formData.get('stops').split(',').map(s => s.trim());
    
    const newRoute = {
        id: adminData.routes.length + 1,
        name: formData.get('name') || 'New Route',
        start: formData.get('start') || 'Start',
        end: formData.get('end') || 'End',
        stops: stops.length ? stops : ['Stop 1', 'Stop 2'],
        schedule: formData.get('schedule') || '6:00 AM - 10:00 PM',
        frequency: formData.get('frequency') || '15 min'
    };
    
    adminData.routes.push(newRoute);
    renderRoutesGrid();
    closeModal('addRouteModal');
    alert(`✅ Route "${newRoute.name}" created successfully!`);
}

function editRoute(id) {
    const route = adminData.routes.find(r => r.id === id);
    if (route) {
        alert(`✏️ Edit Route: ${route.name}\n\nStart: ${route.start}\nEnd: ${route.end}\nStops: ${route.stops.join(', ')}\nSchedule: ${route.schedule}\nFrequency: ${route.frequency}`);
    }
}

function deleteRoute(id) {
    if (confirm('Are you sure you want to delete this route?')) {
        adminData.routes = adminData.routes.filter(r => r.id !== id);
        renderRoutesGrid();
        alert('🗑️ Route deleted successfully!');
    }
}

// ============================================
// LIVE TRACKING
// ============================================
function renderTrackingItems() {
    const container = document.getElementById('trackingItems');
    if (!container) return;
    
    const activeBuses = adminData.buses.filter(b => b.status === 'active');
    
    container.innerHTML = activeBuses.map(bus => `
        <div class="tracking-item">
            <div class="tracking-item-left">
                <span class="tracking-dot ${bus.status === 'active' ? 'active' : 'transit'}"></span>
                <div>
                    <div class="bus-name">${bus.name}</div>
                    <div class="bus-location">${bus.route}</div>
                </div>
            </div>
            <div class="bus-time">${Math.floor(Math.random() * 15) + 5} min</div>
        </div>
    `).join('');
}

// ============================================
// RECENT BOOKINGS & POPULAR ROUTES
// ============================================
function renderRecentBookings() {
    const container = document.getElementById('recentBookings');
    if (!container) return;
    
    const recent = adminData.bookings.slice(0, 5);
    
    container.innerHTML = recent.map(booking => `
        <div class="activity-item">
            <div class="activity-item-left">
                <div class="name">${booking.passenger}</div>
                <div class="detail">${booking.bus} • ${booking.date}</div>
            </div>
            <div class="activity-item-right">
                <div class="amount">Rs.${booking.amount}</div>
                <div class="status" style="color:${booking.status === 'confirmed' ? '#065f46' : '#6b7280'}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</div>
            </div>
        </div>
    `).join('');
}

function renderPopularRoutes() {
    const container = document.getElementById('popularRoutes');
    if (!container) return;
    
    container.innerHTML = adminData.popularRoutes.map(route => `
        <div class="route-item">
            <div>
                <div class="route-name">${route.name}</div>
                <div class="route-riders">${route.riders.toLocaleString()} riders</div>
            </div>
            <div class="route-bar">
                <div class="fill" style="width: ${route.percentage}%"></div>
            </div>
        </div>
    `).join('');
}

// ============================================
// PAYMENTS TABLE
// ============================================
function renderPaymentsTable() {
    const tbody = document.getElementById('paymentTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = adminData.bookings.map(booking => `
        <tr>
            <td><strong>#${String(booking.id).padStart(4, '0')}</strong></td>
            <td>${booking.passenger}</td>
            <td>${booking.bus}</td>
            <td><strong>Rs.${booking.amount}</strong></td>
            <td>${booking.method}</td>
            <td>${booking.date}</td>
            <td><span class="status-badge ${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span></td>
        </tr>
    `).join('');
}

// ============================================
// CHARTS
// ============================================
function initCharts() {
    // Passenger Chart
    const ctx1 = document.getElementById('passengerChart');
    if (ctx1) {
        chartInstances.passenger = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Passengers',
                    data: [320, 450, 380, 520, 480, 600, 550],
                    borderColor: '#1a7a5a',
                    backgroundColor: 'rgba(26, 122, 90, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    // Revenue Chart
    const ctx2 = document.getElementById('revenueChart');
    if (ctx2) {
        chartInstances.revenue = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue (Rs.)',
                    data: [12000, 18000, 15000, 22000, 20000, 28000, 25000],
                    backgroundColor: ['#0f4c81', '#1a7a5a', '#0f4c81', '#1a7a5a', '#0f4c81', '#1a7a5a', '#0f4c81'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

function initAnalyticsCharts() {
    // Trend Chart
    const ctx3 = document.getElementById('trendChart');
    if (ctx3) {
        if (chartInstances.trend) chartInstances.trend.destroy();
        chartInstances.trend = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Passengers',
                    data: [1200, 1500, 1800, 2200],
                    borderColor: '#0f4c81',
                    backgroundColor: 'rgba(15, 76, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    // Utilization Chart
    const ctx4 = document.getElementById('utilizationChart');
    if (ctx4) {
        if (chartInstances.utilization) chartInstances.utilization.destroy();
        chartInstances.utilization = new Chart(ctx4, {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Inactive', 'Maintenance'],
                datasets: [{
                    data: [32, 8, 5],
                    backgroundColor: ['#22c55e', '#ef4444', '#f59e0b']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Payment Chart
    const ctx5 = document.getElementById('paymentChart');
    if (ctx5) {
        if (chartInstances.payment) chartInstances.payment.destroy();
        chartInstances.payment = new Chart(ctx5, {
            type: 'pie',
            data: {
                labels: ['JazzCash', 'Easypaisa', 'Card', 'Wallet', 'Cash'],
                datasets: [{
                    data: [35, 25, 20, 12, 8],
                    backgroundColor: ['#0f4c81', '#1a7a5a', '#8b5cf6', '#f59e0b', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modals on backdrop click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ============================================
// SEARCH GLOBAL
// ============================================
document.getElementById('globalSearch')?.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const query = this.value.toLowerCase();
        if (query) {
            alert(`🔍 Searching for: "${query}"\n\nResults will appear here.`);
        }
    }
});

// ============================================
// NOTIFICATIONS
// ============================================
document.querySelector('.notification-btn')?.addEventListener('click', function() {
    alert(`📬 Notifications (8)\n\n• 3 new bookings\n• 2 buses in maintenance\n• 1 driver request\n• 2 payment alerts`);
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', function(e) {
    // Ctrl + 1-8 for navigation
    if (e.ctrlKey && e.key >= '1' && e.key <= '8') {
        e.preventDefault();
        const pages = ['dashboard', 'buses', 'drivers', 'routes', 'tracking', 'analytics', 'payments', 'settings'];
        const page = pages[parseInt(e.key) - 1];
        if (page) navigateTo(page);
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// ============================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================
window.toggleSidebar = toggleSidebar;
window.logout = logout;
window.filterBuses = filterBuses;
window.openAddBusModal = openAddBusModal;
window.addBus = addBus;
window.editBus = editBus;
window.deleteBus = deleteBus;
window.openAddDriverModal = openAddDriverModal;
window.addDriver = addDriver;
window.editDriver = editDriver;
window.deleteDriver = deleteDriver;
window.openAddRouteModal = openAddRouteModal;
window.addRoute = addRoute;
window.editRoute = editRoute;
window.deleteRoute = deleteRoute;
window.closeModal = closeModal;
window.navigateTo = navigateTo;

console.log('✅ Admin Dashboard fully loaded!');
console.log('📋 Use Ctrl+1-8 to navigate quickly');