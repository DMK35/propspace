// controllers/propertyController.js
// Handles all property listing logic: create, read, update, delete.
// IMPORTANT: update/delete must verify the requester actually OWNS the
// listing before allowing changes - this is required by the assignment.

const propertyRepository = require("../repositories/propertyRepository");

// GET /api/properties
// PUBLIC route - anyone can view, even without logging in.
// Supports optional query filters: ?city=Lagos&minPrice=100&maxPrice=500
const getAllProperties = async (req, res) => {
  try {
    const { city, minPrice, maxPrice } = req.query;
    const properties = await propertyRepository.findAll({ city, minPrice, maxPrice });
    res.status(200).json(properties);
  } catch (error) {
    console.error("Get all properties error:", error.message);
    res.status(500).json({ message: "Could not fetch properties" });
  }
};

// GET /api/properties/my-listings
// PROTECTED route - only returns properties belonging to the logged-in user
const getMyListings = async (req, res) => {
  try {
    const properties = await propertyRepository.findByOwner(req.userId);
    res.status(200).json(properties);
  } catch (error) {
    console.error("Get my listings error:", error.message);
    res.status(500).json({ message: "Could not fetch your listings" });
  }
};

// GET /api/properties/:id
// PUBLIC route - view a single property's full details
const getPropertyById = async (req, res) => {
  try {
    const property = await propertyRepository.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error("Get property by id error:", error.message);
    // If the id format itself is invalid (not a valid Mongo ObjectId),
    // Mongoose throws an error which we treat as "not found" too
    res.status(404).json({ message: "Property not found" });
  }
};

// POST /api/properties
// PROTECTED route - creates a new listing owned by the logged-in user
const createProperty = async (req, res) => {
  try {
    const { title, description, price, city, country, propertyType, imageUrls } = req.body;

    // Basic validation before touching the database
    if (!title || !description || !price || !city || !country || !propertyType) {
      return res.status(400).json({ message: "All required fields must be filled in" });
    }

    if (price < 0) {
      return res.status(400).json({ message: "Price cannot be negative" });
    }

    const validTypes = ["Apartment", "House", "Studio"];
    if (!validTypes.includes(propertyType)) {
      return res.status(400).json({ message: "Property type must be Apartment, House, or Studio" });
    }

    const newProperty = await propertyRepository.create({
      title,
      description,
      price,
      city,
      country,
      propertyType,
      imageUrls: imageUrls || [],
      owner: req.userId, // comes from the JWT, NOT from the request body
      // (we never trust the client to tell us who the owner is)
    });

    res.status(201).json({ message: "Property listed successfully", property: newProperty });
  } catch (error) {
    console.error("Create property error:", error.message);
    res.status(500).json({ message: "Could not create property listing" });
  }
};

// PUT /api/properties/:id
// PROTECTED route - only the ORIGINAL AUTHOR can update their own listing
const updateProperty = async (req, res) => {
  try {
    const property = await propertyRepository.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // OWNERSHIP CHECK - this is critical.
    // property.owner is an ObjectId, req.userId is a string, so we
    // convert property.owner to a string before comparing.
    if (property.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "You are not allowed to edit this listing" });
    }

    const { title, description, price, city, country, propertyType, imageUrls } = req.body;

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (city) updates.city = city;
    if (country) updates.country = country;
    if (propertyType) updates.propertyType = propertyType;
    if (imageUrls) updates.imageUrls = imageUrls;

    const updatedProperty = await propertyRepository.update(req.params.id, updates);

    res.status(200).json({ message: "Property updated successfully", property: updatedProperty });
  } catch (error) {
    console.error("Update property error:", error.message);
    res.status(500).json({ message: "Could not update property" });
  }
};

// DELETE /api/properties/:id
// PROTECTED route - only the ORIGINAL AUTHOR can delete their own listing
const deleteProperty = async (req, res) => {
  try {
    const property = await propertyRepository.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Same ownership check as update
    if (property.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "You are not allowed to delete this listing" });
    }

    await propertyRepository.remove(req.params.id);

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete property error:", error.message);
    res.status(500).json({ message: "Could not delete property" });
  }
};

module.exports = {
  getAllProperties,
  getMyListings,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
