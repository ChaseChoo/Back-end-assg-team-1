// Meal Logging JavaScript
let userToken = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuthentication();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('mealDate').value = today;
    
    // Load meal history
    loadMealHistory();
    
    // Bind form submission
    document.getElementById('mealForm').addEventListener('submit', handleMealSubmission);
    document.getElementById('saveMealChanges').addEventListener('click', handleMealUpdate);
});

function checkAuthentication() {
    userToken = sessionStorage.getItem('authToken'); // Changed from localStorage to sessionStorage
    const navbarAuthArea = document.getElementById('navbarAuthArea');
    
    if (userToken) {
        // User is logged in
        const username = sessionStorage.getItem('username') || 'User'; // Changed from localStorage to sessionStorage
        navbarAuthArea.innerHTML = `
            <span class="navbar-text me-3">Welcome, ${username}!</span>
            <button class="btn btn-outline-danger btn-sm" onclick="logout()">Logout</button>
        `;
    } else {
        // User is not logged in
        navbarAuthArea.innerHTML = `
            <a href="user-login.html" class="btn btn-outline-primary btn-sm me-2">Login</a>
            <a href="user-registration.html" class="btn btn-primary btn-sm">Register</a>
        `;
        
        // Redirect to login if not authenticated
        window.location.href = 'user-login.html';
        return;
    }
}

function logout() {
    sessionStorage.removeItem('token');     // Changed from localStorage to sessionStorage
    sessionStorage.removeItem('username');  // Changed from localStorage to sessionStorage
    sessionStorage.removeItem('userId');    // Changed from localStorage to sessionStorage
    window.location.href = 'index.html';
}

async function loadMealHistory() {
    if (!userToken) return;
    
    try {
        const response = await fetch('/api/meals', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const meals = await response.json();
            displayMealHistory(meals);
        } else {
            console.error('Failed to load meal history');
            showAlert('Failed to load meal history', 'danger');
        }
    } catch (error) {
        console.error('Error loading meal history:', error);
        showAlert('Error loading meal history', 'danger');
    }
}

function displayMealHistory(meals) {
    const mealHistoryContainer = document.getElementById('mealHistory');
    
    if (!meals || meals.length === 0) {
        mealHistoryContainer.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="bi bi-journal display-1"></i>
                <p>No meals logged yet. Add your first meal above!</p>
            </div>
        `;
        return;
    }
    
    // Sort meals by date (newest first)
    meals.sort((a, b) => new Date(b.mealPlanDateTime) - new Date(a.mealPlanDateTime));
    
    // Group meals by date
    const mealsByDate = meals.reduce((acc, meal) => {
        const date = new Date(meal.mealPlanDateTime).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(meal);
        return acc;
    }, {});
    
    let html = '';
    
    Object.keys(mealsByDate).forEach(date => {
        html += `
            <div class="mb-4">
                <h6 class="text-primary border-bottom pb-2">${date}</h6>
                <div class="row g-3">
        `;
        
        mealsByDate[date].forEach(meal => {
            const calories = meal.calories ? `${meal.calories} cal` : 'No calorie info';
            const mealTime = new Date(meal.mealPlanDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            html += `
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="card-title text-primary mb-0">${meal.foodName}</h6>
                                <div class="dropdown">
                                    <button class="btn btn-link btn-sm text-muted" type="button" data-bs-toggle="dropdown">
                                        <i class="bi bi-three-dots-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#" onclick="editMeal(${meal.mealID})">
                                            <i class="bi bi-pencil me-2"></i>Edit
                                        </a></li>
                                        <li><a class="dropdown-item text-danger" href="#" onclick="deleteMeal(${meal.mealID})">
                                            <i class="bi bi-trash me-2"></i>Delete
                                        </a></li>
                                    </ul>
                                </div>
                            </div>
                            <small class="text-muted">${mealTime}</small>
                            <br>
                            <small class="text-success">${calories}</small>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    mealHistoryContainer.innerHTML = html;
}

async function handleMealSubmission(event) {
    event.preventDefault();
    
    if (!userToken) {
        showAlert('Please log in to add meals', 'warning');
        return;
    }
    
    // Convert the form data to match the new MealPlan table structure
    const formData = {
        foodName: document.getElementById('foodItems').value, // Use foodItems as foodName
        calories: document.getElementById('calories').value ? document.getElementById('calories').value.toString() : "0", // Convert to string as expected by validation
        mealPlanDateTime: new Date(document.getElementById('mealDate').value + 'T' + new Date().toTimeString().split(' ')[0]).toISOString() // Combine date with current time
    };
    
    try {
        const response = await fetch('/api/meals', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showAlert('Meal added successfully!', 'success');
            document.getElementById('mealForm').reset();
            // Reset date to today
            document.getElementById('mealDate').value = new Date().toISOString().split('T')[0];
            // Reload meal history
            loadMealHistory();
        } else {
            const errorData = await response.json();
            showAlert(errorData.error || 'Failed to add meal', 'danger');
        }
    } catch (error) {
        console.error('Error adding meal:', error);
        showAlert('Error adding meal', 'danger');
    }
}

async function editMeal(mealId) {
    try {
        const response = await fetch(`/api/meals/${mealId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const meal = await response.json();
            
            // Populate edit form with new data structure
            document.getElementById('editMealId').value = meal.mealID;
            document.getElementById('editFoodItems').value = meal.foodName;
            document.getElementById('editCalories').value = meal.calories || '';
            document.getElementById('editMealDate').value = meal.mealPlanDateTime.split('T')[0];
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('editMealModal'));
            modal.show();
        } else {
            showAlert('Failed to load meal data', 'danger');
        }
    } catch (error) {
        console.error('Error loading meal for edit:', error);
        showAlert('Error loading meal data', 'danger');
    }
}

async function handleMealUpdate() {
    const mealId = document.getElementById('editMealId').value;
    
    const formData = {
        foodName: document.getElementById('editFoodItems').value,
        calories: document.getElementById('editCalories').value ? document.getElementById('editCalories').value.toString() : "0",
        mealPlanDateTime: new Date(document.getElementById('editMealDate').value + 'T' + new Date().toTimeString().split(' ')[0]).toISOString()
    };
    
    try {
        const response = await fetch(`/api/meals/${mealId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showAlert('Meal updated successfully!', 'success');
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editMealModal'));
            modal.hide();
            // Reload meal history
            loadMealHistory();
        } else {
            const errorData = await response.json();
            showAlert(errorData.error || 'Failed to update meal', 'danger');
        }
    } catch (error) {
        console.error('Error updating meal:', error);
        showAlert('Error updating meal', 'danger');
    }
}

async function deleteMeal(mealId) {
    if (!confirm('Are you sure you want to delete this meal? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/meals/${mealId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            showAlert('Meal deleted successfully!', 'success');
            loadMealHistory();
        } else {
            const errorData = await response.json();
            showAlert(errorData.error || 'Failed to delete meal', 'danger');
        }
    } catch (error) {
        console.error('Error deleting meal:', error);
        showAlert('Error deleting meal', 'danger');
    }
}

function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv && alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}
