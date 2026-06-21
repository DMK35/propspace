// index.js - this is the very first file React runs.
// It finds the <div id="root"> in index.html and renders our <App /> into it.

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
