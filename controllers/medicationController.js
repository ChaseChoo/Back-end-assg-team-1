const medicationModel = require("../models/medicationModel");
const MedicationInventoryModel = require("../models/medicationInventoryModel");
const axios = require("axios"); // used for external API

// (POST) Create new medication
async function createMedication(req, res) {
    try {
        const userId = req.user.userId; // Extract userId from JWT
        // Call the medicationModel.js file createMedication function
        const newMedication = await medicationModel.createMedication({
            ...req.body, // JS Spread operator allows dynamic injection of userId
            userId
        });
        res.status(201).json(newMedication); // Return the created medication
    } 
    catch (error) {
        console.error("Error creating medication:", error);
        res.status(500).json({ error: "Failed to create medication" });
    }
}

// (POST) Create medication schedule
async function createSchedule(req, res) {
    try {
        const userId = req.user.userId; // Extract userId from JWT
        // Call the medicationModel.js file createSchedule function
        const newSchedule = await medicationModel.createSchedule({
            ...req.body, // JS Spread operator allows dynamic injection of userId
            userId
        });
        res.status(201).json(newSchedule); // Return the created schedule
    } 
    catch (error) {
        console.error("Error creating schedule:", error);
        res.status(500).json({ error: "Failed to create schedule" });
    }
}

// (PUT) mark or unmark dose as taken
async function updateMarkAsTaken(req, res) {
    const scheduleId = parseInt(req.params.scheduleId);
    const { markAsTaken } = req.body;
    const userId = req.user.userId;

    try {
        const result = await medicationModel.setMarkAsTaken(scheduleId, markAsTaken);

        if (!result) {
            return res.status(404).json({ error: "Schedule not found" });
        }

        // If medication is marked as taken, update inventory
        if (markAsTaken) {
            try {
                // Get the medication info from the schedule
                const scheduleInfo = await medicationModel.getScheduleById(scheduleId);
                if (scheduleInfo && scheduleInfo.medicationId) {
                    // Update inventory stock (decrease by 1 when taken)
                    await MedicationInventoryModel.updateStockAfterTaken(scheduleInfo.medicationId, userId, 1);
                }
            } catch (inventoryError) {
                console.error("Error updating inventory after medication taken:", inventoryError);
                // Don't fail the main operation if inventory update fails
            }
        }

        res.json({
            message: markAsTaken ? "Dose marked as taken" : "Dose unmarked"
        });
    } catch (error) {
        console.error("Error updating markAsTaken:", error);
        res.status(500).json({ error: "Failed to update markAsTaken" });
    }
}

// (DELETE) by scheduleId for each medication record doseTime
// A user can delete a specific doseTime without deleting the whole medication record
async function deleteScheduleById(req, res) {
    const scheduleId = parseInt(req.params.scheduleId);
    const userId = req.user.userId; // dynamic userId from requests 

    try {
        const success = await medicationModel.deleteSchedule(scheduleId, userId);
        if (!success) {
            return res.status(404).json({ error: "Schedule not found or access denied" });
        }
        res.json({ message: "Dose schedule deleted successfully" });
    } catch (error) {
        console.error("Error deleting schedule:", error);
        res.status(500).json({ error: "Failed to delete schedule" });
    }
}


// (PUT) Update an existing medication record
async function updateMedication(req, res) {
    // Extracts the medicationId from the URL route and changes to INT
    const medicationId = parseInt(req.params.id);
    const userId = req.user.userId; // dynamic userId from requests 
    
    try {
        // Call the medicationModel.js file updateMedication function
        const success = await medicationModel.updateMedication(medicationId, req.body, userId);

        // Check if medication exists or if user is authorised 
        if (!success) {
            return res.status(404).json({ error: "Medication not found or access denied" });
        }

        res.json({
            message: `Medication with ID ${medicationId} updated successfully.` 
        });
    }
    catch (error) {
        console.error("Error updating medication:", error);
        res.status(500).json({ error: "Failed to update medication" });
    }
}

// (GET) Retrieve all scheduled medications for a specific user (with timing info)
async function getAllScheduledMedications(req, res) {
    try {
        const userId = req.user.userId; // dynamic userId from requests 
        const medications = await medicationModel.getAllScheduledMedicationsByUserId(userId);
        res.json(medications);
    } 
    catch (error) {
        console.error("Error retrieving scheduled medications:", error);
        res.status(500).json({ error: "Failed to retrieve scheduled medications" });
    }
}

// (GET) Autocomplete medication name using RxNav
async function getMedicationSuggestions(req, res) {
    const name = req.query.name;
    if (!name || name.length < 3) {
        return res.status(400).json({ error: "Query too short" });
    }

    try {
        const apiUrl = `${process.env.RXNAV_API_URL}/drugs.json?name=${encodeURIComponent(name)}`;
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error("RxNav fetch error:", error.message);
        res.status(500).json({ error: "Unable to fetch medication suggestions" });
    }
}

// (GET) Get side effects from OpenFDA for a given drug name
async function getOpenFdaAdverseEvents(req, res) {
  const name = req.query.name;
  if (!name) {
    return res.status(400).json({ error: "Missing medication name" });
  }

  const apiKey = process.env.OPENFDA_API_KEY;
  const encodedName = encodeURIComponent(name);

  const url = `https://api.fda.gov/drug/event.json?api_key=${apiKey}&search=patient.drug.medicinalproduct:${encodedName}&limit=100`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("openFDA API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Unable to fetch adverse events" });
  }
}

// Export controller functions to make them available for routing
module.exports = {
    createMedication,
    createSchedule,
    updateMarkAsTaken,
    deleteScheduleById,
    updateMedication,
    getAllScheduledMedications,
    getMedicationSuggestions, // RXNAV External API
    getOpenFdaAdverseEvents, // OPENDFA External API
};