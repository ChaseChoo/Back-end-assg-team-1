// Family Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Family management page loaded');
    console.log('SessionStorage authToken:', sessionStorage.getItem('authToken'));
    console.log('SessionStorage username:', sessionStorage.getItem('username'));
    console.log('SessionStorage userId:', sessionStorage.getItem('userId'));
    console.log('SessionStorage email:', sessionStorage.getItem('email'));
    console.log('All sessionStorage items:', Object.keys(sessionStorage));
    
    // Initialize the page
    initializePage();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load family members after initialization
    setTimeout(() => {
        loadFamilyMembers();
    }, 100);
});

// Global variables
let currentStep = 1;
let selectedRelationship = '';
let selectedAccessLevel = '';
let familyMembers = [];
let memberToRemove = null;

// Initialize page elements
function initializePage() {
    // Set minimum date for today
    const today = new Date().toISOString().split('T')[0];
    
    // Setup authentication
    checkAuthStatus();
    
    // Setup form validation
    setupFormValidation();
}

// Check authentication status
function checkAuthStatus() {
    const token = sessionStorage.getItem('authToken');
    const username = sessionStorage.getItem('username');
    
    console.log('Checking auth status - Token exists:', !!token, 'Username:', username);
    
    // If no token, show warning but don't redirect immediately (for debugging)
    if (!token) {
        console.warn('No authentication token found');
        // For now, let's not redirect and see what happens
        return false;
    }
    
    const authArea = document.getElementById('navbarAuthArea');
    if (authArea && token && username) {
        authArea.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle me-1"></i>${username}
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="user-settings.html">Settings</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item" onclick="logout()">Logout</button></li>
                </ul>
            </div>
        `;
    } else {
        if (authArea) {
            authArea.innerHTML = `
                <a href="user-login.html" class="btn btn-outline-primary me-2">Login</a>
                <a href="user-registration.html" class="btn btn-primary">Sign Up</a>
            `;
        }
    }
    
    return !!token;
}

// Setup event listeners
function setupEventListeners() {
    // Relationship selection
    document.querySelectorAll('.relationship-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.relationship-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedRelationship = this.dataset.value;
            document.getElementById('relationshipNext').disabled = false;
        });
    });
    
    // Access level selection
    document.querySelectorAll('.access-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.access-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedAccessLevel = this.dataset.value;
            document.getElementById('accessNext').disabled = false;
        });
    });
    
    // Phone number formatting
    document.getElementById('phoneNumber').addEventListener('input', formatPhoneNumber);
    document.getElementById('editPhoneNumber').addEventListener('input', formatPhoneNumber);
}

// Format phone number as user types
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 6) {
        value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
    } else if (value.length >= 3) {
        value = `(${value.slice(0,3)}) ${value.slice(3)}`;
    }
    e.target.value = value;
}

// Step navigation functions
function nextStep(step) {
    // Validate current step
    if (!validateCurrentStep()) {
        return;
    }
    
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.add('d-none');
    
    // Show next step
    document.getElementById(`step${step}`).classList.remove('d-none');
    
    currentStep = step;
}

function previousStep(step) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.add('d-none');
    
    // Show previous step
    document.getElementById(`step${step}`).classList.remove('d-none');
    
    currentStep = step;
}

// Validate current step
function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            if (!firstName || !lastName) {
                showAlert('Please enter both first and last name.', 'warning');
                return false;
            }
            return true;
        case 2:
            if (!selectedRelationship) {
                showAlert('Please select a relationship.', 'warning');
                return false;
            }
            return true;
        case 3:
            const phoneNumber = document.getElementById('phoneNumber').value.trim();
            if (!phoneNumber) {
                showAlert('Please enter a phone number.', 'warning');
                return false;
            }
            // Basic phone validation
            const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
            if (!phoneRegex.test(phoneNumber)) {
                showAlert('Please enter a valid phone number format: (555) 123-4567', 'warning');
                return false;
            }
            return true;
        case 4:
            if (!selectedAccessLevel) {
                showAlert('Please select an access level.', 'warning');
                return false;
            }
            return true;
        default:
            return true;
    }
}

// Show summary before final submission
function showSummary() {
    if (!validateCurrentStep()) return;
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const emailAddress = document.getElementById('emailAddress').value.trim();
    const emergencyContact = document.getElementById('emergencyContact').checked;
    
    const summaryHtml = `
        <div class="row">
            <div class="col-md-6">
                <h6 class="text-success mb-2">Personal Information</h6>
                <p class="mb-1"><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p class="mb-1"><strong>Relationship:</strong> ${selectedRelationship}</p>
                <p class="mb-3"><strong>Access Level:</strong> ${selectedAccessLevel === 'View' ? 'View Only' : 'Help & Manage'}</p>
            </div>
            <div class="col-md-6">
                <h6 class="text-success mb-2">Contact Information</h6>
                <p class="mb-1"><strong>Phone:</strong> ${phoneNumber}</p>
                ${emailAddress ? `<p class="mb-1"><strong>Email:</strong> ${emailAddress}</p>` : ''}
                <p class="mb-0">
                    <span class="badge ${emergencyContact ? 'bg-warning' : 'bg-secondary'}">
                        ${emergencyContact ? 'Emergency Contact' : 'Regular Contact'}
                    </span>
                </p>
            </div>
        </div>
    `;
    
    document.getElementById('memberSummary').innerHTML = summaryHtml;
    nextStep(5);
}

// Load family members from server
async function loadFamilyMembers() {
    try {
        const token = sessionStorage.getItem('authToken');
        console.log('Loading family members, token:', token ? 'exists' : 'missing');
        
        if (!token) {
            console.log('No token found, showing empty state');
            showEmptyState();
            return;
        }

        console.log('Making API call to /api/family');
        const response = await fetch('/api/family', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('API response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Family data received:', data);
            familyMembers = data.familyMembers || [];
            displayFamilyMembers();
            updateStats();
        } else if (response.status === 401 || response.status === 403) {
            console.log('Authentication failed, redirecting to login');
            alert('Session expired. Please sign in again.');
            window.location.href = 'user-login.html';
        } else {
            console.error('Failed to load family members, status:', response.status);
            showEmptyState();
        }
    } catch (error) {
        console.error('Error loading family members:', error);
        showEmptyState();
    }
}

// Display family members
function displayFamilyMembers() {
    const container = document.getElementById('familyMembersContainer');
    
    if (familyMembers.length === 0) {
        showEmptyState();
        return;
    }
    
    let html = '';
    
    // Add new member card
    html += `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="add-member-card" onclick="showAddMemberModal()">
                <i class="bi bi-plus-circle text-success display-1 mb-3"></i>
                <h5 class="text-success">Add Family Member</h5>
                <p class="text-muted">Invite someone to your support group</p>
            </div>
        </div>
    `;
    
    // Family member cards
    familyMembers.forEach(member => {
        const initials = getInitials(member.firstName, member.lastName);
        const accessBadge = member.accessLevel === 'Manage' ? 'bg-primary' : 'bg-secondary';
        const emergencyBadge = member.emergencyContact ? '<span class="badge bg-warning ms-2">Emergency</span>' : '';
        
        html += `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card member-card h-100">
                    <div class="card-body text-center">
                        <div class="member-avatar">
                            ${initials}
                        </div>
                        <h5 class="card-title mb-2">${member.firstName} ${member.lastName}</h5>
                        <p class="text-muted mb-2">${member.relationship}</p>
                        <div class="mb-3">
                            <span class="badge ${accessBadge} access-badge">${member.accessLevel === 'Manage' ? 'Can Help & Manage' : 'View Only'}</span>
                            ${emergencyBadge}
                        </div>
                        <div class="contact-info mb-3">
                            <p class="small mb-1">
                                <i class="bi bi-telephone me-1"></i>
                                <a href="tel:${member.phoneNumber}" class="text-decoration-none">${member.phoneNumber}</a>
                            </p>
                            ${member.emailAddress ? `
                                <p class="small mb-0">
                                    <i class="bi bi-envelope me-1"></i>
                                    <a href="mailto:${member.emailAddress}" class="text-decoration-none">${member.emailAddress}</a>
                                </p>
                            ` : ''}
                        </div>
                        <div class="btn-group w-100" role="group">
                            <button class="btn btn-outline-primary btn-sm" onclick="editMember(${member.id})" title="Edit">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="showRemoveModal(${member.id})" title="Remove">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Show empty state
function showEmptyState() {
    const container = document.getElementById('familyMembersContainer');
    container.innerHTML = `
        <div class="col-12">
            <div class="empty-state">
                <i class="bi bi-people text-muted"></i>
                <h4>No Family Members Yet</h4>
                <p class="mb-4">Start building your support network by adding trusted family members or caregivers.</p>
                <button class="btn btn-success btn-lg" onclick="showAddMemberModal()">
                    <i class="bi bi-plus-circle me-2"></i>Add Your First Family Member
                </button>
            </div>
        </div>
    `;
}

// Update statistics
function updateStats() {
    const familyCount = familyMembers.filter(m => ['Son', 'Daughter', 'Spouse', 'Sibling'].includes(m.relationship)).length;
    const caregiverCount = familyMembers.filter(m => m.relationship === 'Caregiver').length;
    const emergencyCount = familyMembers.filter(m => m.emergencyContact).length;
    
    document.getElementById('familyCount').textContent = `${familyCount} member${familyCount !== 1 ? 's' : ''}`;
    document.getElementById('caregiverCount').textContent = `${caregiverCount} caregiver${caregiverCount !== 1 ? 's' : ''}`;
    document.getElementById('emergencyCount').textContent = `${emergencyCount} contact${emergencyCount !== 1 ? 's' : ''}`;
}

// Get initials from name
function getInitials(firstName, lastName) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}

// Show add member modal
function showAddMemberModal() {
    // Reset form
    resetAddMemberForm();
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('addMemberModal'));
    modal.show();
}

