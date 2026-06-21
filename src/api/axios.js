// api/axios.js
// This creates ONE central axios instance that the whole app uses.
// The interceptor below automatically attaches the JWT token to every
// outgoing request - so we never have to manually add it in each component.

import axios from "axios";

// Change this if your backend runs on a different port
const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// REQUEST INTERCEPTOR - runs before every single request is sent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR - runs after every response comes back
// If the token is invalid/expired, the backend sends 401.
// We catch that globally here and log the user out automatically.
api.interceptors.response.use(
  (response) => response, // if successful, just pass it through
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login - using window.location here (outside React Router)
      // because interceptors live outside the component tree
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
