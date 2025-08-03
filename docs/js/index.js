// docs/js/index.js - Modern SilverConnect Landing Page

// Modern Page Initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeModernFeatures();
    initializeAnimations();
    initializeAuthenticationDisplay();
    initializeMedicationReminders();
    initializeLanguageSwitcher();
    
    // Hide loading animation after page loads
    setTimeout(() => {
        const loader = document.getElementById('loader-overlay');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    }, 1500);
});

// Modern Authentication Display
function initializeAuthenticationDisplay() {
    const authArea = document.getElementById('navbarAuthArea');
    const token = sessionStorage.getItem('authToken');
    
    if (token && authArea) {
        // User is logged in - show modern profile menu
        authArea.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-modern-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle me-1"></i>
                    <span id="username-display">My Account</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="user-settings.html">
                        <i class="bi bi-gear me-2"></i>Settings
                    </a></li>
                    <li><a class="dropdown-item" href="medication.html">
                        <i class="bi bi-capsule me-2"></i>My Medications
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="modernLogout()">
                        <i class="bi bi-box-arrow-right me-2"></i>Sign Out
                    </a></li>
                </ul>
            </div>
        `;
        
        // Fetch and display username
        fetchUserProfile();
    } else {
        // User not logged in - show modern auth buttons
        authArea.innerHTML = `
            <div class="d-flex gap-2">
                <a href="user-login.html" class="btn btn-modern-outline btn-sm">
                    <i class="bi bi-box-arrow-in-right me-1"></i>Sign In
                </a>
                <a href="user-registration.html" class="btn btn-modern-primary btn-sm">
                    <i class="bi bi-person-plus me-1"></i>Join Now
                </a>
            </div>
        `;
    }
}

// Modern Logout Function
function modernLogout() {
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('authToken');
    
    // Show modern notification
    showModernToast('Signed out successfully', 'success');
    
    // Redirect after brief delay
    setTimeout(() => {
        window.location.href = 'user-login.html';
    }, 1000);
}

// Fetch User Profile for Modern Display
async function fetchUserProfile() {
    const token = sessionStorage.getItem('authToken');
    if (!token) return;
    
    try {
        const response = await fetch('/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const profile = await response.json();
            const usernameDisplay = document.getElementById('username-display');
            if (usernameDisplay && profile.username) {
                usernameDisplay.textContent = profile.username;
            }
        }
    } catch (error) {
        console.log('Profile fetch failed:', error);
    }
}

// Modern Animation Initialization
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-up');
            }
        });
    }, observerOptions);
    
    // Observe all feature cards and sections
    document.querySelectorAll('.modern-feature-card, .glass-card').forEach(el => {
        observer.observe(el);
    });
    
    // Modern parallax effect for hero section
    initializeModernParallax();
}

// Modern Parallax Effect
function initializeModernParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-section');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Modern Feature Interactions
function initializeModernFeatures() {
    // Add modern hover effects to feature cards
    document.querySelectorAll('.modern-feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Modern button interactions
    document.querySelectorAll('.btn-modern-primary, .btn-modern-secondary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            createRippleEffect(e, this);
        });
    });
}

// Modern Ripple Effect
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Modern Toast Notifications
function showModernToast(message, type = 'info') {
    const toastContainer = getOrCreateToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'} border-0`;
    toast.setAttribute('role', 'alert');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Auto remove after hide
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

function getOrCreateToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '1055';
        document.body.appendChild(container);
    }
    return container;
}

// Modern Language Switcher Initialization
function initializeLanguageSwitcher() {
    // Initialize the language switcher if available
    if (typeof initializeSimpleLanguageSwitcher === 'function') {
        initializeSimpleLanguageSwitcher();
    }
}

// Modern Medication Reminders (Enhanced)
function initializeMedicationReminders() {
    // Request notification permission with modern UI
    if ("Notification" in window && Notification.permission !== "granted") {
        showNotificationPermissionRequest();
    }
    
    // Start checking reminders every 30 seconds
    setInterval(checkMedicationReminders, 30000);
}

function showNotificationPermissionRequest() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content glass-card">
                <div class="modal-header border-0">
                    <h5 class="modal-title text-gradient">
                        <i class="bi bi-bell me-2"></i>Enable Notifications
                    </h5>
                </div>
                <div class="modal-body">
                    <p>Stay on top of your health with smart medication reminders. We'll notify you when it's time for your next dose.</p>
                    <div class="d-flex gap-2 justify-content-end">
                        <button type="button" class="btn btn-modern-outline" data-bs-dismiss="modal">Maybe Later</button>
                        <button type="button" class="btn btn-modern-primary" onclick="requestNotificationPermission()">Enable Notifications</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', () => modal.remove());
}

function requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            showModernToast('Notifications enabled successfully!', 'success');
        }
    });
}

// Track notified medication keys per minute
let notifiedThisMinute = new Set();

// Enhanced Medication Reminder Check
async function checkMedicationReminders() {
    const token = sessionStorage.getItem('authToken');
    if (!token) return;

    try {
        const response = await fetch("/api/medication-records", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) return;

        const medications = await response.json();
        const now = new Date();
        now.setSeconds(0, 0);

        medications.forEach(med => {
            (med.doseTimes || []).forEach((doseISO, i) => {
                const [hh, mm] = doseISO.substring(11, 16).split(":");
                const doseTime = new Date(now);
                doseTime.setHours(parseInt(hh), parseInt(mm), 0, 0);

                const enabled = !!med.reminderEnabledFlags?.[i];
                const taken = !!med.doseTakenFlags?.[i];
                const key = `${med.medicationId}-${i}-${now.getTime()}`;

                if (enabled && !taken && 
                    now.getTime() === doseTime.getTime() && 
                    !notifiedThisMinute.has(key)) {
                    
                    sendModernNotification(med.medicationName, doseTime);
                    notifiedThisMinute.add(key);
                }
            });
        });

        // Clear notification tracking every minute
        setTimeout(() => notifiedThisMinute.clear(), 60000);

    } catch (error) {
        console.log('Reminder check failed:', error);
    }
}

// Modern Notification System
function sendModernNotification(medicationName, doseTime) {
    const timeStr = doseTime.toTimeString().substring(0, 5);
    
    if (Notification.permission === "granted") {
        const notification = new Notification(`💊 Medication Reminder`, {
            body: `Time to take ${medicationName} at ${timeStr}`,
            icon: 'assets/capsule.png',
            badge: 'assets/capsule.png',
            tag: 'medication-reminder',
            requireInteraction: true
        });
        
        notification.onclick = () => {
            window.focus();
            window.location.href = 'medication.html';
            notification.close();
        };
    }
    
    // Also show in-app notification
    showModernToast(`Time to take ${medicationName}!`, 'info');
}

// Add modern CSS animations
const modernStyles = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = modernStyles;
document.head.appendChild(styleSheet);

// Triggering notification for a medication
function showReminderNotification(medName, time) {
  const message = `It's ${time}. Time to take: ${medName}`;

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Medication Reminder", { body: message });
  } else {
    alert(message); // fallback if browser notifications blocked
  }
}

// DoseTime medication reminder checker
document.addEventListener("DOMContentLoaded", () => {
  checkMedicationReminders(); // run immediately on load
  setInterval(checkMedicationReminders, 20000); // then every 20s

  // Initialize i18n first
  setTimeout(() => {
    updateNavbarAuth();
  }, 100);
});

// Function to update navbar authentication area with i18n support
function updateNavbarAuth() {
  const authArea = document.getElementById("navbarAuthArea");
  const savedUsername = sessionStorage.getItem("username");

  if (authArea) {
    if (savedUsername) {
      authArea.innerHTML = `
        <a href="user-settings.html" class="btn btn-colour d-flex align-items-center gap-2 px-3 py-2">
          <i class="bi bi-person-circle fs-5"></i>
          <span id="navbarUsername">${savedUsername}</span>
        </a>
      `;
    } else {
      authArea.innerHTML = `
        <a href="user-login.html" class="btn btn-colour ms-3 login-btn" data-i18n="nav.login">Log In</a>
        <a href="user-registration.html" class="btn btn-colour ms-3 register-btn" data-i18n="nav.register">Register</a>
      `;
      
      // Apply translations to new elements if i18n is available
      if (window.i18n) {
        window.i18n.applyTranslations();
      }
    }
  }
}


// Lottie Animation For Loading for ALL html pages
window.addEventListener("load", function () {
  const loaderOverlay = document.getElementById("loader-overlay");
  setTimeout(() => {
    loaderOverlay.style.opacity = "0";
    setTimeout(() => {
      loaderOverlay.style.display = "none";
    }, 500); // fade-out duration for lottie animation
  }, 600); // Show for 0.6s before fade out
});
