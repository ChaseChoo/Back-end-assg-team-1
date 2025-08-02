const mealLogModel = require("../models/mealLogModel");

// (GET) retrieve all meal logs
async function getAllMealLogs(req, res) {
  try {
    const mealLogs = await mealLogModel.getAllMealLogs();
    res.json(mealLogs);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving meal logs" });
  }
}

// (GET) retrieve meal log by mealLogId
async function getMealLogById(req, res) {
  try {
    const id = parseInt(req.params.id);
    // Call mealLogModel.js file getMealLogById function 
    const mealLog = await mealLogModel.getMealLogById(id);

    // Check if meal log exists inside the database
    if (!mealLog) {
      return res.status(404).json({ error: "Meal Log not found" });
    }
    // Return meal log data response as JSON 
    res.json(mealLog);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving Meal Log" });
  }
}

// (POST) Create new meal log
async function createMealLog(req, res) {
  try {
    // Call the mealLogModel.js file createMealLog function
    const newMealLog = await mealLogModel.createMealLog(req.body);
    res.status(201).json(newMealLog);
  } catch (error) {
    console.error("Error creating meal log:", error);
    res.status(500).json({ error: "Failed to create meal log" });
  }
}

// (PUT) Update meal log
async function updateMealLog(req, res) {
  try {
    const id = parseInt(req.params.id);
    const updatedMealLog = await mealLogModel.updateMealLog(id, req.body);
    if (!updatedMealLog) {
      return res.status(404).json({ error: "Meal Log not found" });
    }
    res.json(updatedMealLog);
  } 
  catch (error) {
    console.error("Error updating meal log:", error);
    res.status(500).json({ error: "Failed to update meal log" });
  }
}

// (DELETE) Delete meal log
async function deleteMealLog(req, res) {
  try {
    const id = parseInt(req.params.id);
    const result = await mealLogModel.deleteMealLog(id);
    if (!result) {
      return res.status(404).json({ error: "Meal Log not found" });
    }
    res.json({ message: "Meal Log deleted successfully" });
  } catch (error) {
    console.error("Error deleting meal log:", error);
    res.status(500).json({ error: "Failed to delete meal log" });
  }
}

module.exports = {
    getAllMealLogs,
    getMealLogById,
    createMealLog,
    updateMealLog,
    deleteMealLog
}