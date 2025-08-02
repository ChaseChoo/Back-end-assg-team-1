// tests/medicationValidation.test.js

// Import the validation functions from medicationValidation.js middleware
const {
  validateMedication,
  validateMedicationUpdate,
  validateMedicationId,
  validateSchedule,
  validateMarkAsTaken,
} = require("../middlewares/medicationValidation");

// Create a mock response object with jest.fn()
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis(); // allow chaining .status().json()
  res.json = jest.fn().mockReturnThis(); // Mocks the JSON response method
  return res;
};

// Begin test suite for all medication validation middlewares
describe("Medication Validation Middlewares", () => {
  let req, res, next; // These will be reset before each test

  beforeEach(() => {
    res = mockRes();  // Reset mocked response
    next = jest.fn(); // Create a fresh mock for next()
  });

  // Testing validateMedication function
  describe("validateMedication", () => {
    it("should pass valid medication data", () => {
      req = {
        body: {
          userId: 1,
          medicationName: "Paracetamol",
          dosage: "500mg",
          frequency: "Daily",
          startDate: "2025-07-30",
          endDate: "2025-08-01",
          iconType: "tablet"
        },
      };

      // Call middleware with valid data
      validateMedication(req, res, next);
      // next() should be called, meaning validation passed
      expect(next).toHaveBeenCalled();
    });

    it("should return 400 on missing fields", () => {
      req = { body: {} }; // No body fields provided
      // Call middleware with invalid data
      validateMedication(req, res, next);

      // Should return a 400 status
      expect(res.status).toHaveBeenCalledWith(400);

      // Should return a JSON error message
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });
  });

  // Testing validateMedicationUpdate function
  describe("validateMedicationUpdate", () => {
    it("should pass valid update payload", () => {
      req = {
        body: {
          scheduleId: 1,
          medicationName: "Ibuprofen",
          dosage: "200mg",
          frequency: "Twice daily",
          startDate: "2025-07-30",
          endDate: "2025-08-02",
          iconType: "capsule",
          doseTime: "08:00" // Required only for PUT
        },
      };

      validateMedicationUpdate(req, res, next);

      // next() should be called if everything is valid
      expect(next).toHaveBeenCalled();
    });

    it("should return 400 on invalid doseTime format", () => {
      req = {
        body: {
          scheduleId: 1,
          medicationName: "Ibuprofen",
          dosage: "200mg",
          frequency: "Twice daily",
          startDate: "2025-07-30",
          endDate: "2025-08-02",
          iconType: "capsule",
          doseTime: "invalid" // Incorrect format
        },
      };

      validateMedicationUpdate(req, res, next);

      // Should return 400 due to invalid doseTime
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // Testing validateMedicationId function
  describe("validateMedicationId", () => {
    it("should pass with valid medication ID", () => {
      req = { params: { id: "2" } }; // ID passed as string from URL params
      validateMedicationId(req, res, next);

      // Should proceed if ID is a valid positive number
      expect(next).toHaveBeenCalled();
    });

    it("should return 400 on invalid ID", () => {
      req = { params: { id: "-1" } };
      validateMedicationId(req, res, next); // Negative ID not allowed

      // Should return a 400 status code
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // Testing validateSchedule function
  describe("validateSchedule", () => {
    it("should pass valid schedule data", () => {
      req = {
        body: {
          userId: 1,
          medicationId: 2,
          doseTime: "09:30", // Must match HH:mm or HH:mm:ss format
          reminderEnabled: true
        },
      };

      validateSchedule(req, res, next);

      // Should call next() because data is valid
      expect(next).toHaveBeenCalled();
    });

    it("should return 400 on missing fields", () => {
      req = { body: {} }; // Missing required schedule fields

      validateSchedule(req, res, next);

      // Should fail with status 400
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // Testing validateMarkAsTaken function
  describe("validateMarkAsTaken", () => {
    it("should pass valid scheduleId and boolean", () => {
      req = {
        params: { scheduleId: "5" }, // Valid numeric param
        body: { markAsTaken: true }, // Valid boolean in body
      };

      validateMarkAsTaken(req, res, next);

      // Should pass validation
      expect(next).toHaveBeenCalled();
    });

    it("should return 400 if scheduleId is invalid", () => {
      req = {
        params: { scheduleId: "abc" }, // Invalid as it is not a number
        body: { markAsTaken: true },
      };

      validateMarkAsTaken(req, res, next);

      // Expect 400 for invalid param
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if markAsTaken is missing", () => {
      req = {
        params: { scheduleId: "1" }, // Valid param
        body: {}, // markAsTaken missing
      };

      validateMarkAsTaken(req, res, next);

      // Should return 400 because of missing body field
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
