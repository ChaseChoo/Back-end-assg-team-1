const sql = require('mssql');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const config = {
  server: "localhost",
  port: 1433,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    encrypt: false,
    connectionTimeout: 30000,
    requestTimeout: 30000
  }
};

async function testConnection() {
    console.log('Testing database connection...');
    
    try {
        const pool = await sql.connect(config);
        console.log('✅ Connected successfully!');
        
        // Check medication table structure
        const medicationColumns = await pool.request().query(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Medications'
            ORDER BY ORDINAL_POSITION
        `);
        console.log('� Medications table columns:');
        medicationColumns.recordset.forEach(col => {
            console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE}) ${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}`);
        });
        
        // Check schedule table structure
        const scheduleColumns = await pool.request().query(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'MedicationSchedules'
            ORDER BY ORDINAL_POSITION
        `);
        console.log('\n� MedicationSchedules table columns:');
        scheduleColumns.recordset.forEach(col => {
            console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE}) ${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}`);
        });
        
        await pool.close();
        console.log('\n✅ Connection closed successfully');
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
}

testConnection();
