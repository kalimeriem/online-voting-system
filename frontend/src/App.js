import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Departments from "./pages/Departments/Departments";
import Elections from "./pages/Elections/Elections";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes without Sidebar */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with Sidebar */}
        <Route
          path="/dashboard"
          element={
            <div style={{ display: "flex" }}>
              <Sidebar />
              <div className="content" style={{ flex: 1, padding: "20px" }}>
                <Dashboard />
              </div>
            </div>
          }
        />
        <Route
          path="/elections"
          element={
            <div style={{ display: "flex" }}>
              <Sidebar />
              <div className="content" style={{ flex: 1, padding: "20px" }}>
                <Elections />
              </div>
            </div>
          }
        />
        <Route
  path="/Departments"
  element={
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="content" style={{ flex: 1, padding: "20px" }}>
        <Departments />
      </div>
    </div>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
