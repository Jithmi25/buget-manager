// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/Home.jsx';
import SignUp from './components/Auth/SignUp.jsx';
import Login from './components/Auth/Login.jsx';
import ForgotPassword from './components/Auth/ForgotPassword.jsx';
import ResetPassword from './components/Auth/ResetPassword.jsx';
import Dashboard from './components/Dashboard/Dashboard';
import { supabase } from './lib/supabase';

function App() {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  function Logout() {
    React.useEffect(() => {
      supabase.auth.signOut().catch(() => {});
    }, []);
    return <Navigate to="/login" />;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/signup" 
          element={!session ? <SignUp /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/login" 
          element={!session ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/forgot-password" 
          element={!session ? <ForgotPassword /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/reset-password" 
          element={<ResetPassword />} 
        />
        <Route 
          path="/logout" 
          element={<Logout />} 
        />
        <Route 
          path="/dashboard" 
          element={session ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={session ? <Navigate to="/dashboard" /> : <Home />} 
        />
      </Routes>
    </Router>
  );
}

export default App;