const pool = require("../config/db");


// ==========================================
// Get Notifications for a Donor
// ==========================================
const getDonorNotifications = async (req, res) => {
    try {
        const { donor_id } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM notifications
             WHERE donor_id = $1
             ORDER BY created_at DESC`,
            [donor_id]
        );

        res.status(200).json({
            count: result.rows.length,
            notifications: result.rows
        });

    } catch (error) {
        console.error("Get Notifications Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// Create Emergency Notification
// ==========================================
const createNotification = async (req, res) => {
    try {
        const {
            request_id,
            donor_id,
            title,
            message,
            notification_type
        } = req.body;

        // Validate required fields
        if (!request_id || !donor_id || !message) {
            return res.status(400).json({
                message: "request_id, donor_id and message are required"
            });
        }

        // Use default title if not provided
        const notificationTitle =
            title || "Emergency Blood Request";

        const result = await pool.query(
            `INSERT INTO notifications
            (
                request_id,
                donor_id,
                title,
                message,
                notification_type,
                is_read
            )
            VALUES ($1, $2, $3, $4, $5, false)
            RETURNING *`,
            [
                request_id,
                donor_id,
                notificationTitle,
                message,
                notification_type || "emergency"
            ]
        );

        res.status(201).json({
            message: "Notification created successfully",
            notification: result.rows[0]
        });

    } catch (error) {
        console.error("Create Notification Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// Mark Notification as Read
// ==========================================
const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE notifications
             SET is_read = true
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.status(200).json({
            message: "Notification marked as read",
            notification: result.rows[0]
        });

    } catch (error) {
        console.error("Mark Notification Read Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// Export
// ==========================================
module.exports = {
    getDonorNotifications,
    createNotification,
    markNotificationRead
};