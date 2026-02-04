// src/components/Auth/SignUp.js
import React, { useEffect, useState } from 'react';
import authVideo from '../../assets/auth.mp4';
import { Link, useNavigate } from 'react-router-dom';
import { signUpWithEmail } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  // Validation functions
  const validateFullName = (name) => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return '';
  };

  const validateConfirmPassword = (confirmPass, password) => {
    if (!confirmPass) return 'Please confirm your password';
    if (confirmPass !== password) return 'Passwords do not match';
    return '';
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return validateFullName(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        return validateConfirmPassword(value, formData.password);
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setFieldErrors({
        ...fieldErrors,
        [name]: error
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    const error = validateField(name, value);
    setFieldErrors({
      ...fieldErrors,
      [name]: error
    });
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    // Validate all fields
    const errors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password)
    };

    setFieldErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some(error => error !== '')) {
      setError('Please fix the errors above');
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await signUpWithEmail(
        formData.email, 
        formData.password, 
        formData.fullName
      );
      
      if (error) {
        setError(error.message || 'Sign up failed. Please try again.');
        setLoading(false);
        return;
      }

      // Redirect to dashboard on successful signup (email confirmation disabled)
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign up error:', err);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-form-container">
          <div className="auth-header">
            <h2>Check Your Email!</h2>
            <p>We have sent a confirmation link to {formData.email}</p>
            <p>Please check your inbox and click the link to verify your account.</p>
            <button onClick={() => navigate('/login')} className="btn-primary">
              Go to Login
            </button>
          </div>
        </div>
        <div className="auth-visual">
          <video autoPlay loop muted className="auth-video" poster="/placeholder-video.jpg">
            <source src={authVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay">
            <h3>Account Created!</h3>
            <p>Please check your email to verify your account</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join our community of creators</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleEmailSignUp} className="auth-form" noValidate>
          <div className="form-group">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.fullName && fieldErrors.fullName ? 'error' : ''}
              required
            />
            {touched.fullName && fieldErrors.fullName && (
              <span className="field-error">{fieldErrors.fullName}</span>
            )}
          </div>
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.email && fieldErrors.email ? 'error' : ''}
              required
            />
            {touched.email && fieldErrors.email && (
              <span className="field-error">{fieldErrors.email}</span>
            )}
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.password && fieldErrors.password ? 'error' : ''}
              required
            />
            {touched.password && fieldErrors.password && (
              <span className="field-error">{fieldErrors.password}</span>
            )}
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.confirmPassword && fieldErrors.confirmPassword ? 'error' : ''}
              required
            />
            {touched.confirmPassword && fieldErrors.confirmPassword && (
              <span className="field-error">{fieldErrors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Login</Link>
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

export default SignUp;