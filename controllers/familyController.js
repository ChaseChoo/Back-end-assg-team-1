const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const dbConfig = require('../dbConfig');

// Get all family members for a user
const getFamilyMembers = async (req, res) => {
    let connection;
    try {
        const userId = req.user.userId;
        
        connection = await sql.connect(dbConfig);
        const request = connection.request();
        request.input('userId', sql.Int, userId);
        
        const query = `
            SELECT 
                id,
                firstName,
                lastName,
                relationship,
                phoneNumber,
                emailAddress,
                accessLevel,
                emergencyContact,
                createdAt,
                updatedAt
            FROM family_members 
            WHERE userId = @userId 
            ORDER BY createdAt DESC
        `;
        
        const result = await request.query(query);
        
        res.json({
            success: true,
            familyMembers: result.recordset || []
        });
    } catch (error) {
        console.error('Error fetching family members:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve family members'
        });
    } finally {
        if (connection) {
            connection.close();
        }
    }
};

// Add a new family member
const addFamilyMember = async (req, res) => {
    let connection;
    try {
        const userId = req.user.userId;
        const {
            firstName,
            lastName,
            relationship,
            phoneNumber,
            emailAddress,
            accessLevel,
            emergencyContact
        } = req.body;

        // Validation
        if (!firstName || !lastName || !relationship || !phoneNumber || !accessLevel) {
            return res.status(400).json({
                success: false,
                message: 'First name, last name, relationship, phone number, and access level are required'
            });
        }

        // Validate relationship
        const validRelationships = ['Son', 'Daughter', 'Spouse', 'Sibling', 'Caregiver', 'Other'];
        if (!validRelationships.includes(relationship)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid relationship type'
            });
        }

        // Validate access level
        const validAccessLevels = ['View', 'Manage'];
        if (!validAccessLevels.includes(accessLevel)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid access level'
            });
        }

        // Validate phone number format
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Phone number must be in format (555) 123-4567'
            });
        }

        // Validate email if provided
        if (emailAddress) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailAddress)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email address format'
                });
            }
        }

        connection = await sql.connect(dbConfig);
        
        // Check if phone number already exists for this user
        let request = connection.request();
        request.input('userId', sql.Int, userId);
        request.input('phoneNumber', sql.NVarChar(20), phoneNumber);
        
        const existingQuery = `
            SELECT id FROM family_members 
            WHERE userId = @userId AND phoneNumber = @phoneNumber
        `;
        const existing = await request.query(existingQuery);
        
        if (existing.recordset && existing.recordset.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'A family member with this phone number already exists'
            });
        }

        // Insert new family member
        request = connection.request();
        request.input('userId', sql.Int, userId);
        request.input('firstName', sql.NVarChar(100), firstName.trim());
        request.input('lastName', sql.NVarChar(100), lastName.trim());
        request.input('relationship', sql.NVarChar(50), relationship);
        request.input('phoneNumber', sql.NVarChar(20), phoneNumber.trim());
        request.input('emailAddress', sql.NVarChar(255), emailAddress ? emailAddress.trim() : null);
        request.input('accessLevel', sql.NVarChar(20), accessLevel);
        request.input('emergencyContact', sql.Bit, emergencyContact || false);
        
        const insertQuery = `
            INSERT INTO family_members (
                userId, firstName, lastName, relationship, phoneNumber, 
                emailAddress, accessLevel, emergencyContact, createdAt, updatedAt
            ) 
            OUTPUT INSERTED.id, INSERTED.firstName, INSERTED.lastName, INSERTED.relationship, 
                   INSERTED.phoneNumber, INSERTED.emailAddress, INSERTED.accessLevel, INSERTED.emergencyContact, INSERTED.createdAt
            VALUES (@userId, @firstName, @lastName, @relationship, @phoneNumber, @emailAddress, @accessLevel, @emergencyContact, GETDATE(), GETDATE())
        `;
        
        const result = await request.query(insertQuery);

        res.status(201).json({
            success: true,
            message: 'Family member added successfully',
            familyMember: result.recordset[0]
        });

    } catch (error) {
        console.error('Error adding family member:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add family member'
        });
    } finally {
        if (connection) {
            connection.close();
        }
    }
};

