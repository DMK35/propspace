// routes/propertyRoutes.js

const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");
const protect = require("../middleware/authMiddleware");

// IMPORTANT: /my-listings must be declared BEFORE /:id
// Otherwise Express would think "my-listings" is an :id value and
// try to look up a property with that id, which would break this route.
router.get("/my-listings", protect, propertyController.getMyListings);

router.get("/", propertyController.getAllProperties); // public
router.get("/:id", propertyController.getPropertyById); // public

router.post("/", protect, propertyController.createProperty); // protected
router.put("/:id", protect, propertyController.updateProperty); // protected
router.delete("/:id", protect, propertyController.deleteProperty); // protected

module.exports = router;
