// Medication Inventory Management JavaScript

// Global variables
let currentInventory = [];
let currentFamilyInventory = [];
let currentNotifications = [];

// Update navbar authentication state
function updateNavbarAuth() {
    const navbarAuthArea = document.getElementById('navbarAuthArea');
    const token = sessionStorage.getItem('authToken');
    const username = sessionStorage.getItem('username');
    
    if (token && username) {
        navbarAuthArea.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle me-1"></i>${username}
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="user-settings.html">
                        <i class="bi bi-gear me-2"></i>Settings
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()">
                        <i class="bi bi-box-arrow-right me-2"></i>Sign Out
                    </a></li>
                </ul>
            </div>
        `;
    } else {
        navbarAuthArea.innerHTML = `
            <a href="user-login.html" class="btn btn-primary">
                <i class="bi bi-box-arrow-in-right me-1"></i>Sign In
            </a>
        `;
    }
}

// Logout function
function logout() {
    sessionStorage.clear();
    window.location.href = 'user-login.html';
}

// Initialize the inventory system
function initializeInventory() {
    console.log('Initializing medication inventory...');
    
    // Check authentication
    const token = sessionStorage.getItem('authToken');
    if (!token) {
        showAuthRequired();
        return;
    }
    
    // Set up navigation authentication
    updateNavbarAuth();
    
    // Load initial data
    loadInventoryData();
    loadInventoryStats();
    loadNotifications();
    
    // Set up event listeners
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Add inventory item
    document.getElementById('saveInventoryItem').addEventListener('click', handleAddInventoryItem);
    
    // Update inventory item
    document.getElementById('updateInventoryItem').addEventListener('click', handleUpdateInventoryItem);
    
    // Take medication
    document.getElementById('confirmTakeMedication').addEventListener('click', handleTakeMedication);
    
    // Restock medication
    document.getElementById('confirmRestock').addEventListener('click', handleRestockMedication);
    
    // Refresh inventory
    document.getElementById('refreshInventory').addEventListener('click', function() {
        loadInventoryData();
        loadInventoryStats();
        loadNotifications();
    });
    
    // Tab switching
    document.getElementById('family-inventory-tab').addEventListener('click', function() {
        loadFamilyInventory();
    });
    
    // Form validation
    document.getElementById('addInventoryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleAddInventoryItem();
    });
    
    document.getElementById('editInventoryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleUpdateInventoryItem();
    });
}

// Load inventory data
async function loadInventoryData() {
    try {
        const response = await fetch('/api/inventory', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentInventory = data.data;
            displayInventory(currentInventory);
        } else {
            showError('Failed to load inventory: ' + data.message);
        }
    } catch (error) {
        console.error('Error loading inventory:', error);
        showError('Failed to load inventory. Please try again.');
    }
}

// Load family inventory
async function loadFamilyInventory() {
    try {
        const response = await fetch('/api/inventory/family', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentFamilyInventory = data.data;
            displayFamilyInventory(currentFamilyInventory);
        } else {
            showError('Failed to load family inventory: ' + data.message);
        }
    } catch (error) {
        console.error('Error loading family inventory:', error);
        showError('Failed to load family inventory. Please try again.');
    }
}

// Load inventory statistics
async function loadInventoryStats() {
    try {
        const response = await fetch('/api/inventory/stats', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            updateStatsDisplay(data.data);
        } else {
            console.error('Failed to load stats:', data.message);
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load notifications
async function loadNotifications() {
    try {
        const response = await fetch('/api/inventory/notifications', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentNotifications = data.data;
            displayNotifications(currentNotifications);
            updateNotificationBadge(data.data.filter(n => !n.isRead).length);
            
            // Send browser notifications for unread low stock alerts
            if (window.notificationManager) {
                data.data.forEach(notification => {
                    if (!notification.isRead && 
                        notification.notificationType === 'low_stock' &&
                        notification.message.includes('running low')) {
                        
                        // Extract medication name and stock count from message
                        const match = notification.message.match(/^(.+?) is running low\. Only (\d+) remaining\./);
                        if (match) {
                            const [, medicationName, remainingCount] = match;
                            window.notificationManager.sendLowStockAlert(medicationName, parseInt(remainingCount));
                        }
                    }
                });
            }
        } else {
            console.error('Failed to load notifications:', data.message);
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

// Display inventory items
function displayInventory(inventory) {
    const inventoryList = document.getElementById('inventoryList');
    const emptyState = document.getElementById('emptyInventoryState');
    
    if (inventory.length === 0) {
        inventoryList.innerHTML = '';
        emptyState.classList.remove('d-none');
        return;
    }
    
    emptyState.classList.add('d-none');
    
    inventoryList.innerHTML = inventory.map(item => {
        const stockClass = item.currentStock === 0 ? 'out-of-stock' : 
                          item.isLowStock ? 'low-stock' : '';
        
        const stockBadgeClass = item.currentStock === 0 ? 'out-of-stock-badge' : 
                               item.isLowStock ? 'low-stock-badge' : 'normal-stock-badge';
        
        const stockText = item.currentStock === 0 ? 'OUT OF STOCK' : 
                         item.isLowStock ? 'LOW STOCK' : 'IN STOCK';
        
        return `
            <div class="inventory-card ${stockClass}">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <div class="medication-name">${escapeHtml(item.medicationName)}</div>
                        <div class="stock-info">
                            <strong>${item.currentStock} ${item.unit}</strong>
                            ${item.lowStockThreshold ? `(Alert at ${item.lowStockThreshold})` : ''}
                        </div>
                        ${item.notes ? `<div class="text-muted small">${escapeHtml(item.notes)}</div>` : ''}
                        <div class="text-muted small">
                            Last updated: ${formatDate(item.lastUpdated)}
                        </div>
                    </div>
                    <div class="col-md-3 text-center">
                        <span class="stock-badge ${stockBadgeClass}">${stockText}</span>
                    </div>
                    <div class="col-md-3 text-end">
                        <div class="btn-group-vertical d-grid gap-2">
                            ${item.currentStock > 0 ? `
                                <button class="btn btn-success action-button" onclick="showTakeMedicationModal(${item.inventoryId}, '${escapeHtml(item.medicationName)}', ${item.currentStock})">
                                    <i class="bi bi-check-circle me-2"></i>Take
                                </button>
                            ` : ''}
                            <button class="btn btn-info action-button" onclick="showRestockModal(${item.inventoryId}, '${escapeHtml(item.medicationName)}', ${item.currentStock})">
                                <i class="bi bi-plus-circle me-2"></i>Restock
                            </button>
                            <button class="btn btn-warning action-button" onclick="showEditModal(${item.inventoryId})">
                                <i class="bi bi-pencil me-2"></i>Edit
                            </button>
                            <button class="btn btn-outline-danger action-button" onclick="deleteInventoryItem(${item.inventoryId}, '${escapeHtml(item.medicationName)}')">
                                <i class="bi bi-trash me-2"></i>Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Display family inventory
function displayFamilyInventory(inventory) {
    const familyInventoryList = document.getElementById('familyInventoryList');
    const emptyState = document.getElementById('emptyFamilyInventoryState');
    
    if (inventory.length === 0) {
        familyInventoryList.innerHTML = '';
        emptyState.classList.remove('d-none');
        return;
    }
    
    emptyState.classList.add('d-none');
    
    familyInventoryList.innerHTML = inventory.map(item => {
        const stockClass = item.currentStock === 0 ? 'out-of-stock' : 
                          item.isLowStock ? 'low-stock' : '';
        
        const stockBadgeClass = item.currentStock === 0 ? 'out-of-stock-badge' : 
                               item.isLowStock ? 'low-stock-badge' : 'normal-stock-badge';
        
        const stockText = item.currentStock === 0 ? 'OUT OF STOCK' : 
                         item.isLowStock ? 'LOW STOCK' : 'IN STOCK';
        
        return `
            <div class="inventory-card family-inventory-card ${stockClass}">
                <div class="owner-info">
                    <i class="bi bi-person me-1"></i>
                    ${escapeHtml(item.ownerName)} (${escapeHtml(item.relationship)})
                </div>
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <div class="medication-name">${escapeHtml(item.medicationName)}</div>
                        <div class="stock-info">
                            <strong>${item.currentStock} ${item.unit}</strong>
                            ${item.lowStockThreshold ? `(Alert at ${item.lowStockThreshold})` : ''}
                        </div>
                        <div class="text-muted small">
                            Last updated: ${formatDate(item.lastUpdated)}
                        </div>
                    </div>
                    <div class="col-md-4 text-center">
                        <span class="stock-badge ${stockBadgeClass}">${stockText}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Display notifications
function displayNotifications(notifications) {
    const notificationsList = document.getElementById('notificationsList');
    const emptyState = document.getElementById('emptyNotificationsState');
    
    if (notifications.length === 0) {
        notificationsList.innerHTML = '';
        emptyState.classList.remove('d-none');
        return;
    }
    
    emptyState.classList.add('d-none');
    
    notificationsList.innerHTML = notifications.map(notification => {
        const readClass = notification.isRead ? 'opacity-75' : '';
        
        return `
            <div class="notification-item ${readClass}" ${!notification.isRead ? `onclick="markNotificationAsRead(${notification.notificationId})"` : ''} style="cursor: ${!notification.isRead ? 'pointer' : 'default'};">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                            <strong>${notification.notificationType.replace('_', ' ').toUpperCase()}</strong>
                            ${!notification.isRead ? '<span class="badge bg-primary ms-2">New</span>' : ''}
                        </div>
                        <p class="mb-1">${escapeHtml(notification.message)}</p>
                        <small class="text-muted">${formatDate(notification.createdAt)}</small>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Update statistics display
function updateStatsDisplay(stats) {
    document.getElementById('totalMedications').textContent = stats.totalMedications || 0;
    document.getElementById('lowStockCount').textContent = stats.lowStockCount || 0;
    document.getElementById('outOfStockCount').textContent = stats.outOfStockCount || 0;
    document.getElementById('totalStock').textContent = stats.totalStock || 0;
}

// Update notification badge
function updateNotificationBadge(count) {
    const badge = document.getElementById('notificationBadge');
    if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.classList.remove('d-none');
    } else {
        badge.classList.add('d-none');
    }
}

// Handle adding inventory item
async function handleAddInventoryItem() {
    const form = document.getElementById('addInventoryForm');
    const formData = new FormData(form);
    
    const inventoryData = {
        medicationName: formData.get('medicationName') || document.getElementById('medicationName').value,
        currentStock: parseInt(document.getElementById('currentStock').value),
        lowStockThreshold: parseInt(document.getElementById('lowStockThreshold').value) || 5,
        unit: document.getElementById('unit').value,
        notes: document.getElementById('notes').value
    };
    
    // Validation
    if (!inventoryData.medicationName || inventoryData.medicationName.trim() === '') {
        showError('Please enter a medication name');
        return;
    }
    
    if (isNaN(inventoryData.currentStock) || inventoryData.currentStock < 0) {
        showError('Please enter a valid current stock amount');
        return;
    }
    
    try {
        const response = await fetch('/api/inventory', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inventoryData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('Medication added to inventory successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('addInventoryModal'));
            modal.hide();
            form.reset();
            loadInventoryData();
            loadInventoryStats();
            loadNotifications();
        } else {
            showError('Failed to add medication: ' + data.message);
        }
    } catch (error) {
        console.error('Error adding inventory item:', error);
        showError('Failed to add medication. Please try again.');
    }
}

// Show edit modal
function showEditModal(inventoryId) {
    const item = currentInventory.find(item => item.inventoryId === inventoryId);
    if (!item) {
        showError('Inventory item not found');
        return;
    }
    
    document.getElementById('editInventoryId').value = inventoryId;
    document.getElementById('editMedicationName').value = item.medicationName;
    document.getElementById('editCurrentStock').value = item.currentStock;
    document.getElementById('editLowStockThreshold').value = item.lowStockThreshold;
    document.getElementById('editUnit').value = item.unit;
    document.getElementById('editNotes').value = item.notes || '';
    
    const modal = new bootstrap.Modal(document.getElementById('editInventoryModal'));
    modal.show();
}

// Handle updating inventory item
async function handleUpdateInventoryItem() {
    const inventoryId = document.getElementById('editInventoryId').value;
    
    const inventoryData = {
        medicationName: document.getElementById('editMedicationName').value,
        currentStock: parseInt(document.getElementById('editCurrentStock').value),
        lowStockThreshold: parseInt(document.getElementById('editLowStockThreshold').value),
        unit: document.getElementById('editUnit').value,
        notes: document.getElementById('editNotes').value
    };
    
    // Validation
    if (!inventoryData.medicationName || inventoryData.medicationName.trim() === '') {
        showError('Please enter a medication name');
        return;
    }
    
    if (isNaN(inventoryData.currentStock) || inventoryData.currentStock < 0) {
        showError('Please enter a valid current stock amount');
        return;
    }
    
    try {
        const response = await fetch(`/api/inventory/${inventoryId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inventoryData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('Medication updated successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editInventoryModal'));
            modal.hide();
            loadInventoryData();
            loadInventoryStats();
            loadNotifications();
        } else {
            showError('Failed to update medication: ' + data.message);
        }
    } catch (error) {
        console.error('Error updating inventory item:', error);
        showError('Failed to update medication. Please try again.');
    }
}

// Show take medication modal
function showTakeMedicationModal(inventoryId, medicationName, currentStock) {
    document.getElementById('takeMedicationId').value = inventoryId;
    document.getElementById('takeMedicationName').textContent = medicationName;
    document.getElementById('currentStockDisplay').textContent = currentStock;
    document.getElementById('quantityTaken').value = 1;
    document.getElementById('quantityTaken').max = currentStock;
    
    const modal = new bootstrap.Modal(document.getElementById('takeMedicationModal'));
    modal.show();
}

// Handle taking medication
async function handleTakeMedication() {
    const inventoryId = document.getElementById('takeMedicationId').value;
    const quantityTaken = parseInt(document.getElementById('quantityTaken').value);
    
    if (isNaN(quantityTaken) || quantityTaken <= 0) {
        showError('Please enter a valid quantity');
        return;
    }
    
    try {
        const response = await fetch(`/api/inventory/${inventoryId}/take`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantityTaken })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('Medication taken and stock updated!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('takeMedicationModal'));
            modal.hide();
            loadInventoryData();
            loadInventoryStats();
            loadNotifications();
        } else {
            showError('Failed to update stock: ' + data.message);
        }
    } catch (error) {
        console.error('Error taking medication:', error);
        showError('Failed to update stock. Please try again.');
    }
}

// Show restock modal
function showRestockModal(inventoryId, medicationName, currentStock) {
    document.getElementById('restockMedicationId').value = inventoryId;
    document.getElementById('restockMedicationName').textContent = medicationName;
    document.getElementById('restockCurrentStockDisplay').textContent = currentStock;
    document.getElementById('quantityAdded').value = 1;
    
    const modal = new bootstrap.Modal(document.getElementById('restockModal'));
    modal.show();
}

// Handle restocking medication
async function handleRestockMedication() {
    const inventoryId = document.getElementById('restockMedicationId').value;
    const quantityAdded = parseInt(document.getElementById('quantityAdded').value);
    
    if (isNaN(quantityAdded) || quantityAdded <= 0) {
        showError('Please enter a valid quantity');
        return;
    }
    
    try {
        const response = await fetch(`/api/inventory/${inventoryId}/restock`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantityAdded })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('Stock updated successfully!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('restockModal'));
            modal.hide();
            loadInventoryData();
            loadInventoryStats();
            loadNotifications();
        } else {
            showError('Failed to update stock: ' + data.message);
        }
    } catch (error) {
        console.error('Error restocking medication:', error);
        showError('Failed to update stock. Please try again.');
    }
}

// Delete inventory item
async function deleteInventoryItem(inventoryId, medicationName) {
    if (!confirm(`Are you sure you want to delete ${medicationName} from your inventory?`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/inventory/${inventoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('Medication removed from inventory');
            loadInventoryData();
            loadInventoryStats();
        } else {
            showError('Failed to delete medication: ' + data.message);
        }
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        showError('Failed to delete medication. Please try again.');
    }
}

// Mark notification as read
async function markNotificationAsRead(notificationId) {
    try {
        const response = await fetch(`/api/inventory/notifications/${notificationId}/read`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadNotifications();
        }
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

// Utility functions
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function showSuccess(message) {
    // Create and show success toast/alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

function showError(message) {
    // Create and show error toast/alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        <i class="bi bi-exclamation-triangle-fill me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

function showAuthRequired() {
    document.getElementById('loadingState').classList.add('d-none');
    document.getElementById('authRequiredMessage').classList.remove('d-none');
    document.getElementById('mainContent').classList.add('d-none');
}

// Export functions for global access
window.initializeInventory = initializeInventory;
window.showTakeMedicationModal = showTakeMedicationModal;
window.showRestockModal = showRestockModal;
window.showEditModal = showEditModal;
window.deleteInventoryItem = deleteInventoryItem;
window.markNotificationAsRead = markNotificationAsRead;
window.logout = logout;
