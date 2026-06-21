// context/AuthContext.js
// This Context shares "who is logged in" with EVERY component in the app,
// without us having to pass it down manually through props.

import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check localStorage on first load

  // STATE INITIALIZATION (runs ONCE when the app first mounts)
  // We check if a token/user already exists in localStorage from a previous session
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []); // empty array = runs only once on mount, not on every re-render

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);

    return user;
  };

  const register = async (username, email, password) => {
    const response = await api.post("/auth/register", { username, email, password });
    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);

    return user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Lets other parts of the app (like the Profile page) update the
  // locally stored user info after an edit, without needing to log out/in
  const updateLocalUser = (updatedFields) => {
    const newUser = { ...user, ...updatedFields };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateLocalUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so components can just call useAuth() instead of
// importing useContext + AuthContext every time
export function useAuth() {
  return useContext(AuthContext);
}
