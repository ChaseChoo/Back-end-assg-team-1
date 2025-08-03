// Validation middleware for inventory operations

const validateInventoryItem = (req, res, next) => {
    const { medicationName, currentStock, lowStockThreshold, unit } = req.body;
    
    // Check required fields
    if (!medicationName || medicationName.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Medication name is required'
        });
    }
    
    if (currentStock === undefined || currentStock === null) {
        return res.status(400).json({
            success: false,
            message: 'Current stock is required'
        });
    }
    
    // Validate stock quantities
    if (!Number.isInteger(Number(currentStock)) || Number(currentStock) < 0) {
        return res.status(400).json({
            success: false,
            message: 'Current stock must be a non-negative integer'
        });
    }
    
    if (lowStockThreshold !== undefined && (!Number.isInteger(Number(lowStockThreshold)) || Number(lowStockThreshold) < 0)) {
        return res.status(400).json({
            success: false,
            message: 'Low stock threshold must be a non-negative integer'
        });
    }
    
    // Validate medication name length
    if (medicationName.trim().length > 100) {
        return res.status(400).json({
            success: false,
            message: 'Medication name cannot exceed 100 characters'
        });
    }
    
    // Validate unit
    if (unit && unit.length > 20) {
        return res.status(400).json({
            success: false,
            message: 'Unit cannot exceed 20 characters'
        });
    }
    
    // Validate notes if provided
    if (req.body.notes && req.body.notes.length > 500) {
        return res.status(400).json({
            success: false,
            message: 'Notes cannot exceed 500 characters'
        });
    }
    
    next();
};

const validateInventoryId = (req, res, next) => {
    const inventoryId = req.params.id;
    
    if (!inventoryId || !Number.isInteger(Number(inventoryId)) || Number(inventoryId) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Valid inventory ID is required'
        });
    }
    
    next();
};

const validateQuantity = (req, res, next) => {
    const { quantityTaken, quantityAdded } = req.body;
    const quantity = quantityTaken || quantityAdded;
    
    if (!quantity || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Valid quantity is required and must be a positive integer'
        });
    }
    
    if (Number(quantity) > 1000) {
        return res.status(400).json({
            success: false,
            message: 'Quantity cannot exceed 1000'
        });
    }
    
    next();
};

const validateNotificationId = (req, res, next) => {
    const notificationId = req.params.id;
    
    if (!notificationId || !Number.isInteger(Number(notificationId)) || Number(notificationId) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Valid notification ID is required'
        });
    }
    
    next();
};

module.exports = {
    validateInventoryItem,
    validateInventoryId,
    validateQuantity,
    validateNotificationId
};
