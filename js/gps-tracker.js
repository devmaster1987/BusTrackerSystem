// ============================================
// GPS TRACKING SYSTEM
// Real-time Bus Tracking Module
// ============================================

class GPSTracker {
    constructor() {
        this.watchId = null;
        this.currentPosition = null;
        this.isTracking = false;
        this.busLocations = {};
        this.updateInterval = null;
        this.listeners = [];
        
        // Initialize with sample bus locations
        this.initializeSampleData();
    }

    // ============================================
    // SAMPLE BUS LOCATIONS (Simulated GPS Data)
    // ============================================
    initializeSampleData() {
        // Base locations for different routes
        const baseLocations = {
            'Green Line': { lat: 24.8607, lng: 67.0011 },
            'City Express': { lat: 24.8707, lng: 67.0111 },
            'Karachi Coach': { lat: 24.8807, lng: 67.0211 },
            'Red Line': { lat: 24.8507, lng: 66.9911 },
            'Blue Line': { lat: 24.8907, lng: 67.0311 },
            'Orange Line': { lat: 24.8657, lng: 67.0051 },
            'Silver Coach': { lat: 24.8757, lng: 67.0151 },
            'Express Line': { lat: 24.8557, lng: 66.9951 }
        };

        // Generate random positions for each bus
        Object.keys(baseLocations).forEach(busName => {
            const base = baseLocations[busName];
            this.busLocations[busName] = {
                lat: base.lat + (Math.random() - 0.5) * 0.01,
                lng: base.lng + (Math.random() - 0.5) * 0.01,
                speed: 20 + Math.random() * 30, // km/h
                heading: Math.random() * 360,
                timestamp: new Date().toISOString(),
                status: 'active',
                passengers: Math.floor(20 + Math.random() * 40)
            };
        });
    }

    // ============================================
    // START GPS TRACKING
    // ============================================
    startTracking() {
        if (this.isTracking) return;

        // Check if browser supports Geolocation
        if (!navigator.geolocation) {
            console.warn('⚠️ Geolocation not supported by this browser');
            this.startSimulatedTracking();
            return;
        }

        // Start watching position
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.currentPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    speed: position.coords.speed || 0,
                    heading: position.coords.heading || 0,
                    timestamp: new Date().toISOString()
                };
                
