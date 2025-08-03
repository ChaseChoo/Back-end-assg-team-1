const mealModel = require("../models/mealModel");
const jwt = require("jsonwebtoken");

// Get all meals for the authenticated user
async function getAllMeals(req, res) {
  try {
    const userId = req.user.userId; // Get userId from JWT token
    const meals = await mealModel.getAllMealsByUserId(userId);
    res.json(meals);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving meals" });
  }
}

async function getMealById(req, res) {
  try {
    const userId = req.user.userId; // Get userId from JWT token
    const meal = await mealModel.getMealById(req.params.id); // Changed from mealID to id
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    
    // Check if the meal belongs to the authenticated user
    if (meal.userId && meal.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You do not have access to this meal" });
    }
    
    res.json(meal);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving meal" });
  }
}

async function createMeal(req, res) {
  try {
    const { foodName, calories, mealPlanDateTime } = req.body;
    const userId = req.user.userId; // Get userId from JWT token
    
    if (!foodName || !calories || !mealPlanDateTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const newMeal = await mealModel.createMeal(userId, foodName, calories, mealPlanDateTime);
    res.status(201).json(newMeal);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating meal" });
  }
}

async function updateMeal(req, res) {
  try {
    const { foodName, calories, mealPlanDateTime } = req.body;
    const userId = req.user.userId; // Get userId from JWT token
    const mealID = req.params.id; // Changed from mealID to id
    
    if (!foodName || !calories || !mealPlanDateTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // First check if the meal exists and belongs to the user
    const existingMeal = await mealModel.getMealById(mealID);
    if (!existingMeal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    
    if (existingMeal.userId && existingMeal.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You do not have access to this meal" });
    }
    
    const updatedMeal = await mealModel.updateMeal(
      mealID,
      foodName,
      calories,
      mealPlanDateTime
    );
    
    res.json(updatedMeal);
  } catch (error) {
    console.error("Controller error:", error);
    if (error.message === 'Meal not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Error updating meal" });
  }
}

async function deleteMeal(req, res) {
  try {
    const userId = req.user.userId; // Get userId from JWT token
    const mealID = req.params.id; // Changed from mealID to id
    
    // First check if the meal exists and belongs to the user
    const existingMeal = await mealModel.getMealById(mealID);
    if (!existingMeal) {
      return res.status(404).json({ error: "Meal not found" });
    }
    
    if (existingMeal.userId && existingMeal.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You do not have access to this meal" });
    }
    
    const deletedMeal = await mealModel.deleteMeal(mealID);
    res.json({ 
      message: 'Meal deleted successfully',
      deletedMeal
    });
  } catch (error) {
    console.error("Controller error:", error);
    if (error.message === 'Meal not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Error deleting meal" });
  }
}

async function getAllFoods(req, res) {
  try {
    const foods = await mealModel.getAllFoods();
    res.json(foods);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving foods" });
  }
}

async function getFoodById(req, res) {
  try {
    const food = await mealModel.getFoodById(req.params.foodID);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving food" });
  }
}

async function createNewFood(req, res) {
  try {
    const { foodName, calories, allergens } = req.body;
    if (!foodName || !calories || !allergens) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newFood = await mealModel.createNewFood(foodName, calories, allergens);
    res.status(201).json(newFood);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating food" });
  }
}

async function searchFoods(req, res) {
  try {
    const { term } = req.query;
    if (!term) {
      return res.status(400).json({ error: "Search term is required" });
    }
    
    const foods = await mealModel.searchFoods(term);
    res.json(foods);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error searching foods" });
  }
}

async function deleteFood(req, res) {
  try {
    const deletedFood = await mealModel.deleteFood(req.params.foodID);
    res.json({ 
      message: 'Food deleted successfully',
      deletedFood
    });
  } catch (error) {
    console.error("Controller error:", error);
    if (error.message === 'Food not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Error deleting food" });
  }
}

module.exports = {
  getAllMeals,
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
