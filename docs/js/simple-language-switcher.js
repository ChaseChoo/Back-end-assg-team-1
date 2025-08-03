// Simple Language Switcher for SilverConnect
class SimpleLanguageSwitcher {
    constructor() {
        this.currentLanguage = 'en';
        this.init();
    }

    init() {
        // Create language switcher in the navigation
        this.createLanguageSwitcher();
        
        // Get saved language preference
        const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
        this.currentLanguage = savedLanguage;
    }

    createLanguageSwitcher() {
        // Find the navigation auth area or navbar-nav
        let navTarget = document.getElementById('navbarAuthArea');
        
        // If no auth area, try to add to the main navbar-nav
        if (!navTarget) {
            const navbarNav = document.querySelector('.navbar-nav');
            if (navbarNav) {
                // Create a nav item for the language switcher
                const navItem = document.createElement('li');
                navItem.className = 'nav-item';
                navItem.id = 'navbarAuthArea';
                navbarNav.appendChild(navItem);
                navTarget = navItem;
            }
        }
        
        if (!navTarget) {
            console.warn('Could not find navigation area for language switcher');
            return;
        }

        // Create language switcher dropdown
        const languageSwitcher = document.createElement('div');
        languageSwitcher.className = 'dropdown me-3';
        languageSwitcher.innerHTML = `
            <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-globe me-1"></i>
                <span id="currentLanguageText">${this.currentLanguage === 'zh' ? '中文' : 'English'}</span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="languageDropdown">
                <li><a class="dropdown-item" href="#" onclick="languageSwitcher.switchLanguage('en')">
                    <i class="bi bi-check ${this.currentLanguage === 'en' ? '' : 'invisible'} me-2"></i>English
                </a></li>
                <li><a class="dropdown-item" href="#" onclick="languageSwitcher.switchLanguage('zh')">
                    <i class="bi bi-check ${this.currentLanguage === 'zh' ? '' : 'invisible'} me-2"></i>中文 (Chinese)
                </a></li>
            </ul>
        `;

        // Insert language switcher at the beginning of auth area
        navTarget.insertBefore(languageSwitcher, navTarget.firstChild);
        
        console.log('Language switcher created successfully');
    }

    switchLanguage(language) {
        if (language === this.currentLanguage) return;

        // Show loading indicator
        this.showLoadingToast();

        // Switch language
        this.currentLanguage = language;
        localStorage.setItem('preferredLanguage', language);

        // Update dropdown text
        const currentLanguageText = document.getElementById('currentLanguageText');
        if (currentLanguageText) {
            currentLanguageText.textContent = language === 'zh' ? '中文' : 'English';
        }

        // Update checkmarks
        document.querySelectorAll('#languageDropdown + .dropdown-menu .bi-check').forEach(check => {
            check.classList.add('invisible');
        });
        
        if (language === 'en') {
            document.querySelector('#languageDropdown + .dropdown-menu .dropdown-item:first-child .bi-check').classList.remove('invisible');
        } else {
            document.querySelector('#languageDropdown + .dropdown-menu .dropdown-item:last-child .bi-check').classList.remove('invisible');
        }

        // Apply translation
        if (window.translator) {
            setTimeout(() => {
                window.translator.translatePage(language);
                this.showSuccessToast(language);
            }, 100);
        } else {
            // Fallback: reload page with language parameter
            setTimeout(() => {
                location.reload();
            }, 500);
        }
    }

    showLoadingToast() {
        this.showToast('Switching language...', 'info');
    }

    showSuccessToast(language) {
        const message = language === 'zh' ? 'Language switched to Chinese' : 'Language switched to English';
        this.showToast(message, 'success');
    }

    showToast(message, type = 'info') {
        // Remove existing toasts
        document.querySelectorAll('.language-toast').forEach(toast => toast.remove());

        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast language-toast align-items-center text-white bg-${type === 'success' ? 'success' : 'info'} border-0`;
        toast.setAttribute('role', 'alert');
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.zIndex = '9999';
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;

        document.body.appendChild(toast);

        // Show toast
        const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
        bsToast.show();

        // Remove from DOM after hiding
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}

// Initialize language switcher when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.languageSwitcher = new SimpleLanguageSwitcher();
});
