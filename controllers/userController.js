const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6Ik5hcmVuZHJhIiwiZXhwIjoxNjg1NTU4NjU3LCJpYXQiOjE2ODU1NTg2NTd9.lKeQ59xrETqqoqlXK3jeYMOCpBHFKMVnx8HWz4jn8qU",
    { expiresIn: "1h" }
  );
};

// User registration route handler
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // console.log(name + " " + email + " " + password);

    // Check for required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // Check if user already exists
    // Assuming you have a User model defined with Mongoose
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("User registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

// User login route handler
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id);
    res.setHeader("Authorization", `Bearer ${token}`);
    return res.status(200).json({ token });
  } catch (error) {
    console.error("User login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
