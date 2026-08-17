// ============================================
// DRIVER APP LOGIC
// ============================================

// ============================================
// DATA
// ============================================
const driverData = {
    id: 'DRV-001',
    name: 'Muhammad Ali',
    route: 'Green Line',
    routePath: 'Clifton → Saddar',
    stops: ['Clifton', 'Zamzama', 'Tariq Road', 'Saddar'],
    currentStop: 1, // index
    passengers: 42,
    capacity: 60,
    status: 'active',
    nextStop: 'Tariq Road'
};

const tripHistoryData = [
    { route: 'Green Line', date: 'Aug 13, 2026', passengers: 42, status: 'Completed' },
    { route: 'Red Line', date: 'Aug 12, 2026', passengers: 38, status: 'Completed' },
    { route: 'City Express', date: 'Aug 12, 2026', passengers: 35, status: 'Completed' },
    { route: 'Green Line', date: 'Aug 11, 2026', passengers: 40, status: 'Completed' },
    { route: 'Blue Line', date: 'Aug 11, 2026', passengers: 28, status: 'Completed' }
];

const passengerList = [
    { name: 'Ahmed Raza', seat: 'A12', status: 'On Board' },
    { name: 'Sara Khan', seat: 'B05', status: 'On Board' },
    { name: 'Usman Ali', seat: 'C08', status: 'On Board' },
    { name: 'Fatima Noor', seat: 'A03', status: 'On Board' },
    { name: 'Hassan Raza', seat: 'B12', status: 'On Board' },
    { name: 'Ayesha Siddiqui', seat: 'D02', status: 'On Board' },
    { name: 'Bilal Ahmed', seat: 'C15', status: 'On Board' },
    { name: 'Zara Malik', seat: 'A08', status: 'On Board' }
];

// ============================================
// STATE
// ============================================
let isLoggedIn = false;
let isTripActive = true;

// ============================================
// DOM ELEMENTS
// ============================================
const loginScreen = document.getElementById('loginScreen');
const driverApp = document.getElementById('driverApp');
const passengerCount = document.getElementById('passengerCount');
const nextStop = document.getElementById('nextStop');

// ============================================
// LOGIN FUNCTIONS
// ============================================
function handleLogin(e) {
    e.preventDefault();
    
    const employeeId = document.getElementById('employeeId').value;
    const password = document.getElementById('password').value;
    
    // Simple validation - in production, this would be an API call
    if (employeeId === 'DRV-001' && password === 'driver123') {
        loginSuccess();
    } else if (employeeId === 'zaman' && password === 'zaman123') {
        // Alternate driver
        driverData.id = 'DRV-002';
        driverData.name = 'Usman Khan';
        driverData.route = 'Red Line';
        driverData.routePath = 'Gulshan → Tower';
        driverData.stops = ['Gulshan', 'Shahrah-e-Faisal', 'Tower'];
        driverData.currentStop = 0;
        driverData.passengers = 38;
        driverData.nextStop = 'Shahrah-e-Faisal';
        loginSuccess();
    } else {
        alert('❌ Invalid credentials. Please try again.\n\nTest Credentials:\nDRV-001 / driver123\nDRV-002 / driver123');
    }
}

function loginSuccess() {
    isLoggedIn = true;
    loginScreen.style.display = 'none';
    driverApp.style.display = 'flex';
    
    // Update UI with driver data
    document.getElementById('driverName').textContent = driverData.name;
    document.getElementById('driverId').textContent = driverData.id;
    document.getElementById('routeName').textContent = driverData.route;
    document.getElementById('routePath').textContent = driverData.routePath;
    document.getElementById('nextStop').textContent = driverData.nextStop;
    document.getElementById('passengerCount').textContent = driverData.passengers;
    
    renderTripHistory();
    console.log(`✅ Driver ${driverData.name} logged in successfully`);
}

// ============================================
// RENDER FUNCTIONS
// ============================================

// Render Trip History
function renderTripHistory() {
    const historyList = document.getElementById('tripHistory');
    if (!historyList) return;
    
    historyList.innerHTML = tripHistoryData.slice(0, 3).map(trip => `
        <div class="history-item">
            <div class="history-item-left">
                <span class="route">${trip.route}</span>
                <span class="date">${trip.date}</span>
            </div>
            <div class="history-item-right">
                <div class="passengers">${trip.passengers} riders</div>
                <div class="status">${trip.status}</div>
            </div>
        </div>
    `).join('');
}

