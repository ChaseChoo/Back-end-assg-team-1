const sql = require("mssql");
const dbConfig = require("../dbConfig");

// (GET) Get all meal logs
async function getAllMealLogs() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT mealLogId, userId, foodName, calories, water FROM MealLog";
    const result = await connection.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database error:", error);
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

// (GET) Get meal log by mealLogId
async function getMealLogById(mealLogId) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT mealLogId, userId, foodName, calories, water FROM MealLog WHERE mealLogId = @mealLogId";
    const request = connection.request();
    
    request.input("mealLogId", sql.Int, mealLogId); // matching mealLogId's
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return null; // Return NULL if no matching meal log found
    }

    return result.recordset[0]; // Return the found meal log
  } catch (error) {
    console.error("Database error:", error);
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

// (POST) Create new meal log
async function createMealLog(MealLogData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "INSERT INTO MealLog (userId, foodName, calories, water) VALUES (@userId, @foodName, @calories, @water); SELECT SCOPE_IDENTITY() AS mealLogId;";
    const request = connection.request();
    request.input("userId", sql.Int, MealLogData.userId);
    request.input("foodName", MealLogData.foodName);
    request.input("calories", MealLogData.calories);
    request.input("water", MealLogData.water);
    const result = await request.query(query);

    const newMealLogId = result.recordset[0].mealLogId; 
    return await getMealLogById(newMealLogId);
  } catch (error) {
    console.error("Database error:", error);
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

// (PUT) Update meal log
async function updateMealLog(mealLogId, MealLogData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "UPDATE MealLog SET userId = @userId, foodName = @foodName, calories = @calories, water = @water WHERE mealLogId = @mealLogId";
    const request = connection.request();
    request.input("mealLogId", sql.Int, mealLogId);
    request.input("userId", sql.Int, MealLogData.userId);
    request.input("foodName", MealLogData.foodName);
    request.input("calories", MealLogData.calories);
    request.input("water", MealLogData.water);
    
    await request.query(query);
    return await getMealLogById(mealLogId); // Return updated meal log
  } catch (error) {
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

// (DELETE) Delete meal log
async function deleteMealLog(mealLogId) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "DELETE FROM MealLog WHERE mealLogId = @mealLogId";
    const request = connection.request();
    request.input("mealLogId", sql.Int, mealLogId);
    
    await request.query(query);
    return { message: "Meal log deleted successfully" };
  } catch (error) {
    console.error("Database error:", error);
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
  getAllMealLogs,
  getMealLogById,
  createMealLog,
  updateMealLog,
  deleteMealLog, 
}