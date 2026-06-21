// routes/authRoutes.js
// ROUTES LAYER RULE: just wiring. No logic here, only:
// "when this URL + HTTP verb is hit, call this controller function"

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
