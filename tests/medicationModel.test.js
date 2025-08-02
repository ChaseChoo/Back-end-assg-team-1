// tests/medicationModel.test.js

// Suppress console errors logs to keep test output clean
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

// Restore console.error after all tests
afterAll(() => {
  console.error.mockRestore();
});

// Import the model and dependencies
const sql = require("mssql");
const medicationModel = require("../models/medicationModel");

// Mock the mssql library
jest.mock("mssql");

describe("medicationModel", () => {
  let mockConnection, mockRequest;

  // Reset mock DB connection & request before each test
  beforeEach(() => {
    mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn(),
    };

    mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection);
    jest.clearAllMocks();
  });

   // Testing createMedication()  function
  describe("createMedication", () => {
    it("should insert new medication and return medicationId", async () => {
        // Mock DB insert result
        const mockResult = { recordset: [{ medicationId: 123 }] };
        mockRequest.query.mockResolvedValue(mockResult);

        const data = {
            userId: 1,
            medicationName: "Paracetamol",
            dosage: "500mg",
            frequency: "Daily",
            startDate: "2023-08-01",
            endDate: "2023-08-10",
            iconType: "pill",
        };

        const result = await medicationModel.createMedication(data);

        expect(result).toEqual({ medicationId: 123 }); // should return inserted ID
        expect(mockRequest.query).toHaveBeenCalled();
        expect(mockConnection.close).toHaveBeenCalled();
    });

    it("should throw error if DB fails", async () => {
      sql.connect.mockRejectedValue(new Error("Connection fail"));

      await expect(medicationModel.createMedication({})).rejects.toThrow("Connection fail");
    });
  });

    // Testing createSchedule() function
    describe("createSchedule", () => {
        it("should insert new schedule and return inserted row", async () => {
        const mockRow = { scheduleId: 1, doseTime: "14:00:00" };
        mockRequest.query.mockResolvedValue({ recordset: [mockRow] });

        const result = await medicationModel.createSchedule({
            userId: 1,
            medicationId: 1,
            doseTime: "14:00",
            reminderEnabled: true,
        });

        expect(result).toEqual(mockRow);
    });

    it("should throw error on failure", async () => {
        sql.connect.mockRejectedValue(new Error("Fail"));

        await expect(
            medicationModel.createSchedule({ userId: 1, medicationId: 1, doseTime: "10:00", reminderEnabled: true })
        ).rejects.toThrow("Fail");
        });
    });

    // Testing setMarkAsTaken() function
    describe("setMarkAsTaken", () => {
        it("should update markAsTaken and return true", async () => {
        mockRequest.query.mockResolvedValue({ rowsAffected: [1] });

        const result = await medicationModel.setMarkAsTaken(5, true);
        expect(result).toBe(true);
        });

        it("should return false if no row affected", async () => {
        mockRequest.query.mockResolvedValue({ rowsAffected: [0] });

        const result = await medicationModel.setMarkAsTaken(5, false);
        expect(result).toBe(false);
        });
    });

    // Testing deleteSchedule() function
    describe("deleteSchedule", () => {
        it("should delete schedule and medication if needed", async () => {
        // Return medicationId    
        mockConnection.request
            .mockReturnValueOnce({
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue({ recordset: [{ medicationId: 7 }] }),
            })
            // Delete schedule
            .mockReturnValueOnce({
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue({ rowsAffected: [1] }),
            })
            // if count = 0, trigger medication deletion
            .mockReturnValueOnce({
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue({ recordset: [{ count: 0 }] }),
            })
            // Delete medication
            .mockReturnValueOnce({
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue({}),
            });

        const result = await medicationModel.deleteSchedule(10, 1);
        expect(result).toBe(true);
    });

    it("should return false if no medication found", async () => {
      mockRequest.query.mockResolvedValue({ recordset: [] });
      mockConnection.request.mockReturnValue(mockRequest);

      const result = await medicationModel.deleteSchedule(999, 1);
      expect(result).toBe(false);
    });
  });

  // Testing updateMedication() function
  describe("updateMedication", () => {
    it("should update medication and schedule and return true", async () => {
      mockRequest.query.mockResolvedValueOnce({ rowsAffected: [1] });
      mockConnection.request
        .mockReturnValueOnce(mockRequest)  // update medication
        .mockReturnValueOnce(mockRequest); // for schedule update

      const result = await medicationModel.updateMedication(1, {
        medicationName: "Panadol",
        dosage: "500mg",
        frequency: "Daily",
        startDate: "2023-08-01",
        endDate: "2023-08-10",
        iconType: "pill",
        doseTime: "08:30",
        scheduleId: 5,
      }, 1);

      expect(result).toBe(true);
    });

    it("should return null if no rows updated", async () => {
      mockRequest.query.mockResolvedValueOnce({ rowsAffected: [0] });
      mockConnection.request.mockReturnValue(mockRequest);

      const result = await medicationModel.updateMedication(1, {
        doseTime: "08:00",
        scheduleId: 5,
      }, 1);

      expect(result).toBeNull();
    });
  });

  // getAllScheduledMedicationsByUserId()
  describe("getAllScheduledMedicationsByUserId", () => {
    it("should return grouped medication records", async () => {
      // Mock recordset with one medication + one schedule  
      const recordset = [
        {
          medicationId: 1,
          userId: 1,
          medicationName: "Panadol",
          dosage: "500mg",
          frequency: "Daily",
          startDate: "2023-08-01",
          endDate: "2023-08-10",
          iconType: "pill",
          createdAt: new Date("2023-07-30T00:00:00Z"),
          doseTime: new Date("1970-01-01T14:00:00Z"),
          scheduleId: 10,
          markAsTaken: false,
          reminderEnabled: true
        }
      ];

      mockRequest.query.mockResolvedValue({ recordset });

      const result = await medicationModel.getAllScheduledMedicationsByUserId(1);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].doseTimes[0]).toContain("T14:00:00");
    });
  });
});
