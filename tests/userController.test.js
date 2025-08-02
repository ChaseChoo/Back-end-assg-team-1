// userController.test.js

// Suppress console errors logs to keep test output clean
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// Restore console.error after all tests
afterAll(() => {
  console.error.mockRestore();
});

// Import the controller and dependencies
const userController = require("../controllers/userController");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sql = require("mssql");

// Mocking the external modules so that I can control their behavior in tests
jest.mock("../models/userModel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("mssql"); // Fully mock the mssql package so it doesn't run real db queries
sql.Int = jest.fn(); // MOCK sql.Int to prevent test failures in updateUser() function

// Testing registerUser() function
describe("userController.registerUser", () => {
    // Clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // Test successful user registration
    it("should register a new user and return 201 with token", async () => {
        const req = {
        body: {
            username: "Zixian",
            email: "zixian@example.com",
            password: "password123"
        }
    };

    const res = {
      status: jest.fn().mockReturnThis(), // allow chaining .status().json()
      json: jest.fn()
    };

    // Simulate no existing user with the same email
    userModel.getUserByEmail.mockResolvedValue(null);
    // Simulate bcrypt salt and hash generation
    bcrypt.genSalt.mockResolvedValue("salt123");
    bcrypt.hash.mockResolvedValue("hashed123");
    // Simulate new user creation in DB
    userModel.createUser.mockResolvedValue({
      userId: 1,
      username: "Zixian",
      email: "zixian@example.com"
    });

    // Simulate JWT signing token
    jwt.sign.mockReturnValue("mocked.jwt.token");

    // Run controller function
    await userController.registerUser(req, res);

    // Check email check and user creation were called correctly
    expect(userModel.getUserByEmail).toHaveBeenCalledWith("zixian@example.com");
    expect(userModel.createUser).toHaveBeenCalledWith({
      username: "Zixian",
      email: "zixian@example.com",
      passwordHash: "hashed123"
    });

    // Check successful response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully",
      username: "Zixian",
      email: "zixian@example.com",
      token: "mocked.jwt.token"
    });
  });

  // Test for duplicate email scenario
  it("should return 409 if email is already registered", async () => {
    const req = { body: { email: "duplicate@example.com" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Simulate existing user found by email
    userModel.getUserByEmail.mockResolvedValue({});

    await userController.registerUser(req, res);

    // Expect HTTP 409 and message
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: "Email is already registered" });
  });

  // Test for any unhandled exception during registration
  it("should return 500 on registration failure", async () => {
    const req = { body: { email: "fail@example.com" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Simulate DB failure
    userModel.getUserByEmail.mockRejectedValue(new Error("DB error"));

    await userController.registerUser(req, res);

    // Expect server error
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});

// Testing for loginUser() function
describe("userController.loginUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test successful login
  it("should return login success with token", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "password123"
      }
    };

    const res = {
      json: jest.fn()
    };

    // Simulate user found  
    userModel.getUserByEmail.mockResolvedValue({
      userId: 1,
      username: "Zixian",
      email: "test@example.com",
      passwordHash: "hashed123"
    });

    // Simulate successful password match
    bcrypt.compare.mockResolvedValue(true);
    // Simulate JWT token generation
    jwt.sign.mockReturnValue("mocked.jwt.token");

    await userController.loginUser(req, res);

    // Expect correct user info and token returned
    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      userId: 1,
      username: "Zixian",
      email: "test@example.com",
      token: "mocked.jwt.token"
    });
  });

  // Test for login with unregistered email
  it("should return 401 if user not found", async () => {
    const req = { body: { email: "notfound@example.com" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Simulate no user found
    userModel.getUserByEmail.mockResolvedValue(null);

    await userController.loginUser(req, res);

    // Expect 401 Unauthorised
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid email or password" });
  });

  // Test for wrong password
  it("should return 401 if password does not match", async () => {
    const req = { body: { email: "test@example.com", password: "wrongpass" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Simulate user exists
    userModel.getUserByEmail.mockResolvedValue({
      passwordHash: "hashed"
    });

    // Simulate password mismatch
    bcrypt.compare.mockResolvedValue(false);

    await userController.loginUser(req, res);

    // Expect login failure
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid email or password" });
  });

  // Test for any unexpected login error
  it("should return 500 on error", async () => {
    const req = { body: { email: "fail@example.com" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Simulate DB failure
    userModel.getUserByEmail.mockRejectedValue(new Error("Login error"));

    await userController.loginUser(req, res);

    // Expect server error
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});

// Testing updateUserInfo() function
describe("userController.updateUserInfo", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset all mocks before each test
  });

  // It should update user and return a success message
  it("should update user info and return success", async () => {
    const req = {
      user: { userId: 1 }, // token-decoded userId
      body: {
        username: "UpdatedZixian",
        email: "updated@example.com",
        password: "newpass123"
      }
    };
    const res = { json: jest.fn() };

    // Mocking bcrypt and updateUser behavior
    bcrypt.genSalt.mockResolvedValue("salt");
    bcrypt.hash.mockResolvedValue("hashedpass");
    userModel.updateUser.mockResolvedValue(); // no return expected

    await userController.updateUserInfo(req, res); // call function

    // Expectations: Hashing + model update called correctly
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith("newpass123", "salt");
    expect(userModel.updateUser).toHaveBeenCalledWith({
      userId: 1,
      username: "UpdatedZixian",
      email: "updated@example.com",
      passwordHash: "hashedpass"
    });

    // Final response should confirm update
    expect(res.json).toHaveBeenCalledWith({
      message: "User updated successfully",
      username: "UpdatedZixian",
      email: "updated@example.com"
    });
  });

  // It should return 500 if update fails
  it("should return 500 if update fails", async () => {
    const req = {
      user: { userId: 2 },
      body: {
        username: "FailUser",
        email: "fail@example.com",
        password: "failpass"
      }
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    bcrypt.genSalt.mockResolvedValue("salt");
    bcrypt.hash.mockResolvedValue("hashed");
    userModel.updateUser.mockRejectedValue(new Error("DB failure")); // simulate DB crash

    await userController.updateUserInfo(req, res);

    // Should return a 500 server error
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});

// Testing deleteUserAccount() function
describe("userController.deleteUserAccount", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset all mocks before each test
  });

  // It should delete user account and confirm success
  it("should delete the user and return success", async () => {
    const req = { user: { userId: 1 } }; // simulated JWT-decoded userId
    const res = { json: jest.fn() };

    userModel.deleteUser.mockResolvedValue(); // simulate success

    await userController.deleteUserAccount(req, res); // call function

    // Expect delete to be called correctly
    expect(userModel.deleteUser).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({ message: "User account deleted successfully" });
  });

  // It should return 500 on internal failure
  it("should return 500 if deletion fails", async () => {
    const req = { user: { userId: 999 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    userModel.deleteUser.mockRejectedValue(new Error("DB crash")); // simulate DB error

    await userController.deleteUserAccount(req, res);

    // Should return server error
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});
