// userModel.test.js
// Unit test for userModel.js using Jest

// Suppress console errors logs to keep test output clean
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// Restore console.error after tests are done
afterAll(() => {
  console.error.mockRestore();
});

// Restore console.error after running the tests
const sql = require("mssql"); // SQL Server library (mocked)
const User = require("../models/userModel"); // userModel.js file

jest.mock("mssql"); // Fully mock the mssql package so it doesn't run real db queries

// Testing createUser() function
describe("User.createUser", () => {
    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks(); 
    });

    it("should create a new user and return user data", async () => {
        // This is the fake user that the mock DB will return
        const mockResult = {
        userId: 1,
        username: "Zixian",
        email: "zixian@example.com"
    };

    // Mock the request object returned by connection.request()
    const mockRequest = {
      input: jest.fn().mockReturnThis(), // .input() is chainable
      query: jest.fn().mockResolvedValue({ recordset: [mockResult] }), // simulate DB returning inserted row
    };

    // Mock the connection object from sql.connect()
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest), // returns our mockRequest
      close: jest.fn().mockResolvedValue(undefined),   // simulates DB connection closing
    };

    // Simulate successful DB connection
    sql.connect.mockResolvedValue(mockConnection);

    // Call the createUser function being tested
    const user = await User.createUser({
      username: "Zixian",
      email: "zixian@example.com",
      passwordHash: "hashed123"
    });

    // Assert sql.connect was called
    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));

    // These check if .input() was called with the correct parameters 
    // The "undefined" = mocked sql.NVarChar type
    expect(mockRequest.input).toHaveBeenCalledWith("username", undefined, "Zixian");
    expect(mockRequest.input).toHaveBeenCalledWith("email", undefined, "zixian@example.com");
    expect(mockRequest.input).toHaveBeenCalledWith("passwordHash", undefined, "hashed123");

    // The function should return the mockResult as user
    expect(user).toEqual(mockResult);

    // Ensure DB connection was closed
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if DB connection fails", async () => {
    // Simulate a DB connection error
    const errorMessage = "DB error";
    sql.connect.mockRejectedValue(new Error(errorMessage));

    // Function should throw the same error
    await expect(User.createUser({
      username: "fail",
      email: "fail@example.com",
      passwordHash: "failhash"
    })).rejects.toThrow(errorMessage);
  });
});


// Testing getUserByEmail() function
describe("User.getUserByEmail", () => {
    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //  When the email exists, the function should return the correct user object
    it("should return user object if email exists", async () => {
        // Mocked user data returned from the database
        const mockUser = {
            userId: 2,
            username: "Tester",
            email: "test@example.com",
            passwordHash: "testhash"
        };

         // Mock the request object returned by sql.request()
        const mockRequest = {
            input: jest.fn().mockReturnThis(), // Allow method chaining
            query: jest.fn().mockResolvedValue({ recordset: [mockUser] }), // Simulate successful DB query
        };

        
        // Mock the connection returned by sql.connect()
        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined), // Simulate closing the DB connection
        };

        // sql.connect to return the mocked connection
        sql.connect.mockResolvedValue(mockConnection);

        // Call the actual function under test
        const user = await User.getUserByEmail("test@example.com");

        // check that .input() was called with the correct parameters
        // "undefined" is expected because sql.NVarChar(100) is not passed in a mock
        expect(mockRequest.input).toHaveBeenCalledWith("email", undefined, "test@example.com");

        // Assert that returned user matches our mockUser
        expect(user).toEqual(mockUser);

        // Confirm that DB connection was closed properly
        expect(mockConnection.close).toHaveBeenCalled();
    });

    // When no user is found with the given email, function should return null
    it("should return null if no user found", async () => {
        const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: [] }),
    };

    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn(), // Close doesn't need to resolve here since it's not being awaited
    };

    sql.connect.mockResolvedValue(mockConnection);

    const user = await User.getUserByEmail("noone@example.com");

    // Should return null when recordset is empty
    expect(user).toBeNull();
  });

  // If DB connection fails, the function should throw an error
  it("should throw error on DB fail", async () => {
    // Simulate a DB connection failure
    sql.connect.mockRejectedValue(new Error("DB down"));

    // Should throw the same error message
    await expect(User.getUserByEmail("err@example.com")).rejects.toThrow("DB down");
  });
});

// Testing deleteUser() function
describe("User.deleteUser", () => {
    // Clear all mocks before every test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // It should send a DELETE query to the database and close the connection
    it("should delete user by ID", async () => {
        const mockRequest = {
        input: jest.fn().mockReturnThis(), // Makes .input() chainable
        query: jest.fn().mockResolvedValue({}), // No specific return expected for DELETE
    };

    // Mock connection object
    const mockConnection = {
      request: jest.fn(() => mockRequest), // Simulates request() returning mockRequest
      close: jest.fn().mockResolvedValue(undefined), // Simulates async DB close
    };

    // Mock sql.connect to return the mock connection
    sql.connect.mockResolvedValue(mockConnection);

    // Call the function under test
    await User.deleteUser(3);

    // check .input() was called with correct userId
    expect(mockRequest.input).toHaveBeenCalledWith("userId", expect.anything(), 3);

    // check DELETE query was executed
    expect(mockRequest.query).toHaveBeenCalled();

    // check connection was closed
    expect(mockConnection.close).toHaveBeenCalled();
  });

  // Should throw an error if DB fails to connect
  it("should throw error on DB fail", async () => {
    // Simulate connection error
    sql.connect.mockRejectedValue(new Error("delete failed"));

    // Function should throw the same error
    await expect(User.deleteUser(4)).rejects.toThrow("delete failed");
  });
});

// Testing updateUser() function
describe("User.updateUser", () => {
    // Clear mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // It should update the user in the database with new credentials
    it("should update user details successfully", async () => {
        // Mock request and connection setup
        const mockRequest = {
            input: jest.fn().mockReturnThis(), // allows chaining
            query: jest.fn().mockResolvedValue({}) // no output expected for UPDATE
        };

        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined)
        };

        // simulate a working DB connection
        sql.connect.mockResolvedValue(mockConnection);

        // call the actual function being tested
        await User.updateUser({
            userId: 5,
            username: "UpdatedUser",
            email: "updated@example.com",
            passwordHash: "updatedhash"
        });

        // Assert that input() is called correctly
        expect(mockRequest.input).toHaveBeenCalledWith("userId", sql.Int, 5);
        expect(mockRequest.input).toHaveBeenCalledWith("username", undefined, "UpdatedUser");
        expect(mockRequest.input).toHaveBeenCalledWith("email", undefined, "updated@example.com");
        expect(mockRequest.input).toHaveBeenCalledWith("passwordHash", undefined, "updatedhash");


        // Assert that query() and close() are both triggered
        expect(mockRequest.query).toHaveBeenCalled();
        expect(mockConnection.close).toHaveBeenCalled();
    });

    // It should throw an error if SQL connection fails
    it("should throw an error if update fails", async () => {
        sql.connect.mockRejectedValue(new Error("update error"));

        // Expect function to throw that same error
        await expect(User.updateUser({
            userId: 2,
            username: "Fail",
            email: "fail@example.com",
            passwordHash: "failhash"
        })).rejects.toThrow("update error");
    });
});
