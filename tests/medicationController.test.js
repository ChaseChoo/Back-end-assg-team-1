// tests/medicationController.test.js

// Suppress console errors logs to keep test output clean
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

// Restore console.error after all tests
afterAll(() => {
  console.error.mockRestore();
});

// Import the model and dependencies
const medicationController = require("../controllers/medicationController");
const medicationModel = require("../models/medicationModel");
const axios = require("axios");  // Axios is used in the controller for external APIs

/// Mocking the external modules to avoid real DB/API calls
jest.mock("../models/medicationModel");
jest.mock("axios");

// Helper function to create a mock response object for Express.js
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis(); // Allow chaining: res.status(...).json(...)
  res.json = jest.fn().mockReturnThis();   // Capture res.json call
  return res;
};

// Group all tests for the medicationController
describe("medicationController", () => {
  let req, res, next;

  // Runs before each test to reset mocks and fresh req/res objects
  beforeEach(() => {
    res = mockRes();        // Fresh mock response
    next = jest.fn();       // Just in case a middleware needs it
    jest.clearAllMocks();   // Ensure test isolation
  });

  // Testing createMedication Function
  describe("createMedication", () => {
    it("should create medication and return 201", async () => {
      req = {
        user: { userId: 1 }, // Simulated authenticated user
        body: { medicationName: "Panadol" } // Sample medication input
      };

      // Mock DB result
      medicationModel.createMedication.mockResolvedValue({ medicationId: 10 });

      // Run controller function
      await medicationController.createMedication(req, res); 

      // Assertions
      expect(medicationModel.createMedication).toHaveBeenCalledWith({ medicationName: "Panadol", userId: 1 }); // Ensure model call
      expect(res.status).toHaveBeenCalledWith(201); // Status 201
      expect(res.json).toHaveBeenCalledWith({ medicationId: 10 }); // Returned JSON
    });

    it("should handle errors and return 500", async () => {
      req = { user: { userId: 1 }, body: {} }; // Input doesn't matter, we simulate a DB failure
      medicationModel.createMedication.mockRejectedValue(new Error("DB error")); // Simulate error

      await medicationController.createMedication(req, res); // Call controller

      expect(res.status).toHaveBeenCalledWith(500); // Should return internal server error
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to create medication" });
    });
  });

  // Testing createSchedule function
  describe("createSchedule", () => {
    it("should create schedule and return 201", async () => {
      req = {
        user: { userId: 2 }, // Simulate JWT-authenticated user
        body: { doseTime: "08:00" } // Input body from frontend
      };

      // Simulate DB returning a new scheduleId after insert
      medicationModel.createSchedule.mockResolvedValue({ scheduleId: 99 });

      await medicationController.createSchedule(req, res);

      // Expect model to be called with correct data
      expect(medicationModel.createSchedule).toHaveBeenCalledWith({ doseTime: "08:00", userId: 2 });

      // Expect 201 Created and response with scheduleId
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ scheduleId: 99 });
    });
  });

  // Testing updateMarkAsTaken function
  describe("updateMarkAsTaken", () => {
    it("should mark dose as taken", async () => {
      req = { 
        params: { scheduleId: "5" }, // Schedule ID from URL
        body: { markAsTaken: true }  // New mark status from client
    }; 
      medicationModel.setMarkAsTaken.mockResolvedValue(true); // Simulate success

      await medicationController.updateMarkAsTaken(req, res);

      // Should pass correct values to model
      expect(medicationModel.setMarkAsTaken).toHaveBeenCalledWith(5, true);
      // Expect success message
      expect(res.json).toHaveBeenCalledWith({ message: "Dose marked as taken" });
    });

    it("should return 404 if schedule doesn't exist", async () => {
      req = { params: { scheduleId: "999" }, body: { markAsTaken: false } };
      medicationModel.setMarkAsTaken.mockResolvedValue(false); // Simulate not found

      await medicationController.updateMarkAsTaken(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Schedule not found" });
    });
  });

  // Testing deleteScheduleById function
  describe("deleteScheduleById", () => {
    it("should delete schedule successfully", async () => {
      req = { 
        params: { scheduleId: "3" }, // Dose time ID to delete
        user: { userId: 1 }  // Authenticated user
    };
      medicationModel.deleteSchedule.mockResolvedValue(true); // Mock successful delete

      await medicationController.deleteScheduleById(req, res);

      // Controller should pass parsed ID and userId to model
      expect(medicationModel.deleteSchedule).toHaveBeenCalledWith(3, 1);

      // Should return success JSON response
      expect(res.json).toHaveBeenCalledWith({ message: "Dose schedule deleted successfully" });
    });

    it("should return 404 on failure", async () => {
        // Simulate case where scheduleId doesn't exist or not owned by user
        req = { 
            params: { scheduleId: "3" }, 
            user: { userId: 1 } 
        };
        medicationModel.deleteSchedule.mockResolvedValue(false); // Simulate not found or forbidden

        await medicationController.deleteScheduleById(req, res);

        // Should return 404 Not Found
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Schedule not found or access denied" });
    });
  });

  // Testing updateMedication function
  describe("updateMedication", () => {
    it("should update medication successfully", async () => {
      // Simulate update request on medicationId 7 with new dosage
      req = {
        params: { id: "7" }, // Medication ID from URL
        user: { userId: 5 }, // Authenticated userId
        body: { dosage: "250mg" } // Payload to update
      };

      // Mock successful DB update
      medicationModel.updateMedication.mockResolvedValue(true); 

      await medicationController.updateMedication(req, res);

      // Should call model with parsed ID, body, and userId
      expect(medicationModel.updateMedication).toHaveBeenCalledWith(7, { dosage: "250mg" }, 5);

      // Expect success response
      expect(res.json).toHaveBeenCalledWith({ message: "Medication with ID 7 updated successfully." });
    });

    it("should return 404 if medication not found", async () => {
      // Simulate case where update did not affect any row
      req = { 
        params: { id: "7" }, // Medication ID from URL
        user: { userId: 5 },  // Authenticated userId
        body: {} 
    };
      medicationModel.updateMedication.mockResolvedValue(null); // Simulate not found

      await medicationController.updateMedication(req, res);

      // Should return 404 Not Found
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Medication not found or access denied" });
    });
  });

  // Testing getAllScheduledMedications functions
  describe("getAllScheduledMedications", () => {
    it("should return array of medications", async () => {
      // Simulate user requesting all medications
      req = { 
        user: { userId: 1 }  // Authenticated user
    };
      const fakeMeds = [{ medicationName: "Paracetamol" }];

      // Mock DB returning list
      medicationModel.getAllScheduledMedicationsByUserId.mockResolvedValue(fakeMeds);

      await medicationController.getAllScheduledMedications(req, res);

      // Should return result from model directly
      expect(res.json).toHaveBeenCalledWith(fakeMeds);
    });
  });

  // Testing getMedicationSuggestions (RxNav)
  describe("getMedicationSuggestions", () => {
    it("should fetch suggestions from RxNav", async () => {
      // Simulate client search for "para"
      req = { query: { name: "para" } };

      // Mock RxNav API response
      axios.get.mockResolvedValue({ data: { suggestions: ["Panadol"] } });

      await medicationController.getMedicationSuggestions(req, res);

      // Should fetch from RxNav
      expect(axios.get).toHaveBeenCalled(); // RxNav API call

      // Return the suggestion JSON
      expect(res.json).toHaveBeenCalledWith({ suggestions: ["Panadol"] });
    });

    it("should reject short queries with 400", async () => {
      req = { query: { name: "pa" } }; // too short
      await medicationController.getMedicationSuggestions(req, res);

      // Should reject with 400 Bad Request
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Query too short" });
    });
  });

  // Testing getOpenFdaAdverseEvents
  describe("getOpenFdaAdverseEvents", () => {
    it("should fetch data from OpenFDA", async () => {
      // Simulate client requesting adverse events for ibuprofen
      req = { query: { name: "ibuprofen" } };

      const mockData = { results: ["nausea"] };

      // Mock OpenFDA API response
      axios.get.mockResolvedValue({ data: mockData });

      await medicationController.getOpenFdaAdverseEvents(req, res);

      // Should return OpenFDA data directly
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it("should reject empty name with 400", async () => {
      // Simulate missing query param
      req = { query: {} };
      await medicationController.getOpenFdaAdverseEvents(req, res);

      // Should return 400 Bad Request
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing medication name" });
    });
  });
});
