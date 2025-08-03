// Healthcare Appointments JavaScript
let userToken = null;
let currentAppointments = [];
let currentCancelId = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    setMinDate();
    loadDoctors();
    loadAppointments();
    setupEventListeners();
});

function checkAuthentication() {
    userToken = sessionStorage.getItem('authToken');
    const navbarAuthArea = document.getElementById('navbarAuthArea');
    
    if (userToken) {
        const username = sessionStorage.getItem('username') || 'User';
        navbarAuthArea.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle me-1"></i>${username}
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="user-settings.html">
                        <i class="bi bi-gear me-2"></i>Settings
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()">
                        <i class="bi bi-box-arrow-right me-2"></i>Logout
                    </a></li>
                </ul>
            </div>
        `;
    } else {
        navbarAuthArea.innerHTML = `
            <div class="d-flex gap-2">
                <a href="user-login.html" class="btn btn-outline-primary btn-sm">Login</a>
                <a href="user-registration.html" class="btn btn-primary btn-sm">Register</a>
            </div>
        `;
        window.location.href = 'user-login.html';
        return;
    }
}

function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userId');
    window.location.href = 'index.html';
}

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').min = today;
    document.getElementById('editDate').min = today;
    
    // Set default filter dates
    document.getElementById('fromDate').value = today;
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    document.getElementById('toDate').value = nextMonth.toISOString().split('T')[0];
}

function setupEventListeners() {
    // Doctor selection change
    document.getElementById('doctorSelect').addEventListener('change', function() {
        updateDoctorInfo();
    });
    
    // Filter changes
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('fromDate').addEventListener('change', applyFilters);
    document.getElementById('toDate').addEventListener('change', applyFilters);
}

async function loadDoctors() {
    try {
        const response = await fetch('/api/doctors', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const doctors = await response.json();
            populateDoctorSelect(doctors);
        } else {
            console.error('Failed to load doctors');
            showAlert('Failed to load doctors', 'warning');
        }
    } catch (error) {
        console.error('Error loading doctors:', error);
        showAlert('Error loading doctors', 'danger');
    }
}

function populateDoctorSelect(doctors) {
    const select = document.getElementById('doctorSelect');
    select.innerHTML = '<option value="">Choose a doctor...</option>';
    
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.doctorId;
        option.textContent = `${doctor.doctorName} - ${doctor.specialization}`;
        option.dataset.doctor = JSON.stringify(doctor);
        select.appendChild(option);
    });
}

function updateDoctorInfo() {
    const select = document.getElementById('doctorSelect');
    const infoDiv = document.getElementById('doctorInfo');
    
    if (select.value) {
        const doctor = JSON.parse(select.options[select.selectedIndex].dataset.doctor);
        infoDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="doctor-avatar me-3">${doctor.doctorName.charAt(0)}</div>
                <div>
                    <div class="fw-semibold">${doctor.specialization}</div>
                    <div class="small text-muted">${doctor.clinicName}</div>
                    <div class="small text-muted">${doctor.location}</div>
                </div>
            </div>
        `;
    } else {
        infoDiv.innerHTML = '<span class="text-muted">Select a doctor to see details</span>';
    }
}

