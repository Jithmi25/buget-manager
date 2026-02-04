// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Safe env access for browser + Vite
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
const nodeEnv = (typeof process !== 'undefined' && process.env) ? process.env : {};
const supabaseUrl = env.VITE_SUPABASE_URL ?? nodeEnv.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY ?? nodeEnv.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const message = 'Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.';
  console.error(message);
  throw new Error(message);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// AUTH FUNCTIONS

// 1. Email Sign Up
export const signUpWithEmail = async (email, password, fullName) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          avatar_url: null
        }
        // Note: emailRedirectTo removed - configure in Supabase dashboard if needed
      }
    });

    if (error) {
      console.error('Supabase signup error:', error);
      
      // Improve rate limit error message
      if (error.message?.includes('rate limit')) {
        return { 
          data: null, 
          error: {
            message: 'Too many signup attempts. Please try again in 1 hour or use a different email address.',
            ...error
          }
        };
      }
      
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected signup error:', err);
    return { 
      data: null, 
      error: {
        message: err.message || 'Network error. Please check your connection and try again.',
        status: err.status || 'network_error'
      }
    };
  }
};

// 2. Email Login
export const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Supabase login error:', error);
      // Return a more user-friendly error message
      if (error.message.includes('Invalid login credentials')) {
        return { 
          data: null, 
          error: { 
            message: 'Invalid email or password. Please check your credentials.',
            ...error 
          } 
        };
      }
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected login error:', err);
    return { 
      data: null, 
      error: {
        message: err.message || 'Login failed. Please try again.',
        status: err.status || 'network_error'
      }
    };
  }
};

// 3. Google Login/Signup
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      },
      redirectTo: `${window.location.origin}/dashboard`
    }
  });
  return { data, error };
};

// 4. Sign Out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// 5. Get Current User
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (user && !error) {
    return { user, error: null };
  }
  
  return { user: null, error };
};

// 6. Update User Profile
export const updateUserProfile = async (updates) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('No user logged in');
  
  // Update in auth (basic info)
  const updateData = {};
  
  if (updates.email) updateData.email = updates.email;
  if (updates.password) updateData.password = updates.password;
  if (updates.fullName) updateData.data = { full_name: updates.fullName };
  
  if (Object.keys(updateData).length > 0) {
    const { data, error } = await supabase.auth.updateUser(updateData);
    return { data, error };
  }

  return { data: user, error: null };
};

// 7. Forgot Password
export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
};