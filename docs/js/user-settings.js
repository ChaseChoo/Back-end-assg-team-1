document.addEventListener("DOMContentLoaded", () => {
    // Retrieve JWT token from sessionStorage
    const token = sessionStorage.getItem('authToken');

    if (!token) {
        alert("You must be logged in to access this page.");
        window.location.href = "user-login.html";
        return;
    }

    // Prefill form with sessionStorage stored values 
    document.getElementById("username").value = sessionStorage.getItem("username") || "";
    document.getElementById("email").value = sessionStorage.getItem("email") || "";
    
    // Prefill language preference
    const currentLanguage = sessionStorage.getItem("languagePreference") || 'en';
    document.getElementById("languageSelect").value = currentLanguage;

    // DOM Refererences 
    const updateForm = document.getElementById("updateUserForm");
    const updateMsg = document.getElementById("updateMsg");
    const languageForm = document.getElementById("languageForm");
    const languageMsg = document.getElementById("languageMsg");
    const deleteBtn = document.getElementById("deleteAccountBtn");
    const deleteMsg = document.getElementById("deleteMsg");
    const logoutBtn = document.getElementById("logoutBtn"); 

    // Handles Update Profile
    updateForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // prevent default form submission

        // extracting the values from input fields
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            // sending PUT req to update the user 
            const res = await fetch("/api/users/update", {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ username, email, password })
        });

        // handle unauthorised access
        if (res.status === 401 || res.status === 403) {
            alert("Session expired or unauthorized. Please log in again.");
            sessionStorage.clear();
            window.location.href = "user-login.html";
            return;
        }

        const data = await res.json();

        if (res.ok) {
            // if update successful, show message and update session storage
            updateMsg.className = "text-success";
            updateMsg.textContent = "Profile updated successfully!";
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("email", email);
            updateForm.reset();
        } 
        else {
            // if update fail return error
            updateMsg.className = "text-danger";
            updateMsg.textContent = data.error || data.message || "Update failed.";
        }
        } 
        catch (err) {
            // unexpected or network errors
            updateMsg.className = "text-danger";
            updateMsg.textContent = "Something went wrong.";
            console.error(err);
        }
    });

    // Handle Language Preference Update
    languageForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const selectedLanguage = document.getElementById("languageSelect").value;

        try {
            const res = await fetch("/api/users/language", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ languagePreference: selectedLanguage })
            });

            if (res.status === 401 || res.status === 403) {
                alert("Session expired or unauthorized. Please log in again.");
                sessionStorage.clear();
                window.location.href = "user-login.html";
                return;
            }

            const data = await res.json();

            if (res.ok) {
                // Update successful, save to sessionStorage and switch language
                sessionStorage.setItem("languagePreference", selectedLanguage);
                languageMsg.className = "text-success";
                languageMsg.textContent = "Language preference updated successfully!";
                
                // Switch language using i18n
                if (window.i18n) {
                    await window.i18n.switchLanguage(selectedLanguage);
                }
            } else {
                languageMsg.className = "text-danger";
                languageMsg.textContent = data.message || "Language update failed.";
            }
        } catch (err) {
            languageMsg.className = "text-danger";
            languageMsg.textContent = "Something went wrong.";
            console.error(err);
        }
    });

  // Handle Account Deletion (PERMANENT)
  // if deleted, database will cascade and delete all information related to user
  deleteBtn.addEventListener("click", async () => {
    const confirmDelete = confirm("Are you sure you want to permanently delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
        // sending DELETE req to DELETE the user 
        const res = await fetch("/api/users/delete", {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${token}`
            }
        });   
      
        // Handles unauthorised access
        if (res.status === 401 || res.status === 403) {
            alert("Session expired or unauthorized. Please log in again.");
            sessionStorage.clear();
            window.location.href = "user-login.html";
            return;
        }

        const data = await res.json();

        if (res.ok) {
            // Delete success, show message and redirect user to index page
            deleteMsg.className = "text-success";
            deleteMsg.textContent = "Your account has been deleted. Redirecting...";
            sessionStorage.clear();
            setTimeout(() => {
            window.location.href = "index.html";
            }, 2000);
        } 
        else {
            // Delete failed, show error message
            deleteMsg.className = "text-danger";
            deleteMsg.textContent = data.error || data.message || "Account deletion failed.";
        }
        } 
        catch (err) {
            // Network error or unexpected error
            deleteMsg.className = "text-danger";
            deleteMsg.textContent = "Something went wrong.";
            console.error(err);
        }
    });

    // Handles logout and clears ALL sessionStorage and redirect user to login page
    // once sessionStorage is cleared there won't be a valid bearer token
    // can only have another token if account is logged in again
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = "user-login.html";
        });
    }
});
