const sql = require("mssql");
const dbConfig = require("../dbConfig");

// (POST) Create new medication
async function createMedication(data) {
    let connection;
    try {
        // Connect to database configuration file
        connection = await sql.connect(dbConfig);

        const query = `INSERT INTO Medication (userId, medicationName, dosage, frequency, startDate, endDate, iconType)
                       VALUES (@userId, @medicationName, @dosage, @frequency, @startDate, @endDate, @iconType);
                       SELECT SCOPE_IDENTITY() AS medicationId`;

        const request = connection.request();
        // using SQL type binding and parameter safety
        request.input("userId", sql.Int, data.userId);
        request.input("medicationName", sql.NVarChar(100), data.medicationName);
        request.input("dosage", sql.NVarChar(50), data.dosage);
        request.input("frequency", sql.NVarChar(20), data.frequency);
        request.input("startDate", sql.Date, data.startDate);
        request.input("endDate", sql.Date, data.endDate);
        request.input("iconType", sql.NVarChar(20), data.iconType);

        // Execute SQL query and retrieve inserted medicationId
        const result = await request.query(query);
        const newId = result.recordset[0].medicationId;

        // Return newly inserted medication record id
        return { medicationId: newId };
    }
    catch (error) {
        console.error("Database error:", error);
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

// (POST) Create new schedule
async function createSchedule({ userId, medicationId, doseTime, reminderEnabled }) {
    let connection;
    try {
        // Connect to SQL Server
        connection = await sql.connect(dbConfig);
        const request = connection.request();

        // Convert doseTime string (HH:mm) to Date object for sql.Time
        const [hour, minute] = doseTime.split(":").map(Number);
        const jsTime = new Date(Date.UTC(1970, 0, 1, hour, minute, 0)); 

        // Safe SQL parameter binding
        request.input("userId", sql.Int, userId);
        request.input("medicationId", sql.Int, medicationId);
        request.input("doseTime", sql.Time, jsTime);
        request.input("reminderEnabled", sql.Bit, reminderEnabled);

        const result = await request.query(`
            INSERT INTO MedicationSchedule (userId, medicationId, doseTime, reminderEnabled)
            OUTPUT INSERTED.*
            VALUES (@userId, @medicationId, @doseTime, @reminderEnabled)
        `);

        return result.recordset[0];
    } 
    catch (error) {
        console.error("Error creating schedule:", error);
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

// (PUT) Controller -> updateMarkAsTaken
// PUT function used to set (1) or unset (0) the status of markAsTaken 
async function setMarkAsTaken(scheduleId, markAsTaken) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const request = connection.request();

        request.input("scheduleId", sql.Int, scheduleId);
        request.input("markAsTaken", sql.Bit, markAsTaken);

        const result = await request.query(`
            UPDATE MedicationSchedule
            SET markAsTaken = @markAsTaken
            WHERE scheduleId = @scheduleId
        `);

        return result.rowsAffected[0] > 0;
    } catch (err) {
        console.error("Error updating markAsTaken:", err);
        throw err;
    } finally {
        if (connection) await connection.close();
    }
}

// (DELETE) Delete schedule by scheduleId as one schedule has one doseTime
// Allows user to delete a specific doseTime schedule instead of all
async function deleteSchedule(scheduleId, userId) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);

        // Step 1: Get medicationId before deleting
        const medIdResult = await connection.request()
            .input("scheduleId", sql.Int, scheduleId)
            .input("userId", sql.Int, userId)
            .query(`SELECT medicationId FROM MedicationSchedule WHERE scheduleId = @scheduleId AND userId = @userId`);

        const medicationId = medIdResult.recordset[0]?.medicationId;
        if (!medicationId) return false;

        // Step 2: Delete the schedule
        const delResult = await connection.request()
            .input("scheduleId", sql.Int, scheduleId)
            .input("userId", sql.Int, userId)
            .query(`DELETE FROM MedicationSchedule WHERE scheduleId = @scheduleId AND userId = @userId`);

        if (delResult.rowsAffected[0] === 0) return false;

        // Step 3: Check if medication has any remaining schedules
        const countResult = await connection.request()
            .input("medicationId", sql.Int, medicationId)
            .query(`SELECT COUNT(*) AS count FROM MedicationSchedule WHERE medicationId = @medicationId`);

        if (countResult.recordset[0].count === 0) {
            await connection.request()
                .input("medicationId", sql.Int, medicationId)
                .input("userId", sql.Int, userId)
                .query(`DELETE FROM Medication WHERE medicationId = @medicationId AND userId = @userId`);
        }

        return true;
    } catch (err) {
        console.error("Error deleting schedule & checking medication:", err);
        throw err;
    } finally {
        if (connection) await connection.close();
    }
}

