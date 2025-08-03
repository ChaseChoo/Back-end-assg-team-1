// Wait until the DOM is fully loaded before attaching event listeners

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm"); // Login form element
  const alertBox = document.getElementById("alertBox"); // Alert box for displaying messages

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)

    // Get trimmed values from input fields
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      // Send POST request to backend API to attempt login
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Sending JSON body
        },
        body: JSON.stringify({ email, password }), // payload with email + password
      });

      const result = await response.json();
      console.log("Response status:", response.status);
      console.log("Response body:", result);

      if (response.ok) {
        // On successful login save token and username in sessionStorage
        sessionStorage.setItem("authToken", result.token);
        sessionStorage.setItem("userId", result.userId)
        sessionStorage.setItem("username", result.username);
        sessionStorage.setItem("email", result.email);
        sessionStorage.setItem("languagePreference", result.languagePreference || 'en');

        // Show success message and redirect after 2 seconds
        alertBox.className = "alert alert-success";
        alertBox.textContent = "Login successful! Redirecting...";
        alertBox.classList.remove("d-none");

        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      } else {
        // displays below the login/signup showing 
        // incorrect credentials or server errors
        alertBox.className = "alert alert-danger";
        alertBox.textContent = result.message || "Login failed.";
        alertBox.classList.remove("d-none");
      }
    } catch (error) {
      // handles network errors
      console.error("Login error:", error);
      alertBox.className = "alert alert-danger";
      alertBox.textContent = "Something went wrong. Please try again.";
      alertBox.classList.remove("d-none");
    }
  });

  // Password visibility toggle
  document.querySelectorAll(".toggle-password").forEach(icon => {
    icon.addEventListener("click", function () {
      const targetInput = document.getElementById(this.dataset.target);
      if (targetInput.type === "password") {
        targetInput.type = "text";
        this.classList.replace("bi-eye-slash", "bi-eye");
      } else {
        targetInput.type = "password";
        this.classList.replace("bi-eye", "bi-eye-slash");
      }
    });
  });
});
