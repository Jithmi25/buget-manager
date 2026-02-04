// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import Home from './components/Home/Home.jsx';
import SignUp from './components/Auth/SignUp.jsx';
import Login from './components/Auth/Login.jsx';
import ForgotPassword from './components/Auth/ForgotPassword.jsx';
import ResetPassword from './components/Auth/ResetPassword.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import ScrollToTop from './components/ScrollToTop/ScrollToTop.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
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
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={<Home />} 
          />
        </Routes>
        <ScrollToTop />
      </AuthProvider>
    </Router>
  );
}

export default App;