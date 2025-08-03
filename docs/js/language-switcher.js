// Language Switcher Component for SilverConnect
class LanguageSwitcher {
    constructor() {
        this.currentLanguage = 'en';
        this.init();
    }

    init() {
        this.createLanguageToggle();
        this.bindEvents();
        
        // Listen for language changes
        window.addEventListener('languageChanged', (event) => {
            this.currentLanguage = event.detail.language;
            this.updateToggleState();
        });
    }

    createLanguageToggle() {
        // Find the navbar auth area
        const navbarAuthArea = document.getElementById('navbarAuthArea');
        if (!navbarAuthArea) return;

        // Create language toggle button
        const languageToggle = document.createElement('div');
        languageToggle.className = 'nav-item dropdown me-3';
        languageToggle.innerHTML = `
            <button class="btn btn-outline-primary dropdown-toggle" type="button" id="languageDropdown" 
                    data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-translate me-1"></i>
                <span id="currentLanguageText">English</span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="languageDropdown">
                <li>
                    <a class="dropdown-item language-option" href="#" data-language="en">
                        <i class="bi bi-check-circle me-2 language-check d-none"></i>
                        English
                    </a>
                </li>
                <li>
                    <a class="dropdown-item language-option" href="#" data-language="zh">
                        <i class="bi bi-check-circle me-2 language-check d-none"></i>
                        中文 (Chinese)
                    </a>
                </li>
            </ul>
        `;

        // Insert before the auth buttons
        navbarAuthArea.insertBefore(languageToggle, navbarAuthArea.firstChild);
        
        // Update initial state
        this.updateToggleState();
    }

    bindEvents() {
        // Handle language selection
        document.addEventListener('click', async (event) => {
            if (event.target.classList.contains('language-option') || 
                event.target.closest('.language-option')) {
                
                event.preventDefault();
                
                const option = event.target.closest('.language-option');
                const selectedLanguage = option.getAttribute('data-language');
                
                if (selectedLanguage && selectedLanguage !== this.currentLanguage) {
                    await this.switchLanguage(selectedLanguage);
                }
            }
        });
    }

    async switchLanguage(languageCode) {
        try {
            // Show loading state
            this.setLoadingState(true);
            
            // Switch language using i18n manager
            const success = await window.i18n.switchLanguage(languageCode);
            
            if (success) {
                this.currentLanguage = languageCode;
                this.updateToggleState();
                
                // Show success message
                this.showLanguageChangeMessage(languageCode);
                
                // Refresh dynamic content on current page
                this.refreshPageContent();
                
            } else {
                throw new Error('Failed to switch language');
            }
        } catch (error) {
            console.error('Error switching language:', error);
            this.showErrorMessage();
        } finally {
            this.setLoadingState(false);
        }
    }

    updateToggleState() {
        // Update current language text
        const currentLanguageText = document.getElementById('currentLanguageText');
        if (currentLanguageText) {
            const languageNames = {
                'en': 'English',
                'zh': '中文'
            };
            currentLanguageText.textContent = languageNames[this.currentLanguage] || 'English';
        }

        // Update check marks
        const languageChecks = document.querySelectorAll('.language-check');
        languageChecks.forEach(check => {
            const option = check.closest('.language-option');
            const language = option.getAttribute('data-language');
            
            if (language === this.currentLanguage) {
                check.classList.remove('d-none');
            } else {
                check.classList.add('d-none');
            }
        });
    }

    setLoadingState(isLoading) {
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            if (isLoading) {
                dropdown.disabled = true;
                dropdown.innerHTML = '<i class="bi bi-translate me-1"></i><span class="spinner-border spinner-border-sm me-1"></span>Loading...';
            } else {
                dropdown.disabled = false;
                dropdown.innerHTML = '<i class="bi bi-translate me-1"></i><span id="currentLanguageText">English</span>';
                this.updateToggleState();
            }
        }
    }

    showLanguageChangeMessage(languageCode) {
        const message = languageCode === 'zh' ? '语言已切换到中文' : 'Language switched to English';
        
        // Create temporary toast notification
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    showErrorMessage() {
        const message = this.currentLanguage === 'zh' ? '语言切换失败，请重试' : 'Failed to switch language, please try again';
        
        const toast = document.createElement('div');
        toast.className = 'toast-notification error';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    refreshPageContent() {
        // Trigger refresh for page-specific content
        const event = new CustomEvent('refreshPageContent');
        window.dispatchEvent(event);
        
        // Refresh forms and dynamic content
        this.refreshForms();
        this.refreshModals();
        this.refreshDataTables();
    }

    refreshForms() {
        // Update form labels and placeholders
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const labels = form.querySelectorAll('label[for]');
            labels.forEach(label => {
                if (label.hasAttribute('data-i18n')) {
                    const key = label.getAttribute('data-i18n');
                    label.textContent = window.t(key);
                }
            });

            const inputs = form.querySelectorAll('input[placeholder], textarea[placeholder]');
            inputs.forEach(input => {
                if (input.hasAttribute('data-i18n-placeholder')) {
                    const key = input.getAttribute('data-i18n-placeholder');
                    input.placeholder = window.t(key);
                }
            });
        });
    }

    refreshModals() {
        // Update modal titles and content
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const title = modal.querySelector('.modal-title[data-i18n]');
            if (title) {
                const key = title.getAttribute('data-i18n');
                title.textContent = window.t(key);
            }

            const buttons = modal.querySelectorAll('button[data-i18n]');
            buttons.forEach(button => {
                const key = button.getAttribute('data-i18n');
                button.textContent = window.t(key);
            });
        });
    }

    refreshDataTables() {
        // Update table headers and data if using data tables
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            const headers = table.querySelectorAll('th[data-i18n]');
            headers.forEach(header => {
                const key = header.getAttribute('data-i18n');
                header.textContent = window.t(key);
            });
        });
    }
}

// Initialize language switcher when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for i18n to be ready
    if (window.i18n) {
        new LanguageSwitcher();
    } else {
        // Wait for i18n to load
        const checkI18n = setInterval(() => {
            if (window.i18n) {
                clearInterval(checkI18n);
                new LanguageSwitcher();
            }
        }, 100);
    }
});
