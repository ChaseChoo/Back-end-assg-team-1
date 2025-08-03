const sql = require('mssql');
const dbConfig = require('./dbConfig');

async function checkTables() {
    let connection;
    try {
        console.log('🔌 Connecting to database...');
        connection = await sql.connect(dbConfig);
        
        console.log('\n📋 CHECKING DATABASE TABLES:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const tables = await connection.request().query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE' 
            ORDER BY TABLE_NAME
        `);
        
        console.log('Available tables:');
        tables.recordset.forEach(row => {
            console.log(`  ✓ ${row.TABLE_NAME}`);
        });
        
        console.log('\n🏥 CHECKING APPOINTMENT-RELATED TABLES:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Check Appointments table structure
        if (tables.recordset.some(t => t.TABLE_NAME === 'Appointments')) {
            console.log('\n📅 Appointments table structure:');
            const appointmentColumns = await connection.request().query(`
                SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'Appointments'
                ORDER BY ORDINAL_POSITION
            `);
            appointmentColumns.recordset.forEach(col => {
                console.log(`  ${col.COLUMN_NAME} (${col.DATA_TYPE}) ${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}`);
            });
            
            // Check sample data
            const sampleData = await connection.request().query('SELECT TOP 3 * FROM Appointments');
            console.log(`\n📊 Sample appointments (${sampleData.recordset.length} records):`);
            sampleData.recordset.forEach((row, index) => {
                console.log(`  ${index + 1}. ID: ${row.appointmentId}, User: ${row.userId}, Doctor: ${row.doctorId}, Date: ${row.appointmentDate}, Status: ${row.status || 'N/A'}`);
            });
        } else {
            console.log('❌ Appointments table does not exist!');
        }
        
        // Check related tables
        const relatedTables = ['Doctors', 'Clinics', 'AppointmentTypes'];
        relatedTables.forEach(tableName => {
            const exists = tables.recordset.some(t => t.TABLE_NAME === tableName);
            console.log(`  ${exists ? '✓' : '❌'} ${tableName} table ${exists ? 'exists' : 'missing'}`);
        });
        
    } catch (error) {
        console.error('❌ Error checking database:', error);
    } finally {
        if (connection) {
            await connection.close();
            console.log('\n🔒 Database connection closed.');
        }
    }
}

checkTables();
