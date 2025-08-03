// Ask Us Support System - Replaces chatbot functionality
document.addEventListener("DOMContentLoaded", () => {
    const supportBtn = document.getElementById("support-button");
    const supportBox = document.getElementById("support-box");
    const closeBtn = document.getElementById("close-support");
    const hotlineBtn = document.getElementById("hotline-btn");
    const formBtn = document.getElementById("form-btn");
    const supportOptions = document.getElementById("support-options");
    const askUsForm = document.getElementById("ask-us-form");
    const backBtn = document.getElementById("back-to-options");
    const submitForm = document.getElementById("support-form");

    // When support icon is clicked, show support window
    supportBtn.addEventListener("click", () => {
        supportBox.classList.toggle("d-none");
        supportBtn.classList.add("hidden");
        showSupportOptions();
    });

    // When support is closed, show support icon
    closeBtn.addEventListener("click", () => {
        supportBox.classList.add("d-none");
        supportBtn.classList.remove("hidden");
    });

    // Show hotline information
    hotlineBtn.addEventListener("click", () => {
        showHotlineInfo();
    });

    // Show Ask Us form
    formBtn.addEventListener("click", () => {
        showAskUsForm();
    });

    // Back to main options
    backBtn.addEventListener("click", () => {
        showSupportOptions();
    });

    // Handle form submission
    submitForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await handleFormSubmission();
    });

    function showSupportOptions() {
        supportOptions.classList.remove("d-none");
        askUsForm.classList.add("d-none");
        document.getElementById("hotline-info").classList.add("d-none");
    }

    function showHotlineInfo() {
        supportOptions.classList.add("d-none");
        askUsForm.classList.add("d-none");
        document.getElementById("hotline-info").classList.remove("d-none");
    }

    function showAskUsForm() {
        supportOptions.classList.add("d-none");
        askUsForm.classList.remove("d-none");
        document.getElementById("hotline-info").classList.add("d-none");
    }

    async function handleFormSubmission() {
        const formData = {
            name: document.getElementById("user-name").value,
            email: document.getElementById("user-email").value,
            category: document.getElementById("help-category").value,
            priority: document.getElementById("priority-level").value,
            subject: document.getElementById("help-subject").value,
            message: document.getElementById("help-message").value,
            preferredContact: document.querySelector('input[name="contact-method"]:checked')?.value,
            timestamp: new Date().toISOString()
        };

        try {
            // Show loading state
            const submitBtn = document.querySelector('#support-form button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
            submitBtn.disabled = true;

            // Here you would normally send to your backend
            // For now, we'll simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            showSuccessMessage(formData);
            
            // Reset form
            submitForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

        } catch (error) {
            console.error('Error submitting support request:', error);
            showErrorMessage();
        }
    }

    function showSuccessMessage(data) {
        const successHtml = `
            <div class="text-center p-4">
                <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
                <h6 class="mt-3 mb-2">Request Submitted Successfully!</h6>
                <p class="text-muted small mb-3">Thank you ${data.name}! We've received your ${data.category.toLowerCase()} request.</p>
                <div class="bg-light p-3 rounded text-start mb-3">
                    <small>
                        <strong>Reference ID:</strong> SUP-${Date.now().toString().slice(-6)}<br>
                        <strong>Category:</strong> ${data.category}<br>
                        <strong>Priority:</strong> ${data.priority}<br>
                        ${data.priority === 'Urgent' ? '<strong class="text-danger">Expected Response:</strong> Within 2 hours<br>' : ''}
                        ${data.priority === 'Normal' ? '<strong>Expected Response:</strong> Within 24 hours<br>' : ''}
                        ${data.priority === 'Low' ? '<strong>Expected Response:</strong> Within 2-3 business days<br>' : ''}
                    </small>
                </div>
                <p class="small text-muted">
                    We'll contact you via ${data.preferredContact} at ${data.preferredContact === 'email' ? data.email : 'your phone number'}.
                </p>
                <button class="btn btn-primary btn-sm" onclick="document.getElementById('close-support').click()">
                    Close
                </button>
            </div>
        `;
        
        askUsForm.innerHTML = successHtml;
    }

    function showErrorMessage() {
        const errorHtml = `
            <div class="alert alert-danger text-center">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>Submission Failed</strong><br>
                <small>Please try again or call our hotline for immediate assistance.</small>
                <br><br>
                <button class="btn btn-outline-danger btn-sm" onclick="location.reload()">
                    Try Again
                </button>
            </div>
        `;
        
        document.getElementById("ask-us-form").insertAdjacentHTML('afterbegin', errorHtml);
    }
});

// Helper function to get current time in user's timezone
function getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZoneName: 'short'
    });
}
