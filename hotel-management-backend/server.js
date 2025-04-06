const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");


// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON in req.body

// Load and use routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
console.log("✅ /api/auth routes loaded");

const roomRoutes = require("./routes/roomRoutes");
app.use("/api/rooms", roomRoutes);

const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);



// Test root route
app.get("/", (req, res) => {
  res.send("🏨 Hotel Management API is running. WHO HA!");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
