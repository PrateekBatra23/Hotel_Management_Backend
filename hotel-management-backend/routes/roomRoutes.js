const express = require("express");
const { createRoom, getAllRooms, deleteRoom } = require("../controllers/roomController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createRoom);
router.get("/", getAllRooms);

// 🛑 DELETE route - admin only
router.delete("/:id", protect, adminOnly, deleteRoom);

module.exports = router;
