const sql = require("mssql");
const dbConfig = require("../dbConfig");

async function getAllMealsByUserId(userId) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT * FROM MealPlan WHERE userId = @userId ORDER BY mealPlanDateTime DESC";
    const result = await connection.request()
      .input('userId', sql.Int, userId)
      .query(query);
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

async function getMealById(mealID) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT * FROM MealPlan WHERE mealID = @mealID";
    const result = await connection.request()
      .input('mealID', sql.Int, mealID)
      .query(query);
    return result.recordset[0];
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

async function createMeal(userId, foodName, calories, mealPlanDateTime) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      INSERT INTO MealPlan (userId, foodName, calories, mealPlanDateTime) 
      OUTPUT INSERTED.*
      VALUES (@userId, @foodName, @calories, @mealPlanDateTime)
    `;
    const result = await connection.request()
      .input('userId', sql.Int, userId)
      .input('foodName', sql.VarChar(50), foodName)
      .input('calories', sql.VarChar(10), calories)
      .input('mealPlanDateTime', sql.DateTime, mealPlanDateTime)
      .query(query);
    return result.recordset[0];
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

async function updateMeal(mealID, foodName, calories, mealPlanDateTime) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      UPDATE MealPlan 
      SET foodName = @foodName, 
          calories = @calories, 
          mealPlanDateTime = @mealPlanDateTime
      OUTPUT INSERTED.*
      WHERE mealID = @mealID
    `;
    const result = await connection.request()
      .input('mealID', sql.Int, mealID)
      .input('foodName', sql.VarChar(50), foodName)
      .input('calories', sql.VarChar(10), calories)
      .input('mealPlanDateTime', sql.DateTime, mealPlanDateTime)
      .query(query);
      
    if (result.recordset.length === 0) {
      throw new Error('Meal not found');
    }
    return result.recordset[0];
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

async function deleteMeal(mealID) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      DELETE FROM MealPlan 
      OUTPUT DELETED.*
      WHERE mealID = @mealID
    `;
    const result = await connection.request()
      .input('mealID', sql.Int, mealID)
      .query(query);
      
    if (result.recordset.length === 0) {
      throw new Error('Meal not found');
    }
    return result.recordset[0];
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

async function getAllFoods() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT * FROM foodAndNutrition";
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

async function getFoodById(foodID) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT * FROM foodAndNutrition WHERE foodID = @foodID";
    const result = await connection.request()
      .input('foodID', sql.Int, foodID)
      .query(query);
    return result.recordset[0];
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

async function createNewFood(foodName, calories, allergens) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      INSERT INTO foodAndNutrition (foodName, calories, allergens) 
      OUTPUT INSERTED.*
      VALUES (@foodName, @calories, @allergens)
    `;
    const result = await connection.request()
      .input('foodName', sql.VarChar(50), foodName)
      .input('calories', sql.VarChar(10), calories)
      .input('allergens', sql.VarChar(255), allergens)
      .query(query);
    return result.recordset[0];
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

async function searchFoods(searchTerm) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      SELECT * FROM foodAndNutrition 
      WHERE foodName LIKE '%' + @searchTerm + '%' 
      OR allergens LIKE '%' + @searchTerm + '%'
    `;
    const result = await connection.request()
      .input('searchTerm', sql.VarChar(255), searchTerm)
      .query(query);
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

async function deleteFood(foodID) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      DELETE FROM foodAndNutrition 
      OUTPUT DELETED.*
      WHERE foodID = @foodID
    `;
    const result = await connection.request()
      .input('foodID', sql.Int, foodID)
      .query(query);
      
    if (result.recordset.length === 0) {
      throw new Error('Food not found');
    }
    return result.recordset[0];
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
  getAllMealsByUserId,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
  getAllFoods,
  getFoodById,
  createNewFood,
  searchFoods,
  deleteFood
};
