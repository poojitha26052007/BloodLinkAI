const express = require("express");
const router = express.Router();

const {
    registerDonor,
    getAllDonors,
    searchDonors
} = require("../controllers/donorController");

// Register Donor
router.post("/register", registerDonor);

// Search Matching Donors
router.get("/match", searchDonors);

// Get All Donors
router.get("/", getAllDonors);

module.exports = router;