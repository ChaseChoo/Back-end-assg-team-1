const sql = require('mssql');
const dbConfig = require('./dbConfig');

(async () => {
  try {
    const pool = await sql.connect(dbConfig);
    
    // Check for meal-related tables
    const result = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE' 
      AND (TABLE_NAME LIKE '%meal%' OR TABLE_NAME LIKE '%Meal%')
    `);
    
    console.log('Meal-related tables:', result.recordset);
    
    // Check MealLogs table structure if it exists
    const mealLogsCheck = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'MealLogs'
    `);
    
    if (mealLogsCheck.recordset.length > 0) {
      console.log('MealLogs table structure:', mealLogsCheck.recordset);
    } else {
      console.log('MealLogs table does not exist');
    }
    
    await pool.close();
  } catch (err) {
    console.error('Error:', err);
  }
})();