// Reset add member form
function resetAddMemberForm() {
    currentStep = 1;
    selectedRelationship = '';
    selectedAccessLevel = '';
    
    // Hide all steps except first
    for (let i = 2; i <= 5; i++) {
        document.getElementById(`step${i}`).classList.add('d-none');
    }
    document.getElementById('step1').classList.remove('d-none');
    
    // Clear form fields
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('emailAddress').value = '';
    document.getElementById('emergencyContact').checked = false;
    
    // Clear selections
    document.querySelectorAll('.relationship-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('.access-option').forEach(opt => opt.classList.remove('selected'));
    
    // Disable buttons
    document.getElementById('relationshipNext').disabled = true;
    document.getElementById('accessNext').disabled = true;
}

// Add family member
async function addFamilyMember() {
    try {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            showAlert('Please log in to add family members.', 'warning');
            return;
        }

        const memberData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            relationship: selectedRelationship,
            phoneNumber: document.getElementById('phoneNumber').value.trim(),
            emailAddress: document.getElementById('emailAddress').value.trim(),
            accessLevel: selectedAccessLevel,
            emergencyContact: document.getElementById('emergencyContact').checked
        };

        const response = await fetch('/api/family', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(memberData)
        });

        if (response.ok) {
            const result = await response.json();
            showAlert('Family member added successfully!', 'success');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addMemberModal'));
            modal.hide();
            
            // Reload family members
            loadFamilyMembers();        } else if (response.status === 401 || response.status === 403) {
            alert('Session expired. Please sign in again.');
            window.location.href = 'user-login.html';
        } else {
            const error = await response.json();
            showAlert(error.message || 'Failed to add family member.', 'danger');
        }
    } catch (error) {
        console.error('Error adding family member:', error);
        showAlert('An error occurred while adding the family member.', 'danger');
    }
}

