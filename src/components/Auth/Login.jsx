// src/components/Auth/Login.js
import React, { useState } from 'react';
import authVideo from '../../assets/auth.mp4';
import { Link, useNavigate } from 'react-router-dom';
// Backend disabled for UI-only preview
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
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

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true
    });

    // Validate all fields
    const errors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password)
    };

    setFieldErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some(error => error !== '')) {
      setError('Please fix the errors above');
      return;
    }

    setLoading(true);

    // UI-only: skip backend auth and go to dashboard
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 500);
  };

  const handleGoogleLogin = async () => {
    // UI-only: skip backend OAuth and go to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleEmailLogin} className="auth-form" noValidate>
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
              placeholder="Password"
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

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button onClick={handleGoogleLogin} className="btn-google">
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google"
            className="google-icon"
          />
          Sign in with Google
        </button>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/signup">Sign up</Link>
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

export default Login;