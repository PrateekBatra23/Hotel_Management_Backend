const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

    console.log("👉 Registered:", req.body.email);
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

    console.log("👉 Logged in:", email);
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
    try {
      const user = req.user;
      if (user) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error in getUserProfile:", error.message);
      res.status(500).json({ message: "Server error" });
    }
};
  
  module.exports = { registerUser, loginUser, getUserProfile };

