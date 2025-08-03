const sql = require('mssql');
const dbConfig = require('../dbConfig');

// (POST) Create new User
async function createUser({ username, email, passwordHash, languagePreference = 'en' }) {
    let connection;
    try {
        // Connect to SQL Server
        connection = await sql.connect(dbConfig);
        const request = connection.request();

        // Safe SQL parameter binding
        request.input("username", sql.NVarChar(50), username);
        request.input("email", sql.NVarChar(100), email);
        request.input("passwordHash", sql.NVarChar(255), passwordHash);
        request.input("languagePreference", sql.NVarChar(10), languagePreference);

        // The new row (userId, username, email, languagePreference) are returned immediately
        // From OUTPUT INSERTED SQL Server clause
        const query = `INSERT INTO Users (username, email, passwordHash, languagePreference)
                       OUTPUT INSERTED.userId, INSERTED.username, INSERTED.email, INSERTED.languagePreference
                       VALUES (@username, @email, @passwordHash, @languagePreference)
                      `;

        const result = await request.query(query);

        // Return the created user (excluding passwordHash)
        return result.recordset[0];
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (err) {
                console.error("Error closing connection:", err);
            }
        }
    }
}

// (GET) Find user by email (used for login or duplicate checks)
async function getUserByEmail(email) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const request = connection.request();

        request.input("email", sql.NVarChar(100), email);

        const query = `SELECT userId, username, email, passwordHash, languagePreference
                       FROM Users
                       WHERE email = @email
                       `;

        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return null;
        }

        return result.recordset[0];
    }
    catch (error) {
        console.error("Error retrieving user:", error);
        throw error;
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (err) {
                console.error("Error closing connection:", err);
            }
        }
    }
}

// (PUT) Update user credentials
async function updateUser({ userId, username, email, passwordHash, languagePreference }) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const request = connection.request();
        request.input("userId", sql.Int, userId);
        request.input("username", sql.NVarChar(50), username);
        request.input("email", sql.NVarChar(100), email);
        request.input("passwordHash", sql.NVarChar(255), passwordHash);
        
        let query = `
          UPDATE Users
          SET username = @username, email = @email, passwordHash = @passwordHash`;
        
        // Only update language preference if provided
        if (languagePreference !== undefined) {
            request.input("languagePreference", sql.NVarChar(10), languagePreference);
            query += `, languagePreference = @languagePreference`;
        }
        
        query += ` WHERE userId = @userId`;

        await request.query(query);
    } 
    catch (error) {
        console.error("Error updating user:", error);
        throw error; // Let the controller handle the response
    } 
    finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing connection:", err);
            }
        }
    }
}

// (DELETE) Delete user by ID
async function deleteUser(userId) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const request = connection.request();

        request.input("userId", sql.Int, userId);
        const query = `DELETE FROM Users WHERE userId = @userId`;

        await request.query(query);
    } 
    catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    } 
    finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing connection:", err);
            }
        }
    }
}

// (PUT) Update user language preference only
async function updateUserLanguage(userId, languagePreference) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const request = connection.request();
        request.input("userId", sql.Int, userId);
        request.input("languagePreference", sql.NVarChar(10), languagePreference);

        const query = `
          UPDATE Users
          SET languagePreference = @languagePreference
          WHERE userId = @userId
        `;

        await request.query(query);
    } 
    catch (error) {
        console.error("Error updating user language:", error);
        throw error;
    } 
    finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Error closing connection:", err);
            }
        }
    }
}

// (GET) Get user by ID (for profile information)
async function getUserById(userId) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const request = connection.request();
        request.input("userId", sql.Int, userId);

        const query = `SELECT userId, username, email, languagePreference
                       FROM Users
                       WHERE userId = @userId
                       `;

        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return null;
        }

        return result.recordset[0];
    }
    catch (error) {
        console.error("Error retrieving user by ID:", error);
        throw error;
    }
    finally {
        if (connection) {
            try {
                await connection.close();
            }
            catch (err) {
                console.error("Error closing connection:", err);
            }
        }
    }
}

module.exports = {
    createUser,
    getUserByEmail,
    updateUser,
    updateUserLanguage,
    getUserById,
    deleteUser,
}