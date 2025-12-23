// src/components/Auth/SignUp.js
import React, { useState } from 'react';
import authVideo from '../../assets/auth.mp4';
import { Link, useNavigate } from 'react-router-dom';
import { signUpWithEmail, signInWithGoogle } from '../../lib/supabase';
import './Auth.css';

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
    } catch (err) {
      setError(err.message);
    }
  };

  if (success) {
    return React.createElement(
      'div',
      { className: 'auth-container' },
      React.createElement(
        'div',
        { className: 'auth-content' },
        React.createElement('h2', null, 'Check Your Email!'),
        React.createElement(
          'p',
          null,
          'We have sent a confirmation link to ',
          formData.email
        ),
        React.createElement(
          'p',
          null,
          'Please check your inbox and click the link to verify your account.'
        ),
        React.createElement(
          'button',
          { onClick: () => navigate('/login'), className: 'btn-primary' },
          'Go to Login'
        )
      ),
      React.createElement(
        'div',
        { className: 'auth-visual' },
        React.createElement('div', { className: 'success-animation' },
          React.createElement('i', { className: 'fas fa-envelope' })
        )
      )
    );
  }

  return React.createElement(
    'div',
    { className: 'auth-container' },
    React.createElement(
      'div',
      { className: 'auth-form-container' },
      React.createElement(
        'div',
        { className: 'auth-header' },
        React.createElement('h2', null, 'Create Account'),
        React.createElement('p', null, 'Join our community of creators')
      ),
      error && React.createElement('div', { className: 'error-message' }, error),
      React.createElement(
        'form',
        { onSubmit: handleEmailSignUp, className: 'auth-form' },
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('input', {
            type: 'text',
            name: 'fullName',
            placeholder: 'Full Name',
            value: formData.fullName,
            onChange: handleChange,
            required: true
          })
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('input', {
            type: 'email',
            name: 'email',
            placeholder: 'Email Address',
            value: formData.email,
            onChange: handleChange,
            required: true
          })
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('input', {
            type: 'password',
            name: 'password',
            placeholder: 'Password (min 6 characters)',
            value: formData.password,
            onChange: handleChange,
            required: true
          })
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('input', {
            type: 'password',
            name: 'confirmPassword',
            placeholder: 'Confirm Password',
            value: formData.confirmPassword,
            onChange: handleChange,
            required: true
          })
        ),
        React.createElement(
          'button',
          { type: 'submit', className: 'btn-primary', disabled: loading },
          loading ? 'Creating Account...' : 'Sign Up'
        )
      ),
      React.createElement(
        'div',
        { className: 'divider' },
        React.createElement('span', null, 'OR')
      ),
      React.createElement(
        'button',
        { onClick: handleGoogleSignUp, className: 'btn-google' },
        React.createElement('img', {
          src: 'https://www.google.com/favicon.ico',
          alt: 'Google',
          className: 'google-icon'
        }),
        ' Sign up with Google'
      ),
      React.createElement(
        'div',
        { className: 'auth-footer' },
        React.createElement(
          'p',
          null,
          'Already have an account? ',
          React.createElement(Link, { to: '/login' }, 'Login')
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'auth-visual' },
      React.createElement(
        'video',
        { autoPlay: true, loop: true, muted: true, className: 'auth-video', poster: '/placeholder-video.jpg' },
        React.createElement('source', { src: authVideo, type: 'video/mp4' }),
        'Your browser does not support the video tag.'
      ),
      React.createElement(
        'div',
        { className: 'video-overlay' },
        React.createElement('h3', null, 'Find 3D Objects, Mockups and Illustrations'),
        React.createElement('p', null, 'Join our creative community')
      )
    )
  );
};

export default SignUp;


