// Enhanced Notification System for SilverConnect
// Handles browser notifications for medication reminders (Backend Only)

class NotificationManager {
    constructor() {
        console.log('NotificationManager: Initializing...');
        this.isSupported = 'Notification' in window;
        this.permission = this.isSupported ? Notification.permission : 'denied';
        this.settings = this.loadSettings();
        console.log('NotificationManager: Permission status:', this.permission);
        console.log('NotificationManager: Browser support:', this.isSupported);
        this.initialize();
    }

    initialize() {
        if (!this.isSupported) {
            console.warn('Browser notifications not supported');
            return;
        }

        // Completely disable auto permission requests
        console.log('NotificationManager: Auto-permission requests disabled');
    }

    isUserLoggedIn() {
        return !!sessionStorage.getItem('authToken');
    }

    loadSettings() {
        const saved = localStorage.getItem('notificationSettings');
        return saved ? JSON.parse(saved) : {
            enabled: true,
            medicationReminders: true,
            appointmentReminders: true,
            lowStockAlerts: true,
            sound: true,
            quietHours: {
                enabled: false,
                start: '22:00',
                end: '07:00'
            }
        };
    }

    saveSettings() {
        localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
    }

    async requestPermission() {
        console.log('NotificationManager: Requesting permission...');
        if (!this.isSupported) {
            console.log('NotificationManager: Browser notifications not supported');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            console.log('NotificationManager: Permission result:', permission);
            
            if (permission === 'granted') {
                console.log('NotificationManager: Permission granted');
                return true;
            } else {
                console.log('NotificationManager: Permission denied');
                return false;
            }
        } catch (error) {
            console.error('NotificationManager: Error requesting permission:', error);
            return false;
        }
    }

    sendNotification(title, options = {}) {
        if (!this.canSendNotification()) return null;

        // Check quiet hours
        if (this.isQuietTime()) return null;

        const defaultOptions = {
            icon: 'assets/capsule.png',
            badge: 'assets/capsule.png',
            requireInteraction: false,
            silent: !this.settings.sound
        };

        const finalOptions = { ...defaultOptions, ...options };
        
        try {
            const notification = new Notification(title, finalOptions);
            
            // Auto-close after 10 seconds if not requiring interaction
            if (!finalOptions.requireInteraction) {
                setTimeout(() => notification.close(), 10000);
            }
            
            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            return null;
        }
    }

    sendMedicationReminder(medicationName, doseTime) {
        if (!this.settings.medicationReminders) return null;

        const timeStr = doseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const notification = this.sendNotification('💊 Medication Reminder', {
            body: `Time to take ${medicationName} at ${timeStr}`,
            tag: `medication-${medicationName}`,
            requireInteraction: true,
            actions: [
                { action: 'taken', title: 'Mark as Taken' },
                { action: 'snooze', title: 'Remind in 5 min' }
            ]
        });

        if (notification) {
            notification.onclick = () => {
                window.focus();
                window.location.href = 'medication.html';
                notification.close();
            };
        }

        return notification;
    }

    sendAppointmentReminder(appointmentDetails) {
        if (!this.settings.appointmentReminders) return null;

        return this.sendNotification('📅 Appointment Reminder', {
            body: `You have an appointment with ${appointmentDetails.doctor} in 30 minutes`,
            tag: `appointment-${appointmentDetails.id}`,
            requireInteraction: true
        });
    }

    sendLowStockAlert(medicationName, remainingCount) {
        if (!this.settings.lowStockAlerts) return null;

        return this.sendNotification('⚠️ Low Stock Alert', {
            body: `${medicationName} is running low. Only ${remainingCount} remaining.`,
            tag: `lowstock-${medicationName}`,
            requireInteraction: false
        });
    }

    canSendNotification() {
        return this.isSupported && 
               this.permission === 'granted' && 
               this.settings.enabled &&
               this.isUserLoggedIn();
    }

    isQuietTime() {
        if (!this.settings.quietHours.enabled) return false;

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const [startHour, startMin] = this.settings.quietHours.start.split(':').map(Number);
        const [endHour, endMin] = this.settings.quietHours.end.split(':').map(Number);
        
        const startTime = startHour * 60 + startMin;
        const endTime = endHour * 60 + endMin;

        if (startTime < endTime) {
            // Same day quiet hours (e.g., 22:00 to 23:00)
            return currentTime >= startTime && currentTime <= endTime;
        } else {
            // Overnight quiet hours (e.g., 22:00 to 07:00)
            return currentTime >= startTime || currentTime <= endTime;
        }
    }

    // Test notification function
    sendTestNotification() {
        return this.sendNotification('Test Notification', {
            body: 'This is a test notification from SilverConnect',
            tag: 'test'
        });
    }
}

// Initialize notification manager globally
console.log('Loading NotificationManager...');
window.notificationManager = new NotificationManager();
console.log('NotificationManager loaded and available as window.notificationManager');
