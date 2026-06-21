// components/Navbar.js
// Top navigation bar, shown on every page. Changes links depending on
// whether the user is logged in or not.

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-blue-600">
        PropSpace
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/" className="text-gray-600 hover:text-blue-600 text-sm">
          Browse
        </Link>

        {user ? (
          // Logged-in menu
          <>
            <Link to="/my-listings" className="text-gray-600 hover:text-blue-600 text-sm">
              My Listings
            </Link>
            <Link to="/create-listing" className="text-gray-600 hover:text-blue-600 text-sm">
              + New Listing
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-blue-600 text-sm">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-600 px-3 py-1.5 rounded text-sm hover:bg-red-100"
            >
              Logout
            </button>
          </>
        ) : (
          // Logged-out menu
          <>
            <Link to="/login" className="text-gray-600 hover:text-blue-600 text-sm">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
