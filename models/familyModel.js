const sql = require('mssql');
const dbConfig = require('../dbConfig');

// Family Member Model
class FamilyModel {
    // Create family_members table if it doesn't exist
    static async createTable() {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            const request = connection.request();

            const createTableQuery = `
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='family_members' AND xtype='U')
                CREATE TABLE family_members (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    userId INT NOT NULL,
                    firstName NVARCHAR(100) NOT NULL,
                    lastName NVARCHAR(100) NOT NULL,
                    relationship NVARCHAR(50) NOT NULL CHECK (relationship IN ('Son', 'Daughter', 'Spouse', 'Sibling', 'Caregiver', 'Other')),
                    phoneNumber NVARCHAR(20) NOT NULL,
                    emailAddress NVARCHAR(255) NULL,
                    accessLevel NVARCHAR(20) NOT NULL CHECK (accessLevel IN ('View', 'Manage')) DEFAULT 'View',
                    emergencyContact BIT DEFAULT 0,
                    createdAt DATETIME2 DEFAULT GETDATE(),
                    updatedAt DATETIME2 DEFAULT GETDATE(),
                    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
                    UNIQUE(userId, phoneNumber)
                );
            `;

            await request.query(createTableQuery);
            console.log('Family members table created or already exists');
            
            // Create indexes for better performance
            await this.createIndexes();
            
            return true;
        } catch (error) {
            console.error('Error creating family_members table:', error);
            throw error;
        } finally {
            if (connection) {
                connection.close();
            }
        }
    }

    // Create indexes for better performance
    static async createIndexes() {
        let connection;
        try {
            connection = await sql.connect(dbConfig);
            
            const indexes = [
                {
                    name: 'IX_family_members_userId',
                    query: `
                        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_family_members_userId')
                        CREATE INDEX IX_family_members_userId ON family_members(userId);
                    `
                },
                {
                    name: 'IX_family_members_relationship',
                    query: `
                        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_family_members_relationship')
                        CREATE INDEX IX_family_members_relationship ON family_members(relationship);
                    `
                },
                {
                    name: 'IX_family_members_emergencyContact',
                    query: `
                        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_family_members_emergencyContact')
                        CREATE INDEX IX_family_members_emergencyContact ON family_members(emergencyContact);
                    `
                },
                {
                    name: 'IX_family_members_accessLevel',
                    query: `
                        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IX_family_members_accessLevel')
                        CREATE INDEX IX_family_members_accessLevel ON family_members(accessLevel);
                    `
                }
            ];

            for (const index of indexes) {
                try {
                    const request = connection.request();
                    await request.query(index.query);
                    console.log(`Index ${index.name} created or already exists`);
                } catch (error) {
                    console.error(`Error creating index ${index.name}:`, error);
                }
            }
        } catch (error) {
            console.error('Error creating indexes:', error);
        } finally {
            if (connection) {
                connection.close();
            }
        }
    }
}

module.exports = FamilyModel;
