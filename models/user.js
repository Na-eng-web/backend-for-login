const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[\w-]+(\.[\w-]+)*@([a-z\d-]+(\.[a-z\d-]+)*\.[a-z]{2,3}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/i,
      "Please enter a valid email Address",
    ],
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash the password before saving
userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// User model
const User = mongoose.model("User", userSchema);

module.exports = User;
