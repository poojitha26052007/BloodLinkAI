const pool = require("../config/db");

// ==========================================
// Create Blood Request
// ==========================================
const createRequest = async (req, res) => {
    try {
        const {
            patient_name,
            blood_group,
            phone,
            city,
            hospital,
            urgency,
            latitude,
            longitude
        } = req.body;

        // Validate required fields
        if (
            !patient_name ||
            !blood_group ||
            !phone ||
            !city ||
            !hospital ||
            !urgency
        ) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        // Create blood request
        const requestResult = await pool.query(
            `INSERT INTO blood_requests
            (
                patient_name,
                blood_group,
                phone,
                city,
                hospital,
                urgency,
                latitude,
                longitude
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *`,
            [
                patient_name,
                blood_group,
                phone,
                city,
                hospital,
                urgency,
                latitude || null,
                longitude || null
            ]
        );

        const bloodRequest = requestResult.rows[0];

        // ==========================================
        // Find Matching Available Donors
        // ==========================================
        let donorResult;

        if (latitude != null && longitude != null) {
            donorResult = await pool.query(
                `SELECT *,
                        CASE
                            WHEN LOWER(city) = LOWER($2) THEN 1
                            ELSE 2
                        END AS priority,

                        ROUND(
                            (
                                6371 * acos(
                                    LEAST(
                                        1,
                                        GREATEST(
                                            -1,
                                            cos(radians($3))
                                            * cos(radians(latitude))
                                            * cos(radians(longitude) - radians($4))
                                            + sin(radians($3))
                                            * sin(radians(latitude))
                                        )
                                    )
                                )
                            )::numeric,
                            2
                        ) AS distance_km

                 FROM donors

                 WHERE blood_group = $1
                 AND available = true
                 AND latitude IS NOT NULL
                 AND longitude IS NOT NULL

                 ORDER BY
                    priority ASC,
                    distance_km ASC,
                    last_donation_date ASC NULLS FIRST`,
                [
                    blood_group,
                    city,
                    latitude,
                    longitude
                ]
            );
        } else {
            // If request has no coordinates,
            // match donors by blood group and city
            donorResult = await pool.query(
                `SELECT *,
                        CASE
                            WHEN LOWER(city) = LOWER($2) THEN 1
                            ELSE 2
                        END AS priority

                 FROM donors

                 WHERE blood_group = $1
                 AND available = true

                 ORDER BY
                    priority ASC,
                    last_donation_date ASC NULLS FIRST`,
                [
                    blood_group,
                    city
                ]
            );
        }

        // ==========================================
        // Automatically Create Notifications
        // for Matching Donors
        // ==========================================
        for (const donor of donorResult.rows) {
            try {
                await pool.query(
                    `INSERT INTO notifications
                    (
                        donor_id,
                        request_id,
                        title,
                        message,
                        urgency,
                        is_read,
                        notification_type
                    )
                    VALUES ($1,$2,$3,$4,$5,false,$6)`,
                    [
                        donor.id,
                        bloodRequest.id,
                        "Emergency Blood Request",
                        `Emergency blood request: ${blood_group} blood required at ${hospital}`,
                        urgency,
                        "emergency"
                    ]
                );
            } catch (notificationError) {
                console.error(
                    "Notification creation error:",
                    notificationError.message
                );
            }
        }

        // ==========================================
        // Final Response
        // ==========================================
        res.status(201).json({
            message: "Blood request created successfully",
            request: bloodRequest,
            matching_donors: donorResult.rows,
            notifications_sent: donorResult.rows.length
        });

    } catch (error) {
        console.error("Create Request Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// Get All Blood Requests
// ==========================================
const getAllRequests = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM blood_requests
             ORDER BY created_at DESC`
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Get Requests Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// Donor Responds to Blood Request
// ==========================================
const donorResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { donor_id, response } = req.body;

        // ==========================================
        // Validate Input
        // ==========================================
        if (!donor_id || !response) {
            return res.status(400).json({
                message: "donor_id and response are required"
            });
        }

        if (!["accepted", "rejected"].includes(response)) {
            return res.status(400).json({
                message: "Response must be accepted or rejected"
            });
        }

        // ==========================================
        // Check Blood Request
        // ==========================================
        const requestResult = await pool.query(
            `SELECT *
             FROM blood_requests
             WHERE id = $1`,
            [id]
        );

        if (requestResult.rows.length === 0) {
            return res.status(404).json({
                message: "Blood request not found"
            });
        }

        const bloodRequest = requestResult.rows[0];

        // ==========================================
        // Check Donor
        // ==========================================
        const donorResult = await pool.query(
            `SELECT *
             FROM donors
             WHERE id = $1`,
            [donor_id]
        );

        if (donorResult.rows.length === 0) {
            return res.status(404).json({
                message: "Donor not found"
            });
        }

        const donor = donorResult.rows[0];

        // ==========================================
        // Donor Accepts Request
        // ==========================================
        if (response === "accepted") {

            // Check if request is already fulfilled
            if (bloodRequest.status === "fulfilled") {
                return res.status(400).json({
                    message: "This blood request has already been fulfilled"
                });
            }

            // Update blood request
            const updatedRequest = await pool.query(
                `UPDATE blood_requests
                 SET donor_id = $1,
                     donor_response = $2,
                     status = 'fulfilled'
                 WHERE id = $3
                 RETURNING *`,
                [
                    donor_id,
                    response,
                    id
                ]
            );

            // Make donor unavailable
            await pool.query(
                `UPDATE donors
                 SET available = false
                 WHERE id = $1`,
                [donor_id]
            );

            // Mark related notifications as read
            await pool.query(
                `UPDATE notifications
                 SET is_read = true
                 WHERE request_id = $1
                 AND donor_id = $2`,
                [
                    id,
                    donor_id
                ]
            );

            return res.status(200).json({
                message: "Donor accepted the blood request",
                request: updatedRequest.rows[0],
                donor: {
                    id: donor.id,
                    full_name: donor.full_name,
                    blood_group: donor.blood_group,
                    available: false
                }
            });
        }

        // ==========================================
        // Donor Rejects Request
        // ==========================================
        const rejectedRequest = await pool.query(
            `UPDATE blood_requests
             SET donor_id = $1,
                 donor_response = $2
             WHERE id = $3
             RETURNING *`,
            [
                donor_id,
                response,
                id
            ]
        );

        // Mark notification as read
        await pool.query(
            `UPDATE notifications
             SET is_read = true
             WHERE request_id = $1
             AND donor_id = $2`,
            [
                id,
                donor_id
            ]
        );

        res.status(200).json({
            message: "Donor rejected the blood request",
            request: rejectedRequest.rows[0]
        });

    } catch (error) {
        console.error("Donor Response Error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ==========================================
// Export Functions
// ==========================================
module.exports = {
    createRequest,
    getAllRequests,
    donorResponse
};