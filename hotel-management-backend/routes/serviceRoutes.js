const express = require("express");
const {
  createServiceRequest,
  getMyServiceRequests,
  getAllServiceRequests,
  updateServiceStatus,
  updateServiceRequest,
  deleteServiceRequest,
} = require("../controllers/serviceRequestController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new service request
router.post("/", protect, createServiceRequest);

// Get service requests of the logged-in user
router.get("/me", protect, getMyServiceRequests);

// Admin - view all requests
router.get("/", protect, adminOnly, getAllServiceRequests);

// Admin - update request status
router.patch("/:id", protect, adminOnly, updateServiceStatus);

// PATCH /api/services/:id
router.patch("/:id", protect, updateServiceRequest);
router.delete("/:id", protect, deleteServiceRequest);


module.exports = router;
