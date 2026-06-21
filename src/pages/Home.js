// pages/Home.js
// PUBLIC feed - works for both guests and logged-in users.

import React, { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import PropertyCard from "../components/PropertyCard";
import FilterSidebar from "../components/FilterSidebar";
import { LoadingState, EmptyState, ErrorState } from "../components/StatusStates";

function Home() {
  const [properties, setProperties] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "empty" | "error"
  const [filters, setFilters] = useState({ city: "", minPrice: "", maxPrice: "" });

  // useCallback so this function reference doesn't change every render,
  // which keeps the useEffect below from re-running unnecessarily
  const fetchProperties = useCallback(async (activeFilters) => {
    setStatus("loading");
    try {
      // Build query string only with filters that actually have a value
      const params = {};
      if (activeFilters.city) params.city = activeFilters.city;
      if (activeFilters.minPrice) params.minPrice = activeFilters.minPrice;
      if (activeFilters.maxPrice) params.maxPrice = activeFilters.maxPrice;

      const response = await api.get("/properties", { params });

      setProperties(response.data);
      setStatus(response.data.length === 0 ? "empty" : "success");
    } catch (err) {
      console.error("Fetch properties error:", err);
      setStatus("error");
    }
  }, []);

  // STATE INITIALIZATION - run the fetch exactly once when the page mounts
  useEffect(() => {
    fetchProperties(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Browse Properties</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <FilterSidebar onFilter={handleFilter} />

        <div className="flex-1">
          {status === "loading" && <LoadingState message="Loading properties..." />}
          {status === "error" && <ErrorState message="Could not load properties. Please try again." />}
          {status === "empty" && <EmptyState message="No properties match your search." />}

          {status === "success" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
