const sql = require('mssql');
const dbConfig = require("../dbConfig");

/**
 * (GET) Fetch doctors, optionally filtered by appointmentTypeId and clinicId
 * Returns an array of doctor objects
 */
async function getDoctors(appointmentTypeId, clinicId) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    let query = 'SELECT * FROM Doctors';
    const conditions = [];
    const request = connection.request();
    if (appointmentTypeId) {
      conditions.push('appointmentTypeId = @appointmentTypeId');
      request.input('appointmentTypeId', sql.Int, appointmentTypeId);
    }
    if (clinicId) {
      conditions.push('clinicId = @clinicId');
      request.input('clinicId', sql.Int, clinicId);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('doctorModel.getDoctors error:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('Error closing connection:', closeErr);
      }
    }
  }
}

module.exports = {
  getDoctors
};
 