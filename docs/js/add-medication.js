// Linked to add-medication.html

// Wait for DOM to fully load before executing script
document.addEventListener("DOMContentLoaded", () => {

  // Redirect unauthenticated users to login if no token found
  const token = sessionStorage.getItem('authToken');
  if (!token) {
    window.location.href = "user-login.html"; 
    return;
  }

  // Reference to the medication form element
  const form = document.getElementById("medicationForm");

  // Target both startDate and endDate inputs
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");

  // Set minimum selectable dates to today
  if (startDateInput && endDateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const minDate = `${yyyy}-${mm}-${dd}`;

    // Set minimum date to today
    startDateInput.min = minDate;
    endDateInput.min = minDate;

    // Optional: update endDate.min dynamically when startDate is selected
    startDateInput.addEventListener("change", () => {
      endDateInput.min = startDateInput.value;
    });
  }

  // Check if form exists on the page
  if (form) {
    // Event listener for form submission
    form.addEventListener("submit", async (e) => {
      // Prevent default form submission behaviour (page reloads)
      e.preventDefault();

      // Create formData object to extract form fields values
      const formData = new FormData(form);
      // Convert formdata to plain JS objects for JSON
      const data = Object.fromEntries(formData.entries());

      try {
        // Send POST request to database API endpoint
        const res = await fetch("/api/medication", {
          method: "POST",
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
          },
          body: JSON.stringify(data), // Convert form data to JSON strings
        });

        // Check for authentication errors before trying to parse
        if (res.status === 401 || res.status === 403) {
            alert("Session expired or unauthorized. Please log in again.");
            window.location.href = "user-login.html";
            return;
        }

        // Parse JSON response
        const result = await res.json();

        // Check if req was successful and throw error if it fails
        if (!res.ok) throw new Error(result.error || "Error submitting medication.");

        // Store data in sessionStorage for schedule page
        // Allows schedule html page to access medication details
        sessionStorage.setItem("latestMedicationId", result.medicationId);
        sessionStorage.setItem("latestMedicationName", data.medicationName);
        sessionStorage.setItem("latestIconType", data.iconType);
        sessionStorage.setItem("latestUserId", data.userId);

        // Show Bootstrap success modal to user
        const modal = new bootstrap.Modal(document.getElementById("successModal"));
        modal.show();

        // Redirect after user clicks on button to schedule-medication.html page
        document.getElementById("goToSchedule").addEventListener("click", () => {
          window.location.href = "schedule-medication.html";
        });

        // Reset form fields after submission
        form.reset();
      } 
      catch (err) {
          const feedback = document.getElementById("formFeedback");
          feedback.textContent = err.message;
          feedback.className = "text-danger";
      }
    });
  }

    // RxNav autocomplete logic
    const medInput = document.getElementById("medicationName"); // medication name input
    const suggestionBox = document.getElementById("medSuggestions"); // Suggestion dropdown

    // Timer delay to delay API calls each time u type a character
    // to prevent too many API calls
    let debounce; 

    // Listen for user typing in the medication input field
    medInput.addEventListener("input", () => {
      const query = medInput.value.trim(); // trim whitespaces

      suggestionBox.innerHTML = ""; // Clear old suggestions
      if (debounce) clearTimeout(debounce); // Cancel previous debounce timer
      if (query.length < 3) return; // don't search if less than 3 characters

      // Apply API call delay of 300ms
      debounce = setTimeout(async () => {
        try {
          // Fetch autocomplete suggestions from backend
          const res = await fetch(`/api/medication-suggestions?name=${query}`);

          if (!res.ok) throw new Error(`RxNav API returned ${res.status}`);
          const data = await res.json();

          const suggestions = new Set(); // use to avoid dupes
          const groups = data?.drugGroup?.conceptGroup || [];

           // Loop through all drug names
          groups.forEach(group => {
            (group.conceptProperties || []).forEach(prop => {
              const rawName = prop.name;

              // Match first compound name with dosage (e.g. acetaminophen 500 MG)
              const match = rawName.match(/^[\w\s\-]+?\s\d+\s?(MG|ML|G|MCG)/i);

              if (match) {
                const cleanedName = match[0].trim();
                suggestions.add(cleanedName);
              }
            });
          });

          // Render top 5 matches
          [...suggestions].slice(0, 5).forEach(name => {
            const div = document.createElement("div");
            div.className = "list-group-item list-group-item-action";
            div.textContent = name;
            div.addEventListener("click", () => {
              medInput.value = name;
              suggestionBox.innerHTML = "";
            });
            suggestionBox.appendChild(div);
          });

          // If no matches found, show placeholder message
          if (suggestions.size === 0) {
            suggestionBox.innerHTML = '<div class="list-group-item">No matches</div>';
          }

        } catch (err) {
          console.error("RxNav error:", err);
          suggestionBox.innerHTML = '<div class="list-group-item text-danger">API error</div>';
        }
      }, 300); // end debounce
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (!medInput.contains(e.target) && !suggestionBox.contains(e.target)) {
        suggestionBox.innerHTML = "";
      }
    });
});