// Edit member
function editMember(memberId) {
    const member = familyMembers.find(m => m.id === memberId);
    if (!member) return;
    
    // Populate edit form
    document.getElementById('editMemberId').value = member.id;
    document.getElementById('editFirstName').value = member.firstName;
    document.getElementById('editLastName').value = member.lastName;
    document.getElementById('editPhoneNumber').value = member.phoneNumber;
    document.getElementById('editEmailAddress').value = member.emailAddress || '';
    document.getElementById('editRelationship').value = member.relationship;
    document.getElementById('editAccessLevel').value = member.accessLevel;
    document.getElementById('editEmergencyContact').checked = member.emergencyContact || false;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editMemberModal'));
    modal.show();
}

// Update family member
async function updateFamilyMember() {
    try {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            showAlert('Please log in to update family members.', 'warning');
            return;
        }

        const memberId = document.getElementById('editMemberId').value;
        const memberData = {
            firstName: document.getElementById('editFirstName').value.trim(),
            lastName: document.getElementById('editLastName').value.trim(),
            relationship: document.getElementById('editRelationship').value,
            phoneNumber: document.getElementById('editPhoneNumber').value.trim(),
            emailAddress: document.getElementById('editEmailAddress').value.trim(),
            accessLevel: document.getElementById('editAccessLevel').value,
            emergencyContact: document.getElementById('editEmergencyContact').checked
        };

        const response = await fetch(`/api/family/${memberId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(memberData)
        });

        if (response.ok) {
            showAlert('Family member updated successfully!', 'success');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editMemberModal'));
            modal.hide();
            
            // Reload family members
            loadFamilyMembers();        } else if (response.status === 401 || response.status === 403) {
            alert('Session expired. Please sign in again.');
            window.location.href = 'user-login.html';
        } else {
            const error = await response.json();
            showAlert(error.message || 'Failed to update family member.', 'danger');
        }
    } catch (error) {
        console.error('Error updating family member:', error);
        showAlert('An error occurred while updating the family member.', 'danger');
    }
}

// Show remove confirmation modal
function showRemoveModal(memberId) {
    const member = familyMembers.find(m => m.id === memberId);
    if (!member) return;
    
    memberToRemove = member;
    
    // Populate member details
    document.getElementById('removeMemberDetails').innerHTML = `
        <div class="d-flex align-items-center">
            <div class="member-avatar me-3" style="width: 50px; height: 50px; font-size: 1.2rem;">
                ${getInitials(member.firstName, member.lastName)}
            </div>
            <div>
                <h6 class="mb-1">${member.firstName} ${member.lastName}</h6>
                <p class="text-muted mb-1">${member.relationship}</p>
                <small class="text-muted">${member.phoneNumber}</small>
            </div>
        </div>
    `;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('removeModal'));
    modal.show();
}

// Confirm remove member
async function confirmRemove() {
    if (!memberToRemove) return;
    
    try {
        const token = sessionStorage.getItem('authToken');
        if (!token) {
            showAlert('Please log in to remove family members.', 'warning');
            return;
        }

        const response = await fetch(`/api/family/${memberToRemove.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            showAlert('Family member removed successfully.', 'success');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('removeModal'));
            modal.hide();
            
            // Clear member to remove
            memberToRemove = null;
            
            // Reload family members
            loadFamilyMembers();        } else if (response.status === 401 || response.status === 403) {
            alert('Session expired. Please sign in again.');
            window.location.href = 'user-login.html';
        } else {
            const error = await response.json();
            showAlert(error.message || 'Failed to remove family member.', 'danger');
        }
    } catch (error) {
        console.error('Error removing family member:', error);
        showAlert('An error occurred while removing the family member.', 'danger');
    }
}

