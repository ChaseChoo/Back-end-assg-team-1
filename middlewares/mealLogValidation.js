const Joi = require("joi"); // Import Joi for validation

// Validation schema for meal logs (used for POST/PUT)
const mealLogSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be a positive number",
    "any.required": "User ID is required",
  }),
  foodName: Joi.string().max(100).required().messages({
      "string.base": "Food name must be a string",
      "string.empty": "Food name cannot be empty",
      "string.max": "Food name cannot exceed 100 characters",
      "any.required": "Food name is required",
    }),
  calories: Joi.number().integer().min(0).required().messages({
    "number.base": "Calories must be a number",
    "number.integer": "Calories must be an integer",
    "number.min": "Calories cannot be negative",
    "any.required": "Calories are required",
  }),
  water: Joi.number().integer().min(0).required().messages({
    "number.base": "Water intake must be a number",
    "number.integer": "Water intake must be an integer",
    "number.min": "Water intake cannot be negative",
    "any.required": "Water intake is required",
  }),
  // Add validation for other fields if necessary (e.g., year, genre)
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