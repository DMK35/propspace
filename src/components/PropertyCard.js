// components/PropertyCard.js
// Displays one property as a small card. Used in the Home feed grid
// and the My Listings grid.

import React from "react";
import { Link } from "react-router-dom";

function PropertyCard({ property }) {
  // Fallback placeholder image if the listing has no images yet
  const imageToShow =
    property.imageUrls && property.imageUrls.length > 0
      ? property.imageUrls[0]
      : "https://placehold.co/400x250?text=No+Image";

  return (
    <Link
      to={`/properties/${property._id}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
    >
      <img
        src={imageToShow}
        alt={property.title}
        className="w-full h-44 object-cover"
        // If the image link is broken, fall back to the placeholder instead of a broken icon
        onError={(e) => {
          e.target.src = "https://placehold.co/400x250?text=No+Image";
        }}
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{property.title}</h3>
        <p className="text-gray-500 text-sm">
          {property.city}, {property.country}
        </p>
        <p className="text-blue-600 font-bold mt-2">${property.price.toLocaleString()}</p>
        <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {property.propertyType}
        </span>
      </div>
    </Link>
  );
}

export default PropertyCard;
