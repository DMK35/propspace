// controllers/authController.js
// CONTROLLER LAYER: business logic lives here.
// Routes just call these functions. These functions call the repository
// to actually touch the database.

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

// Helper function: creates a signed JWT token containing the user's id.
// expiresIn: "7d" means the token stops working after 7 days, forcing re-login.
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation - make sure nothing is missing
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email and password are all required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if email or username is already taken
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: "This username is already taken" });
    }

    // SALT + HASH the password before saving.
    // genSalt(10) generates a random salt with 10 "rounds" of complexity.
    // This means even two users with the same password get different hashes.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userRepository.createUser({
      username,
      email,
      password: hashedPassword, // store the HASH, never the plain password
    });

    const token = generateToken(newUser._id);

    // 201 Created = a new resource was successfully created
    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Something went wrong during registration" });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      // We deliberately DON'T say "email not found" - that helps attackers
      // guess which emails are registered. Generic message is safer.
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // bcrypt.compare hashes the plain password the same way and checks
    // if it matches the stored hash. Returns true/false.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Something went wrong during login" });
  }
};

module.exports = {
  register,
  login,
};