// Update an existing family member
const updateFamilyMember = async (req, res) => {
    let connection;
    try {
        const userId = req.user.userId;
        const memberId = req.params.id;
        const {
            firstName,
            lastName,
            relationship,
            phoneNumber,
            emailAddress,
            accessLevel,
            emergencyContact
        } = req.body;

        // Validation
        if (!firstName || !lastName || !relationship || !phoneNumber || !accessLevel) {
            return res.status(400).json({
                success: false,
                message: 'First name, last name, relationship, phone number, and access level are required'
            });
        }

        // Validate relationship
        const validRelationships = ['Son', 'Daughter', 'Spouse', 'Sibling', 'Caregiver', 'Other'];
        if (!validRelationships.includes(relationship)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid relationship type'
            });
        }

        // Validate access level
        const validAccessLevels = ['View', 'Manage'];
        if (!validAccessLevels.includes(accessLevel)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid access level'
            });
        }

        // Validate phone number format
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Phone number must be in format (555) 123-4567'
            });
        }

        // Validate email if provided
        if (emailAddress) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailAddress)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email address format'
                });
            }
        }

        connection = await sql.connect(dbConfig);

        // Check if member exists and belongs to user
        let request = connection.request();
        request.input('memberId', sql.Int, memberId);
        request.input('userId', sql.Int, userId);
        
        const memberQuery = `
            SELECT id FROM family_members 
            WHERE id = @memberId AND userId = @userId
        `;
        const member = await request.query(memberQuery);
        
        if (!member.recordset || member.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Family member not found'
            });
        }

        // Check if phone number already exists for another member
        request = connection.request();
        request.input('userId', sql.Int, userId);
        request.input('phoneNumber', sql.NVarChar(20), phoneNumber);
        request.input('memberId', sql.Int, memberId);
        
        const duplicateQuery = `
            SELECT id FROM family_members 
            WHERE userId = @userId AND phoneNumber = @phoneNumber AND id != @memberId
        `;
        const duplicate = await request.query(duplicateQuery);
        
        if (duplicate.recordset && duplicate.recordset.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'A different family member with this phone number already exists'
            });
        }

        // Update family member
        request = connection.request();
        request.input('firstName', sql.NVarChar(100), firstName.trim());
        request.input('lastName', sql.NVarChar(100), lastName.trim());
        request.input('relationship', sql.NVarChar(50), relationship);
        request.input('phoneNumber', sql.NVarChar(20), phoneNumber.trim());
        request.input('emailAddress', sql.NVarChar(255), emailAddress ? emailAddress.trim() : null);
        request.input('accessLevel', sql.NVarChar(20), accessLevel);
        request.input('emergencyContact', sql.Bit, emergencyContact || false);
        request.input('memberId', sql.Int, memberId);
        request.input('userId', sql.Int, userId);
        
        const updateQuery = `
            UPDATE family_members 
            SET firstName = @firstName, lastName = @lastName, relationship = @relationship, phoneNumber = @phoneNumber, 
                emailAddress = @emailAddress, accessLevel = @accessLevel, emergencyContact = @emergencyContact, updatedAt = GETDATE()
            WHERE id = @memberId AND userId = @userId
        `;
        
        await request.query(updateQuery);

        // Get updated member
        request = connection.request();
        request.input('memberId', sql.Int, memberId);
        request.input('userId', sql.Int, userId);
        
        const updatedMemberQuery = `
            SELECT 
                id, firstName, lastName, relationship, phoneNumber, 
                emailAddress, accessLevel, emergencyContact, updatedAt
            FROM family_members 
            WHERE id = @memberId AND userId = @userId
        `;
        const updatedMember = await request.query(updatedMemberQuery);

        res.json({
            success: true,
            message: 'Family member updated successfully',
            familyMember: updatedMember.recordset[0]
        });

    } catch (error) {
        console.error('Error updating family member:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update family member'
        });
    } finally {
        if (connection) {
            connection.close();
        }
    }
};

