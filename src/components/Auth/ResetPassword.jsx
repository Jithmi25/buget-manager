// src/components/Auth/ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Backend disabled for UI-only preview
import authVideo from '../../assets/auth.mp4';
import './Auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

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

    setLoading(true);
    // UI-only: skip backend update
    setTimeout(() => {
      alert('Password updated successfully!');
      setLoading(false);
      navigate('/login');
    }, 500);
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter your new password</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}

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
            />
            {touched.confirmPassword && fieldErrors.confirmPassword && (
              <span className="field-error">{fieldErrors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
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
