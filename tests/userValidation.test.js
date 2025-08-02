// userValidation.test.js

// Import the validation functions from userValidation.js middleware
const {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  authenticateToken
} = require("../middlewares/userValidation");

const jwt = require("jsonwebtoken"); // used to mock test for JWT tokens

// Create a mock response object with jest.fn()
const createMockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res); // allow chaining .status().json()
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("User Validation Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    res = createMockRes(); // fresh mock for each test
    next = jest.fn(); // mock next() to track calls
  });

  // validateUserRegistration function
  describe("validateUserRegistration", () => {
    it("should call next() for valid input", () => {
      req = {
        body: {
          username: "Zixian",
          email: "zixian@example.com",
          password: "password123"
        }
      };

      // run middleware
      validateUserRegistration(req, res, next);

      // this should pass the validation
      expect(next).toHaveBeenCalled();
    });

    it("should return 400 for missing fields", () => {
      req = { body: {} }; // empty input = fail

      validateUserRegistration(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400); // Bad Request status
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) }) // some error returned
      );
    });
  });

  // validateUserLogin function
  describe("validateUserLogin", () => {
    it("should call next() for valid login input", () => {
      req = {
        body: {
          email: "test@example.com",
          password: "mypassword"
        }
      };

      // run middleware
      validateUserLogin(req, res, next);

      // valid input should pass
      expect(next).toHaveBeenCalled();
    });

    it("should return 400 for invalid email format", () => {
      req = {
        body: {
          email: "invalid",
          password: "password123"
        }
      };

      validateUserLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // validateUserUpdate function
  describe("validateUserUpdate", () => {
    it("should call next() for valid update input", () => {
      req = {
        body: {
          username: "UpdatedUser",
          email: "updated@example.com",
          password: "updatedPassword"
        }
      };

      // run middleware
      validateUserUpdate(req, res, next);

      // valid input should pass
      expect(next).toHaveBeenCalled();
    });

    it("should return 400 for missing fields", () => {
      req = { body: {} }; // empty input

      validateUserUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400); // this should fail
    });
  });

  // authenticateToken JWT function
  describe("authenticateToken", () => {
    it("should return 401 if no token is provided", () => {
      req = { headers: {} }; // no auth header

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401); // // unauthorised
      expect(res.json).toHaveBeenCalledWith({ message: "Access denied. No token provided." });
    });

    // 403 forbidden status
    it("should return 403 if token is invalid", () => {
      req = {
        headers: { authorization: "Bearer faketoken" }
      };

      // Simulate jwt.verify calling the callback with an error
      jest.spyOn(jwt, "verify").mockImplementation((_, __, cb) =>
        cb(new Error("Invalid token"))
      );

      authenticateToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403); // forbidden status code
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid or expired token." });
    });

    // checks if a valid token is provided
    it("should attach decoded user and call next() if token is valid", () => {
      const mockDecoded = { userId: 1, username: "Zixian" };
      req = {
        headers: { authorization: "Bearer validtoken" }
      };

      // Simulate jwt.verify calling the callback with decoded token
      jest.spyOn(jwt, "verify").mockImplementation((_, __, cb) =>
        cb(null, mockDecoded)
      );

      authenticateToken(req, res, next);

      expect(req.user).toEqual(mockDecoded); // token decoded correctly
      expect(next).toHaveBeenCalled(); // passed to next middleware
    });
  });
});
