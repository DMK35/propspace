// App.js
// This is where all the pages get wired to URLs using React Router.

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyListings from "./pages/MyListings";
import PropertyDetail from "./pages/PropertyDetail";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Profile from "./pages/Profile";

function App() {
  return (
    // AuthProvider wraps EVERYTHING so any page can access useAuth()
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* PUBLIC routes - anyone can view these, no login required */}
          <Route path="/" element={<Home />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED routes - wrapped in <ProtectedRoute>, redirects to
              /login automatically if no one is signed in */}
          <Route
            path="/my-listings"
            element={
              <ProtectedRoute>
                <MyListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-listing"
            element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-listing/:id"
            element={
              <ProtectedRoute>
                <EditListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
