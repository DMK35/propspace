// components/FilterSidebar.js
// Lets the user filter the public property feed by city and price range.
// It just collects the filter values and hands them up to the parent (Home page)
// via the onFilter callback - it doesn't fetch data itself.

import React, { useState } from "react";

function FilterSidebar({ onFilter }) {
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleApply = () => {
    onFilter({ city, minPrice, maxPrice });
  };

  const handleClear = () => {
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    onFilter({ city: "", minPrice: "", maxPrice: "" });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow w-full md:w-64">
      <h3 className="font-semibold mb-3">Filter Properties</h3>

      <label className="block text-sm text-gray-600 mb-1">City</label>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="e.g. Lagos"
        className="w-full border border-gray-300 rounded px-2 py-1 mb-3 text-sm"
      />

      <label className="block text-sm text-gray-600 mb-1">Min Price</label>
      <input
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        placeholder="0"
        className="w-full border border-gray-300 rounded px-2 py-1 mb-3 text-sm"
      />

      <label className="block text-sm text-gray-600 mb-1">Max Price</label>
      <input
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="1000000"
        className="w-full border border-gray-300 rounded px-2 py-1 mb-4 text-sm"
      />

      <button
        onClick={handleApply}
        className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 mb-2"
      >
        Apply Filters
      </button>
      <button
        onClick={handleClear}
        className="w-full bg-gray-100 text-gray-700 py-2 rounded text-sm font-medium hover:bg-gray-200"
      >
        Clear
      </button>
    </div>
  );
}

export default FilterSidebar;