// Delete a family member
const deleteFamilyMember = async (req, res) => {
    let connection;
    try {
        const userId = req.user.userId;
        const memberId = req.params.id;

        connection = await sql.connect(dbConfig);

        // Check if member exists and belongs to user
        let request = connection.request();
        request.input('memberId', sql.Int, memberId);
        request.input('userId', sql.Int, userId);
        
        const memberQuery = `
            SELECT id, firstName, lastName FROM family_members 
            WHERE id = @memberId AND userId = @userId
        `;
        const member = await request.query(memberQuery);
        
        if (!member.recordset || member.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Family member not found'
            });
        }

        // Delete family member
        request = connection.request();
        request.input('memberId', sql.Int, memberId);
        request.input('userId', sql.Int, userId);
        
        const deleteQuery = `
            DELETE FROM family_members 
            WHERE id = @memberId AND userId = @userId
        `;
        
        await request.query(deleteQuery);

        res.json({
            success: true,
            message: `${member.recordset[0].firstName} ${member.recordset[0].lastName} has been removed from your family group`
        });

    } catch (error) {
        console.error('Error deleting family member:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove family member'
        });
    } finally {
        if (connection) {
            connection.close();
        }
    }
};

// Get family member by ID
const getFamilyMemberById = async (req, res) => {
    let connection;
    try {
        const userId = req.user.userId;
        const memberId = req.params.id;

        connection = await sql.connect(dbConfig);
        const request = connection.request();
        request.input('memberId', sql.Int, memberId);
        request.input('userId', sql.Int, userId);

        const query = `
            SELECT 
                id, firstName, lastName, relationship, phoneNumber, 
                emailAddress, accessLevel, emergencyContact, createdAt, updatedAt
            FROM family_members 
            WHERE id = @memberId AND userId = @userId
        `;
        
        const result = await request.query(query);
        
        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Family member not found'
            });
        }

        res.json({
            success: true,
            familyMember: result.recordset[0]
        });

    } catch (error) {
        console.error('Error fetching family member:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve family member'
        });
    } finally {
        if (connection) {
            connection.close();
        }
    }
};

// Get family statistics
const getFamilyStats = async (req, res) => {
    let connection;
    try {
        const userId = req.user.userId;
        
        connection = await sql.connect(dbConfig);
        const request = connection.request();
        request.input('userId', sql.Int, userId);
        
        const statsQuery = `
            SELECT 
                COUNT(*) as totalMembers,
                SUM(CASE WHEN relationship IN ('Son', 'Daughter', 'Spouse', 'Sibling') THEN 1 ELSE 0 END) as familyMembers,
                SUM(CASE WHEN relationship = 'Caregiver' THEN 1 ELSE 0 END) as caregivers,
                SUM(CASE WHEN emergencyContact = 1 THEN 1 ELSE 0 END) as emergencyContacts,
                SUM(CASE WHEN accessLevel = 'Manage' THEN 1 ELSE 0 END) as manageAccess,
                SUM(CASE WHEN accessLevel = 'View' THEN 1 ELSE 0 END) as viewAccess
            FROM family_members 
            WHERE userId = @userId
        `;
        
        const result = await request.query(statsQuery);

        res.json({
            success: true,
            stats: result.recordset[0] || {
                totalMembers: 0,
                familyMembers: 0,
                caregivers: 0,
                emergencyContacts: 0,
                manageAccess: 0,
                viewAccess: 0
            }
        });

    } catch (error) {
        console.error('Error fetching family stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve family statistics'
        });
    } finally {
        if (connection) {
            connection.close();
        }
    }
};

module.exports = {
    getFamilyMembers,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    getFamilyMemberById,
    getFamilyStats
};
