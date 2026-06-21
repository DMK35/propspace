// repositories/userRepository.js
// REPOSITORY LAYER RULE: this file is the ONLY place allowed to talk
// directly to the User model / MongoDB. Controllers call these functions
// instead of touching the database themselves. This keeps things organized.

const User = require("../models/User");

// Find a user by their email (used during login, and checking for duplicates)
const findByEmail = (email) => {
  return User.findOne({ email });
};

// Find a user by their username (used to check for duplicate usernames at signup)
const findByUsername = (username) => {
  return User.findOne({ username });
};

// Find a user by their MongoDB _id
const findById = (id) => {
  return User.findById(id);
};

// Create a new user document
const createUser = (userData) => {
  return User.create(userData);
};

// Update a user's profile fields (name, phone, avatar etc.)
// { new: true } makes it return the UPDATED document, not the old one
const updateUser = (id, updates) => {
  return User.findByIdAndUpdate(id, updates, { new: true });
};

module.exports = {
  findByEmail,
  findByUsername,
  findById,
  createUser,
  updateUser,
};
