import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import '../../css/SignupSuccess.css';

const SignupSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/welcome');
  };

  return (
    <div className="signup-success-container">
      {/* Background Logo */}
      <div className="signup-success-background-logo">
        <img src="/images/logo.jpg" alt="Trygve Background Logo" />
      </div>
      
      <div className="signup-success-card">
        {/* Success Icon */}
        <div className="signup-success-content">
          <div className="signup-success-icon">
            <Check size={32} color="white" strokeWidth={3} />
          </div>
          
          {/* <img src="/images/logo.png" alt="Trygve Logo" className="signup-success-logo" /> */}
          
          <h1 className="signup-success-title">
            You're Now with Your Trusted Guardian of Life!
          </h1>
          
          <p className="signup-success-subtitle">
            Welcome to the TRYGVE family! Your journey to better health starts here.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={handleBackToLogin}
          className="signup-success-btn"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default SignupSuccess;
