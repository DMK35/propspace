// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

// All routes below require a valid JWT token (protect middleware runs first)
router.get("/me", protect, userController.getMyProfile);
router.put("/me", protect, userController.updateMyProfile);
router.put("/me/password", protect, userController.changePassword);

module.exports = router;
