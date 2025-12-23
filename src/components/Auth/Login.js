// src/components/Auth/Login.js
import React, { useState } from 'react';
import authVideo from '../../assets/auth.mp4';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmail, signInWithGoogle } from '../../lib/supabase';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await signInWithEmail(
        formData.email,
        formData.password
      );

      if (error) throw error;

      if (data?.user) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  return React.createElement(
    'div',
    { className: 'auth-container' },
    React.createElement(
      'div',
      { className: 'auth-form-container' },
      React.createElement(
        'div',
        { className: 'auth-header' },
        React.createElement('h2', null, 'Welcome Back'),
        React.createElement('p', null, 'Sign in to your account')
      ),
      error && React.createElement('div', { className: 'error-message' }, error),
      React.createElement(
        'form',
        { onSubmit: handleEmailLogin, className: 'auth-form' },
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
            placeholder: 'Password',
            value: formData.password,
            onChange: handleChange,
            required: true
          })
        ),
        React.createElement(
          'div',
          { className: 'form-options' },
          React.createElement(
            'label',
            { className: 'checkbox-container' },
            React.createElement('input', { type: 'checkbox' }),
            React.createElement('span', null, 'Remember me')
          ),
          React.createElement(Link, { to: '/forgot-password', className: 'forgot-link' }, 'Forgot password?')
        ),
        React.createElement(
          'button',
          { type: 'submit', className: 'btn-primary', disabled: loading },
          loading ? 'Signing in...' : 'Sign In'
        )
      ),
      React.createElement(
        'div',
        { className: 'divider' },
        React.createElement('span', null, 'OR')
      ),
      React.createElement(
        'button',
        { onClick: handleGoogleLogin, className: 'btn-google' },
        React.createElement('img', {
          src: 'https://www.google.com/favicon.ico',
          alt: 'Google',
          className: 'google-icon'
        }),
        ' Sign in with Google'
      ),
      React.createElement(
        'div',
        { className: 'auth-footer' },
        React.createElement(
          'p',
          null,
          "Don't have an account? ",
          React.createElement(Link, { to: '/signup' }, 'Sign up')
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'auth-visual' },
      React.createElement(
        'video',
        {
          autoPlay: true,
          loop: true,
          muted: true,
          className: 'auth-video',
          poster: '/placeholder-video.jpg'
        },
        React.createElement('source', { src: authVideo, type: 'video/mp4' }),
        'Your browser does not support the video tag.'
      ),
      React.createElement(
        'div',
        { className: 'video-overlay' },
        React.createElement('h3', null, 'Access Thousands of Assets'),
        React.createElement('p', null, '3D models, illustrations, and mockups for your projects')
      )
    )
  );
};

export default Login;