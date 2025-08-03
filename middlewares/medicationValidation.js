const Joi = require("joi"); // Import Joi for validation

// Validation schema for Medication (used for POST)
// Note: userId is extracted from JWT token by authenticateToken middleware, not from request body
const medicationSchema = Joi.object({
  medicationName: Joi.string().max(100).required().messages({
    "string.base": "Medication name must be a string",
    "string.empty": "Medication name cannot be empty",
    "string.max": "Medication name cannot exceed 100 characters",
    "any.required": "Medication name is required",
  }),
  dosage: Joi.string().max(50).required().messages({
    "string.base": "Dosage must be a string",
    "string.empty": "Dosage cannot be empty",
    "string.max": "Dosage cannot exceed 50 characters",
    "any.required": "Dosage is required",
  }),
  frequency: Joi.string().max(20).required().messages({
    "string.base": "Frequency must be a string",
    "string.empty": "Frequency cannot be empty",
    "string.max": "Frequency cannot exceed 20 characters",
    "any.required": "Frequency is required",
  }),
  startDate: Joi.date().required().messages({
    "date.base": "Start date must be a valid date",
    "any.required": "Start date is required",
  }),
  endDate: Joi.date().greater(Joi.ref("startDate")).required().messages({
    "date.base": "End date must be a valid date",
    "date.greater": "End date must be after the start date",
    "any.required": "End date is required",
  }),
  iconType: Joi.string().valid("capsule", "tablet", "syringe", "inhaler", "").allow(null, "").messages({
    "string.base": "Icon type must be a string",
    "any.only": "Icon type must be one of: capsule, tablet, syringe, inhaler",
  }),
});


// Middleware to validate Medication body for POST
function validateMedication(req, res, next) {
    // Validate the request body against the medicationSchema
    const { error } = medicationSchema.validate(req.body, { abortEarly: false }); // abortEarly: false collects all errors
    
    if (error) {
    // If validation fails, format the error messages and send a 400 error message
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    return res.status(400).json({ error: errorMessage });
    }

    // If validation succeeds, pass control to the next middleware/route handler
    next();
}

// Validation schema for UPDATING Medication Records in medication.html (used for PUT)
// Requires a whole new Schema because of the doseTime field from MedicationSchedule tbl
const medicationUpdateSchema = Joi.object({
  scheduleId: Joi.number().integer().positive().required().messages({
    "number.base": "Schedule ID must be a number",
    "number.integer": "Schedule ID must be an integer",
    "number.positive": "Schedule ID must be a positive number",
    "any.required": "Schedule ID is required"
  }),
  medicationName: Joi.string().max(100).required().messages({
    "string.base": "Medication name must be a string",
    "string.empty": "Medication name cannot be empty",
    "string.max": "Medication name cannot exceed 100 characters",
    "any.required": "Medication name is required",
  }),
  dosage: Joi.string().max(50).required().messages({
    "string.base": "Dosage must be a string",
    "string.empty": "Dosage cannot be empty",
    "string.max": "Dosage cannot exceed 50 characters",
    "any.required": "Dosage is required",
  }),
  frequency: Joi.string().max(20).required().messages({
    "string.base": "Frequency must be a string",
    "string.empty": "Frequency cannot be empty",
    "string.max": "Frequency cannot exceed 20 characters",
    "any.required": "Frequency is required",
  }),
  startDate: Joi.date().required().messages({
    "date.base": "Start date must be a valid date",
    "any.required": "Start date is required",
  }),
  endDate: Joi.date().greater(Joi.ref("startDate")).required().messages({
    "date.base": "End date must be a valid date",
    "date.greater": "End date must be after the start date",
    "any.required": "End date is required",
  }),
  iconType: Joi.string().valid("capsule", "tablet", "syringe", "inhaler", "").allow(null, "").messages({
    "string.base": "Icon type must be a string",
    "any.only": "Icon type must be one of: capsule, tablet, syringe, inhaler",
  }),
  // Added doseTime to this schema because the PUT request updates 2 tables
  doseTime: Joi.string().pattern(/^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).required().messages({
    "any.required": "Dose time is required",
    "string.pattern.base": "Dose time must be in HH:mm or HH:mm:ss format"
  })
});

// Middleware to validate update forms for PUT requests (used for PUT)
// Requires a whole new Schema because of the doseTime field from MedicationSchedule tbl
function validateMedicationUpdate(req, res, next) {
  const { error } = medicationUpdateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map(d => d.message).join(", ");
    return res.status(400).json({ error: errorMessage });
  }
  next();
}


// Middleware to validate medicationId in the URL (GET by ID, PUT, DELETE)
function validateMedicationId(req, res, next) {
    // Parse the medicationId from request parameters
    const medicationId = parseInt(req.params.id);

    // Check if the parsed medicationId is a valid positive number
    if (isNaN(medicationId) || medicationId <= 0) {

        // If not valid, return a 400 error response
        return res.status(400).json({ error: "Invalid medication ID. Must be a positive number." });
    }

    // If validation succeeds, pass control to the next middleware/route handler
    next();
}

// Validation schema for to validate medication schedules (POST/PUT) requests
// Note: userId is extracted from JWT token by authenticateToken middleware, not from request body
function validateSchedule(req, res, next) {
  const schema = Joi.object({
    medicationId: Joi.number().integer().positive().required().messages({
      "any.required": "Medication ID is required",
      "number.base": "Medication ID must be a number",
      "number.positive": "Medication ID must be a positive number"
    }),
    doseTime: Joi.string().pattern(/^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).required().messages({
        "any.required": "Dose time is required",
        "string.pattern.base": "Dose time must be in HH:mm or HH:mm:ss format"
    }),
    reminderEnabled: Joi.boolean().required().messages({
      "any.required": "Reminder status is required",
      "boolean.base": "Reminder status must be true or false"
    }),
  });

  // Perform validation on the request body based on the defined schema
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    // Collect all error messages into one string
    const errorMessage = error.details.map((detail) => detail.message).join(", ");
    // Respond with error message
    return res.status(400).json({ error: errorMessage });
  }
  // If validation succeeds, pass control to the next middleware/route handler
  next();
}

// Middleware to validate scheduleId param and markAsTaken boolean in body
function validateMarkAsTaken(req, res, next) {
  const scheduleId = parseInt(req.params.scheduleId);
  if (isNaN(scheduleId) || scheduleId <= 0) {
    return res.status(400).json({ error: "Invalid schedule ID. Must be a positive number." });
  }

  const schema = Joi.object({
    markAsTaken: Joi.boolean().required().messages({
      "any.required": "markAsTaken is required",
      "boolean.base": "markAsTaken must be true or false"
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
}


// module.exports is used to make database interaction functions available
module.exports = {
    validateMedication,
    validateMedicationUpdate,
    validateMedicationId,
    validateSchedule,
    validateMarkAsTaken,
};