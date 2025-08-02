const Joi = require("joi"); // Import Joi for validation

// Validation schema for Appointment creation (POST)
// -------------------------------------------------------------------
// Requires: userId, doctorId, appointmentDate, appointmentTime, notes
// All fields validated for type, format, and constraints
const appointmentSchema = Joi.object({
  doctorId: Joi.number().integer().positive().required().messages({
    "any.required": "Doctor ID is required",
    "number.base": "Doctor ID must be a number",
    "number.integer": "Doctor ID must be an integer",
    "number.positive": "Doctor ID must be a positive number",
  }),

  appointmentTypeId: Joi.number().integer().positive().required().messages({
    "any.required": "Appointment type is required",
    "number.base": "Appointment type must be a number",
    "number.integer": "Appointment type must be an integer",
    "number.positive": "Appointment type must be a positive number",
  }),

  appointmentDate: Joi.date().required().messages({
    "any.required": "Appointment date is required",
    "date.base": "Appointment date must be a valid date",
  }),
  
  appointmentTime: Joi.string()
    .pattern(/^([01][0-9]|2[0-3]):[0-5][0-9]$/) // matches HH:mm
    .required()
    .messages({
      "any.required": "Appointment time is required",
      "string.pattern.base": "Appointment time must be in HH:mm format",
    }),

  notes: Joi.string().trim().max(500).allow(null, "").messages({  //trim whitespace, max length 500, allow null or empty string
    "string.max": "Notes cannot exceed 500 characters",
  }),
});

// Middleware to validate request body for appointment creation (POST)
function validateAppointment(req, res, next) {
    const { error } = appointmentSchema.validate(req.body, { abortEarly: false});
    if (error) {
        const messages = error.details.map((d) => d.message).join(", ");
        return res.status(400).json({ error: messages });
    }
    next(); // continue if valid 
}

// Validation schema for updating an appointment (PUT)
// -------------------------------------------------------
// Only allows: appointmentDate, appointmentTime, notes
// Used for PUT requests to update an existing appointment
const updateAppointmentSchema = Joi.object({
  appointmentDate: Joi.date().required().messages({
    "any.required": "Appointment date is required",
    "date.base": "Appointment date must be a valid date",
  }),
  appointmentTime: Joi.string()
    .pattern(/^([01][0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "any.required": "Appointment time is required",
      "string.pattern.base": "Appointment time must be in HH:mm format",
    }),
  notes: Joi.string().trim().max(500).allow(null, "").messages({
    "string.max": "Notes cannot exceed 500 characters",
  }),
});

// Middleware to validate request body for appointment update (PUT)
function validateUpdateAppointment(req, res, next) {
  const { error } = updateAppointmentSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(", ");
    return res.status(400).json({ error: messages });
  }
  next();
}

// -------------------------------------------------------------------
// Middleware to validate appointmentId param in routes
// Ensures :id in route is a positive integer
function validateAppointmentId(req, res, next) {
    const id = parseInt(req.params.id); //converts id to an integer
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid appointment ID. Must be a positive integer." });
    }
    next(); 
}

module.exports = {
    validateAppointment,
    validateAppointmentId,
    validateUpdateAppointment,
}
