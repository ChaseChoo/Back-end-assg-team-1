const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// (POST) Register a new user
async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        // Check if email already exists
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "Email is already registered" });
        }

        // Hash password using bcrypt
        const salt = await bcrypt.genSalt(10); // Salt generates a unique string used to make the hash more secure.
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user in database
        const newUser = await userModel.createUser({ username, email, passwordHash });

        // Generate JWT with userId (not exposed to user)
        const token = jwt.sign(
            { userId: newUser.userId, username: newUser.username },
            process.env.JWT_ACCESS_SECRET, // .env file JWT access secret key
            { expiresIn: "2h" } // JWT will generate new token that auto expire in 2 hours
        );

        // Return safe user info and token
        res.status(201).json({
            message: "User registered successfully",
            username: newUser.username,
            email: newUser.email,
            token
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// (POST) Login user
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare hashed password using bcrypt
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user.userId, username: user.username },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "2h" }
        );

        // Send back bearer token and user info
        res.json({
            message: "Login successful",
            userId : user.userId,
            username: user.username,
            email: user.email,
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// (PUT) Update user info
async function updateUserInfo(req, res) {
    try {
        const userId = req.user.userId; // extracted from JWT by authenticateToken
        const { username, email, password } = req.body;

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Update user in DB
        await userModel.updateUser({ userId, username, email, passwordHash });

        res.json({
            message: "User updated successfully",
            username,
            email
        });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// (DELETE) Delete user
async function deleteUserAccount(req, res) {
    try {
        const userId = req.user.userId; // extracted from JWT

        await userModel.deleteUser(userId);

        res.json({ message: "User account deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { 
    registerUser,
    loginUser,
    updateUserInfo,
    deleteUserAccount,
};
