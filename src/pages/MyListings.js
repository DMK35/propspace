// pages/MyListings.js
// PROTECTED page - shows only the logged-in user's own properties.

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { LoadingState, EmptyState, ErrorState } from "../components/StatusStates";

function MyListings() {
  const [properties, setProperties] = useState([]);
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // guards against setting state after unmount

    const fetchMyListings = async () => {
      setStatus("loading");
      try {
        const response = await api.get("/properties/my-listings");
        if (!isMounted) return;
        setProperties(response.data);
        setStatus(response.data.length === 0 ? "empty" : "success");
      } catch (err) {
        if (!isMounted) return;
        console.error("Fetch my listings error:", err);
        setStatus("error");
      }
    };

    fetchMyListings();

    // MEMORY CLEANUP - if the component unmounts before the request
    // finishes, we don't try to update state on a dead component
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;

    try {
      await api.delete(`/properties/${id}`);
      // Remove it from local state immediately instead of re-fetching everything
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete listing");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Link
          to="/create-listing"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          + New Listing
        </Link>
      </div>

      {status === "loading" && <LoadingState message="Loading your listings..." />}
      {status === "error" && <ErrorState message="Could not load your listings." />}
      {status === "empty" && <EmptyState message="You haven't listed any properties yet." />}

      {status === "success" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((property) => (
            <div key={property._id} className="bg-white rounded-lg shadow overflow-hidden">
              <img
                src={property.imageUrls[0] || "https://placehold.co/400x250?text=No+Image"}
                alt={property.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold truncate">{property.title}</h3>
                <p className="text-gray-500 text-sm">{property.city}</p>
                <p className="text-blue-600 font-bold mt-1">${property.price.toLocaleString()}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/edit-listing/${property._id}`)}
                    className="flex-1 bg-gray-100 text-gray-700 py-1.5 rounded text-sm hover:bg-gray-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property._id)}
                    className="flex-1 bg-red-50 text-red-600 py-1.5 rounded text-sm hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;
