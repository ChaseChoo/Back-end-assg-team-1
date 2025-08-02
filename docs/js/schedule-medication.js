
// Wait for DOM to fully load before executing script
document.addEventListener("DOMContentLoaded", () => {

  // Redirect unauthenticated users
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.href = "user-login.html"; 
    return;
  }

  // Retrieve medication data values from sessionStorage (add-medication.html page)
  const medicationId = sessionStorage.getItem("latestMedicationId");
  const medicationName = sessionStorage.getItem("latestMedicationName");
  const iconType = sessionStorage.getItem("latestIconType");
  const userId = sessionStorage.getItem("latestUserId");

  // Populate UI with medication information
  // Dynamically display medication name from (add-medication.html page)
  document.getElementById("medicationNameDisplay").textContent = medicationName;
  // Dynamically display medication icon from (add-medication.html page)
  document.getElementById("medicationIcon").src = `assets/${iconType}.png`;
  document.getElementById("medicationIcon").alt = iconType;

  // Handle form submission
  const scheduleForm = document.getElementById("scheduleForm");

  // Add event listener to "+ Add Another Time" button to clone time input
  const addDoseTimeBtn = document.getElementById("addDoseTimeBtn");
  const doseTimeContainer = document.getElementById("doseTimeContainer");

  if (addDoseTimeBtn && doseTimeContainer) {
      addDoseTimeBtn.addEventListener("click", () => {
      const newRow = document.createElement("div");
      newRow.className = "row align-items-center mb-2";

      newRow.innerHTML = `
        <div class="col-11">
          <input type="time" class="form-control input-outline doseTimeInput" required>
        </div>
        <div class="col-1 text-end">
          <button type="button" class="btn btn-outline-danger btn-sm remove-time-btn">
            <i class="bi bi-x-circle"></i>
          </button>
        </div>`;

      // Add event listener to remove this time row
      newRow.querySelector(".remove-time-btn").addEventListener("click", () => {
        newRow.remove();
      });

      doseTimeContainer.appendChild(newRow);
    });
  }

  // Check if schedule form exists on the html page
  if (scheduleForm) {
    // Event listener for schedule form submission
    scheduleForm.addEventListener("submit", async (e) => {
      // Prevent default form submission behaviour (page reloads)
      e.preventDefault();

      // Boolean reminder toggle state stored as BIT in database
      const reminderEnabled = document.getElementById("reminderToggle").checked === true;

      // Gather all doseTime inputs in HH:MM:SS format for SQL
      const doseTimeInputs = document.querySelectorAll(".doseTimeInput");
      const schedules = [...doseTimeInputs].map(input => ({
        userId: parseInt(userId),                // Convert string to integer for database
        medicationId: parseInt(medicationId),    // Convert string to integer for database
        doseTime: input.value + ":00",           // set as HH:MM:SS format for SQL
        reminderEnabled
      }));

      try {
        // Send multiple POST requests to create all medication schedules
        const responses = await Promise.all(
          schedules.map(payload =>
            fetch("/api/medication-schedule", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
              },
              body: JSON.stringify(payload) // Convert payload obj into a JSON string
            })
          )
        );

        for (const res of responses) {
          if (res.status === 401 || res.status === 403) {
            alert("Session expired or unauthorized. Please log in again.");
            window.location.href = "user-login.html";
            return;
          }

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Some schedules failed to save");
          }
        }

        // Show Bootstrap success modal to user
        const modal = new bootstrap.Modal(document.getElementById("successModal"));
        modal.show();

        // Automatically redirect user after creating a medication schedule
        setTimeout(() => {
          window.location.href = "medication.html";
        }, 2000); // Redirect user after 2 seconds

      } catch (err) {
        alert("Error: " + err.message);
      }
    });
  }
});

/** 
 * NOTE: The reminder only works if the user is LOGGED IN and 
 * if notifications are enabled in localhost:3000
 * Ensure computer does NOT have Do Not Disturb on 
 * to prevent notification from being suppressed
*/ 