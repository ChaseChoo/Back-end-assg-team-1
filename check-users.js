const sql = require('mssql');
const dbConfig = require('./dbConfig');

async function checkUsers() {
    let connection;
    try {
        console.log('🔌 Connecting to database...');
        connection = await sql.connect(dbConfig);
        
        const users = await connection.request().query('SELECT TOP 3 userId, email, username FROM Users');
        
        console.log('📋 Sample users:');
        users.recordset.forEach(user => {
            console.log(`  ID: ${user.userId}, Email: ${user.email}, Username: ${user.username}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

checkUsers();
