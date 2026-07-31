const express = require("express");

const router = express.Router();

const {
    createRequest,
    getAllRequests,
    donorResponse
} = require("../controllers/requestController");


// ==========================================
// Create Blood Request
// POST /api/requests
// ==========================================
router.post("/", createRequest);


// ==========================================
// Get All Blood Requests
// GET /api/requests
// ==========================================
router.get("/", getAllRequests);


// ==========================================
// Donor Response
// POST /api/requests/:id/respond
// ==========================================
router.post("/:id/respond", donorResponse);


module.exports = router;