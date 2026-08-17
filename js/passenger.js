// ============================================
// PASSENGER APP LOGIC
// ============================================

// ============================================
// DATA
// ============================================
const busData = [
    {
        id: 1,
        name: 'Green Line',
        type: 'government',
        typeLabel: 'Government Bus',
        route: 'Gulshan → Saddar',
        fare: 80,
        arrival: 8,
        status: 'active',
        capacity: 60,
        passengers: 42,
        stops: ['Gulshan', 'Tariq Road', 'Saddar'],
        lat: 24.8607,
        lng: 67.0011
    },
    {
        id: 2,
        name: 'City Express',
        type: 'private',
        typeLabel: 'Private Bus',
        route: 'Gulshan → Saddar',
        fare: 100,
        arrival: 15,
        status: 'active',
        capacity: 45,
        passengers: 38,
        stops: ['Gulshan', 'Shahrah-e-Faisal', 'Saddar'],
        lat: 24.8707,
        lng: 67.0111
    },
    {
        id: 3,
        name: 'Karachi Coach',
        type: 'intercity',
        typeLabel: 'Intercity Coach',
        route: 'Karachi → Hyderabad',
        fare: 350,
        arrival: 45,
        status: 'active',
        capacity: 50,
        passengers: 30,
        stops: ['Karachi', 'Thatta', 'Hyderabad'],
        lat: 24.8807,
        lng: 67.0211
    },
    {
        id: 4,
        name: 'Red Line',
        type: 'government',
        typeLabel: 'Government Bus',
        route: 'Clifton → Tower',
        fare: 70,
        arrival: 5,
        status: 'active',
        capacity: 55,
        passengers: 48,
        stops: ['Clifton', 'Zamzama', 'Tower'],
        lat: 24.8507,
        lng: 66.9911
    },
    {
        id: 5,
        name: 'Blue Line',
        type: 'private',
        typeLabel: 'Private Bus',
        route: 'Malir → Saddar',
        fare: 90,
        arrival: 20,
        status: 'inactive',
        capacity: 40,
        passengers: 0,
        stops: ['Malir', 'Shahrah-e-Faisal', 'Saddar'],
        lat: 24.8907,
        lng: 67.0311
    }
];

const bookings = [
    {
        id: 1,
        busName: 'Green Line',
        date: '2026-08-13',
        time: '8:30 AM',
        fare: 80,
        status: 'confirmed',
        qr: 'QR-001'
    },
    {
        id: 2,
        busName: 'City Express',
        date: '2026-08-12',
        time: '5:45 PM',
        fare: 100,
        status: 'completed',
        qr: 'QR-002'
    }
];

const paymentMethods = [
    { id: 'jazzcash', name: 'JazzCash', icon: 'fa-mobile-screen' },
    { id: 'easypaisa', name: 'Easypaisa', icon: 'fa-mobile-screen' },
    { id: 'card', name: 'Credit/Debit Card', icon: 'fa-credit-card' },
    { id: 'wallet', name: 'Wallet Balance', icon: 'fa-wallet' },
    { id: 'cash', name: 'Cash Payment', icon: 'fa-money-bill' }
];

// ============================================
// STATE
// ============================================
let selectedBus = null;
let selectedPayment = null;
let currentPage = 'home';

// ============================================
// DOM ELEMENTS
// ============================================
const busList = document.getElementById('busList');
const searchInput = document.getElementById('searchInput');
const detailModal = document.getElementById('busDetailModal');
const bookingModal = document.getElementById('bookingModal');
const paymentModal = document.getElementById('paymentModal');
const successModal = document.getElementById('successModal');

// ============================================
// RENDER FUNCTIONS
// ============================================

