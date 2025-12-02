const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// Test route (pehle wala)
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "User test route working ✅",
  });
});

// REGISTER route:  POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1) Empty field check
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // 2) Password length check
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // 3) User already exist check
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // 4) New user create
    const user = await User.create({ name, email, password });

    // 5) Success response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error, try again later" });
  }
});

module.exports = router;
