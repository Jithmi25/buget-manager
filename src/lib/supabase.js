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

// 6. Get User Profile
export const getUserProfile = async (userId) => {
  const { data: { user } } = await supabase.auth.getUser();
  const id = userId ?? user?.id;

  if (!id) throw new Error('No user logged in');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  return { data, error };
};

// 7. Upsert User Profile
export const upsertUserProfile = async (profile) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('No user logged in');

  const payload = {
    id: user.id,
    full_name: profile.fullName ?? profile.full_name ?? null,
    avatar_url: profile.avatarUrl ?? profile.avatar_url ?? null,
    currency: profile.currency ?? 'LKR',
    language: profile.language ?? 'en',
    theme: profile.theme ?? 'light',
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  return { data, error };
};

// 8. Update User Profile
export const updateUserProfile = async (updates) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('No user logged in');
  
  const updateData = {};
  
  if (updates.email) updateData.email = updates.email;
  if (updates.password) updateData.password = updates.password;
  if (updates.fullName) updateData.data = { full_name: updates.fullName };
  
  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase.auth.updateUser(updateData);
    if (error) return { data: null, error };
  }

  const { data, error } = await upsertUserProfile({
    fullName: updates.fullName,
    avatarUrl: updates.avatarUrl,
    currency: updates.currency,
    language: updates.language,
    theme: updates.theme
  });

  return { data, error };
};

// 9. Forgot Password
export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
};

// 10. Upload Profile Avatar to Supabase Storage
export const uploadProfileAvatar = async (file) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user logged in');
  
  if (!file) throw new Error('No file provided');
  
  // Create unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Upload to storage
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type
    });

  if (error) {
    console.error('Upload error:', error);
    return { data: null, error };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return { data: { publicUrl, filePath }, error: null };
};