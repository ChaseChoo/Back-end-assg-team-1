// Hide loader overlay when page is ready or data is loaded
function hideLoader() {
  const loader = document.getElementById('loader-overlay');
  if (loader) loader.style.display = 'none';
}

// Call hideLoader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // If you fetch data, call hideLoader after all data is loaded
  hideLoader();
});

// book-appointment.js
// Handles dynamic UI and form submission for the appointment booking page

document.addEventListener('DOMContentLoaded', function() {
  // Check authentication first
  const token = sessionStorage.getItem('token');
  if (!token) {
    alert("Please log in to book an appointment.");
    window.location.href = "user-login.html";
    return;
  }

  // --- 1. Render Clinic Cards ---
  const clinics = [
    { id: 1, name: "KKK General Hospital", location: "535 Clementi Road", img: "assets/hospital(1).png" },
    { id: 2, name: "Mount Eagles Hospital", location: "123 Bukit Timah", img: "assets/hospital(2).png" },
    { id: 3, name: "City Health Clinic", location: "456 Jurong West", img: "assets/hospital(3).png" }
  ];
  const clinicCards = document.getElementById('clinicCards');
  if (clinicCards) {
    clinicCards.innerHTML = clinics.map(clinic => `
      <div class="col-md-4">
        <div class="clinic-card" data-id="${clinic.id}">
          <img src="${clinic.img}" alt="${clinic.name}">
          <div class="fw-bold mb-1">${clinic.name}</div>
          <div class="small text-muted">${clinic.location}</div>
        </div>
      </div>
    `).join("");
    clinicCards.querySelectorAll('.clinic-card').forEach(card => {
      card.addEventListener('click', function() {
        clinicCards.querySelectorAll('.clinic-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        document.getElementById('appointmentForm').dataset.clinicId = card.dataset.id;
        // Refresh doctors when clinic changes
        fetchAndRenderDoctors();
      });
    });
  }

  // --- 2. Populate Appointment Type Dropdown ---
  // Map type names to IDs based on your AppointmentTypes table
  const appointmentTypes = [
    { id: 1, name: "General Consultation" },
    { id: 2, name: "Specialist Consultation" },
    { id: 3, name: "Pediatrics" },
    { id: 4, name: "Vaccination Appointment" }
  ];
  const typeSelect = document.getElementById('type');
  if (typeSelect) {
    typeSelect.innerHTML = '<option value="">-- Select Type --</option>' +
      appointmentTypes.map(type => `<option value="${type.id}">${type.name}</option>`).join("");
  }

  // --- 3. Render Doctor Cards (fetch from backend by appointmentTypeId and clinicId) ---
  const doctorCards = document.getElementById('doctorCards');
  async function fetchAndRenderDoctors() {
    if (!doctorCards) return;
    doctorCards.innerHTML = '<div class="text-center w-100 py-3"><span class="spinner-border"></span> Loading doctors...</div>';
    try {
      const appointmentTypeId = typeSelect ? typeSelect.value : "";
      const clinicId = document.getElementById('appointmentForm').dataset.clinicId || "";
      let url = '/api/doctors';
      const params = [];
      if (appointmentTypeId) params.push(`appointmentTypeId=${appointmentTypeId}`);
      if (clinicId) params.push(`clinicId=${clinicId}`);
      if (params.length > 0) url += `?${params.join('&')}`;
      
      // Add authentication to doctor fetching if your API requires it
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.status === 401 || res.status === 403) {
        alert("Session expired. Please log in again.");
        window.location.href = "user-login.html";
        return;
      }
      
      const doctors = await res.json();
      if (!Array.isArray(doctors) || doctors.length === 0) {
        doctorCards.innerHTML = '<div class="text-center w-100 py-3">No doctors available for this type and clinic.</div>';
        return;
      }
      doctorCards.innerHTML = doctors.map(doc => {
        // Map appointmentTypeId to name
        const typeObj = appointmentTypes.find(t => t.id === doc.appointmentTypeId);
        const typeName = typeObj ? typeObj.name : "";
        return `
          <div class="col-md-4 mb-2">
            <div class="doctor-card professional-card" data-id="${doc.doctorId}" style="min-height:100px;max-width:220px;margin:auto;">
              <div class="card-header bg-light text-center py-1" style="border-bottom:1px solid #e3e6f0;">
                <span class="fw-semibold" style="color:#034cbc;font-size:1rem;">Doctor</span>
              </div>
              <div class="card-body d-flex flex-column justify-content-center align-items-center py-2">
                <div class="fw-bold mb-1" style="font-size:1rem;color:#034cbc;">${doc.fullName}</div>
                <div class="small text-muted mb-1">${typeName}</div>
              </div>
            </div>
          </div>
        `;
      }).join("");
      doctorCards.querySelectorAll('.doctor-card').forEach(card => {
        card.addEventListener('click', function() {
          doctorCards.querySelectorAll('.doctor-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          document.getElementById('appointmentForm').dataset.doctorId = card.dataset.id;
        });
      });
    } catch (err) {
      console.error('Error fetching doctors:', err);
      doctorCards.innerHTML = '<div class="text-danger text-center w-100 py-3">Error loading doctors.</div>';
    }
  }

  // Initial load: show all doctors
  fetchAndRenderDoctors();
  if (typeSelect) {
    typeSelect.addEventListener('change', function() {
      fetchAndRenderDoctors();
    });
  }

  // --- 4. Render Time Select Dropdown ---
  function generateTimeSlots(start, end, interval) {
    const slots = [];
    let [h, m] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    while (h < endH || (h === endH && m <= endM)) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      m += interval;
      if (m >= 60) { h++; m = m % 60; }
    }
    return slots;
  }
  const timeSelect = document.getElementById('time');
  const timeSlots = generateTimeSlots("09:00", "17:00", 15);
  function renderTimeOptions() {
    if (!timeSelect) return;
    const dateInput = document.getElementById('date');
    const selectedDate = dateInput ? dateInput.value : '';
    const now = new Date();
    let options = '<option value="">-- Select Time --</option>';
    timeSlots.forEach(slot => {
      let disabled = false;
      if (selectedDate) {
        // Build a Date object for the slot on the selected date
        const [year, month, day] = selectedDate.split('-').map(Number);
        const [h, m] = slot.split(":").map(Number);
        const slotDate = new Date(year, month - 1, day, h, m);
        // If selected date is today, disable times before now
        if (
          year === now.getFullYear() &&
          month === (now.getMonth() + 1) &&
          day === now.getDate()
        ) {
          if (slotDate <= now) {
            disabled = true;
          }
        } else if (slotDate < now) {
          // If selected date is in the past, disable all slots
          disabled = true;
        }
      } else {
        // If no date selected, disable all slots
        disabled = true;
      }
      options += `<option value="${slot}"${disabled ? ' disabled style="color:#ccc;"' : ''}>${slot}</option>`;
    });
    timeSelect.innerHTML = options;
  }
  if (timeSelect) {
    renderTimeOptions();
    const dateInput = document.getElementById('date');
    if (dateInput) {
      dateInput.addEventListener('change', renderTimeOptions);
    }
  }

  // --- 5. Set min date for date picker ---
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // --- 6. Form Submission (SINGLE HANDLER - FIXED) ---
  const form = document.getElementById('appointmentForm');
  const responseMsg = document.getElementById('response');
  const formFeedback = document.getElementById('formFeedback');
  
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Clear previous messages
      if (responseMsg) {
        responseMsg.textContent = '';
        responseMsg.className = '';
      }
      if (formFeedback) {
        formFeedback.textContent = '';
        formFeedback.className = '';
      }
      
      // Gather data
      const clinicId = form.dataset.clinicId;
      const doctorId = form.dataset.doctorId;
      const appointmentTypeId = typeSelect ? typeSelect.value : '';
      const appointmentDate = dateInput ? dateInput.value : '';
      const appointmentTime = timeSelect ? timeSelect.value : '';
      const notes = document.getElementById('notes') ? document.getElementById('notes').value : '';
      
      // Basic validation
      if (!clinicId || !doctorId || !appointmentTypeId || !appointmentDate || !appointmentTime) {
        const errorMsg = 'Please fill in all required fields (clinic, doctor, type, date, and time).';
        if (responseMsg) {
          responseMsg.textContent = errorMsg;
          responseMsg.className = 'text-danger text-center';
        } else if (formFeedback) {
          formFeedback.textContent = errorMsg;
          formFeedback.className = 'text-danger';
        }
        return;
      }
      
      // Send to backend with authentication
      try {
        const res = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // FIXED: Added authentication
          },
          body: JSON.stringify({
            doctorId: parseInt(doctorId),
            appointmentTypeId: parseInt(appointmentTypeId),
            appointmentDate,
            appointmentTime,
            notes
          })
        });
        
        // Handle authentication errors
        if (res.status === 401 || res.status === 403) {
          alert("Session expired. Please log in again.");
          window.location.href = "user-login.html";
          return;
        }
        
        const data = await res.json();
        
        if (res.ok && data.success) {
          const successMsg = 'Appointment successfully booked!';
          if (responseMsg) {
            responseMsg.textContent = successMsg;
            responseMsg.className = 'text-success text-center';
          }
          // Show success modal if it exists
          const successModal = document.getElementById("successModal");
          if (successModal && window.bootstrap) {
            const modal = new bootstrap.Modal(successModal);
            modal.show();
            // Handle dashboard redirect
            const dashboardBtn = document.getElementById("goToDashboard");
            if (dashboardBtn) {
              dashboardBtn.addEventListener("click", () => {
                window.location.href = "dashboard.html";
              });
            }
          }
          // Always show the message even if modal is not present
          if (!successModal && responseMsg) {
            responseMsg.textContent = successMsg;
            responseMsg.className = 'text-success text-center';
          }
          // Reset form and selections
          form.reset();
          form.removeAttribute('data-clinic-id');
          form.removeAttribute('data-doctor-id');
          if (clinicCards) {
            clinicCards.querySelectorAll('.clinic-card').forEach(c => c.classList.remove('selected'));
          }
          if (doctorCards) {
            doctorCards.querySelectorAll('.doctor-card').forEach(c => c.classList.remove('selected'));
          }
          // Clear time options
          if (timeSelect) {
            timeSelect.innerHTML = '<option value="">-- Select Time --</option>';
          }
          
        } else {
          const errorMsg = data.error || 'Failed to book appointment.';
          if (responseMsg) {
            responseMsg.textContent = errorMsg;
            responseMsg.className = 'text-danger text-center';
          } else if (formFeedback) {
            formFeedback.textContent = errorMsg;
            formFeedback.className = 'text-danger';
          }
        }
      } catch (err) {
        console.error('Error booking appointment:', err);
        const errorMsg = 'Server error. Please try again later.';
        if (responseMsg) {
          responseMsg.textContent = errorMsg;
          responseMsg.className = 'text-danger text-center';
        } else if (formFeedback) {
          formFeedback.textContent = errorMsg;
          formFeedback.className = 'text-danger';
        }
      }
    });
  }
});