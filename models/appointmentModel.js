const sql = require("mssql");
const dbConfig = require("../dbConfig");

/**
 * (GET) Get all booked appointment times for a doctor on a specific date
 * What this function does: 
 * 1. Get all the appointment times that are booked for a specific doctor on given date 
 * 2. Times can be hidden in the available time for the doctor 
 * 3. Ensures user can only choose from the available time slots to avoid double booking.
 */
async function getBookedTimes(doctorId, appointmentDate) {
  let connection;
  try {
    // Connect to the database
    connection = await sql.connect(dbConfig);
    const request = connection.request();

    // Bind parameters securely
    request.input("doctorId", sql.Int, doctorId);
    request.input("appointmentDate", sql.Date, appointmentDate);

    // Query booked times
    const result = await request.query(`
      SELECT appointmentTime
      FROM Appointments
      WHERE doctorId = @doctorId AND appointmentDate = @appointmentDate
    `);

    // Return array of booked time strings (e.g. "09:00:00")
    return result.recordset.map(row => row.appointmentTime);
  } catch (error) {
    console.error("Error fetching booked times:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

/**
 * (GET) Retrieve all appointments for a specific user
 * What this function does:
 * 1. Gets all appointments from the database for a given userId
 * 2. Returns an array of appointment objects (empty array if user has no bookings)
 * 3. Allows users to view their own appointments in a calendar or list
 * 4. Can be used to show "no booking at the moment" if the array is empty
 */
async function getAppointmentsByUser(userId) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("userId", sql.Int, userId);
    // Join with Doctor, Clinic, and AppointmentTypes tables for more info
    const result = await request.query(`
      SELECT a.appointmentId, a.appointmentDate, a.appointmentTime, a.notes,
             d.doctorId, d.fullName AS doctorName, c.clinicName, c.clinicId,
             t.typeName AS type
      FROM Appointments a
      JOIN Doctors d ON a.doctorId = d.doctorId
      JOIN Clinics c ON d.clinicId = c.clinicId
      JOIN AppointmentTypes t ON a.appointmentTypeId = t.appointmentTypeId
      WHERE a.userId = @userId
      ORDER BY a.appointmentDate DESC, a.appointmentTime DESC
    `);
    return result.recordset;
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

/**
 * (POST) Book a new appointment for a user
 * What this function does:
 * 1. Allows user to make an appointment with a doctor
 * 2. Duplicate time check, secure parameter binding, optional notes handling
 */
async function createAppointment({ userId, doctorId, appointmentTypeId, appointmentDate, appointmentTime, notes }) {
  let connection;
  try {
    // Check for duplicate booking before inserting
    const booked = await getBookedTimes(doctorId, appointmentDate);
    if (booked.includes(appointmentTime)) {
      throw new Error("This time slot is already booked.");
    }

    // Convert "HH:mm" string to Date object (SQL expects a Date object for sql.Time)
    const [hour, minute] = appointmentTime.split(":").map(Number);
    const timeAsDate = new Date(Date.UTC(1970, 0, 1, hour, minute, 0));

    // Connect to the database
    connection = await sql.connect(dbConfig);
    const request = connection.request();

    request.input("userId", sql.Int, userId);
    request.input("doctorId", sql.Int, doctorId);
    request.input("appointmentTypeId", sql.Int, appointmentTypeId); // <-- use value from frontend
    request.input("appointmentDate", sql.Date, appointmentDate);
    request.input("appointmentTime", sql.Time, timeAsDate);
    request.input("notes", sql.VarChar(500), notes?.trim() || null);

    await request.query(`
      INSERT INTO Appointments (userId, doctorId, appointmentTypeId, appointmentDate, appointmentTime, notes)
      VALUES (@userId, @doctorId, @appointmentTypeId, @appointmentDate, @appointmentTime, @notes)
    `);

    return { success: true, message: "Appointment booked successfully" };
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

/**
 * (PUT) Update appointment date, time, and notes for a specific appointment
 * What this function does:
 * 1. User is able to update an existing appointment's date, time, and notes
 * 2. Ensures the new time is not already booked by checking against existing appointments
 * 3. Returns success message or throws error if update fails
 */
async function updateAppointment(id, { appointmentDate, appointmentTime, notes }) {
  let connection;
  console.log(">>> updateAppointment called with:", { id, appointmentDate, appointmentTime, notes });  // <-- Add This
  try {
    const [hour, minute] = appointmentTime.split(":").map(Number);
    const timeAsDate = new Date(Date.UTC(1970, 0, 1, hour, minute, 0));
    console.log(">>> Converted Time (sql.Time compatible):", timeAsDate);  // <-- Add This

    connection = await sql.connect(dbConfig);

    // Fetch doctorId for this appointment
    const getDoctorRequest = connection.request();
    getDoctorRequest.input("appointmentId", sql.Int, id);
    const doctorResult = await getDoctorRequest.query(`
      SELECT doctorId FROM Appointments WHERE appointmentId = @appointmentId
    `);

    console.log(">>> doctorResult:", doctorResult.recordset);  // <-- Add This

    if (!doctorResult.recordset.length) {
      throw new Error("Appointment not found.");
    }

    const doctorId = doctorResult.recordset[0].doctorId;
    console.log(">>> Found doctorId:", doctorId);

    // Double booking check
    const checkRequest = connection.request();
    checkRequest.input("doctorId", sql.Int, doctorId);
    checkRequest.input("appointmentDate", sql.Date, appointmentDate);
    checkRequest.input("appointmentTime", sql.Time, timeAsDate);
    checkRequest.input("appointmentId", sql.Int, id);
    const bookedResult = await checkRequest.query(`
      SELECT appointmentId FROM Appointments
      WHERE doctorId = @doctorId
        AND appointmentDate = @appointmentDate
        AND appointmentTime = @appointmentTime
        AND appointmentId <> @appointmentId
    `);
    console.log(">>> bookedResult:", bookedResult.recordset);  // <-- Add This

    if (bookedResult.recordset.length > 0) {
      throw new Error("This time slot is already booked for this doctor.");
    }

    // Perform Update
    const updateRequest = connection.request();
    updateRequest.input("appointmentId", sql.Int, id);
    updateRequest.input("appointmentDate", sql.Date, appointmentDate);
    updateRequest.input("appointmentTime", sql.Time, timeAsDate);
    updateRequest.input("notes", sql.VarChar(500), notes?.trim() || null);
    const updateResult = await updateRequest.query(`
      UPDATE Appointments
      SET appointmentDate = @appointmentDate,
          appointmentTime = @appointmentTime,
          notes = @notes
      WHERE appointmentId = @appointmentId
    `);
    console.log(">>> Update Query Result:", updateResult);  // <-- Add This

    // Fetch Updated Appointment
    const updatedRequest = connection.request();
    updatedRequest.input("appointmentId", sql.Int, id);
    const updatedResult = await updatedRequest.query(`
        SELECT 
        a.appointmentId, a.userId, a.doctorId, a.appointmentTypeId, 
        a.appointmentDate, a.appointmentTime, a.notes,
        d.fullName AS doctorName,               
        t.typeName AS type                      
      FROM Appointments a
      JOIN Doctors d ON a.doctorId = d.doctorId
      JOIN AppointmentTypes t ON a.appointmentTypeId = t.appointmentTypeId
      WHERE a.appointmentId = @appointmentId
    `);
    console.log(">>> Updated Appointment Result:", updatedResult.recordset);  // <-- Add This

    if (!updatedResult.recordset.length) {
      // Instead of throwing, return a minimal object to indicate success
      return {
        appointmentId: id,
        appointmentDate,
        appointmentTime,
        notes,
        // Optionally add a flag or message
        warning: 'Updated in DB, but could not fetch full updated appointment.'
      };
    }

    return updatedResult.recordset[0];
  } catch (error) {
    console.error(">>> ERROR in updateAppointment:", error);  // <-- Make sure this prints
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}




/**
 * (DELETE) Delete an appointment by appointmentId
 * What this function does:
 * 1. Deletes the appointment with the given appointmentId
 * 2. Returns success message or throws error if not found
 */
async function deleteAppointment(appointmentId) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("appointmentId", sql.Int, appointmentId);
    const result = await request.query(`
      DELETE FROM Appointments WHERE appointmentId = @appointmentId
    `);
    if (result.rowsAffected[0] === 0) {
      throw new Error("Appointment not found or already deleted.");
    }
    return { success: true, message: "Appointment deleted successfully" };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

/**
 * (GET) Get a single appointment by appointmentId
 * What this function does:
 * 1. Fetches the appointment with the given appointmentId
 * 2. Returns the appointment object or null if not found
 */
async function getAppointmentById(appointmentId) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("appointmentId", sql.Int, appointmentId);
    const result = await request.query(`
      SELECT * FROM Appointments WHERE appointmentId = @appointmentId
    `);
    if (!result.recordset.length) {
      return null;
    }
    return result.recordset[0];
  } catch (error) {
    console.error("Error fetching appointment by ID:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

module.exports = {
  getBookedTimes,
  createAppointment,
  getAppointmentsByUser,
  updateAppointment,
  deleteAppointment,
  getAppointmentById,
};