// Render Full History
function renderFullHistory() {
    const historyFullList = document.getElementById('historyFullList');
    if (!historyFullList) return;
    
    historyFullList.innerHTML = tripHistoryData.map(trip => `
        <div class="history-item">
            <div class="history-item-left">
                <span class="route">${trip.route}</span>
                <span class="date">${trip.date}</span>
            </div>
            <div class="history-item-right">
                <div class="passengers">${trip.passengers} riders</div>
                <div class="status">${trip.status}</div>
            </div>
        </div>
    `).join('');
}

// Render Passengers
function renderPassengers() {
    const passengerListEl = document.getElementById('passengerList');
    if (!passengerListEl) return;
    
    // Update stats
    document.getElementById('statTotal').textContent = driverData.passengers;
    document.getElementById('statCapacity').textContent = driverData.capacity;
    document.getElementById('statAvailable').textContent = driverData.capacity - driverData.passengers;
    document.getElementById('modalPassengerCount').textContent = driverData.passengers;
    
    passengerListEl.innerHTML = passengerList.map(p => `
        <div class="passenger-item">
            <div class="passenger-avatar">${p.name.charAt(0)}</div>
            <div class="passenger-info">
                <div class="name">${p.name}</div>
                <div class="seat">Seat: ${p.seat}</div>
            </div>
            <div class="passenger-status">
                <i class="fas fa-check-circle" style="font-size:12px;"></i> ${p.status}
            </div>
        </div>
    `).join('');
}

// ============================================
// ACTIONS
// ============================================

// End Trip
function endTrip() {
    if (confirm('Are you sure you want to end this trip?')) {
        isTripActive = false;
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        
        if (statusDot) {
            statusDot.classList.remove('active');
            statusDot.classList.add('offline');
        }
        if (statusText) statusText.textContent = 'Offline';
        
        // Add to history
        tripHistoryData.unshift({
            route: driverData.route,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            passengers: driverData.passengers,
            status: 'Completed'
        });
        
        renderTripHistory();
        alert('✅ Trip ended successfully!');
        
        // Reset after delay
        setTimeout(() => {
            if (confirm('Start a new trip?')) {
                location.reload();
            }
        }, 1000);
    }
}

// Show Route Map
function showRouteMap() {
    document.getElementById('routeMapModal').classList.add('active');
}

// Show Passengers
function showPassengers() {
    renderPassengers();
    document.getElementById('passengersModal').classList.add('active');
}

// Show Trip History
function showTripHistory() {
    renderFullHistory();
    document.getElementById('historyModal').classList.add('active');
}

// Open Scanner
function openScanner() {
    document.getElementById('scannerModal').classList.add('active');
    // Simulate scanning after 3 seconds
    setTimeout(() => {
        document.querySelector('.scanner-container').style.display = 'none';
        document.getElementById('qrResult').style.display = 'block';
    }, 3000);
}

// Reset Scanner
function resetScanner() {
    document.querySelector('.scanner-container').style.display = 'block';
    document.getElementById('qrResult').style.display = 'none';
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    
    // Reset scanner if it's the scanner modal
    if (modalId === 'scannerModal') {
        document.querySelector('.scanner-container').style.display = 'block';
        document.getElementById('qrResult').style.display = 'none';
    }
}

// Close modals on backdrop click
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                // Reset scanner
                if (this.id === 'scannerModal') {
                    document.querySelector('.scanner-container').style.display = 'block';
                    document.getElementById('qrResult').style.display = 'none';
                }
            }
        });
    });
});

// ============================================
// BOTTOM NAVIGATION
// ============================================
function setupBottomNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            
            const page = this.dataset.page;
            switch(page) {
                case 'dashboard':
                    // Already on dashboard
                    break;
                case 'route':
                    showRouteMap();
                    break;
                case 'scanner':
                    openScanner();
                    break;
                case 'profile':
                    alert(`👤 Driver Profile\n\nName: ${driverData.name}\nID: ${driverData.id}\nRoute: ${driverData.route}\nPassengers: ${driverData.passengers}`);
                    break;
            }
        });
    });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚗 Driver App Loaded');
    console.log(`👤 Driver: ${driverData.name}`);
    console.log(`🚍 Route: ${driverData.route}`);
    console.log(`👥 Passengers: ${driverData.passengers}`);
    
    // Show login screen by default
    loginScreen.style.display = 'flex';
    driverApp.style.display = 'none';
    
    setupBottomNav();
});

// ============================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================
window.handleLogin = handleLogin;
window.endTrip = endTrip;
window.showRouteMap = showRouteMap;
window.showPassengers = showPassengers;
window.showTripHistory = showTripHistory;
window.openScanner = openScanner;
window.resetScanner = resetScanner;
window.closeModal = closeModal;