// Modern Add Medication JavaScript - Enhanced for SilverConnect

document.addEventListener("DOMContentLoaded", () => {
  // Authentication check
  const token = sessionStorage.getItem('authToken');
  if (!token) {
    window.location.href = "user-login.html"; 
    return;
  }

  initializeModernFeatures();
  setupFormValidation();
  setupMedicationAutocomplete();
  setupSupportWidget();
});

// Initialize modern UI features
function initializeModernFeatures() {
  // Set today as minimum date
  const today = new Date().toISOString().split('T')[0];
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  
  if (startDateInput && endDateInput) {
    startDateInput.min = today;
    startDateInput.value = today;
    endDateInput.min = today;
    
    // Update end date minimum when start date changes
    startDateInput.addEventListener("change", () => {
      endDateInput.min = startDateInput.value;
      if (endDateInput.value && endDateInput.value < startDateInput.value) {
        endDateInput.value = startDateInput.value;
      }
    });
  }

  // Add ripple effects to buttons
  document.querySelectorAll('.btn-modern-primary, .btn-modern-choice').forEach(btn => {
    btn.addEventListener('click', function(e) {
      createModernRipple(e, this);
    });
  });

  // Icon selection animation
  document.querySelectorAll('.icon-option input').forEach(radio => {
    radio.addEventListener('change', function() {
      // Remove active state from all options
      document.querySelectorAll('.icon-wrapper').forEach(wrapper => {
        wrapper.classList.remove('selected-icon');
      });
      
      // Add active state to selected option
      if (this.checked) {
        this.nextElementSibling.classList.add('selected-icon');
        createSelectionAnimation(this.nextElementSibling);
      }
    });
  });
}

// Setup form validation and submission
function setupFormValidation() {
  const form = document.getElementById("medicationForm");
  
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      try {
        showLoadingState();
        
        const response = await fetch("/api/add-medication", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          const result = await response.json();
          showSuccessModal(result);
        } else {
          const error = await response.json();
          showErrorMessage(error.error || "Failed to add medication");
        }
      } catch (error) {
        showErrorMessage("Network error. Please try again.");
      } finally {
        hideLoadingState();
      }
    });
  }
}

// Validate form data
function validateForm() {
  const requiredFields = ['iconType', 'medicationName', 'dosage', 'frequency', 'startDate', 'endDate'];
  let isValid = true;
  
  requiredFields.forEach(fieldName => {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field || (field.type === 'radio' && !document.querySelector(`[name="${fieldName}"]:checked`))) {
      isValid = false;
      highlightMissingField(fieldName);
    }
  });
  
  // Validate date range
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    showErrorMessage("End date must be after start date");
    isValid = false;
  }
  
  return isValid;
}

// Setup medication name autocomplete
function setupMedicationAutocomplete() {
  const medicationInput = document.getElementById('medicationName');
  const suggestionsDiv = document.getElementById('medSuggestions');
  
  const commonMedications = [
    'Aspirin', 'Ibuprofen', 'Acetaminophen', 'Metformin', 'Lisinopril',
    'Atorvastatin', 'Amlodipine', 'Metoprolol', 'Omeprazole', 'Simvastatin',
    'Losartan', 'Gabapentin', 'Hydrochlorothiazide', 'Sertraline', 'Furosemide'
  ];
  
  if (medicationInput && suggestionsDiv) {
    medicationInput.addEventListener('input', function() {
      const value = this.value.toLowerCase();
      suggestionsDiv.innerHTML = '';
      
      if (value.length > 1) {
        const matches = commonMedications.filter(med => 
          med.toLowerCase().includes(value)
        );
        
        if (matches.length > 0) {
          suggestionsDiv.style.display = 'block';
          matches.slice(0, 5).forEach(match => {
            const suggestion = document.createElement('div');
            suggestion.className = 'autocomplete-item p-2';
            suggestion.textContent = match;
            suggestion.addEventListener('click', () => {
              medicationInput.value = match;
              suggestionsDiv.style.display = 'none';
            });
            suggestionsDiv.appendChild(suggestion);
          });
        } else {
          suggestionsDiv.style.display = 'none';
        }
      } else {
        suggestionsDiv.style.display = 'none';
      }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!medicationInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
        suggestionsDiv.style.display = 'none';
      }
    });
  }
}

// Setup support widget
function setupSupportWidget() {
  const supportButton = document.getElementById('support-button');
  const supportBox = document.getElementById('support-box');
  const closeSupport = document.getElementById('close-support');
  
  if (supportButton && supportBox) {
    supportButton.addEventListener('click', () => {
      supportBox.classList.toggle('d-none');
    });
    
    if (closeSupport) {
      closeSupport.addEventListener('click', () => {
        supportBox.classList.add('d-none');
      });
    }
  }
}

// Modern ripple effect
function createModernRipple(event, element) {
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

// Selection animation
function createSelectionAnimation(element) {
  element.style.transform = 'scale(1.05)';
  setTimeout(() => {
    element.style.transform = 'scale(1)';
  }, 200);
}

// Show loading state
function showLoadingState() {
  const submitBtn = document.querySelector('[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Adding Medication...';
  }
}

// Hide loading state
function hideLoadingState() {
  const submitBtn = document.querySelector('[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-arrow-right me-2"></i>Continue to Schedule';
  }
}

// Show success modal
function showSuccessModal(result) {
  const modal = new bootstrap.Modal(document.getElementById('successModal'));
  modal.show();
  
  // Set up redirect to schedule page
  document.getElementById('goToSchedule').addEventListener('click', () => {
    window.location.href = `schedule-medication.html?medicationId=${result.medicationId}`;
  });
}

// Show error message
function showErrorMessage(message) {
  const feedback = document.getElementById('formFeedback');
  if (feedback) {
    feedback.innerHTML = `
      <div class="alert alert-danger d-flex align-items-center" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        ${message}
      </div>
    `;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Highlight missing field
function highlightMissingField(fieldName) {
  const field = document.querySelector(`[name="${fieldName}"]`);
  if (field) {
    field.classList.add('is-invalid');
    setTimeout(() => field.classList.remove('is-invalid'), 3000);
  }
}

// Initialize modern toast notifications if not already available
if (typeof showModernToast === 'undefined') {
  function showModernToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
      <i class="bi bi-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
      ${message}
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}