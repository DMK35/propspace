// server.js
// This is the entry point of the backend. Running "node server.js" starts everything.

// Load environment variables from .env file FIRST, before anything else needs them
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");

const app = express();

// Connect to MongoDB Atlas
connectDB();

// MIDDLEWARE (runs on every request, in order)
app.use(cors()); // allows our React frontend (different port) to call this API
app.use(express.json()); // lets us read JSON request bodies as req.body

// ROUTES
// Every URL starting with /api/auth goes to authRoutes, and so on
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);

// Simple health check route - visit this in browser to confirm server is alive
app.get("/", (req, res) => {
  res.send("PropSpace API is running");
});

// 404 handler - runs if no route above matched
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
