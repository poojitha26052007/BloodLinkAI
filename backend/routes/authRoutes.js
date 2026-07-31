const express = require("express");

const router = express.Router();

const {
    register,
    login,
    getMe
} = require("../controllers/authController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");


// ==========================================
// Register
// POST /api/auth/register
// ==========================================
router.post("/register", register);


// ==========================================
// Login
// POST /api/auth/login
// ==========================================
router.post("/login", login);


// ==========================================
// Current User
// GET /api/auth/me
// Protected by JWT
// ==========================================
router.get("/me", authenticateToken, getMe);


module.exports = router;