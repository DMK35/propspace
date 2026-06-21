// components/PropertyForm.js
// Shared form used by BOTH "Create Listing" and "Edit Listing" pages,
// since they need almost identical fields. This avoids duplicating code.

import React, { useState } from "react";
import InputField from "./InputField";

const PROPERTY_TYPES = ["Apartment", "House", "Studio"];

// initialValues lets EditListing pre-fill the form with existing data.
// onSubmit is called with the validated form data when the user submits.
function PropertyForm({ initialValues = {}, onSubmit, submitLabel = "Submit" }) {
  const [title, setTitle] = useState(initialValues.title || "");
  const [description, setDescription] = useState(initialValues.description || "");
  const [price, setPrice] = useState(initialValues.price || "");
  const [city, setCity] = useState(initialValues.city || "");
  const [country, setCountry] = useState(initialValues.country || "");
  const [propertyType, setPropertyType] = useState(initialValues.propertyType || "Apartment");
  // Image URLs stored as a single textarea, one URL per line - simpler than a dynamic list UI
  const [imageUrlsText, setImageUrlsText] = useState(
    (initialValues.imageUrls || []).join("\n")
  );

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!price || Number(price) <= 0) newErrors.price = "Enter a valid price greater than 0";
    if (!city.trim()) newErrors.city = "City is required";
    if (!country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    // Turn the textarea into a clean array of URLs, removing empty lines
    const imageUrls = imageUrlsText
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    setSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        price: Number(price),
        city,
        country,
        propertyType,
        imageUrls,
      });
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
      {serverError && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{serverError}</div>
      )}

      <InputField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Cozy 2-bedroom apartment downtown"
        required
        error={errors.title}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Describe the property..."
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <InputField
        label="Price (USD)"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="e.g. 1200"
        required
        error={errors.price}
      />

      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Lagos"
          required
          error={errors.city}
        />
        <InputField
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="e.g. Nigeria"
          required
          error={errors.country}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URLs (one per line)
        </label>
        <textarea
          value={imageUrlsText}
          onChange={(e) => setImageUrlsText(e.target.value)}
          rows={3}
          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <p className="text-xs text-gray-400 mt-1">Paste direct image links, one on each line</p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export default PropertyForm;
