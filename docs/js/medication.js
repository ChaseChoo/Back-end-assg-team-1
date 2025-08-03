// Linked to medication.html to dynamically fetch display medication records

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("medication-list");
    const loader = document.getElementById("loader-overlay");

     // Display username greeting if available in sessionStorage
    const username = sessionStorage.getItem("username");
    if (username) {
        const greetingEl = document.getElementById("usernameText");
        if (greetingEl) {
        greetingEl.textContent = `${username}!`;
        }
    }

    // Prevent users from selecting past dates for both Start Date and End Date
    const startDateInput = document.getElementById("editStartDate");
    const endDateInput = document.getElementById("editEndDate");

    if (startDateInput && endDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const minDate = `${yyyy}-${mm}-${dd}`;

        startDateInput.min = minDate;
        endDateInput.min = minDate;

        startDateInput.addEventListener("change", () => {
            endDateInput.min = startDateInput.value;
        });
    }

    // Fetching medication records using JWT token
    try {
        const response = await fetch("/api/medication-records", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        });

        // Check for authentication errors before trying to parse
        if (response.status === 401 || response.status === 403) {
            alert("Session expired or unauthorized. Please log in again.");
            window.location.href = "user-login.html";
            return;
        }

        const medications = await response.json();

        // Group all medications by each individual doseTime
        const grouped = {};

        medications.forEach(med => {
            (med.doseTimes || []).forEach((doseISO, idx) => {
                try {
                const hhmm = doseISO.substring(11, 16); // safely extract "HH:mm"

                if (!grouped[hhmm]) grouped[hhmm] = [];

                grouped[hhmm].push({
                    ...med,
                    doseTime: hhmm,
                    scheduleId: med.scheduleIds?.[idx],      // assign scheduleId per dose
                    markAsTaken: med.markAsTakenFlags?.[idx] // assign taken status per dose
                });
                } catch (e) {
                console.warn("Invalid doseTime skipped:", doseISO);
                }
            });
        });

        // Render grouped cards per dose time
        container.innerHTML = Object.keys(grouped).length
            ? Object.entries(grouped)
                .sort(([a], [b]) => a.localeCompare(b)) // sort time keys
                .map(([time, meds]) => createTimeSection(time, meds)).join("")
            : `<p class="text-center">No medications found.</p>`;

    } 
    catch (error) {
        console.error("Failed to load medications:", error);
        container.innerHTML = `<p class="text-danger text-center">Error loading data.</p>`;
    } finally {
        loader.style.display = "none";
    }
});

// Create a section per dose time
function createTimeSection(time, meds) {
    const formattedTime = formatTime12Hr(time);
    return `
       <div class="mb-5 d-flex flex-column align-items-center">
            <div class="text-start" style="width: 100%; max-width: 640px;">
                <h5 class="fw-bold mb-3">${formattedTime}</h5>
                <div class="d-flex flex-column gap-3">
                    ${meds.map(createCardHTML).join("")}
                </div>
            </div>
        </div>
    `;
}

// Dynamicially create each medication record card display
function createCardHTML(med) {
  // Add safety checks for required fields
  if (!med || !med.medicationName) {
    console.warn('Invalid medication data:', med);
    return '<div class="alert alert-warning">Invalid medication data</div>';
  }

  const takenLabel = med.markAsTaken
    ? `<p class="mb-0 mt-1 text-success fw-semibold">Medication Taken</p>`
    : "";

  const medData = encodeURIComponent(JSON.stringify(med)); // safely encode object

  // Safely handle potentially undefined fields
  const medicationName = med.medicationName || 'Unknown Medication';
  const dosage = med.dosage || 'No dosage specified';
  const frequency = med.frequency || 'No frequency specified';
  const iconType = med.iconType || 'tablet'; // default icon

  return `
    <div class="card shadow-sm markable-card medication-card" data-med='${medData}'
         style="max-width: 600px; width: 100%; cursor: pointer;">
      <div class="card-body d-flex align-items-center">
          <img src="assets/${iconType}.png" alt="${iconType}" width="40" height="40" class="me-3">
          <div class="flex-grow-1 text-start">
              <h6 class="fw-bold mb-1">${medicationName}</h6>
              <p class="mb-0 small">${dosage}, ${frequency}</p>
              <p class="mb-0 text-muted small">From ${med.startDate ? med.startDate.split("T")[0] : 'N/A'} to ${med.endDate ? med.endDate.split("T")[0] : 'N/A'}</p>
              ${takenLabel}
          </div>
          <div class="d-flex flex-column gap-1">
              <button class="btn btn-sm btn-outline-primary edit-btn">
                  <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger delete-btn">
                  <i class="bi bi-trash"></i>
              </button>
          </div>
      </div>
    </div>`;
}

// Click handling for mark taken / edit / delete
document.getElementById("medication-list").addEventListener("click", function (e) {
    const card = e.target.closest(".medication-card");
    if (!card) return;

    const med = JSON.parse(decodeURIComponent(card.dataset.med));

    if (e.target.closest(".edit-btn")) {
        openEditModal(med);
    } else if (e.target.closest(".delete-btn")) {
        openDeleteModal(med.scheduleId); // delete by scheduleId for each doseTime
    } else {
        openTakenModal(med);
    }
});

