// Nodemon code entry point
const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
const path = require("path"); // built-in path module in node

// Load environment variables
dotenv.config();

// Controller & Validation Middleware from /middleware
const medicationController = require("./controllers/medicationController");
const {
    validateMedication,
    validateMedicationId,
    validateSchedule,
    validateMedicationUpdate,
    validateMarkAsTaken,
} = require("./middlewares/medicationValidation");

const mealLogController = require("./controllers/mealLogController");
const {
    validateMealLog,
    validateMealLogId,
} = require("./middlewares/mealLogValidation");

const userController = require("./controllers/userController");
const {
    authenticateToken, // JWT Bearer Token
    validateUserRegistration,
    validateUserLogin,
    validateUserUpdate,
} = require("./middlewares/userValidation");

const appointmentController = require("./controllers/appointmentController");
const {
    validateAppointment,
    validateAppointmentId,
    validateUpdateAppointment,
} = require("./middlewares/appointmentValidation");

const doctorController = require('./controllers/doctorController');

// Create Express app
const app = express();
const port = process.env.PORT || 3000; 

// Middleware
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Serving static files from /docs folder
// When a request comes from a .html file, Express will look for it in the "docs" folder
app.use(express.static(path.join(__dirname, "docs")));

// Routes for Medications
app.get("/api/medication-records", authenticateToken, medicationController.getAllScheduledMedications); // medication.html list of medication records
app.post("/api/medication", authenticateToken, validateMedication, medicationController.createMedication); // add-medication.html
app.post("/api/medication-schedule", authenticateToken, validateSchedule, medicationController.createSchedule); // schedule-medication.html
app.put("/api/medication-schedule/:scheduleId/mark-taken", authenticateToken, validateMarkAsTaken, medicationController.updateMarkAsTaken); // Setting the markAsTaken as (1) or (0)
app.put("/api/medication/:id", authenticateToken, validateMedicationId, validateMedicationUpdate, medicationController.updateMedication);
app.delete("/api/medication-schedule/:scheduleId", authenticateToken, medicationController.deleteScheduleById); // delete a specific medication record doseTime

// External API RxNav Autocomplete Proxy (to bypass school firewall permissions) 
app.get("/api/medication-suggestions", medicationController.getMedicationSuggestions);
// External API OPENFDA for the chatbot to retrieve side effects based on medication names
app.get("/api/openfda-adverse-events", medicationController.getOpenFdaAdverseEvents);

// Routes for Meal Logs
app.get("/api/mealLog", mealLogController.getAllMealLogs);
app.get("/api/mealLog/:id", validateMealLogId, mealLogController.getMealLogById);
app.post("/api/mealLog", validateMealLog, mealLogController.createMealLog);
app.put("/api/mealLog/:id", validateMealLogId, mealLogController.updateMealLog);
app.delete("/api/mealLog/:id", validateMealLogId, mealLogController.deleteMealLog);

// Routes for Users
app.post("/api/users/register", validateUserRegistration, userController.registerUser); // Create new user account
app.post("/api/users/login", validateUserLogin, userController.loginUser); // Login to existing user account
app.put("/api/users/update", authenticateToken, validateUserUpdate, userController.updateUserInfo); // Profile update for user account
app.delete("/api/users/delete", authenticateToken, userController.deleteUserAccount); // Permanently deleting user account

// Routes for Appointments
app.post("/api/appointments", authenticateToken, validateAppointment, appointmentController.createAppointment);
app.get("/api/appointments", authenticateToken, appointmentController.getUserAppointments);
app.put("/api/appointments/:id", authenticateToken, validateAppointmentId, validateUpdateAppointment, appointmentController.updateAppointment);
app.delete("/api/appointments/:id", authenticateToken, validateAppointmentId, appointmentController.deleteAppointment);

// Route for Doctors 
app.get('/api/doctors', doctorController.getDoctors);


// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Graceful shutdown
// Listening for termination signals (like ctrl+c)
process.on("SIGINT", async() => {
    console.log("Server is gracefully shutting down");
    // Close any open connections
    await sql.close();
    console.log("Database connections closed");
    process.exit(0) // exit process
});
