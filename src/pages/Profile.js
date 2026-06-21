// pages/Profile.js
// PROTECTED page - lets the user view/edit their profile and change password.

import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/InputField";

function Profile() {
  const { user, updateLocalUser } = useAuth();

  // --- Profile info form state ---
  const [username, setUsername] = useState(user?.username || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // --- Password change form state (kept separate from profile form on purpose,
  // so editing your name doesn't accidentally touch your password) ---
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage("");
    setProfileError("");
    setSavingProfile(true);

    try {
      const response = await api.put("/users/me", { username, phone, avatarUrl });
      updateLocalUser(response.data.user); // keep navbar/context in sync immediately
      setProfileMessage("Profile updated successfully");
    } catch (err) {
      setProfileError(err.response?.data?.message || "Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setSavingPassword(true);
    try {
      await api.put("/users/me/password", { oldPassword, newPassword });
      setPasswordMessage("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Could not change password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* PROFILE INFO SECTION */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Profile Settings</h2>

        {profileMessage && (
          <div className="bg-green-50 text-green-700 text-sm p-3 rounded mb-4">{profileMessage}</div>
        )}
        {profileError && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{profileError}</div>
        )}

        <form onSubmit={handleProfileSubmit}>
          <InputField label="Email" value={user?.email || ""} onChange={() => {}} />
          {/* Email is shown but kept read-only here on purpose, since changing it
              would normally require re-verification - out of scope for this project */}

          <InputField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <InputField
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. +234 800 000 0000"
          />
          <InputField
            label="Avatar Image URL"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/your-photo.jpg"
          />

          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Avatar preview"
              className="w-16 h-16 rounded-full object-cover mb-4"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}

          <button
            type="submit"
            disabled={savingProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* PASSWORD CHANGE SECTION */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>

        {passwordMessage && (
          <div className="bg-green-50 text-green-700 text-sm p-3 rounded mb-4">{passwordMessage}</div>
        )}
        {passwordError && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{passwordError}</div>
        )}

        <form onSubmit={handlePasswordSubmit}>
          <InputField
            label="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <InputField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
          />

          <button
            type="submit"
            disabled={savingPassword}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {savingPassword ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
