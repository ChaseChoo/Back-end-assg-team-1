// appointment-list.js - Populate the appointment list modal with all appointments
document.addEventListener('DOMContentLoaded', async function() {
  const container = document.getElementById('appointmentListContainer');
  container.innerHTML = '<div class="text-center py-4"><span class="spinner-border"></span> Loading appointments...</div>';

  const token = sessionStorage.getItem('token');
  if (!token) {
    alert("No token found. Please log in.");
    window.location.href = "user-login.html";
    return;
  }

  try {
    const res = await fetch('/api/appointments', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.status === 401 || res.status === 403) {
      alert("Session expired or unauthorized. Please log in again.");
      window.location.href = "user-login.html";
      return;
    }

    const data = await res.json();
    let appointments = data.appointments || [];
    console.log(appointments);

    if (!Array.isArray(appointments) || appointments.length === 0) {
      container.innerHTML = '<div class="text-center py-4 text-muted">No appointments found.</div>';
      return;
    }

    // Sort appointments by date and time ascending
    appointments.sort((a, b) => {
      const dateStrA = a.appointmentDate ? a.appointmentDate.split('T')[0] : '';
      const dateStrB = b.appointmentDate ? b.appointmentDate.split('T')[0] : '';
      const timeStrA = a.appointmentTime ? (a.appointmentTime.split('T')[1] || a.appointmentTime) : '00:00';
      const timeStrB = b.appointmentTime ? (b.appointmentTime.split('T')[1] || b.appointmentTime) : '00:00';
      const fullA = new Date(dateStrA + 'T' + timeStrA);
      const fullB = new Date(dateStrB + 'T' + timeStrB);
      return fullA.getTime() - fullB.getTime();
    });

    const clinicDetails = {
      'KKK General Hospital': { room: 'Room 101', floor: '2nd Floor', location: '535 Clementi Road, Singapore' },
      'Mount Eagles Hospital': { room: 'Room 202', floor: '5th Floor', location: '123 Bukit Timah, Singapore' },
      'City Health Clinic': { room: 'Room 303', floor: '1st Floor', location: '456 Jurong West, Singapore' },
      'MerderkaLife Clinic': { room: 'Room 101', floor: '2nd Floor', location: '535 Clementi Road, Singapore' },
    };

    function getDayOfWeek(dateStr) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const d = new Date(dateStr);
      return days[d.getDay()];
    }

    let msgHtml = '';
    if (localStorage.getItem('showCancelMsg')) {
      msgHtml = '<div id="deleteSuccessMsg" class="alert alert-success" role="alert">Appointment cancelled successfully.</div>';
      localStorage.removeItem('showCancelMsg');
    } else if (localStorage.getItem('showEditMsg')) {
      msgHtml = '<div id="editSuccessMsg" class="alert alert-success" role="alert" style="display:block;">Appointment updated successfully.</div>';
      localStorage.removeItem('showEditMsg');
    } else {
      msgHtml = '<div id="editSuccessMsg" class="alert alert-success" role="alert" style="display:none;"></div>';
    }

    container.innerHTML = `
      ${msgHtml}
      <div class="row g-4">
        ${appointments.map(app => {
          let time = '';
          if (app.appointmentTime) {
            if (typeof app.appointmentTime === 'string') {
              const parts = app.appointmentTime.includes('T') 
                ? app.appointmentTime.match(/T(\d{2}):(\d{2})/) 
                : app.appointmentTime.split(':');
              if (parts) {
                time = parts[1] + ':' + parts[2];
              }
            }
          }
          const dateStr = app.appointmentDate ? app.appointmentDate.split('T')[0] : '';
          const dayOfWeek = dateStr ? getDayOfWeek(dateStr) : '';
          const clinicName = app.clinicName || 'MerderkaLife Clinic';
          const details = clinicDetails[clinicName] || clinicDetails['MerderkaLife Clinic'];

          return `
            <div class="col-12 col-md-6 col-lg-4">
              <div class="card shadow-sm h-100 border-0">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div class="me-3">
                      <span class="badge appointment-date-badge fs-6"><i class="bi bi-calendar-event me-1"></i> ${dateStr}</span>
                    </div>
                    <div>
                      <span class="badge appointment-time-badge fs-6"><i class="bi bi-clock me-1"></i> ${time}</span>
                    </div>
                  </div>
                  <h5 class="card-title mb-2"><i class="bi bi-person-circle me-2"></i> ${app.doctorName || '-'} </h5>
                  <p class="mb-1"><i class="bi bi-clipboard2-pulse me-2"></i> <span class="fw-semibold">${app.type || 'N/A'}</span></p>
                  <p class="mb-1"><i class="bi bi-hospital me-2"></i> <span class="fw-semibold">${clinicName}</span></p>
                  <p class="mb-1"><i class="bi bi-geo-alt me-2"></i> <span class="fw-semibold">${details.location}</span></p>
                  <p class="mb-1"><i class="bi bi-door-open me-2"></i> ${details.room}, ${details.floor}</p>
                  <p class="mb-1"><i class="bi bi-calendar-week me-2"></i> <span class="fw-semibold">${dayOfWeek}</span></p>
                  <p class="mb-1"><i class="bi bi-chat-left-text me-2"></i> ${app.notes ? `<span title="${app.notes}">${app.notes.length > 60 ? app.notes.slice(0, 60) + '…' : app.notes}</span>` : '<span class="text-muted">No notes</span>'}</p>
                  <button class="btn btn-sm btn-outline-primary mt-2 me-2 edit-appointment-btn"
                    data-id="${app.appointmentId}"
                    data-clinic="${clinicName}"
                    data-doctor="${app.doctorName || ''}"
                    data-type="${app.type || ''}"
                    data-date="${dateStr}"
                    data-time="${time}"
                    data-notes="${app.notes || ''}">
                    <i class="bi bi-pencil"></i> Edit
                  </button>
                  <button class="btn btn-sm btn-outline-danger mt-2 delete-appointment-btn" data-id="${app.appointmentId}">
                    <i class="bi bi-x-circle"></i> Cancel Appointment
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // --- Edit Appointment Modal Logic ---
    const editModalEl = document.getElementById('editAppointmentModal');
    const editModal = editModalEl ? new bootstrap.Modal(editModalEl) : null;

    document.querySelectorAll('.edit-appointment-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.getElementById('editAppointmentId').value = this.dataset.id;
        document.getElementById('editClinic').value = this.dataset.clinic;
        document.getElementById('editDoctor').value = this.dataset.doctor;
        document.getElementById('editType').value = this.dataset.type;
        document.getElementById('editDate').value = this.dataset.date;
        document.getElementById('editTime').value = this.dataset.time;
        document.getElementById('editNotes').value = this.dataset.notes;
        document.getElementById('editFeedback').textContent = '';
        const editDateInput = document.getElementById('editDate');
        if (editDateInput) {
          const today = new Date().toISOString().split('T')[0];
          editDateInput.min = today;
        }
        if (editModal) editModal.show();
      });
    });

    const editForm = document.getElementById('editAppointmentForm');
    if (editForm) {
      editForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const id = document.getElementById('editAppointmentId').value;
        const date = document.getElementById('editDate').value;
        const time = document.getElementById('editTime').value;
        const notes = document.getElementById('editNotes').value;
        const feedback = document.getElementById('editFeedback');
        feedback.textContent = '';
        feedback.className = '';

        try {
          const res = await fetch(`/api/appointments/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ appointmentDate: date, appointmentTime: time, notes })
          });

          const result = await res.json();
        
          if (!res.ok) {
            throw new Error(result.error || result.message || 'Unknown error');
          }

          if (result.success) {
            if (editModal) editModal.hide();
            localStorage.setItem('showEditMsg', '1');
            location.reload();
          } else {
            feedback.textContent = result.message || 'Failed to update appointment.';
            feedback.className = 'text-danger mb-2';
          }
        } catch (err) {
          feedback.textContent = 'Error updating appointment: ' + err.message;
          feedback.className = 'text-danger mb-2';
        }
      });
    }

    let deleteModal = null;
    let appointmentToDelete = null;
    if (window.bootstrap) {
      deleteModal = new window.bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    }

    document.querySelectorAll('.delete-appointment-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        appointmentToDelete = this.getAttribute('data-id');
        if (deleteModal) deleteModal.show();
        else if (confirm('Are you sure you want to delete this appointment?')) handleDelete(appointmentToDelete);
      });
    });

    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', async function() {
        if (appointmentToDelete) {
          await handleDelete(appointmentToDelete);
          if (deleteModal) deleteModal.hide();
        }
      });
    }

    async function handleDelete(appointmentId) {
      try {
        const res = await fetch(`/api/appointments/${appointmentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await res.json();
        if (result.success) {
          localStorage.setItem('showCancelMsg', '1');
          location.reload();
        } else {
          alert(result.message || 'Failed to cancel appointment.');
        }
      } catch (err) {
        alert('Error deleting appointment.');
      }
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = '<div class="text-danger text-center py-4">Error loading appointments.</div>';
  }
});
