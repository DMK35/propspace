// models/User.js
// This is the "shape" of a user document in MongoDB.
// Mongoose uses this Schema to validate data before saving it.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true, // removes accidental whitespace e.g. "  john  " -> "john"
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // MongoDB will reject duplicate emails
      trim: true,
      lowercase: true, // so "John@Mail.com" and "john@mail.com" are treated the same
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      // NOTE: we never store the plain password here.
      // It gets hashed in the controller BEFORE it reaches this model.
    },
    phone: {
      type: String,
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
  },
  {
    // timestamps automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