// Format HH:mm to 12-hour format
function formatTime12Hr(time) {
    const [hour, minute] = time.split(":");
    const h = parseInt(hour);
    const suffix = h >= 12 ? "PM" : "AM";
    const formatted = `${((h + 11) % 12 + 1)}:${minute} ${suffix}`;
    return formatted;
}

// Open Mark As Taken Modal
function openTakenModal(med) {
  document.getElementById("takenMedName").textContent = med.medicationName;
  document.getElementById("takenDosage").textContent = med.dosage;
  document.getElementById("takenFrequency").textContent = med.frequency;
  document.getElementById("takenDoseTime").textContent = med.doseTime;

  const checkbox = document.getElementById("markTakenCheckbox");
  const confirmBtn = document.getElementById("confirmTakenBtn");

  checkbox.checked = !!med.markAsTaken;
  confirmBtn.disabled = true;

  confirmBtn.dataset.scheduleId = med.scheduleId;
  confirmBtn.dataset.originalState = med.markAsTaken ? "1" : "0";

  const modal = new bootstrap.Modal(document.getElementById("takenModal"));
  modal.show();
    
}
    // Enable confirm button when checkbox is checked
    document.getElementById("markTakenCheckbox").addEventListener("change", function () {
        const confirmBtn = document.getElementById("confirmTakenBtn");
        const newState = this.checked ? "1" : "0";
        confirmBtn.disabled = newState === confirmBtn.dataset.originalState;
});

// Submit markAsTaken update
document.getElementById("confirmTakenBtn").addEventListener("click", async function () {
    const scheduleId = this.dataset.scheduleId;
    const newValue = document.getElementById("markTakenCheckbox").checked;

    try {
        const res = await fetch(`/api/medication-schedule/${scheduleId}/mark-taken`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ markAsTaken: newValue })
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to update");

        bootstrap.Modal.getInstance(document.getElementById("takenModal")).hide();
        showSuccessModal(newValue ? "Dose marked as taken" : "Dose unmarked");
    } catch (err) {
        alert("Error: " + err.message);
    }
});

// Open Edit Modal with prefilled values
function openEditModal(med) {
    document.getElementById("editScheduleId").value = med.scheduleId; // hidden field
    document.getElementById("editMedicationId").value = med.medicationId;
    document.getElementById("editMedicationName").value = med.medicationName;
    document.getElementById("editDosage").value = med.dosage;
    document.getElementById("editStartDate").value = med.startDate.split("T")[0];
    document.getElementById("editEndDate").value = med.endDate.split("T")[0];
    
    // Match doseTime for current scheduleId
    let matchedDoseTime = "";
    if (Array.isArray(med.scheduleIds) && Array.isArray(med.doseTimes)) {
        const index = med.scheduleIds.findIndex(id => id === med.scheduleId);
        if (index !== -1 && med.doseTimes[index]) {
            matchedDoseTime = new Date(med.doseTimes[index]).toISOString().substring(11, 16);
        }
    }
    document.getElementById("editDoseTime").value = matchedDoseTime;


    // Select the correct iconType radio button
    document.querySelectorAll('input[name="editIconType"]').forEach(radio => {
        radio.checked = radio.value === med.iconType;
    });

    // Select the correct frequency radio button
    document.querySelectorAll('input[name="editFrequency"]').forEach(radio => {
        radio.checked = radio.value === med.frequency;
    });

    const modal = new bootstrap.Modal(document.getElementById("editModal"));
    modal.show();
}

// Submit Update
document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editMedicationId").value;
    const payload = {
        scheduleId: document.getElementById("editScheduleId").value,
        medicationName: document.getElementById("editMedicationName").value,
        dosage: document.getElementById("editDosage").value,
        frequency: document.querySelector('input[name="editFrequency"]:checked')?.value,
        startDate: document.getElementById("editStartDate").value,
        endDate: document.getElementById("editEndDate").value,
        iconType: document.querySelector('input[name="editIconType"]:checked')?.value,
        doseTime: document.getElementById("editDoseTime").value,
    };

    try {
        const res = await fetch(`/api/medication/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Failed to update");

        bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
        showSuccessModal("Medication updated successfully");
    } catch (err) {
        alert("Error updating: " + err.message);
    }
});


// Open Delete Confirmation Modal
function openDeleteModal(id) {
    document.getElementById("confirmDeleteBtn").onclick = () => deleteMedication(id);
    const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
    modal.show();
}

// Delete Medication
async function deleteMedication(id) {
    try {
        const res = await fetch(`/api/medication-schedule/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
            }
        });
        const result = await res.json();

        if (!res.ok) throw new Error(result.error || "Failed to delete");

        bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
        showSuccessModal("Medication deleted successfully");
    } catch (e) {
        alert("Error deleting: " + e.message);
    }
}

// Show Success Modal
function showSuccessModal(message) {
    document.getElementById("successMessage").textContent = message;
    const modal = new bootstrap.Modal(document.getElementById("successModal"));
    modal.show();
    setTimeout(() => location.reload(), 2000);
}

// Smooth scroll to medications list
function scrollToMedications() {
    const medicationList = document.getElementById("medication-list");
    if (medicationList) {
        medicationList.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        // If no medications are visible, scroll to the container
        const container = document.querySelector('.container.mt-4');
        if (container) {
            container.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Add modern interaction effects
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-modern');
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
    
    // Add ripple animation keyframes
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
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
});

