// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getCurrentUser, signOut as supabaseSignOut } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check active session on mount
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (session) {
        setSession(session);
        setUser(session.user ?? null);
      } else {
        setSession(null);
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setSession(session);
        setUser(session.user ?? null);
      } else {
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabaseSignOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
