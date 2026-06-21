/// repositories/propertyRepository.js
// REPOSITORY LAYER: only this file talks directly to the Property model.

const Property = require("../models/Property");

// Get ALL properties (public feed), with optional search filters
const findAll = (filters = {}) => {
  const query = {};

  // If a city filter was passed, do a case-insensitive partial match
  if (filters.city) {
    query.city = { $regex: filters.city, $options: "i" };
  }

  // If min/max price was passed, build a price range query
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  // sort by newest first
  return Property.find(query).sort({ createdAt: -1 });
};

// Get only properties belonging to one specific user (the "My Listings" screen)
const findByOwner = (ownerId) => {
  return Property.find({ owner: ownerId }).sort({ createdAt: -1 });
};

// Get a single property by its id
const findById = (id) => {
  return Property.findById(id);
};

// Create a new property listing
const create = (propertyData) => {
  return Property.create(propertyData);
};

// Update a property by id
const update = (id, updates) => {
  return Property.findByIdAndUpdate(id, updates, { new: true });
};

// Delete a property by id
const remove = (id) => {
  return Property.findByIdAndDelete(id);
};

module.exports = {
  findAll,
  findByOwner,
  findById,
  create,
  update,
  remove,
};
