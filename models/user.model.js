/** @format */

let mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: [3, "Username must be at least 3 characters long"],
    unique: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    minlength: [13, "Email must be at least 13 characters long"],
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Password must be at least 3 characters long"],
    // ❌ unique nahi, lowercase nahi
  },
});

let userModel = mongoose.model("user", userSchema);
module.exports = userModel;
