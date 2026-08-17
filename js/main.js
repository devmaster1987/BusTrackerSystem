// ============================================
// MAIN APPLICATION - LANDING PAGE LOGIC
// ============================================

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚍 BusTracker Platform Loaded');
    console.log('📱 Version: 1.0.0');
    console.log('📅 ' + new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }));
    
    initSmoothScroll();
    initCounterAnimation();
    initMobileMenu();
    initFeatureCards();
    initNewsletterSignup();
    initBackToTop();
});

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (targetId === '#' || !targetId) return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without causing scroll
                history.pushState(null, null, targetId);
            }
        });
    });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text.replace(/[^0-9.]/g, ''));
                const suffix = text.replace(/[0-9.]/g, '');
                
                if (!isNaN(number)) {
                    animateCounter(target, number, suffix);
                }
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target, suffix) {
    let current = 0;
    const increment = Math.ceil(target / 60); // 60 frames
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const stepTime = duration / steps;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current + suffix;
    }, stepTime);
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function initMobileMenu() {
    // Create mobile menu button if it doesn't exist
    const nav = document.querySelector('.nav-container');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!nav || !navMenu) return;
    
    // Check if mobile menu button already exists
    let menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!menuBtn) {
        // Create mobile menu button
        menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.setAttribute('aria-label', 'Toggle menu');
        
        // Insert before nav actions
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            nav.insertBefore(menuBtn, navActions);
        } else {
            nav.appendChild(menuBtn);
        }
    }
    
    // Toggle menu on button click
    menuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('open');
        const icon = this.querySelector('i');
        if (icon) {
            icon.className = navMenu.classList.contains('open') 
                ? 'fas fa-times' 
                : 'fas fa-bars';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }
    });
    
    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('open');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        });
    });
}

// ============================================
// FEATURE CARDS ANIMATION
// ============================================
function initFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    
    if (cards.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });
}

// ============================================
// NEWSLETTER SIGNUP
// ============================================
function initNewsletterSignup() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const input = this.querySelector('input[type="email"]');
        if (input && input.value) {
            alert(`✅ Thank you for subscribing with: ${input.value}\n\nYou'll receive updates about BusTracker!`);
            input.value = '';
        } else {
            alert('⚠️ Please enter a valid email address.');
        }
    });
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
function initBackToTop() {
    // Create back to top button if it doesn't exist
    let btn = document.querySelector('.back-to-top');
    
    if (!btn) {
        btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        btn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(btn);
        
        // Style the button
        btn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #0f4c81 0%, #1a7a5a 100%);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 20px;
            box-shadow: 0 4px 16px rgba(15, 76, 129, 0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: translateY(20px);
            z-index: 999;
        `;
        
        btn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Show/hide button based on scroll position
    let isVisible = false;
    
    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollY > 400 && !isVisible) {
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
            isVisible = true;
        } else if (scrollY <= 400 && isVisible) {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(20px)';
            isVisible = false;
        }
    });
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbarEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let isScrolled = false;
    
    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollY > 50 && !isScrolled) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            isScrolled = true;
        } else if (scrollY <= 50 && isScrolled) {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'rgba(255, 255, 255, 0.85)';
            isScrolled = false;
        }
    });
}

// ============================================
// TYPING ANIMATION FOR HERO
// ============================================
function initTypingEffect() {
    const element = document.querySelector('.typing-text');
    if (!element) return;
    
    const phrases = [
        'Smart Bus Transport Tracker',
        'Real-time Bus Tracking',
        'Digital Ticket Booking',
        'Smart Public Transport'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                isWaiting = true;
                setTimeout(() => {
                    isWaiting = false;
                    type();
                }, 500);
                return;
            }
            
            setTimeout(type, 50);
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
            
            setTimeout(type, 100);
        }
    }
    
    // Start typing after a short delay
    setTimeout(type, 1000);
}

// ============================================
// PARALLAX EFFECT FOR HERO
// ============================================
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const rate = scrollY * 0.3;
        
        const visual = hero.querySelector('.hero-visual');
        if (visual) {
            visual.style.transform = `translateY(${rate * 0.1}px)`;
        }
        
        const content = hero.querySelector('.hero-content');
        if (content) {
            content.style.transform = `translateY(${rate * 0.05}px)`;
        }
    });
}

// ============================================
// ACTIVE NAV LINK HIGHLIGHT
// ============================================
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================
// PREVENT DEFAULT FOR EMPTY LINKS
// ============================================
function initEmptyLinks() {
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
}

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
function showWelcomeMessage() {
    console.log('%c🚍 BusTracker Platform', 'font-size: 24px; font-weight: bold; color: #1a7a5a;');
    console.log('%cSmart Public Transport System', 'font-size: 14px; color: #6b7280;');
    console.log('%c📱 Passenger App: passenger.html', 'font-size: 12px; color: #0f4c81;');
    console.log('%c🚗 Driver App: driver.html', 'font-size: 12px; color: #0f4c81;');
    console.log('%c👨‍💼 Admin Dashboard: admin.html', 'font-size: 12px; color: #0f4c81;');
    console.log('%c🔑 Driver Test Credentials: DRV-001 / driver123', 'font-size: 12px; color: #dc2626;');
}

// ============================================
// PERFORMANCE MONITORING
// ============================================
function initPerformanceMonitoring() {
    if (window.performance) {
        const perfData = window.performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⏱️ Page Load Time: ${loadTime}ms`);
    }
}

// ============================================
// INITIALIZE ALL
// ============================================
function init() {
    showWelcomeMessage();
    initPerformanceMonitoring();
    initNavbarEffect();
    initSmoothScroll();
    initCounterAnimation();
    initMobileMenu();
    initFeatureCards();
    initNewsletterSignup();
    initBackToTop();
    initTypingEffect();
    initParallax();
    initActiveNavLink();
    initEmptyLinks();
}

// Run on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================
window.init = init;

// ============================================
// SERVICE WORKER REGISTRATION (PWA Ready)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to register service worker for PWA
        // navigator.serviceWorker.register('/sw.js').then(function(registration) {
        //     console.log('✅ ServiceWorker registration successful');
        // }).catch(function(err) {
        //     console.log('❌ ServiceWorker registration failed: ', err);
        // });
    });
}

console.log('✅ main.js loaded successfully!');