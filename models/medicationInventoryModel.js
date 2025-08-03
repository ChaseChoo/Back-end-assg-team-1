const sql = require("mssql");
const dbConfig = require("../dbConfig");

class MedicationInventoryModel {
    // Create medication_inventory table
    static async createTable() {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            
            // Create medication_inventory table
            const createInventoryTableQuery = `
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='medication_inventory' AND xtype='U')
                BEGIN
                    CREATE TABLE medication_inventory (
                        inventoryId INT IDENTITY(1,1) PRIMARY KEY,
                        userId INT NOT NULL,
                        medicationId INT,
                        medicationName NVARCHAR(100) NOT NULL,
                        currentStock INT NOT NULL DEFAULT 0,
                        lowStockThreshold INT NOT NULL DEFAULT 5,
                        unit NVARCHAR(20) DEFAULT 'pills',
                        lastUpdated DATETIME2 DEFAULT GETDATE(),
                        notes NVARCHAR(500),
                        isActive BIT DEFAULT 1,
                        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
                        FOREIGN KEY (medicationId) REFERENCES Medications(medicationId) ON DELETE NO ACTION
                    );
                END
            `;
            
            await connection.request().query(createInventoryTableQuery);
            console.log("Medication inventory table created or already exists");
            
            // Create index for better performance
            const createIndexQuery = `
                IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_medication_inventory_userId')
                BEGIN
                    CREATE INDEX IX_medication_inventory_userId ON medication_inventory(userId);
                END
            `;
            
            await connection.request().query(createIndexQuery);
            console.log("Index IX_medication_inventory_userId created or already exists");
            
            // Create inventory notifications table
            const createNotificationsTableQuery = `
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='inventory_notifications' AND xtype='U')
                BEGIN
                    CREATE TABLE inventory_notifications (
                        notificationId INT IDENTITY(1,1) PRIMARY KEY,
                        inventoryId INT NOT NULL,
                        userId INT NOT NULL,
                        familyMemberId INT NULL,
                        notificationType NVARCHAR(50) NOT NULL DEFAULT 'low_stock',
                        message NVARCHAR(500) NOT NULL,
                        isRead BIT DEFAULT 0,
                        createdAt DATETIME2 DEFAULT GETDATE()
                    );
                END
            `;
            
            await connection.request().query(createNotificationsTableQuery);
            console.log("Inventory notifications table created or already exists");
            
        } catch (error) {
            console.error("Error creating medication inventory tables:", error);
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error closing connection:", err);
                }
            }
        }
    }
    
    // Get all inventory items for a user
    static async getInventoryByUserId(userId) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            
            const query = `
                SELECT 
                    mi.inventoryId,
                    mi.medicationId,
                    mi.medicationName,
                    mi.currentStock,
                    mi.lowStockThreshold,
                    mi.unit,
                    mi.lastUpdated,
                    mi.notes,
                    mi.isActive,
                    m.dosage,
                    m.frequency,
                    CASE 
                        WHEN mi.currentStock <= mi.lowStockThreshold THEN 1
                        ELSE 0
                    END as isLowStock
                FROM medication_inventory mi
                LEFT JOIN Medications m ON mi.medicationId = m.medicationId
                WHERE mi.userId = @userId AND mi.isActive = 1
                ORDER BY 
                    CASE WHEN mi.currentStock <= mi.lowStockThreshold THEN 0 ELSE 1 END,
                    mi.medicationName
            `;
            
            const request = connection.request();
            request.input("userId", sql.Int, userId);
            
            const result = await request.query(query);
            return result.recordset;
            
        } catch (error) {
            console.error("Error fetching inventory:", error);
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error closing connection:", err);
                }
            }
        }
    }
    
    // Get inventory for family members (shared view)
    static async getFamilyInventory(userId) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            
            const query = `
                SELECT 
                    mi.inventoryId,
                    mi.medicationName,
                    mi.currentStock,
                    mi.lowStockThreshold,
                    mi.unit,
                    mi.lastUpdated,
                    u.firstName + ' ' + u.lastName as ownerName,
                    fm.relationship,
                    CASE 
                        WHEN mi.currentStock <= mi.lowStockThreshold THEN 1
                        ELSE 0
                    END as isLowStock
                FROM medication_inventory mi
                INNER JOIN users u ON mi.userId = u.userId
                INNER JOIN family_members fm ON u.userId = fm.userId
                WHERE fm.familyMemberId = @userId 
                   AND mi.isActive = 1
                   AND fm.accessLevel IN ('Manage', 'View')
                ORDER BY 
                    CASE WHEN mi.currentStock <= mi.lowStockThreshold THEN 0 ELSE 1 END,
                    u.firstName,
                    mi.medicationName
            `;
            
            const request = connection.request();
            request.input("userId", sql.Int, userId);
            
            const result = await request.query(query);
            return result.recordset;
            
        } catch (error) {
            console.error("Error fetching family inventory:", error);
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error closing connection:", err);
                }
            }
        }
    }
    
    // Add new inventory item
    static async addInventoryItem(data) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            
            const query = `
                INSERT INTO medication_inventory 
                (userId, medicationId, medicationName, currentStock, lowStockThreshold, unit, notes)
                VALUES (@userId, @medicationId, @medicationName, @currentStock, @lowStockThreshold, @unit, @notes);
                SELECT SCOPE_IDENTITY() AS inventoryId
            `;
            
            const request = connection.request();
            request.input("userId", sql.Int, data.userId);
            request.input("medicationId", sql.Int, data.medicationId || null);
            request.input("medicationName", sql.NVarChar(100), data.medicationName);
            request.input("currentStock", sql.Int, data.currentStock);
            request.input("lowStockThreshold", sql.Int, data.lowStockThreshold || 5);
            request.input("unit", sql.NVarChar(20), data.unit || 'pills');
            request.input("notes", sql.NVarChar(500), data.notes || null);
            
            const result = await request.query(query);
            const newId = result.recordset[0].inventoryId;
            
            // Check if stock is low and create notification if needed
            if (data.currentStock <= (data.lowStockThreshold || 5)) {
                await this.createLowStockNotification(newId, data.userId, data.medicationName, data.currentStock);
            }
            
            return { inventoryId: newId };
            
        } catch (error) {
            console.error("Error adding inventory item:", error);
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error closing connection:", err);
                }
            }
        }
    }
    
    // Update inventory item
    static async updateInventoryItem(inventoryId, data) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            
            const query = `
                UPDATE medication_inventory 
                SET medicationName = @medicationName,
                    currentStock = @currentStock,
                    lowStockThreshold = @lowStockThreshold,
                    unit = @unit,
                    notes = @notes,
                    lastUpdated = GETDATE()
                WHERE inventoryId = @inventoryId AND userId = @userId
            `;
            
            const request = connection.request();
            request.input("inventoryId", sql.Int, inventoryId);
            request.input("userId", sql.Int, data.userId);
            request.input("medicationName", sql.NVarChar(100), data.medicationName);
            request.input("currentStock", sql.Int, data.currentStock);
            request.input("lowStockThreshold", sql.Int, data.lowStockThreshold);
            request.input("unit", sql.NVarChar(20), data.unit);
            request.input("notes", sql.NVarChar(500), data.notes || null);
            
            const result = await request.query(query);
            
            // Check if stock is low and create notification if needed
            if (data.currentStock <= data.lowStockThreshold) {
                await this.createLowStockNotification(inventoryId, data.userId, data.medicationName, data.currentStock);
            }
            
            return result.rowsAffected[0] > 0;
            
        } catch (error) {
            console.error("Error updating inventory item:", error);
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error closing connection:", err);
                }
            }
        }
    }
    
    // Update stock when medication is taken
    static async updateStockAfterTaken(medicationId, userId, quantityTaken = 1) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            
            const query = `
                UPDATE medication_inventory 
                SET currentStock = currentStock - @quantityTaken,
                    lastUpdated = GETDATE()
                WHERE medicationId = @medicationId AND userId = @userId AND currentStock >= @quantityTaken
            `;
            
            const request = connection.request();
            request.input("medicationId", sql.Int, medicationId);
            request.input("userId", sql.Int, userId);
            request.input("quantityTaken", sql.Int, quantityTaken);
            
            const result = await request.query(query);
            
            if (result.rowsAffected[0] > 0) {
                // Check new stock level and create notification if low
                const checkStockQuery = `
                    SELECT inventoryId, medicationName, currentStock, lowStockThreshold
                    FROM medication_inventory 
                    WHERE medicationId = @medicationId AND userId = @userId
                `;
                
                const checkRequest = connection.request();
                checkRequest.input("medicationId", sql.Int, medicationId);
                checkRequest.input("userId", sql.Int, userId);
                
                const stockResult = await checkRequest.query(checkStockQuery);
                
                if (stockResult.recordset.length > 0) {
                    const item = stockResult.recordset[0];
                    if (item.currentStock <= item.lowStockThreshold) {
                        await this.createLowStockNotification(item.inventoryId, userId, item.medicationName, item.currentStock);
                    }
                }
            }
            
            return result.rowsAffected[0] > 0;
            
        } catch (error) {
            console.error("Error updating stock after taken:", error);
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error closing connection:", err);
                }
            }
        }
    }
    
    // Delete inventory item
    static async deleteInventoryItem(inventoryId, userId) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            
            const query = `
                UPDATE medication_inventory 
                SET isActive = 0, lastUpdated = GETDATE()
                WHERE inventoryId = @inventoryId AND userId = @userId
            `;
            
            const request = connection.request();
            request.input("inventoryId", sql.Int, inventoryId);
            request.input("userId", sql.Int, userId);
            
            const result = await request.query(query);
            return result.rowsAffected[0] > 0;
            
        } catch (error) {
            console.error("Error deleting inventory item:", error);
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error closing connection:", err);
                }
            }
        }
    }
    
    // Create low stock notification
    static async createLowStockNotification(inventoryId, userId, medicationName, currentStock) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            
            // Create notification for the user
            const userNotificationQuery = `
                INSERT INTO inventory_notifications 
                (inventoryId, userId, notificationType, message)
                VALUES (@inventoryId, @userId, 'low_stock', @message)
            `;
            
            const message = `Your ${medicationName} is running low. Only ${currentStock} remaining.`;
            
            const request = connection.request();
            request.input("inventoryId", sql.Int, inventoryId);
            request.input("userId", sql.Int, userId);
            request.input("message", sql.NVarChar(500), message);
            
            await request.query(userNotificationQuery);
            
            // Create notifications for family members with access
            const familyNotificationQuery = `
                INSERT INTO inventory_notifications 
                (inventoryId, userId, familyMemberId, notificationType, message)
                SELECT @inventoryId, @userId, fm.familyId, 'low_stock', @familyMessage
                FROM family_members fm
                WHERE fm.userId = @userId AND fm.accessLevel IN ('Manage', 'View')
            `;
            
            const familyMessage = `${medicationName} for your family member is running low. Only ${currentStock} remaining.`;
            
            const familyRequest = connection.request();
            familyRequest.input("inventoryId", sql.Int, inventoryId);
            familyRequest.input("userId", sql.Int, userId);
            familyRequest.input("familyMessage", sql.NVarChar(500), familyMessage);
            
            await familyRequest.query(familyNotificationQuery);
            
        } catch (error) {
            console.error("Error creating low stock notification:", error);
            // Don't throw error here as it's a secondary operation
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error closing connection:", err);
                }
            }
        }
    }
    
    // Get notifications for user
    static async getNotifications(userId) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            
            const query = `
                SELECT 
                    notificationId,
                    message,
                    notificationType,
                    isRead,
                    createdAt
                FROM inventory_notifications
                WHERE userId = @userId OR familyMemberId IN (
                    SELECT familyId FROM family_members WHERE familyMemberId = @userId
                )
                ORDER BY createdAt DESC
            `;
            
            const request = connection.request();
            request.input("userId", sql.Int, userId);
            
            const result = await request.query(query);
            return result.recordset;
            
        } catch (error) {
            console.error("Error fetching notifications:", error);
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error closing connection:", err);
                }
            }
        }
    }
    
    // Mark notification as read
    static async markNotificationAsRead(notificationId, userId) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            
            const query = `
                UPDATE inventory_notifications 
                SET isRead = 1
                WHERE notificationId = @notificationId 
                AND (userId = @userId OR familyMemberId IN (
                    SELECT familyId FROM family_members WHERE familyMemberId = @userId
                ))
            `;
            
            const request = connection.request();
            request.input("notificationId", sql.Int, notificationId);
            request.input("userId", sql.Int, userId);
            
            const result = await request.query(query);
            return result.rowsAffected[0] > 0;
            
        } catch (error) {
            console.error("Error marking notification as read:", error);
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error("Error closing connection:", err);
                }
            }
        }
    }
}

module.exports = MedicationInventoryModel;
