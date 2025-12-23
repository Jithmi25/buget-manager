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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        avatar_url: null
      },
      emailRedirectTo: `${window.location.origin}/dashboard`
    }
  });

  // Create profile entry (handled by trigger but we can also do it here)
  if (data?.user && !error) {
    await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        email: email,
        full_name: fullName
      });
  }

  return { data, error };
};

// 2. Email Login
export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
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
    // Get additional profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    return { user: { ...user, profile }, error };
  }
  
  return { user: null, error };
};

// 6. Update User Profile
export const updateUserProfile = async (updates) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('No user logged in');
  
  // Update in auth (basic info)
  if (updates.email || updates.password) {
    const { error } = await supabase.auth.updateUser({
      email: updates.email,
      password: updates.password
    });
    if (error) throw error;
  }

  // Update in profiles table (additional info)
  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: updates.fullName,
      avatar_url: updates.avatarUrl,
      currency: updates.currency,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  return { data, error };
};

// 7. Forgot Password
export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
};