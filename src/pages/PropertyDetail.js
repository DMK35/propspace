// pages/PropertyDetail.js
// PUBLIC page - anyone can view full details of one property.

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { LoadingState, ErrorState } from "../components/StatusStates";

function PropertyDetail() {
  const { id } = useParams(); // grabs the :id part of the URL
  const [property, setProperty] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;

    const fetchProperty = async () => {
      setStatus("loading");
      try {
        const response = await api.get(`/properties/${id}`);
        if (!isMounted) return;
        setProperty(response.data);
        setStatus("success");
      } catch (err) {
        if (!isMounted) return;
        console.error("Fetch property error:", err);
        setStatus("error");
      }
    };

    fetchProperty();

    return () => {
      isMounted = false;
    };
  }, [id]); // re-run if the id in the URL changes

  if (status === "loading") return <LoadingState message="Loading property..." />;
  if (status === "error" || !property)
    return <ErrorState message="Property not found or could not be loaded." />;

  const mainImage = property.imageUrls[0] || "https://placehold.co/800x400?text=No+Image";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 text-sm hover:underline">
        ← Back to all properties
      </Link>

      <img src={mainImage} alt={property.title} className="w-full h-80 object-cover rounded-lg mt-4" />

      {/* If there are more images, show them as small thumbnails below the main one */}
      {property.imageUrls.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {property.imageUrls.slice(1).map((url, i) => (
            <img key={i} src={url} alt={`${property.title} ${i + 2}`} className="w-24 h-20 object-cover rounded" />
          ))}
        </div>
      )}

      <div className="mt-6">
        <h1 className="text-2xl font-bold">{property.title}</h1>
        <p className="text-gray-500">
          {property.city}, {property.country}
        </p>
        <p className="text-3xl font-bold text-blue-600 mt-3">${property.price.toLocaleString()}</p>

        <span className="inline-block mt-3 text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded">
          {property.propertyType}
        </span>

        <h2 className="text-lg font-semibold mt-6 mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
      </div>
    </div>
  );
}

export default PropertyDetail;
