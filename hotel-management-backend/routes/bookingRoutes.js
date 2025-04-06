const express = require("express");
const { bookRoom, getMyBookings, cancelBooking } = require("../controllers/bookingController");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();
console.log("Express version:", express.Router); // Should be a function

router.post("/", protect, bookRoom);
router.get("/me", protect, getMyBookings);
router.patch("/:id/cancel", protect, cancelBooking); // 👈 new route

module.exports = router;
