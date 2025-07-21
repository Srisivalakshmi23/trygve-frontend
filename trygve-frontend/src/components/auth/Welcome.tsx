import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import '../../css/Welcome.css';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      {/* Background Logo */}
      <div className="welcome-background-logo">
        <img src="/images/logo.jpg" alt="Trygve Background Logo" />
      </div>
      
      <div className="welcome-card">
        {/* Header */}
        <div className="welcome-header">
          {/* <img src="/images/logo.png" alt="Trygve Logo" className="welcome-logo" /> */}
          <h1 className="welcome-title">
            Welcome to
          </h1>
          <h2 className="welcome-brand">
            trygve
          </h2>
          <p className="welcome-subtitle">
            "Your trusted partner for personalized healthcare, right at your doorstep."
          </p>
        </div>

        {/* Buttons */}
        <div className="welcome-buttons">
          <button
            onClick={() => navigate('/signup-flow')}
            className="welcome-signup-btn"
          >
            Sign up
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="welcome-login-btn"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
