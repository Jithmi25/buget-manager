// src/components/Home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge animate-fade-in-up">
            <span>✨ Welcome to Budget Manager</span>
          </div>
          
          <h1 className="hero-title animate-fade-in-up delay-1">
            Manage Your Finances
            <span className="gradient-text"> Effortlessly</span>
          </h1>
          
          <p className="hero-description animate-fade-in-up delay-2">
            Take control of your money with our powerful budgeting tools. 
            Track expenses, set goals, and achieve financial freedom.
          </p>
          
          <div className="hero-buttons animate-fade-in-up delay-3">
            <Link to="/login" className="btn-hero btn-primary-hero">
              Get Started
              <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/signup" className="btn-hero btn-secondary-hero">
              Create Account
            </Link>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="floating-card card-1 animate-float">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <div className="card-title">Total Balance</div>
              <div className="card-value">$12,450.00</div>
            </div>
          </div>
          
          <div className="floating-card card-2 animate-float delay-1">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <div className="card-title">Monthly Spending</div>
              <div className="card-value">$3,250.00</div>
            </div>
          </div>
          
          <div className="floating-card card-3 animate-float delay-2">
            <div className="card-icon">🎯</div>
            <div className="card-content">
              <div className="card-title">Savings Goal</div>
              <div className="card-value">75% Complete</div>
            </div>
          </div>
          
          <div className="background-shapes">
            <div className="shape shape-1 animate-pulse"></div>
            <div className="shape shape-2 animate-pulse delay-1"></div>
            <div className="shape shape-3 animate-pulse delay-2"></div>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature-card animate-slide-in-left">
          <div className="feature-icon">📈</div>
          <h3>Track Expenses</h3>
          <p>Monitor your spending habits with detailed analytics and insights</p>
        </div>
        
        <div className="feature-card animate-slide-in-left delay-1">
          <div className="feature-icon">💳</div>
          <h3>Smart Budgeting</h3>
          <p>Set budgets and get alerts when you're close to your limits</p>
        </div>
        
        <div className="feature-card animate-slide-in-left delay-2">
          <div className="feature-icon">🔒</div>
          <h3>Secure & Private</h3>
          <p>Your financial data is encrypted and protected at all times</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
