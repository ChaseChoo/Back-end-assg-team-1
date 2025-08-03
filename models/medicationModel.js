const sql = require("mssql");
const dbConfig = require("../dbConfig");

// (POST) Create new medication
async function createMedication(data) {
    let connection;
    try {
        // Connect to database configuration file
        connection = await sql.connect(dbConfig);

        const query = `INSERT INTO Medications (userId, medicationName, dosage, frequency, instructions, sideEffects)
                       VALUES (@userId, @medicationName, @dosage, @frequency, @instructions, @sideEffects);
                       SELECT SCOPE_IDENTITY() AS medicationId`;

        const request = connection.request();
        // using SQL type binding and parameter safety
        request.input("userId", sql.Int, data.userId);
        request.input("medicationName", sql.NVarChar(100), data.medicationName);
        request.input("dosage", sql.NVarChar(50), data.dosage);
        request.input("frequency", sql.NVarChar(20), data.frequency);
        request.input("instructions", sql.NVarChar(500), data.instructions || null);
        request.input("sideEffects", sql.NVarChar(500), data.sideEffects || null);

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

        // Safe SQL parameter binding (note: no userId in MedicationSchedules table)
        request.input("medicationId", sql.Int, medicationId);
        request.input("doseTime", sql.Time, jsTime);

        const result = await request.query(`
            INSERT INTO MedicationSchedules (medicationId, doseTime)
            OUTPUT INSERTED.*
            VALUES (@medicationId, @doseTime)
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
            UPDATE MedicationSchedules
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

        // Step 1: Get medicationId before deleting (check ownership through Medications table)
        const medIdResult = await connection.request()
            .input("scheduleId", sql.Int, scheduleId)
            .input("userId", sql.Int, userId)
            .query(`SELECT s.medicationId FROM MedicationSchedules s 
                    INNER JOIN Medications m ON s.medicationId = m.medicationId 
                    WHERE s.scheduleId = @scheduleId AND m.userId = @userId`);

        const medicationId = medIdResult.recordset[0]?.medicationId;
        if (!medicationId) return false;

        // Step 2: Delete the schedule
        const delResult = await connection.request()
            .input("scheduleId", sql.Int, scheduleId)
            .query(`DELETE FROM MedicationSchedules WHERE scheduleId = @scheduleId`);

        if (delResult.rowsAffected[0] === 0) return false;

        // Step 3: Check if medication has any remaining schedules
        const countResult = await connection.request()
            .input("medicationId", sql.Int, medicationId)
            .query(`SELECT COUNT(*) AS count FROM MedicationSchedules WHERE medicationId = @medicationId`);

        if (countResult.recordset[0].count === 0) {
            await connection.request()
                .input("medicationId", sql.Int, medicationId)
                .input("userId", sql.Int, userId)
                .query(`DELETE FROM Medications WHERE medicationId = @medicationId AND userId = @userId`);
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

        const medicationUpdateQuery  = `UPDATE Medications
                       SET medicationName = @medicationName,
                           dosage = @dosage,
                           frequency = @frequency,
                           instructions = @instructions,
                           sideEffects = @sideEffects,
                           updatedAt = GETDATE()
                       WHERE medicationId = @medicationId AND userId = @userId;`;
        
        // Safe SQL parameter binding
        request.input("medicationId", sql.Int, medicationId);
        request.input("userId", sql.Int, userId); 
        request.input("medicationName", sql.NVarChar(100), data.medicationName);
        request.input("dosage", sql.NVarChar(50), data.dosage);
        request.input("frequency", sql.NVarChar(20), data.frequency);
        request.input("instructions", sql.NVarChar(500), data.instructions || null);
        request.input("sideEffects", sql.NVarChar(500), data.sideEffects || null);

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

        const scheduleUpdateQuery = `UPDATE MedicationSchedules
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
                        m.instructions, m.sideEffects, m.createdAt, m.updatedAt,
                        s.scheduleId, s.doseTime, s.markAsTaken, s.lastTaken
                        FROM Medications m
                        LEFT JOIN MedicationSchedules s ON m.medicationId = s.medicationId
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
                    instructions: row.instructions,
                    sideEffects: row.sideEffects,
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,
                    doseTimes: [],
                    scheduleIds: [],
                    markAsTakenFlags: [],
                    lastTakenTimes: []
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
                    medMap[id].lastTakenTimes.push(row.lastTaken);
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

// Get schedule information by scheduleId (for inventory integration)
async function getScheduleById(scheduleId) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        
        const query = `
            SELECT ms.scheduleId, ms.medicationId, ms.doseTime, ms.reminderEnabled, ms.markAsTaken,
                   m.medicationName, m.userId
            FROM MedicationSchedules ms
            INNER JOIN Medications m ON ms.medicationId = m.medicationId
            WHERE ms.scheduleId = @scheduleId
        `;
        
        const request = connection.request();
        request.input("scheduleId", sql.Int, scheduleId);
        
        const result = await request.query(query);
        return result.recordset[0] || null;
        
    } catch (error) {
        console.error("Error getting schedule by ID:", error);
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

// module.exports is used to make database interaction functions available
module.exports = { 
    createMedication,
    createSchedule,
    deleteSchedule,
    setMarkAsTaken,
    updateMedication,
    getAllScheduledMedicationsByUserId,
    getScheduleById,
}