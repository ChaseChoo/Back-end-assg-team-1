const Joi = require("joi"); // Import Joi for validation
const jwt = require("jsonwebtoken"); // Import JWT for token verification

// Validation schema for user registration (used for POST/PUT /register & /update)
const userSchema = Joi.object({
    username: Joi.string().max(50).required().messages({
        "string.empty": "Username is required",
        "string.max": "Username must be 50 characters or less",
    }),
    email: Joi.string().email().max(100).required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
        "string.max": "Email must be 100 characters or less",
    }),
    password: Joi.string().min(8).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters",
  }),
});

function validateUserRegistration (req, res, next) {
    console.log("=== VALIDATION MIDDLEWARE REACHED ===");
    console.log("Request body:", req.body);
    const { error } = userSchema.validate(req.body, { abortEarly: false });

    if (error) {
        console.log("Validation error:", error.details);
        const messages = error.details.map((detail) => detail.message);
        return res.status(400).json({ error: messages.join(", ") });
    }
    
    console.log("Validation passed, proceeding to controller");
    next();
}

function validateUserUpdate(req, res, next) {
    const { error } = userSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const messages = error.details.map((detail) => detail.message);
        return res.status(400).json({ error: messages.join(", ") });
    }

    next();
}

// Validation schema for login (used for POST /login)
const userLoginSchema = Joi.object({
    email: Joi.string().email().max(100).required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
        "string.max": "Email must be 100 characters or less",
    }),
    password: Joi.string().min(8).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters",
    }),
});

// User logs in via the frontend form using Email and Password
function validateUserLogin(req, res, next) {
    const { error } = userLoginSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const messages = error.details.map((detail) => detail.message);
        return res.status(400).json({ error: messages.join(", ") });
    }

    next();
}

// Used to authenticate the bearer token created during registration or login
// If a user has no bearer token they cannot access any REST features using the frontend
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token." });
        }

        req.user = decoded; // attaches userId and username to req.user
        next();
    });
}

// module.exports is used to make database interaction fucntions available
module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateUserUpdate,
    authenticateToken,
};