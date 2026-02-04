// src/components/Auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../../lib/supabase';
import authVideo from '../../assets/auth.mp4';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [touched, setTouched] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (touched) {
      setEmailError(validateEmail(value));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setEmailError(validateEmail(email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched(true);

    const emailValidationError = validateEmail(email);
    setEmailError(emailValidationError);

    if (emailValidationError) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await resetPassword(email);
      
      if (error) {
        setError(error.message || 'Failed to send reset email. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-form-container">
          <div className="auth-header">
            <h2>Check Your Email</h2>
            <p>We've sent a password reset link to {email}</p>
          </div>
          
          <div className="success-message">
            <p>Please check your email inbox (and spam folder) for the password reset link.</p>
          </div>

          <div className="auth-footer">
            <p>
              Remember your password?{' '}
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        </div>

        <div className="auth-visual">
          <video autoPlay loop muted className="auth-video" poster="/placeholder-video.jpg">
            <source src={authVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-header">
          <h2>Forgot Password?</h2>
          <p>Enter your email address and we'll send you a link to reset your password</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleBlur}
              className={touched && emailError ? 'error' : ''}
              required
            />
            {touched && emailError && (
              <span className="field-error">{emailError}</span>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password?{' '}
            <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>

      <div className="auth-visual">
        <video autoPlay loop muted className="auth-video" poster="/placeholder-video.jpg">
          <source src={authVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default ForgotPassword;
