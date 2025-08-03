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
const familyController = require('./controllers/familyController');
const inventoryController = require('./controllers/inventoryController');

// Import models for table creation
const FamilyModel = require('./models/familyModel');
const MedicationInventoryModel = require('./models/medicationInventoryModel');
const { addLanguagePreferenceColumn } = require('./utils/languageSetup');

// Import inventory validation middleware
const {
    validateInventoryItem,
    validateInventoryId,
    validateQuantity,
    validateNotificationId
} = require('./middlewares/inventoryValidation');

// Create Express app
const app = express();
const port = process.env.PORT || 3000; 

// Middleware
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log("Request body:", req.body);
    next();
});

// Serving static files from /docs folder
// When a request comes from a .html file, Express will look for it in the "docs" folder
app.use(express.static(path.join(__dirname, "docs")));

// Test route
app.get("/api/test", (req, res) => {
    console.log("TEST ROUTE HIT!");
    res.json({ message: "Test route working!" });
});

// Routes for Medications
app.get("/api/medication-records", authenticateToken, medicationController.getAllScheduledMedications); // medication.html list of medication records
app.post("/api/medication", authenticateToken, validateMedication, medicationController.createMedication); // add-medication.html
// Temporary backward compatibility route (will be removed later)
app.post("/api/add-medication", authenticateToken, validateMedication, medicationController.createMedication); // backward compatibility
app.post("/api/medication-schedule", authenticateToken, validateSchedule, medicationController.createSchedule); // schedule-medication.html
app.put("/api/medication-schedule/:scheduleId/mark-taken", authenticateToken, validateMarkAsTaken, medicationController.updateMarkAsTaken); // Setting the markAsTaken as (1) or (0)
app.put("/api/medication/:id", authenticateToken, validateMedicationId, validateMedicationUpdate, medicationController.updateMedication);
app.delete("/api/medication-schedule/:scheduleId", authenticateToken, medicationController.deleteScheduleById); // delete a specific medication record doseTime

// External API RxNav Autocomplete Proxy (to bypass school firewall permissions) 
app.get("/api/medication-suggestions", medicationController.getMedicationSuggestions);
// External API OPENFDA for the chatbot to retrieve side effects based on medication names
app.get("/api/openfda-adverse-events", medicationController.getOpenFdaAdverseEvents);

// Routes for Users
app.post("/api/users/register", validateUserRegistration, userController.registerUser); // Create new user account
app.post("/api/users/login", validateUserLogin, userController.loginUser); // Login to existing user account
app.get("/api/users/profile", authenticateToken, userController.getUserProfile); // Get user profile information
app.put("/api/users/update", authenticateToken, validateUserUpdate, userController.updateUserInfo); // Profile update for user account
app.put("/api/users/language", authenticateToken, userController.updateUserLanguage); // Update user language preference
app.delete("/api/users/delete", authenticateToken, userController.deleteUserAccount); // Permanently deleting user account

// Routes for Appointments
app.post("/api/appointments", authenticateToken, validateAppointment, appointmentController.createAppointment);
app.get("/api/appointments", authenticateToken, appointmentController.getUserAppointments);
app.put("/api/appointments/:id", authenticateToken, validateAppointmentId, validateUpdateAppointment, appointmentController.updateAppointment);
app.delete("/api/appointments/:id", authenticateToken, validateAppointmentId, appointmentController.deleteAppointment);

// Route for Doctors 
app.get('/api/doctors', doctorController.getDoctors);

// Routes for Family Management
app.get('/api/family', authenticateToken, familyController.getFamilyMembers);
app.post('/api/family', authenticateToken, familyController.addFamilyMember);
app.get('/api/family/stats', authenticateToken, familyController.getFamilyStats);
app.get('/api/family/:id', authenticateToken, familyController.getFamilyMemberById);
app.put('/api/family/:id', authenticateToken, familyController.updateFamilyMember);
app.delete('/api/family/:id', authenticateToken, familyController.deleteFamilyMember);

// Routes for Medication Inventory
app.get('/api/inventory', authenticateToken, inventoryController.getUserInventory);
app.get('/api/inventory/family', authenticateToken, inventoryController.getFamilyInventory);
app.get('/api/inventory/stats', authenticateToken, inventoryController.getInventoryStats);
app.get('/api/inventory/notifications', authenticateToken, inventoryController.getNotifications);
app.post('/api/inventory', authenticateToken, validateInventoryItem, inventoryController.addInventoryItem);
app.put('/api/inventory/:id', authenticateToken, validateInventoryId, validateInventoryItem, inventoryController.updateInventoryItem);
app.put('/api/inventory/:id/take', authenticateToken, validateInventoryId, validateQuantity, inventoryController.takeMedication);
app.put('/api/inventory/:id/restock', authenticateToken, validateInventoryId, validateQuantity, inventoryController.restockMedication);
app.put('/api/inventory/notifications/:id/read', authenticateToken, validateNotificationId, inventoryController.markNotificationAsRead);
app.delete('/api/inventory/:id', authenticateToken, validateInventoryId, inventoryController.deleteInventoryItem);

// Routes for the integrated meal system (your existing meal system with authentication)
const mealController = require("./controllers/mealController");
const {
  validateMealLog: validateMeal,
  validateMealLogId: validateMealId
} = require("./middlewares/mealLogValidation");

// Meal Plan routes (with authentication)
app.get("/api/meals", authenticateToken, mealController.getAllMeals);
app.get("/api/meals/:id", authenticateToken, validateMealId, mealController.getMealById);
app.post("/api/meals", authenticateToken, validateMeal, mealController.createMeal);
app.put("/api/meals/:id", authenticateToken, validateMealId, validateMeal, mealController.updateMeal); 
app.delete("/api/meals/:id", authenticateToken, validateMealId, mealController.deleteMeal);

// Food database routes (with authentication - no validation for now)
app.post("/api/foods", authenticateToken, mealController.createNewFood);
app.get("/api/foods/search", authenticateToken, mealController.searchFoods);
app.get("/api/foods", authenticateToken, mealController.getAllFoods);
app.get("/api/foods/:foodID", authenticateToken, mealController.getFoodById);
app.delete("/api/foods/:foodID", authenticateToken, mealController.deleteFood);

// Start server
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    
    // Initialize database tables
    try {
        await FamilyModel.createTable();
        await MedicationInventoryModel.createTable();
        await addLanguagePreferenceColumn();
        console.log('Database tables initialized successfully');
    } catch (error) {
        console.error('Error initializing database tables:', error);
    }
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
