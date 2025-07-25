// main.jsx or index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { createRoot } from 'react-dom/client'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ BrowserRouter should be ONLY here */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
