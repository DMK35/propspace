// pages/EditListing.js
// PROTECTED page - lets the OWNER of a listing edit it.
// The backend re-checks ownership too, but checking here lets us show a
// friendlier message instead of relying purely on a 403 from the API.

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import PropertyForm from "../components/PropertyForm";
import { LoadingState, ErrorState } from "../components/StatusStates";

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;

    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);
        if (!isMounted) return;
        setProperty(response.data);
        setStatus("success");
      } catch (err) {
        if (!isMounted) return;
        console.error("Fetch property for edit error:", err);
        setStatus("error");
      }
    };

    fetchProperty();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleUpdate = async (formData) => {
    // The backend checks ownership and will respond with 403 if this user
    // isn't the author - PropertyForm will display that message automatically.
    await api.put(`/properties/${id}`, formData);
    navigate("/my-listings");
  };

  if (status === "loading") return <LoadingState message="Loading listing..." />;
  if (status === "error" || !property)
    return <ErrorState message="Could not load this listing for editing." />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Listing</h1>
      <PropertyForm initialValues={property} onSubmit={handleUpdate} submitLabel="Save Changes" />
    </div>
  );
}

export default EditListing;
