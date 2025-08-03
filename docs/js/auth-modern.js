// Modern Authentication JavaScript
// Enhanced interactions for login and registration pages

document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication interactions
    initPasswordToggle();
    initFormAnimations();
    initFormValidation();
    initLoadingAnimation();
    
    // Add ripple effect to buttons
    addRippleEffect();
});

// Password visibility toggle
function initPasswordToggle() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordField = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.className = 'bi bi-eye';
                this.setAttribute('aria-label', 'Hide password');
            } else {
                passwordField.type = 'password';
                icon.className = 'bi bi-eye-slash';
                this.setAttribute('aria-label', 'Show password');
            }
            
            // Add visual feedback
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Form input animations and interactions
function initFormAnimations() {
    const inputs = document.querySelectorAll('.form-control-modern');
    
    inputs.forEach(input => {
        // Add focus animations
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            const icon = this.parentElement.querySelector('.input-icon');
            if (icon) {
                icon.style.color = '#667eea';
                icon.style.transform = 'scale(1.1)';
            }
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            const icon = this.parentElement.querySelector('.input-icon');
            if (icon) {
                icon.style.color = '';
                icon.style.transform = 'scale(1)';
            }
        });
        
        // Add typing animation
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.classList.add('has-content');
            } else {
                this.classList.remove('has-content');
            }
        });
    });
}

// Enhanced form validation
function initFormValidation() {
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        const submitButton = form.querySelector('.btn-auth-primary');
        const inputs = form.querySelectorAll('.form-control-modern');
        
        // Real-time validation feedback
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
        
        // Form submission handling
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            showButtonLoading(submitButton);
            
            // Validate all fields
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField({ target: input })) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Simulate form submission
                setTimeout(() => {
                    showSuccess('Form submitted successfully!');
                    hideButtonLoading(submitButton);
                }, 2000);
            } else {
                hideButtonLoading(submitButton);
                showError('Please correct the errors above.');
            }
        });
    });
}

// Field validation function
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldId = field.id;
    
    // Remove existing error states
    clearFieldError({ target: field });
    
    // Validation rules
    let isValid = true;
    let errorMessage = '';
    
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    } else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    } else if (fieldId === 'password' && value) {
        if (value.length < 8) {
            isValid = false;
            errorMessage = 'Password must be at least 8 characters long.';
        }
    } else if (fieldId === 'username' && value) {
        if (value.length > 50) {
            isValid = false;
            errorMessage = 'Username must be 50 characters or less.';
        }
    }
    
    // Show error state
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.style.borderColor = '#f56565';
    field.style.boxShadow = '0 0 0 3px rgba(245, 101, 101, 0.1)';
    
    // Create or update error message
    let errorDiv = field.parentElement.querySelector('.field-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #c53030;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            animation: slideDown 0.3s ease;
        `;
        field.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

// Clear field error
function clearFieldError(event) {
    const field = event.target;
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Button loading states
function showButtonLoading(button) {
    const originalText = button.innerHTML;
    button.setAttribute('data-original', originalText);
    button.innerHTML = `
        <span class="spinner"></span>
        <span>Processing...</span>
    `;
    button.disabled = true;
    button.style.opacity = '0.8';
    
    // Add spinner styles
    const style = document.createElement('style');
    style.textContent = `
        .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 0.5rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

function hideButtonLoading(button) {
    const originalText = button.getAttribute('data-original');
    if (originalText) {
        button.innerHTML = originalText;
    }
    button.disabled = false;
    button.style.opacity = '1';
}

// Alert functions
function showSuccess(message) {
    showAlert(message, 'success');
}

function showError(message) {
    showAlert(message, 'danger');
}

function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    if (alertBox) {
        alertBox.className = `alert-modern alert-${type}`;
        alertBox.textContent = message;
        alertBox.classList.remove('d-none');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            alertBox.classList.add('d-none');
        }, 5000);
    }
}

// Ripple effect for buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn-auth-primary');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Loading animation
function initLoadingAnimation() {
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader-overlay');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 300);
            }, 800);
        }
    });
}

// Smooth scroll for auth links
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('auth-link')) {
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }
});

// Add keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('form-control-modern')) {
        const form = e.target.closest('form');
        const inputs = Array.from(form.querySelectorAll('.form-control-modern'));
        const currentIndex = inputs.indexOf(e.target);
        
        if (currentIndex < inputs.length - 1) {
            e.preventDefault();
            inputs[currentIndex + 1].focus();
        }
    }
});

// Add modern toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `auth-toast auth-toast-${type}`;
    toast.innerHTML = `
        <div class="auth-toast-content">
            <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add toast styles
    toast.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        border-left: 4px solid ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea'};
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// Export functions for external use
window.authUtils = {
    showToast,
    showSuccess,
    showError,
    showAlert
};
