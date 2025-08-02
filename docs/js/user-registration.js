document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const alertBox = document.getElementById("alertBox"); // alert box for success/errors

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Extracting user inputs
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      // send registration data to the backend
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Save the token to sessionStorage
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("username", result.username); // saved dynamic username UI display

        // Show success message
        alertBox.className = "alert alert-success";
        alertBox.textContent = "Registration successful! Redirecting...";
        alertBox.classList.remove("d-none");

        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = "user-login.html";
        }, 2000);
      } else {
        // Handle server-side validation errors
        alertBox.className = "alert alert-danger";
        alertBox.textContent = result.message || "Registration failed.";
        alertBox.classList.remove("d-none");
      }
    } catch (error) {
      // Handle unexpected server or network errors
      console.error("Error during registration:", error);
      alertBox.className = "alert alert-danger";
      alertBox.textContent = "Something went wrong. Please try again.";
      alertBox.classList.remove("d-none");
    }
    });

    // Password toggle logic
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
