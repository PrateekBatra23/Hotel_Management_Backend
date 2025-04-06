const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile, // 💡 Add this
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware"); // 💡 Add this too

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile); // ✅ Protected route

module.exports = router;