// Setup form validation
function setupFormValidation() {
    // Real-time validation for required fields
    document.getElementById('firstName').addEventListener('blur', function() {
        validateField(this, 'First name is required');
    });
    
    document.getElementById('lastName').addEventListener('blur', function() {
        validateField(this, 'Last name is required');
    });
    
    document.getElementById('phoneNumber').addEventListener('blur', function() {
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        if (this.value && !phoneRegex.test(this.value)) {
            showFieldError(this, 'Please enter a valid phone number');        } else if (response.status === 401 || response.status === 403) {
            alert('Session expired. Please sign in again.');
            window.location.href = 'user-login.html';
        } else {
            clearFieldError(this);
        }
    });
    
    document.getElementById('emailAddress').addEventListener('blur', function() {
        if (this.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.value)) {
                showFieldError(this, 'Please enter a valid email address');        } else if (response.status === 401 || response.status === 403) {
            alert('Session expired. Please sign in again.');
            window.location.href = 'user-login.html';
        } else {
                clearFieldError(this);
            }
        }
    });
}

// Validate individual field
function validateField(field, message) {
    if (!field.value.trim()) {
        showFieldError(field, message);
        return false;        } else if (response.status === 401 || response.status === 403) {
            alert('Session expired. Please sign in again.');
            window.location.href = 'user-login.html';
        } else {
        clearFieldError(field);
        return true;
    }
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('is-invalid');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert-dismissible');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Logout function
function logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    window.location.href = 'user-login.html';
}

