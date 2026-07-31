const pool = require("../config/db");

// Register Donor
const registerDonor = async (req, res) => {
    try {
        const {
            full_name,
            blood_group,
            phone,
            email,
            city,
            state,
            last_donation_date,
            available,
            latitude,
            longitude
        } = req.body;

        const result = await pool.query(
            `INSERT INTO donors
            (
                full_name,
                blood_group,
                phone,
                email,
                city,
                state,
                last_donation_date,
                available,
                latitude,
                longitude
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING *`,
            [
                full_name,
                blood_group,
                phone,
                email,
                city,
                state,
                last_donation_date,
                available ?? true,
                latitude,
                longitude
            ]
        );

        res.status(201).json({
            message: "Donor registered successfully",
            donor: result.rows[0]
        });

    } catch (error) {
        console.error("Register Donor Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get All Donors
const getAllDonors = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM donors ORDER BY id DESC"
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Get Donors Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Search Matching Donors
const searchDonors = async (req, res) => {
    try {
        const { blood_group, city } = req.query;

        const result = await pool.query(
            `SELECT *,
                    CASE
                        WHEN city = $2 THEN 1
                        ELSE 2
                    END AS priority
             FROM donors
             WHERE blood_group = $1
             AND available = true
             ORDER BY priority ASC,
                      last_donation_date ASC NULLS FIRST`,
            [blood_group, city]
        );

        res.status(200).json({
            count: result.rows.length,
            donors: result.rows
        });

    } catch (error) {
        console.error("Search Donors Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Export
module.exports = {
    registerDonor,
    getAllDonors,
    searchDonors
};