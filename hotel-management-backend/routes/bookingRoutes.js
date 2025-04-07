const express = require("express");
const {
  bookRoom,
  getMyBookings,
  cancelBooking,
  getBookingById,
  getAllBookings,
} = require("../controllers/bookingController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔐 Customer Routes
router.post("/", protect, bookRoom);
router.get("/me", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.patch("/:id/cancel", protect, cancelBooking);

// 👑 Admin Route
router.get("/", protect, adminOnly, getAllBookings);

module.exports = router;
