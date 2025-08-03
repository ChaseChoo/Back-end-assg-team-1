const Joi = require("joi"); // Import Joi for validation

// Validation schema for meal logs (used for POST/PUT) - Updated to match your MealPlan table
const mealLogSchema = Joi.object({
  foodName: Joi.string().min(1).max(50).required().messages({
    "string.base": "Food name must be a string",
    "string.empty": "Food name cannot be empty",
    "string.min": "Food name must be at least 1 character long",
    "string.max": "Food name cannot exceed 50 characters",
    "any.required": "Food name is required",
  }),
  calories: Joi.string().min(1).max(10).required().messages({
    "string.base": "Calories must be a string",
    "string.empty": "Calories cannot be empty",
    "string.min": "Calories must be at least 1 character long",
    "string.max": "Calories cannot exceed 10 characters",
    "any.required": "Calories is required",
  }),
  mealPlanDateTime: Joi.date().required().messages({
    "date.base": "Meal plan date/time must be a valid date",
    "any.required": "Meal plan date/time is required",
  })
});

// Middleware to validate Meal Log body for POST/PUT
function validateMealLog(req, res, next) {
  // Validate the request body against the mealLogSchema
  const { error } = mealLogSchema.validate(req.body, { abortEarly: false }); // abortEarly: false collects all errors
  
  if (error) {
    // If validation fails, format the error messages and send a 400 error message
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  // If validation succeeds, pass control to the next middleware/route handler
  next();
}

// Middleware to validate mealLogId in the URL (GET by ID, PUT, DELETE)
function validateMealLogId(req, res, next) {
  // Parse the mealLogId from request parameters
  const mealLogId = parseInt(req.params.id, 10);
  
  if (isNaN(mealLogId) || mealLogId <= 0) {
    return res.status(400).json({ error: "Invalid meal log ID" });
  }

  // If validation succeeds, pass control to the next middleware/route handler
  next();
}

module.exports = {
  validateMealLog,
  validateMealLogId,
};