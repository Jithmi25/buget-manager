// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/Home.jsx';
import SignUp from './components/Auth/SignUp.jsx';
import Login from './components/Auth/Login.jsx';
import ForgotPassword from './components/Auth/ForgotPassword.jsx';
import ResetPassword from './components/Auth/ResetPassword.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
// Backend disabled for UI-only preview

function App() {
  // UI-only mode: backend auth disabled

  return (
    <Router>
      <Routes>
        <Route 
          path="/signup" 
          element={<SignUp />} 
        />
        <Route 
          path="/login" 
          element={<Login />} 
        />
        <Route 
          path="/forgot-password" 
          element={<ForgotPassword />} 
        />
        <Route 
          path="/reset-password" 
          element={<ResetPassword />} 
        />
        <Route 
          path="/logout" 
          element={<Navigate to="/login" />} 
        />
        <Route 
          path="/dashboard" 
          element={<Dashboard />} 
        />
        <Route 
          path="/" 
          element={<Home />} 
        />
      </Routes>
    </Router>
  );
}

export default App;