// models/Property.js
// This is the "shape" of a property listing document in MongoDB.

const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    propertyType: {
      type: String,
      required: true,
      // enum restricts the value to only these 3 options
      enum: ["Apartment", "House", "Studio"],
    },
    imageUrls: {
      type: [String], // an array of strings (image links)
      default: [],
    },
    // This links the property to the user who created it.
    // ObjectId + ref: "User" lets Mongoose "populate" the full user info later if needed.
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Property", propertySchema);
