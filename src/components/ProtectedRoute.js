// components/ProtectedRoute.js
// This wraps any page that should ONLY be visible to logged-in users.
// If there's no logged-in user, it redirects straight to /login instead
// of showing the protected page.

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // While we're still checking localStorage on first app load,
  // show nothing (or a spinner) instead of incorrectly redirecting
  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  if (!user) {
    // "replace" means this redirect doesn't get added to browser history,
    // so pressing Back won't bounce the user between login and the protected page
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
