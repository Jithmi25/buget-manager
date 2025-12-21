// src/components/Auth/SignUp.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUpWithEmail, signInWithGoogle } from '../../lib/supabase';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (error) throw error;

      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        setError('User already exists');
      } else if (data?.user) {
        // If email confirmation is disabled in Supabase settings
        if (data.session) {
          navigate('/dashboard');
        } else {
          setSuccess(true);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      // User will be redirected automatically after Google auth
    } catch (err) {
      setError(err.message);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <h2>Check Your Email!</h2>
        <p>We've sent a confirmation link to {formData.email}</p>
        <p>Please check your inbox and click the link to verify your account.</p>
        <button onClick={() => navigate('/login')} className="btn-primary">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleEmailSignUp}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="divider">OR</div>

      <button onClick={handleGoogleSignUp} className="google-btn">
        <img src="https://www.google.com/favicon.ico" alt="Google" />
        Sign up with Google
      </button>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default SignUp;