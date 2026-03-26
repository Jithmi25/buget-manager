// src/components/Auth/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import authVideo from '../../assets/auth.mp4';
import './Auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sessionValid, setSessionValid] = useState(false);
  const navigate = useNavigate();

  // Check if user has a valid password reset session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        setError('Invalid or expired reset link. Please request a new password reset.');
        setSessionValid(false);
        return;
      }
      
      setSessionValid(true);
    };

    checkSession();
  }, []);

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return '';
  };

  const validateConfirmPassword = (confirmPass, pass) => {
    if (!confirmPass) return 'Please confirm your password';
    if (confirmPass !== pass) return 'Passwords do not match';
    return '';
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (touched.password) {
      setFieldErrors({
        ...fieldErrors,
        password: validatePassword(value)
      });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (touched.confirmPassword) {
      setFieldErrors({
        ...fieldErrors,
        confirmPassword: validateConfirmPassword(value, password)
      });
    }
  };

  const handleBlur = (field) => {
    setTouched({
      ...touched,
      [field]: true
    });

    if (field === 'password') {
      setFieldErrors({
        ...fieldErrors,
        password: validatePassword(password)
      });
    } else if (field === 'confirmPassword') {
      setFieldErrors({
        ...fieldErrors,
        confirmPassword: validateConfirmPassword(confirmPassword, password)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched
    setTouched({
      password: true,
      confirmPassword: true
    });

    // Validate all fields
    const errors = {
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password)
    };

    setFieldErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some(error => error !== '')) {
      setError('Please fix the errors above');
      return;
    }

    if (!sessionValid) {
      setError('Your session has expired. Please request a new password reset.');
      return;
    }

    setLoading(true);

    try {
      // Update password using Supabase
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message || 'Failed to update password. Please try again.');
        setLoading(false);
        return;
      }

      // Success - redirect to login
      alert('Password updated successfully!');
      await supabase.auth.signOut();
      navigate('/login');
    } catch (err) {
      setError('An error occurred while updating your password. Please try again.');
      console.error('Password update error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter your new password</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}

        {sessionValid ? (
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur('password')}
                className={touched.password && fieldErrors.password ? 'error' : ''}
                required
                disabled={loading}
              />
              {touched.password && fieldErrors.password && (
                <span className="field-error">{fieldErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={() => handleBlur('confirmPassword')}
                className={touched.confirmPassword && fieldErrors.confirmPassword ? 'error' : ''}
                required
                disabled={loading}
              />
              {touched.confirmPassword && fieldErrors.confirmPassword && (
                <span className="field-error">{fieldErrors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        ) : (
          <div className="error-message">
            <p>Unable to process your password reset. The link may have expired or is invalid.</p>
          </div>
        )}
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

export default ResetPassword;
