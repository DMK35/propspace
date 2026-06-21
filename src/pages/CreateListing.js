// pages/CreateListing.js
// PROTECTED page - lets a logged-in user create a new property listing.

import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PropertyForm from "../components/PropertyForm";

function CreateListing() {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    // If api.post throws, PropertyForm catches it and shows the server error.
    // We only navigate away if it succeeds.
    await api.post("/properties", formData);
    navigate("/my-listings");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">List a New Property</h1>
      <PropertyForm onSubmit={handleCreate} submitLabel="Create Listing" />
    </div>
  );
}

export default CreateListing;
