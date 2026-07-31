const express = require("express");

const router = express.Router();

const {
    getDonorNotifications,
    createNotification,
    markNotificationRead
} = require("../controllers/notificationController");


// ==========================================
// Create Emergency Notification
// ==========================================
router.post("/", createNotification);


// ==========================================
// Get Notifications for a Donor
// ==========================================
router.get("/donor/:donor_id", getDonorNotifications);


// ==========================================
// Mark Notification as Read
// ==========================================
router.put("/:id/read", markNotificationRead);


module.exports = router;