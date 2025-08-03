const sql = require('mssql');
const dbConfig = require('./dbConfig');

async function checkPasswords() {
    let connection;
    try {
        console.log('🔌 Connecting to database...');
        connection = await sql.connect(dbConfig);
        
        const users = await connection.request().query('SELECT TOP 3 userId, email, username, passwordHash FROM Users');
        
        console.log('📋 Users with password info:');
        users.recordset.forEach(user => {
            console.log(`  ID: ${user.userId}, Email: ${user.email}, Username: ${user.username}`);
            console.log(`  Password Hash: ${user.passwordHash ? 'EXISTS' : 'MISSING'}`);
            console.log(`  Hash starts with: ${user.passwordHash?.substring(0, 20)}...`);
            console.log('');
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

checkPasswords();
