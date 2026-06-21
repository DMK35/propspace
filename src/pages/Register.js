// pages/Register.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/InputField";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({}); // field-specific validation errors
  const [serverError, setServerError] = useState(""); // errors from the backend
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // FORM VALIDATION - runs before we even try to hit the network.
  // This satisfies "prevent submission of incomplete/broken data".
  const validate = () => {
    const newErrors = {};

    if (!username.trim()) newErrors.username = "Username is required";
    else if (username.trim().length < 3) newErrors.username = "Username must be at least 3 characters";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email address";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    // returns true only if there are NO errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // stops the browser from doing a full page reload
    setServerError("");

    if (!validate()) return; // stop here if validation failed

    setSubmitting(true);
    try {
      await register(username, email, password);
      navigate("/"); // send them to the home feed after successful signup
    } catch (err) {
      // err.response.data.message comes from our backend's error responses
      setServerError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create your PropSpace account</h2>

        {serverError && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{serverError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="johndoe"
            required
            error={errors.username}
          />
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            error={errors.email}
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
            error={errors.password}
          />
          <InputField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
            error={errors.confirmPassword}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 mt-2"
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