async function loadAppointments() {
    try {
        const response = await fetch('/api/appointments', {
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentAppointments = data.appointments || data; // Handle both formats
            displayAppointments(currentAppointments);
            updateStats(currentAppointments);
        } else {
            console.error('Failed to load appointments');
            showAlert('Failed to load appointments', 'warning');
            displayEmptyState();
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        showAlert('Error loading appointments', 'danger');
        displayEmptyState();
    }
}

function displayAppointments(appointments) {
    const container = document.getElementById('appointmentsContainer');
    
    // Ensure appointments is an array
    if (!Array.isArray(appointments) || appointments.length === 0) {
        displayEmptyState();
        return;
    }
    
    // Sort appointments by date and time
    appointments.sort((a, b) => {
        // Handle different time formats for comparison
        let timeA, timeB;
        if (a.appointmentTime.includes('T')) {
            timeA = new Date(a.appointmentTime).toTimeString().slice(0, 5);
        } else {
            timeA = a.appointmentTime.slice(0, 5);
        }
        if (b.appointmentTime.includes('T')) {
            timeB = new Date(b.appointmentTime).toTimeString().slice(0, 5);
        } else {
            timeB = b.appointmentTime.slice(0, 5);
        }
        
        const dateA = new Date(a.appointmentDate + 'T' + timeA);
        const dateB = new Date(b.appointmentDate + 'T' + timeB);
        return dateB - dateA; // Most recent first
    });
    
    let html = '';
    appointments.forEach(appointment => {
        const date = new Date(appointment.appointmentDate);
        // Handle time format - extract time from datetime or time string
        let time;
        if (appointment.appointmentTime.includes('T')) {
            // If it's a full datetime, extract just the time part
            const timeObj = new Date(appointment.appointmentTime);
            time = timeObj.toTimeString().slice(0, 5);
        } else {
            // If it's already a time string, just slice it
            time = appointment.appointmentTime.slice(0, 5);
        }
        const status = appointment.status || 'Scheduled';
        const statusClass = getStatusClass(status);
        const isUpcoming = new Date(appointment.appointmentDate) >= new Date().setHours(0,0,0,0);
        
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="appointment-card card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div class="d-flex align-items-center">
                                <div class="doctor-avatar me-3">${appointment.doctorName.charAt(0)}</div>
                                <div>
                                    <h6 class="mb-0">${appointment.doctorName}</h6>
                                    <small class="text-muted">${appointment.specialization}</small>
                                </div>
                            </div>
                            <span class="badge status-badge ${statusClass}">${status}</span>
                        </div>
                        
                        <div class="appointment-time mb-3">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <i class="bi bi-calendar3 text-primary me-1"></i>
                                    <span class="fw-semibold">${formatDate(date)}</span>
                                </div>
                                <div>
                                    <i class="bi bi-clock text-primary me-1"></i>
                                    <span class="fw-semibold">${formatTime(time)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <div class="small text-muted mb-1">
                                <i class="bi bi-geo-alt me-1"></i>${appointment.clinicName}
                            </div>
                            <div class="small text-muted">
                                ${appointment.location}
                            </div>
                            ${appointment.notes ? `<div class="small mt-2"><strong>Notes:</strong> ${appointment.notes}</div>` : ''}
                        </div>
                        
                        <div class="d-flex gap-2">
                            ${isUpcoming && status === 'Scheduled' ? `
                                <button class="btn btn-outline-primary btn-sm flex-fill" 
                                        onclick="editAppointment(${appointment.appointmentId})">
                                    <i class="bi bi-pencil me-1"></i>Reschedule
                                </button>
                                <button class="btn btn-outline-danger btn-sm" 
                                        onclick="showCancelModal(${appointment.appointmentId})">
                                    <i class="bi bi-x-lg"></i>
                                </button>
                            ` : `
                                <button class="btn btn-outline-secondary btn-sm flex-fill" disabled>
                                    <i class="bi bi-check-circle me-1"></i>${status}
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = `<div class="row">${html}</div>`;
}

function displayEmptyState() {
    const container = document.getElementById('appointmentsContainer');
    container.innerHTML = `
        <div class="empty-state">
            <i class="bi bi-calendar-x"></i>
            <h4>No appointments found</h4>
            <p>You haven't scheduled any appointments yet. Click the + button to schedule your first appointment.</p>
            <button class="btn btn-primary" onclick="showBookingModal()">
                <i class="bi bi-plus-circle me-2"></i>Schedule Appointment
            </button>
        </div>
    `;
}

function updateStats(appointments) {
    const today = new Date().setHours(0,0,0,0);
    const upcoming = appointments.filter(apt => 
        new Date(apt.appointmentDate).getTime() >= today && 
        (apt.status === 'Scheduled' || !apt.status)
    );
    const completed = appointments.filter(apt => 
        apt.status === 'Completed' || 
        new Date(apt.appointmentDate).getTime() < today
    );
    
    document.getElementById('upcomingCount').textContent = `${upcoming.length} appointments`;
    document.getElementById('completedCount').textContent = `${completed.length} appointments`;
}

function getStatusClass(status) {
    switch(status) {
        case 'Scheduled': return 'bg-success';
        case 'Completed': return 'bg-primary';
        case 'Cancelled': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    
    let filtered = [...currentAppointments];
    
    if (statusFilter) {
        filtered = filtered.filter(apt => apt.status === statusFilter);
    }
    
    if (fromDate) {
        filtered = filtered.filter(apt => apt.appointmentDate >= fromDate);
    }
    
    if (toDate) {
        filtered = filtered.filter(apt => apt.appointmentDate <= toDate);
    }
    
    displayAppointments(filtered);
}

function showBookingModal() {
    document.getElementById('bookingForm').reset();
    updateDoctorInfo();
    const modal = new bootstrap.Modal(document.getElementById('bookAppointmentModal'));
    modal.show();
}

async function bookAppointment() {
    const form = document.getElementById('bookingForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const appointmentData = {
        doctorId: parseInt(document.getElementById('doctorSelect').value),
        appointmentDate: document.getElementById('appointmentDate').value,
        appointmentTime: document.getElementById('appointmentTime').value,
        notes: document.getElementById('appointmentNotes').value || null
    };
    
    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
        });
        
        if (response.ok) {
            showAlert('Appointment scheduled successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('bookAppointmentModal')).hide();
            loadAppointments(); // Reload to show new appointment
        } else {
            const error = await response.json();
            showAlert(error.error || 'Failed to schedule appointment', 'danger');
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        showAlert('Error scheduling appointment', 'danger');
    }
}

function editAppointment(appointmentId) {
    const appointment = currentAppointments.find(apt => apt.appointmentId === appointmentId);
    if (!appointment) return;
    
    document.getElementById('editAppointmentId').value = appointmentId;
    document.getElementById('editDoctorName').value = appointment.doctorName;
    document.getElementById('editDate').value = appointment.appointmentDate;
    document.getElementById('editTime').value = appointment.appointmentTime.slice(0, 5);
    document.getElementById('editNotes').value = appointment.notes || '';
    
    const modal = new bootstrap.Modal(document.getElementById('editAppointmentModal'));
    modal.show();
}

async function updateAppointment() {
    const appointmentId = document.getElementById('editAppointmentId').value;
    const updateData = {
        appointmentDate: document.getElementById('editDate').value,
        appointmentTime: document.getElementById('editTime').value,
        notes: document.getElementById('editNotes').value || null
    };
    
    try {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
            showAlert('Appointment updated successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('editAppointmentModal')).hide();
            loadAppointments(); // Reload to show updated appointment
        } else {
            const error = await response.json();
            showAlert(error.error || 'Failed to update appointment', 'danger');
        }
    } catch (error) {
        console.error('Error updating appointment:', error);
        showAlert('Error updating appointment', 'danger');
    }
}

function showCancelModal(appointmentId) {
    const appointment = currentAppointments.find(apt => apt.appointmentId === appointmentId);
    if (!appointment) return;
    
    currentCancelId = appointmentId;
    
    const detailsDiv = document.getElementById('cancelAppointmentDetails');
    detailsDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="doctor-avatar me-3">${appointment.doctorName.charAt(0)}</div>
            <div>
                <div class="fw-semibold">${appointment.doctorName}</div>
                <div class="text-muted">${appointment.specialization}</div>
                <div class="small">
                    <i class="bi bi-calendar3 me-1"></i>${formatDate(new Date(appointment.appointmentDate))}
                    <i class="bi bi-clock ms-3 me-1"></i>${formatTime(appointment.appointmentTime.slice(0, 5))}
                </div>
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('cancelModal'));
    modal.show();
}

async function confirmCancel() {
    if (!currentCancelId) return;
    
    try {
        const response = await fetch(`/api/appointments/${currentCancelId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            showAlert('Appointment cancelled successfully', 'success');
            bootstrap.Modal.getInstance(document.getElementById('cancelModal')).hide();
            currentCancelId = null;
            loadAppointments(); // Reload to remove cancelled appointment
        } else {
            const error = await response.json();
            showAlert(error.error || 'Failed to cancel appointment', 'danger');
        }
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        showAlert('Error cancelling appointment', 'danger');
    }
}

function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert-notification');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed alert-notification`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1055; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv && alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}