                this.isTracking = true;
                this.notifyListeners('locationUpdate', this.currentPosition);
                console.log('📍 GPS Updated:', this.currentPosition);
            },
            (error) => {
                console.error('❌ GPS Error:', error.message);
                this.startSimulatedTracking();
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000
            }
        );

        // Start bus simulation
        this.startBusSimulation();
    }

    // ============================================
    // SIMULATED TRACKING (Fallback)
    // ============================================
    startSimulatedTracking() {
        console.log('🔄 Starting simulated GPS tracking');
        
        // Simulate GPS updates every 2 seconds
        this.updateInterval = setInterval(() => {
            // Move buses slightly
            Object.keys(this.busLocations).forEach(busName => {
                const bus = this.busLocations[busName];
                bus.lat += (Math.random() - 0.5) * 0.0005;
                bus.lng += (Math.random() - 0.5) * 0.0005;
                bus.timestamp = new Date().toISOString();
                bus.speed = 15 + Math.random() * 35;
                bus.passengers = Math.floor(20 + Math.random() * 40);
            });
            
            this.isTracking = true;
            this.notifyListeners('simulationUpdate', this.busLocations);
        }, 2000);
    }

    // ============================================
    // BUS SIMULATION
    // ============================================
    startBusSimulation() {
        // Update bus positions every 3 seconds
        setInterval(() => {
            Object.keys(this.busLocations).forEach(busName => {
                const bus = this.busLocations[busName];
                // Random movement
                bus.lat += (Math.random() - 0.5) * 0.0008;
                bus.lng += (Math.random() - 0.5) * 0.0008;
                bus.timestamp = new Date().toISOString();
                bus.heading = (bus.heading + (Math.random() - 0.5) * 20) % 360;
            });
        }, 3000);
    }

    // ============================================
    // STOP TRACKING
    // ============================================
    stopTracking() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        this.isTracking = false;
        console.log('⏹️ GPS Tracking Stopped');
    }

    // ============================================
    // GET BUS LOCATION
    // ============================================
    getBusLocation(busName) {
        return this.busLocations[busName] || null;
    }

    // ============================================
    // GET ALL BUS LOCATIONS
    // ============================================
    getAllBusLocations() {
        return this.busLocations;
    }

    // ============================================
    // GET NEARBY BUSES
    // ============================================
    getNearbyBuses(lat, lng, radius = 5) {
        const nearby = [];
        const radiusInKm = radius;
        
        Object.keys(this.busLocations).forEach(busName => {
            const bus = this.busLocations[busName];
            const distance = this.calculateDistance(lat, lng, bus.lat, bus.lng);
            if (distance <= radiusInKm) {
                nearby.push({
                    name: busName,
                    ...bus,
                    distance: distance
                });
            }
        });
        
        return nearby.sort((a, b) => a.distance - b.distance);
    }

    // ============================================
    // CALCULATE DISTANCE (Haversine Formula)
    // ============================================
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRad(deg) {
        return deg * (Math.PI / 180);
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    addListener(callback) {
        this.listeners.push(callback);
    }

    notifyListeners(event, data) {
        this.listeners.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Listener error:', error);
            }
        });
    }

    // ============================================
    // ETA CALCULATION
    // ============================================
    calculateETA(busName, destinationLat, destinationLng) {
        const bus = this.busLocations[busName];
        if (!bus) return null;

        const distance = this.calculateDistance(
            bus.lat, bus.lng,
            destinationLat, destinationLng
        );
        
        const speed = bus.speed || 30; // km/h
        const timeInHours = distance / speed;
        const timeInMinutes = timeInHours * 60;
        
        return {
            distance: Math.round(distance * 10) / 10,
            duration: Math.round(timeInMinutes),
            arrival: new Date(Date.now() + timeInMinutes * 60000).toLocaleTimeString()
        };
    }

    // ============================================
    // UPDATE BUS STATUS
    // ============================================
    updateBusStatus(busName, status) {
        if (this.busLocations[busName]) {
            this.busLocations[busName].status = status;
            this.notifyListeners('statusUpdate', {
                busName,
                status,
                timestamp: new Date().toISOString()
            });
        }
    }

    // ============================================
    // ROUTE PROGRESS
    // ============================================
    calculateRouteProgress(busName, stops) {
        const bus = this.busLocations[busName];
        if (!bus || !stops || stops.length < 2) return null;

        let totalDistance = 0;
        let traveledDistance = 0;
        let currentStopIndex = 0;

        // Calculate total route distance
        for (let i = 0; i < stops.length - 1; i++) {
            totalDistance += this.calculateDistance(
                stops[i].lat, stops[i].lng,
                stops[i + 1].lat, stops[i + 1].lng
            );
        }

        // Calculate traveled distance
        for (let i = 0; i < stops.length - 1; i++) {
            const distToNextStop = this.calculateDistance(
                bus.lat, bus.lng,
                stops[i + 1].lat, stops[i + 1].lng
            );
            
            if (distToNextStop < 0.5) {
                currentStopIndex = i + 1;
            }
            
            traveledDistance += distToNextStop;
        }

        const progress = Math.min((traveledDistance / totalDistance) * 100, 100);

        return {
            progress: Math.round(progress),
            currentStop: currentStopIndex < stops.length ? stops[currentStopIndex].name : stops[stops.length - 1].name,
            nextStop: currentStopIndex + 1 < stops.length ? stops[currentStopIndex + 1].name : 'Destination',
            totalStops: stops.length
        };
    }
}

// ============================================
// CREATE GLOBAL INSTANCE
// ============================================
const gpsTracker = new GPSTracker();

// ============================================
// EXPORT FOR USE IN OTHER FILES
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = gpsTracker;
}

console.log('📍 GPS Tracker System Loaded');
console.log(`🚍 Tracking ${Object.keys(gpsTracker.busLocations).length} buses`);