// Render Bus Cards
function renderBuses(buses) {
    if (!busList) return;
    
    const activeBuses = buses.filter(b => b.status === 'active');
    
    if (activeBuses.length === 0) {
        busList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bus"></i>
                <p>No buses available right now</p>
            </div>
        `;
        return;
    }
    
    busList.innerHTML = activeBuses.map(bus => `
        <div class="bus-card" onclick="openBusDetail(${bus.id})">
            <div class="bus-card-top">
                <div class="bus-info">
                    <div class="bus-name-badge">
                        <h3>${bus.name}</h3>
                        <span class="bus-type ${bus.type}">${bus.typeLabel}</span>
                    </div>
                    <div class="bus-route-text">${bus.route}</div>
                    <div class="bus-meta">
                        <span class="arrival">
                            <span class="live-dot"></span> ${bus.arrival} min
                        </span>
                        <span class="bus-fare">Rs.${bus.fare}</span>
                    </div>
                </div>
                <div class="bus-card-right">
                    <div class="bus-icon-small">
                        <i class="fas fa-bus"></i>
                    </div>
                    <div class="passenger-count">${bus.passengers} riders</div>
                </div>
            </div>
            <div class="bus-card-bottom">
                <div class="bus-stops">
                    <i class="fas fa-map-pin"></i>
                    <span>${bus.stops.join(' → ')}</span>
                </div>
                <button class="track-btn">Track Live →</button>
            </div>
        </div>
    `).join('');
}

// Render Bus Detail Modal
function renderBusDetail(bus) {
    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;
    
    document.getElementById('modalBusName').textContent = bus.name;
    
    modalBody.innerHTML = `
        <div class="detail-bus-header">
            <div>
                <div class="detail-bus-name">${bus.name}</div>
                <span class="detail-bus-type bus-type ${bus.type}">${bus.typeLabel}</span>
            </div>
            <div class="detail-bus-fare">Rs.${bus.fare}</div>
        </div>
        
        <div class="detail-grid">
            <div class="detail-item">
                <div class="label">Route</div>
                <div class="value">${bus.route}</div>
            </div>
            <div class="detail-item">
                <div class="label">Arrival</div>
                <div class="value"><span class="live-dot"></span> ${bus.arrival} min</div>
            </div>
            <div class="detail-item">
                <div class="label">Capacity</div>
                <div class="value">${bus.capacity} seats</div>
            </div>
            <div class="detail-item">
                <div class="label">Passengers</div>
                <div class="value">${bus.passengers} on board</div>
            </div>
        </div>
        
        <div class="detail-stops">
            <h4>Stops</h4>
            ${bus.stops.map((stop, i) => `
                <div class="stop-item">
                    <div class="stop-dot ${i === 0 ? 'active' : 'inactive'}"></div>
                    <span class="stop-name ${i === 0 ? 'active' : ''}">${stop}</span>
                    ${i === 0 ? '<span style="font-size:11px;color:#1a7a5a;font-weight:600;">(Your stop)</span>' : ''}
                </div>
            `).join('')}
        </div>
        
        <div class="detail-map">
            <div style="text-align:center;">
                <i class="fas fa-map" style="font-size:32px;display:block;margin-bottom:8px;"></i>
                <span>Live Map View</span>
            </div>
        </div>
        
        <button class="btn-primary" onclick="openBooking(${bus.id})">
            Book Ticket - Rs.${bus.fare}
        </button>
    `;
}

// Render Booking Modal
function renderBooking(bus) {
    const bookingBody = document.getElementById('bookingBody');
    if (!bookingBody) return;
    
    bookingBody.innerHTML = `
        <div style="margin-bottom:16px;">
            <div style="font-weight:700;font-size:18px;">${bus.name}</div>
            <div style="color:var(--text-gray);font-size:14px;">${bus.route}</div>
        </div>
        
        <div class="booking-summary">
            <div class="summary-row">
                <span>Bus Fare</span>
                <span>Rs.${bus.fare}</span>
            </div>
            <div class="summary-row">
                <span>Service Fee</span>
                <span>Rs.0</span>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span>Rs.${bus.fare}</span>
            </div>
        </div>
        
        <h4 style="font-size:14px;font-weight:600;margin-bottom:12px;">Select Payment Method</h4>
        
        <div class="payment-options">
            ${paymentMethods.map(method => `
                <div class="payment-option" onclick="selectPayment('${method.id}')" data-method="${method.id}">
                    <div class="payment-option-left">
                        <div class="payment-icon">
                            <i class="fas ${method.icon}"></i>
                        </div>
                        <span>${method.name}</span>
                    </div>
                    <div class="radio"></div>
                </div>
            `).join('')}
        </div>
        
        <button class="btn-primary" onclick="confirmBooking()" id="confirmBtn" disabled style="opacity:0.5;">
            Confirm & Pay
        </button>
    `;
}

// Render Success Modal
function renderSuccess() {
    const successModal = document.getElementById('successModal');
    // Already rendered in HTML, just show it
}

// ============================================
// EVENT HANDLERS
// ============================================

// Open Bus Detail
function openBusDetail(busId) {
    const bus = busData.find(b => b.id === busId);
    if (!bus) return;
    
    selectedBus = bus;
    renderBusDetail(bus);
    detailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Open Booking
function openBooking(busId) {
    const bus = busData.find(b => b.id === busId);
    if (!bus) return;
    
    selectedBus = bus;
    selectedPayment = null;
    detailModal.classList.remove('active');
    renderBooking(bus);
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Select Payment Method
function selectPayment(methodId) {
    selectedPayment = methodId;
    
    document.querySelectorAll('.payment-option').forEach(el => {
        el.classList.toggle('selected', el.dataset.method === methodId);
    });
    
    const confirmBtn = document.getElementById('confirmBtn');
    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.style.opacity = '1';
    }
}

// Confirm Booking
function confirmBooking() {
    if (!selectedPayment) {
        alert('Please select a payment method');
        return;
    }
    
    bookingModal.classList.remove('active');
    successModal.classList.add('active');
    
    // Add to bookings
    const newBooking = {
        id: bookings.length + 1,
        busName: selectedBus.name,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        fare: selectedBus.fare,
        status: 'confirmed',
        qr: `QR-${String(bookings.length + 1).padStart(3, '0')}`
    };
    bookings.push(newBooking);
}

// View Tickets
function viewTickets() {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
    alert('Redirecting to My Tickets...');
    // In production, navigate to tickets page
}

// Close Modals
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
function searchBuses(query) {
    if (!query || query.trim() === '') {
        renderBuses(busData);
        return;
    }
    
    const filtered = busData.filter(bus => 
        bus.name.toLowerCase().includes(query.toLowerCase()) ||
        bus.route.toLowerCase().includes(query.toLowerCase()) ||
        bus.stops.some(stop => stop.toLowerCase().includes(query.toLowerCase()))
    );
    
    renderBuses(filtered);
}

// ============================================
// QUICK ACTION NAVIGATION
// ============================================
function setupQuickActions() {
    document.querySelectorAll('.quick-action').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.dataset.page;
            switch(page) {
                case 'nearby':
                    renderBuses(busData);
                    break;
                case 'routes':
                    alert('Showing all routes...');
                    break;
                case 'tickets':
                    alert('Showing my tickets...');
                    break;
                case 'history':
                    alert('Showing ride history...');
                    break;
            }
        });
    });
}

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
                case 'home':
                    renderBuses(busData);
                    break;
                case 'search':
                    searchInput.focus();
                    break;
                case 'tickets':
                    alert('My Tickets');
                    break;
                case 'profile':
                    alert('User Profile');
                    break;
            }
        });
    });
}

// ============================================
// MODAL CLOSE HANDLERS
// ============================================
function setupModals() {
    // Close detail modal
    document.getElementById('closeDetailModal')?.addEventListener('click', () => {
        closeModal(detailModal);
    });
    
    // Close booking modal
    document.getElementById('closeBookingModal')?.addEventListener('click', () => {
        closeModal(bookingModal);
    });
    
    // Close payment modal
    document.getElementById('closePaymentModal')?.addEventListener('click', () => {
        closeModal(paymentModal);
    });
    
    // View ticket button
    document.getElementById('viewTicketBtn')?.addEventListener('click', viewTickets);
    
    // Close on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
}

// ============================================
// SEARCH INPUT HANDLER
// ============================================
function setupSearch() {
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchBuses(this.value);
        });
    }
}

// ============================================
// NOTIFICATION HANDLER
// ============================================
function setupNotifications() {
    document.getElementById('notifBtn')?.addEventListener('click', () => {
        alert('📬 You have 3 new notifications');
    });
}

// ============================================
// PROFILE HANDLER
// ============================================
function setupProfile() {
    document.getElementById('profileBtn')?.addEventListener('click', () => {
        alert('👤 User Profile');
    });
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
    console.log('🚍 Passenger App Loaded');
    console.log(`📊 ${busData.length} buses loaded`);
    console.log(`🎫 ${bookings.length} bookings`);
    
    renderBuses(busData);
    setupQuickActions();
    setupBottomNav();
    setupModals();
    setupSearch();
    setupNotifications();
    setupProfile();
}

// Run on DOM load
document.addEventListener('DOMContentLoaded', init);

// ============================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================
window.openBusDetail = openBusDetail;
window.openBooking = openBooking;
window.selectPayment = selectPayment;
window.confirmBooking = confirmBooking;
window.viewTickets = viewTickets;