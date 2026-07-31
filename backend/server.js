const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Database
const pool = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const donorRoutes = require("./routes/donorRoutes");
const requestRoutes = require("./routes/requestRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();


// ==========================================
// Middleware
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// Routes
// ==========================================

// Authentication
app.use("/api/auth", authRoutes);

// Donors
app.use("/api/donors", donorRoutes);

// Blood Requests
app.use("/api/requests", requestRoutes);

// Notifications
app.use("/api/notifications", notificationRoutes);


// ==========================================
// Health Check
// ==========================================

app.get("/", (req, res) => {
    res.status(200).json({
        message: "BloodLink AI Backend is running successfully"
    });
});


// ==========================================
// 404 Handler
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        message: "API endpoint not found",
        path: req.originalUrl
    });
});


// ==========================================
// Global Error Handler
// ==========================================

app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(500).json({
        message: "Internal server error"
    });
});


// ==========================================
// Start Server
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// ==========================================
// PostgreSQL Connection Test
// ==========================================

pool.query("SELECT NOW()")
    .then(() => {
        console.log("✅ PostgreSQL Connected Successfully");
    })
    .catch((error) => {
        console.error("❌ PostgreSQL Connection Error:", error);
    });