// (PUT) Update an existing medication record by medicationId
async function updateMedication(medicationId, data, userId) {
    let connection;
    try {
        // Connect to SQL Server
        connection = await sql.connect(dbConfig);
        const request = connection.request();

        const medicationUpdateQuery  = `UPDATE Medication
                       SET medicationName = @medicationName,
                           dosage = @dosage,
                           frequency = @frequency,
                           startDate = @startDate,
                           endDate = @endDate,
                           iconType = @iconType
                       WHERE medicationId = @medicationId AND userId = @userId;;`;
        
        // Safe SQL parameter binding
        request.input("medicationId", sql.Int, medicationId);
        // hardcoded to userId 1 in controller until Login with JWT is completed
        request.input("userId", sql.Int, userId); 
        request.input("medicationName", sql.NVarChar(100), data.medicationName);
        request.input("dosage", sql.NVarChar(50), data.dosage);
        request.input("frequency", sql.NVarChar(20), data.frequency);
        request.input("startDate", sql.Date, data.startDate);
        request.input("endDate", sql.Date, data.endDate);
        request.input("iconType", sql.NVarChar(20), data.iconType);

        // Execute the update query request 
        const medicationResult = await request.query(medicationUpdateQuery);

        // Check if any rows are updated 
        if (medicationResult.rowsAffected[0] === 0) {
            return null; // No medication found to update
        }

        // Second SQL query to update MedicationSchedule table doseTime field
        const scheduleRequest = connection.request();

        // Convert updated doseTime string (HH:mm) to Date object for sql.Time
        const [hour, minute] = data.doseTime.split(":").map(Number);
        const jsTime = new Date(Date.UTC(1970, 0, 1, hour, minute, 0));

        // Safe SQL parameter binding
        scheduleRequest.input("scheduleId", sql.Int, data.scheduleId);
        scheduleRequest.input("doseTime", sql.Time, jsTime);

        const scheduleUpdateQuery = `UPDATE MedicationSchedule
                                     SET doseTime = @doseTime
                                     WHERE scheduleId = @scheduleId;`;

        // Execute the update query request 
        await scheduleRequest.query(scheduleUpdateQuery);                             

        // Return true when both tables are updated
        return true;

    }
    catch (error) {
        console.error("Error updating medication:", error);
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

// Used to display records in the medication.html page
// (GET) Retrieve all scheduled medications for a specific user (with timing info)
async function getAllScheduledMedicationsByUserId(userId) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const request = connection.request();

        // hardcoded to userId 1 in controller until Login with JWT is completed
        request.input("userId", sql.Int, userId);

        const query = ` SELECT m.medicationId, m.userId, m.medicationName, m.dosage, m.frequency,
                        m.startDate, m.endDate, m.iconType, m.createdAt,s.scheduleId, s.doseTime,
                        s.markAsTaken, s.reminderEnabled
                        FROM Medication m
                        LEFT JOIN MedicationSchedule s ON m.medicationId = s.medicationId
                        WHERE m.userId = @userId
                        ORDER BY s.doseTime ASC, m.createdAt DESC;`;

        const result = await request.query(query);

        // Group by medicationId
        const medMap = {};
        for (const row of result.recordset) {
            const id = row.medicationId;
            if (!medMap[id]) {
                medMap[id] = {
                    medicationId: id,
                    userId: row.userId,
                    medicationName: row.medicationName,
                    dosage: row.dosage,
                    frequency: row.frequency,
                    startDate: row.startDate,
                    endDate: row.endDate,
                    iconType: row.iconType,
                    createdAt: row.createdAt,
                    doseTimes: [],
                    scheduleIds: [],
                    markAsTakenFlags: [],
                    reminderEnabledFlags: []
                };
            }
            if (row.doseTime) {
                try {
                    let time = "";

                    // If it's a Date object, extract HH:MM:SS
                    if (row.doseTime instanceof Date) {
                        time = row.doseTime.toTimeString().substring(0, 8); // e.g. "14:30:00"
                    } else if (typeof row.doseTime === "string") {
                        time = row.doseTime.length === 5 ? row.doseTime + ":00" : row.doseTime;
                    }

                    const iso = new Date(`1970-01-01T${time}`).toISOString(); // convert to ISO string
                    medMap[id].doseTimes.push(iso);
                    medMap[id].scheduleIds.push(row.scheduleId);
                    medMap[id].markAsTakenFlags.push(row.markAsTaken);
                    medMap[id].reminderEnabledFlags.push(row.reminderEnabled);
                } catch (err) {
                    console.warn("Invalid doseTime skipped:", row.doseTime, err.message);
                }
            }
        }

        return Object.values(medMap);
    }
    catch (error) {
        console.error("Error fetching scheduled medications:", error);
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

// module.exports is used to make database interaction functions available
module.exports = { 
    createMedication,
    createSchedule,
    deleteSchedule,
    setMarkAsTaken,
    updateMedication,
    getAllScheduledMedicationsByUserId,
}