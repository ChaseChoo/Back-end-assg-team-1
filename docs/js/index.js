// docs/js/index.js

// Ask for notification permission when page loads in
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Track notified medication keys per minute
let notifiedThisMinute = new Set(); // to avoid repeat alerts within a minute

/**
 *  Check medication schedules every 20 seconds
 *  only send reminders if current time matches scheduled doseTime
 *  reminderEnabled must be 1 in the database
 *  dose must not be already taken
 */
async function checkMedicationReminders() {
  const token = sessionStorage.getItem('authToken');
  if (!token) return; // Do nothing if user not logged in

  try {
    const res = await fetch("/api/medication-records", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to fetch medication records");

    console.log("[Reminder] JWT token found:", token);

    const medications = await res.json();
    const now = new Date();
    now.setSeconds(0, 0); // round to exact minute

    console.log("[Reminder] Now is", now.toTimeString().substring(0, 5));
    console.log("[Reminder] Medications fetched:", medications);

    medications.forEach(med => {
      (med.doseTimes || []).forEach((doseISO, i) => {
        // Extract HH and MM from ISO string (e.g., "1970-01-01T14:30:00.000Z")
        const [hh, mm] = doseISO.substring(11, 16).split(":");

        // creating a new Date object set to current day and target doseTime
        const doseTime = new Date(now); // clone current time
        doseTime.setHours(parseInt(hh), parseInt(mm), 0, 0); // override hour/min only

        // Extracting bool flags for each medication dose 
        const enabled = !!med.reminderEnabledFlags?.[i]; // true if reminder is enabled
        const taken = !!med.markAsTakenFlags?.[i]; // true if dose already taken
        const doseKey = doseTime.toTimeString().substring(0, 5);
        const key = `${med.medicationName}-${doseKey}`;

        // Show reminder only if everything matches
        if (
          doseTime.getTime() === now.getTime() &&
          enabled &&
          !taken &&
          !notifiedThisMinute.has(key)
        ) {
          showReminderNotification(med.medicationName, doseKey);
          notifiedThisMinute.add(key);

          // Allow future alert after 70s (next minute)
          setTimeout(() => notifiedThisMinute.delete(key), 70000);
        }
      });
    });

  } 
  catch (err) {
    console.error("Reminder check failed:", err.message);
  }
}

// Triggering notification for a medication
function showReminderNotification(medName, time) {
  const message = `It's ${time}. Time to take: ${medName}`;

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Medication Reminder", { body: message });
  } else {
    alert(message); // fallback if browser notifications blocked
  }
}

// DoseTime medication reminder checker
document.addEventListener("DOMContentLoaded", () => {
  checkMedicationReminders(); // run immediately on load
  setInterval(checkMedicationReminders, 20000); // then every 20s

  // Initialize i18n first
  setTimeout(() => {
    updateNavbarAuth();
  }, 100);
});

// Function to update navbar authentication area with i18n support
function updateNavbarAuth() {
  const authArea = document.getElementById("navbarAuthArea");
  const savedUsername = sessionStorage.getItem("username");

  if (authArea) {
    if (savedUsername) {
      authArea.innerHTML = `
        <a href="user-settings.html" class="btn btn-colour d-flex align-items-center gap-2 px-3 py-2">
          <i class="bi bi-person-circle fs-5"></i>
          <span id="navbarUsername">${savedUsername}</span>
        </a>
      `;
    } else {
      authArea.innerHTML = `
        <a href="user-login.html" class="btn btn-colour ms-3 login-btn" data-i18n="nav.login">Log In</a>
        <a href="user-registration.html" class="btn btn-colour ms-3 register-btn" data-i18n="nav.register">Register</a>
      `;
      
      // Apply translations to new elements if i18n is available
      if (window.i18n) {
        window.i18n.applyTranslations();
      }
    }
  }
}


// Lottie Animation For Loading for ALL html pages
window.addEventListener("load", function () {
  const loaderOverlay = document.getElementById("loader-overlay");
  setTimeout(() => {
    loaderOverlay.style.opacity = "0";
    setTimeout(() => {
      loaderOverlay.style.display = "none";
    }, 500); // fade-out duration for lottie animation
  }, 600); // Show for 0.6s before fade out
});
