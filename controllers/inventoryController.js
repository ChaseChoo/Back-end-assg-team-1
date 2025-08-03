const MedicationInventoryModel = require('../models/medicationInventoryModel');

class InventoryController {
    // GET /api/inventory - Get user's medication inventory
    static async getUserInventory(req, res) {
        try {
            const userId = req.user.userId;
            const inventory = await MedicationInventoryModel.getInventoryByUserId(userId);
            
            res.status(200).json({
                success: true,
                message: 'Inventory retrieved successfully',
                data: inventory
            });
        } catch (error) {
            console.error('Error fetching user inventory:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching inventory',
                error: error.message
            });
        }
    }
    
    // GET /api/inventory/family - Get family members' shared inventory
    static async getFamilyInventory(req, res) {
        try {
            const userId = req.user.userId;
            const inventory = await MedicationInventoryModel.getFamilyInventory(userId);
            
            res.status(200).json({
                success: true,
                message: 'Family inventory retrieved successfully',
                data: inventory
            });
        } catch (error) {
            console.error('Error fetching family inventory:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching family inventory',
                error: error.message
            });
        }
    }
    
    // POST /api/inventory - Add new inventory item
    static async addInventoryItem(req, res) {
        try {
            const userId = req.user.userId;
            const { medicationId, medicationName, currentStock, lowStockThreshold, unit, notes } = req.body;
            
            // Validation
            if (!medicationName || currentStock === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Medication name and current stock are required'
                });
            }
            
            if (currentStock < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Stock quantity cannot be negative'
                });
            }
            
            const inventoryData = {
                userId,
                medicationId: medicationId || null,
                medicationName: medicationName.trim(),
                currentStock: parseInt(currentStock),
                lowStockThreshold: parseInt(lowStockThreshold) || 5,
                unit: unit || 'pills',
                notes: notes ? notes.trim() : null
            };
            
            const result = await MedicationInventoryModel.addInventoryItem(inventoryData);
            
            res.status(201).json({
                success: true,
                message: 'Inventory item added successfully',
                data: { inventoryId: result.inventoryId }
            });
        } catch (error) {
            console.error('Error adding inventory item:', error);
            res.status(500).json({
                success: false,
                message: 'Error adding inventory item',
                error: error.message
            });
        }
    }
    
    // PUT /api/inventory/:id - Update inventory item
    static async updateInventoryItem(req, res) {
        try {
            const userId = req.user.userId;
            const inventoryId = parseInt(req.params.id);
            const { medicationName, currentStock, lowStockThreshold, unit, notes } = req.body;
            
            // Validation
            if (!medicationName || currentStock === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Medication name and current stock are required'
                });
            }
            
            if (currentStock < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Stock quantity cannot be negative'
                });
            }
            
            const inventoryData = {
                userId,
                medicationName: medicationName.trim(),
                currentStock: parseInt(currentStock),
                lowStockThreshold: parseInt(lowStockThreshold) || 5,
                unit: unit || 'pills',
                notes: notes ? notes.trim() : null
            };
            
            const success = await MedicationInventoryModel.updateInventoryItem(inventoryId, inventoryData);
            
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Inventory item not found or unauthorized'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Inventory item updated successfully'
            });
        } catch (error) {
            console.error('Error updating inventory item:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating inventory item',
                error: error.message
            });
        }
    }
    
    // PUT /api/inventory/:id/take - Update stock when medication is taken
    static async takeMedication(req, res) {
        try {
            const userId = req.user.userId;
            const inventoryId = parseInt(req.params.id);
            const { quantityTaken } = req.body;
            
            // Validation
            if (!quantityTaken || quantityTaken <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid quantity taken is required'
                });
            }
            
            // First get the medication ID from inventory
            const inventory = await MedicationInventoryModel.getInventoryByUserId(userId);
            const item = inventory.find(item => item.inventoryId === inventoryId);
            
            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Inventory item not found'
                });
            }
            
            if (item.currentStock < quantityTaken) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient stock available'
                });
            }
            
            let success = false;
            
            if (item.medicationId) {
                // Update via medication ID if available
                success = await MedicationInventoryModel.updateStockAfterTaken(item.medicationId, userId, quantityTaken);
            } else {
                // Update directly via inventory
                const newStock = item.currentStock - quantityTaken;
                const inventoryData = {
                    userId,
                    medicationName: item.medicationName,
                    currentStock: newStock,
                    lowStockThreshold: item.lowStockThreshold,
                    unit: item.unit,
                    notes: item.notes
                };
                success = await MedicationInventoryModel.updateInventoryItem(inventoryId, inventoryData);
            }
            
            if (!success) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update stock'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Medication taken and stock updated successfully',
                data: {
                    remainingStock: item.currentStock - quantityTaken
                }
            });
        } catch (error) {
            console.error('Error taking medication:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating stock',
                error: error.message
            });
        }
    }
    
    // PUT /api/inventory/:id/restock - Add stock to inventory
    static async restockMedication(req, res) {
        try {
            const userId = req.user.userId;
            const inventoryId = parseInt(req.params.id);
            const { quantityAdded } = req.body;
            
            // Validation
            if (!quantityAdded || quantityAdded <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid quantity to add is required'
                });
            }
            
            // Get current inventory item
            const inventory = await MedicationInventoryModel.getInventoryByUserId(userId);
            const item = inventory.find(item => item.inventoryId === inventoryId);
            
            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: 'Inventory item not found'
                });
            }
            
            const newStock = item.currentStock + parseInt(quantityAdded);
            const inventoryData = {
                userId,
                medicationName: item.medicationName,
                currentStock: newStock,
                lowStockThreshold: item.lowStockThreshold,
                unit: item.unit,
                notes: item.notes
            };
            
            const success = await MedicationInventoryModel.updateInventoryItem(inventoryId, inventoryData);
            
            if (!success) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update stock'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Stock updated successfully',
                data: {
                    newStock: newStock
                }
            });
        } catch (error) {
            console.error('Error restocking medication:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating stock',
                error: error.message
            });
        }
    }
    
    // DELETE /api/inventory/:id - Delete inventory item
    static async deleteInventoryItem(req, res) {
        try {
            const userId = req.user.userId;
            const inventoryId = parseInt(req.params.id);
            
            const success = await MedicationInventoryModel.deleteInventoryItem(inventoryId, userId);
            
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Inventory item not found or unauthorized'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Inventory item deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting inventory item:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting inventory item',
                error: error.message
            });
        }
    }
    
    // GET /api/inventory/notifications - Get inventory notifications
    static async getNotifications(req, res) {
        try {
            const userId = req.user.userId;
            const notifications = await MedicationInventoryModel.getNotifications(userId);
            
            res.status(200).json({
                success: true,
                message: 'Notifications retrieved successfully',
                data: notifications
            });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching notifications',
                error: error.message
            });
        }
    }
    
    // PUT /api/inventory/notifications/:id/read - Mark notification as read
    static async markNotificationAsRead(req, res) {
        try {
            const userId = req.user.userId;
            const notificationId = parseInt(req.params.id);
            
            const success = await MedicationInventoryModel.markNotificationAsRead(notificationId, userId);
            
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification not found or unauthorized'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Notification marked as read'
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating notification',
                error: error.message
            });
        }
    }
    
    // GET /api/inventory/stats - Get inventory statistics
    static async getInventoryStats(req, res) {
        try {
            const userId = req.user.userId;
            const inventory = await MedicationInventoryModel.getInventoryByUserId(userId);
            
            const stats = {
                totalMedications: inventory.length,
                lowStockCount: inventory.filter(item => item.isLowStock).length,
                outOfStockCount: inventory.filter(item => item.currentStock === 0).length,
                totalStock: inventory.reduce((sum, item) => sum + item.currentStock, 0)
            };
            
            res.status(200).json({
                success: true,
                message: 'Inventory statistics retrieved successfully',
                data: stats
            });
        } catch (error) {
            console.error('Error fetching inventory stats:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching inventory statistics',
                error: error.message
            });
        }
    }
}

module.exports = InventoryController;
