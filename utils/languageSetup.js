const sql = require('mssql');
const dbConfig = require('../dbConfig');

// Function to add language preference column to Users table
async function addLanguagePreferenceColumn() {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        
        // Check if column exists
        const checkColumnQuery = `
            SELECT COUNT(*) as count
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'languagePreference'
        `;
        
        const checkResult = await connection.request().query(checkColumnQuery);
        
        if (checkResult.recordset[0].count === 0) {
            // Add the column
            const addColumnQuery = `
                ALTER TABLE Users 
                ADD languagePreference NVARCHAR(10) DEFAULT 'en' NOT NULL
            `;
            
            await connection.request().query(addColumnQuery);
            console.log('Language preference column added to Users table.');
            
            // Update existing users to have default English preference
            const updateQuery = `
                UPDATE Users 
                SET languagePreference = 'en' 
                WHERE languagePreference IS NULL
            `;
            
            await connection.request().query(updateQuery);
            console.log('Language preference updated for existing users.');
        } else {
            console.log('Language preference column already exists in Users table.');
        }
        
    } catch (error) {
        console.error('Error adding language preference column:', error);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

module.exports = { addLanguagePreferenceColumn };
