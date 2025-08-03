// Internationalization (i18n) system for SilverConnect
class I18nManager {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.fallbackLanguage = 'en';
        this.supportedLanguages = ['en', 'zh'];
        
        // Initialize with default language
        this.init();
    }

    async init() {
        try {
            // Get user's preferred language from sessionStorage or API
            const token = sessionStorage.getItem('authToken');
            if (token) {
                await this.loadUserLanguagePreference();
            } else {
                // Check browser language or localStorage as fallback
                const savedLanguage = localStorage.getItem('preferredLanguage');
                const browserLanguage = navigator.language.split('-')[0];
                
                this.currentLanguage = savedLanguage || 
                    (this.supportedLanguages.includes(browserLanguage) ? browserLanguage : this.fallbackLanguage);
            }

            // Load translation files
            await this.loadTranslations();
            
            // Apply translations to current page
            this.applyTranslations();
            
            // Set document language
            document.documentElement.lang = this.currentLanguage;
            
        } catch (error) {
            console.error('Error initializing i18n:', error);
            // Fallback to English
            this.currentLanguage = this.fallbackLanguage;
            await this.loadTranslations();
            this.applyTranslations();
        }
    }

    async loadUserLanguagePreference() {
        try {
            const response = await fetch('/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                this.currentLanguage = userData.languagePreference || this.fallbackLanguage;
            }
        } catch (error) {
            console.log('Could not load user language preference, using default');
        }
    }

    async loadTranslations() {
        try {
            // Load current language translations
            if (!this.translations[this.currentLanguage]) {
                const module = await import(`./translations/${this.currentLanguage}.js`);
                this.translations[this.currentLanguage] = module.default || window[`translations_${this.currentLanguage}`];
            }

            // Load fallback language if different
            if (this.currentLanguage !== this.fallbackLanguage && !this.translations[this.fallbackLanguage]) {
                const fallbackModule = await import(`./translations/${this.fallbackLanguage}.js`);
                this.translations[this.fallbackLanguage] = fallbackModule.default || window[`translations_${this.fallbackLanguage}`];
            }
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    t(key, params = {}) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        // Navigate through the nested object
        for (const k of keys) {
            if (translation && typeof translation === 'object') {
                translation = translation[k];
            } else {
                translation = undefined;
                break;
            }
        }

        // Fallback to default language if translation not found
        if (translation === undefined && this.currentLanguage !== this.fallbackLanguage) {
            let fallbackTranslation = this.translations[this.fallbackLanguage];
            for (const k of keys) {
                if (fallbackTranslation && typeof fallbackTranslation === 'object') {
                    fallbackTranslation = fallbackTranslation[k];
                } else {
                    fallbackTranslation = undefined;
                    break;
                }
            }
            translation = fallbackTranslation;
        }

        // Return the key if no translation found
        if (translation === undefined) {
            console.warn(`Translation missing for key: ${key} in language: ${this.currentLanguage}`);
            return key;
        }

        // Replace parameters in translation
        if (typeof translation === 'string' && Object.keys(params).length > 0) {
            return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
                return params[param] || match;
            });
        }

        return translation;
    }

    async switchLanguage(languageCode) {
        if (!this.supportedLanguages.includes(languageCode)) {
            console.error(`Unsupported language: ${languageCode}`);
            return false;
        }

        try {
            // Update user preference in database if logged in
            const token = sessionStorage.getItem('authToken');
            if (token) {
                await this.updateUserLanguagePreference(languageCode);
            } else {
                // Store in localStorage for non-logged in users
                localStorage.setItem('preferredLanguage', languageCode);
            }

            // Update current language
            this.currentLanguage = languageCode;
            
            // Load new translations if not already loaded
            await this.loadTranslations();
            
            // Apply new translations
            this.applyTranslations();
            
            // Update document language
            document.documentElement.lang = languageCode;
            
            // Trigger custom event for other components to update
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: languageCode } }));
            
            return true;
        } catch (error) {
            console.error('Error switching language:', error);
            return false;
        }
    }

    async updateUserLanguagePreference(languageCode) {
        try {
            const response = await fetch('/api/users/language', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ languagePreference: languageCode })
            });

            if (!response.ok) {
                throw new Error('Failed to update language preference');
            }
        } catch (error) {
            console.error('Error updating user language preference:', error);
            throw error;
        }
    }

    applyTranslations() {
        // Find all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            // Check if we should update text content or placeholder
            if (element.hasAttribute('data-i18n-placeholder')) {
                element.placeholder = translation;
            } else if (element.hasAttribute('data-i18n-title')) {
                element.title = translation;
            } else if (element.hasAttribute('data-i18n-value')) {
                element.value = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update page title if it has data-i18n-title attribute
        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            titleElement.textContent = this.t(titleElement.getAttribute('data-i18n'));
        }

        // Update navigation
        this.updateNavigation();
    }

    updateNavigation() {
        // Update navigation items
        const navItems = {
            'meal-logging.html': this.t('nav.mealLogging'),
            'medication.html': this.t('nav.medicationTracker'),
            'medication-inventory.html': this.t('nav.medicineInventory'),
            'family-management.html': this.t('nav.familySupport'),
            'healthcare-appointments.html': this.t('nav.manageAppointment')
        };

        Object.entries(navItems).forEach(([href, text]) => {
            const link = document.querySelector(`a[href="${href}"]`);
            if (link && !link.hasAttribute('data-i18n')) {
                link.textContent = text;
            }
        });

        // Update auth buttons
        const loginBtn = document.querySelector('.login-btn');
        const registerBtn = document.querySelector('.register-btn');
        const logoutBtn = document.querySelector('.logout-btn');
        const profileBtn = document.querySelector('.profile-btn');

        if (loginBtn && !loginBtn.hasAttribute('data-i18n')) {
            loginBtn.textContent = this.t('nav.login');
        }
        if (registerBtn && !registerBtn.hasAttribute('data-i18n')) {
            registerBtn.textContent = this.t('nav.register');
        }
        if (logoutBtn && !logoutBtn.hasAttribute('data-i18n')) {
            logoutBtn.textContent = this.t('nav.logout');
        }
        if (profileBtn && !profileBtn.hasAttribute('data-i18n')) {
            profileBtn.textContent = this.t('nav.profile');
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    isRTL() {
        // Add RTL language support if needed in the future
        const rtlLanguages = ['ar', 'he', 'ur'];
        return rtlLanguages.includes(this.currentLanguage);
    }
}

// Create global instance
const i18n = new I18nManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18nManager;
}

// Global function for easy access
window.t = (key, params) => i18n.t(key, params);
window.i18n = i18n;
