import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../../css/SignupFlow.css';

const SignupFlow: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'IN',
    name: 'India',
    dialCode: '+91',
    flag: '🇮🇳',
    phoneLength: 10
  });
  const navigate = useNavigate();
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Country data with phone number lengths
  const countries = [
    { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', phoneLength: 10 },
    { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', phoneLength: 10 },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', phoneLength: 10 },
    { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', phoneLength: 10 },
    { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', phoneLength: 9 },
    { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', phoneLength: 11 },
    { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', phoneLength: 9 },
    { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', phoneLength: 11 },
    { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', phoneLength: 11 },
    { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷', phoneLength: 11 },
    { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽', phoneLength: 10 },
    { code: 'AE', name: 'UAE', dialCode: '+971', flag: '🇦🇪', phoneLength: 9 },
    { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', phoneLength: 8 },
    { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', phoneLength: 9 },
    { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭', phoneLength: 9 }
  ];

  // Enforce phone number length limit and update placeholder when country changes
  useEffect(() => {
    if (phoneInputRef.current) {
      const currentValue = phoneInputRef.current.value.replace(/\D/g, '');
      if (currentValue.length > selectedCountry.phoneLength) {
        phoneInputRef.current.value = currentValue.substring(0, selectedCountry.phoneLength);
        setPhoneNumber(phoneInputRef.current.value);
      }
      phoneInputRef.current.placeholder = `Enter ${selectedCountry.phoneLength} digits`;
    }
  }, [selectedCountry.phoneLength, selectedCountry.name]);

  // Safety net: Ensure phone number doesn't exceed country-specific length
  useEffect(() => {
    if (phoneNumber.length > selectedCountry.phoneLength) {
      setPhoneNumber(phoneNumber.substring(0, selectedCountry.phoneLength));
    }
  }, [phoneNumber, selectedCountry.phoneLength]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length === selectedCountry.phoneLength) {
      // Store values in localStorage
      const formData = {
        phoneNumber: phoneNumber,
        countryCode: selectedCountry.dialCode,
        countryName: selectedCountry.name,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('signupFormData', JSON.stringify(formData));
      
      // Display in console with structured format
      console.log('Account created for:', {
        fullName: 'User Registration',
        email: 'pending@verification.com',
        location: selectedCountry.name,
        on: new Date().toLocaleString(),
        primaryPhoneNumber: selectedCountry.dialCode + phoneNumber,
        secondaryPhoneNumber: '',
        countryDetails: {
          code: selectedCountry.code,
          flag: selectedCountry.flag,
          dialCode: selectedCountry.dialCode,
          phoneLength: selectedCountry.phoneLength
        }
      });
      
      console.log('Primary Phone Number:', selectedCountry.dialCode + phoneNumber);
      console.log('Secondary Phone Number:', '');
      console.log('Location:', selectedCountry.name);
      console.log('[localStorage]:', formData);
      
      navigate('/otp-verification', { state: { phoneNumber, countryCode: selectedCountry.dialCode } });
    }
  };

  const handleBackClick = () => {
    navigate('/welcome');
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      setPhoneNumber('');
      
      // Store country selection in localStorage silently
      const countryData = {
        selectedCountry: country,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('selectedCountry', JSON.stringify(countryData));
    }
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > selectedCountry.phoneLength) {
      value = value.substring(0, selectedCountry.phoneLength);
    }
    e.target.value = value;
    setPhoneNumber(value);
    
    // Store phone number in localStorage silently
    const currentData = {
      phoneNumber: value,
      countryCode: selectedCountry.dialCode,
      countryName: selectedCountry.name,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('currentPhoneInput', JSON.stringify(currentData));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = e.key;
    if (['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(char)) {
      return;
    }
    if (phoneNumber.length >= selectedCountry.phoneLength || !/[0-9]/.test(char)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/\D/g, '');
    const truncated = pastedText.substring(0, selectedCountry.phoneLength);
    (e.target as HTMLInputElement).value = truncated;
    setPhoneNumber(truncated);
  };

  return (
    <div className="signup-flow-container">
      {/* Background Logo */}
      <div className="signup-flow-background-logo">
        <img src="/images/logo.png" alt="Trygve Background Logo" />
      </div>
      <div className="signup-flow-card">
        {/* Header */}
        <div className="signup-flow-header">
          <button
            onClick={handleBackClick}
            className="signup-flow-back-btn"
          >
            <ArrowLeft size={20} color="#2563EB" />
          </button>
          
          {/* <img src="/images/logo.png" alt="Trygve Logo" className="signup-flow-logo" /> */}
          
          <h1 className="signup-flow-title">
            Can you input your number?
          </h1>
          
          <p className="signup-flow-subtitle">
            You will be sent a code on this number to verify if you are the owner of the number.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="signup-flow-form">
          {/* Country Selector */}
          <div className="signup-flow-form-group">
            <label htmlFor="country-select" className="signup-flow-form-label">
              Country
            </label>
            <div className="signup-flow-country-select-container">
              <select
                id="country-select"
                name="country"
                value={selectedCountry.code}
                onChange={handleCountryChange}
                className="signup-flow-country-select"
                autoComplete="country"
                aria-label="Select your country"
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name} ({country.dialCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone Input */}
          <label htmlFor="phone-number" className="signup-flow-form-label">
            Phone Number
          </label>
          <div className="signup-flow-phone-container">
            <div className="signup-flow-country-prefix">
              <span className="signup-flow-country-flag">{selectedCountry.flag}</span>
              <span className="signup-flow-country-code">{selectedCountry.dialCode}</span>
            </div>
            <input
              id="phone-number"
              name="phoneNumber"
              ref={phoneInputRef}
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneInput}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={`Enter ${selectedCountry.phoneLength} digits`}
              maxLength={selectedCountry.phoneLength}
              className="signup-flow-phone-input"
              autoComplete="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              aria-label={`Phone number for ${selectedCountry.name}`}
              required
            />
          </div>

          {/* Digit Counter */}
          <div className={`signup-flow-phone-counter ${phoneNumber.length === selectedCountry.phoneLength ? 'complete' : ''}`}>
            {phoneNumber.length}/{selectedCountry.phoneLength} digits
            {phoneNumber.length === selectedCountry.phoneLength && ' ✓'}
          </div>

          <button
            type="submit"
            disabled={phoneNumber.length !== selectedCountry.phoneLength}
            className="signup-flow-submit-btn"
            style={{
              background: phoneNumber.length === selectedCountry.phoneLength ? '#2563EB' : '#9CA3AF',
              cursor: phoneNumber.length === selectedCountry.phoneLength ? 'pointer' : 'not-allowed'
            }}
            onMouseEnter={(e) => {
              if (phoneNumber.length === selectedCountry.phoneLength) {
                e.currentTarget.style.background = '#1D4ED8';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (phoneNumber.length === selectedCountry.phoneLength) {
                e.currentTarget.style.background = '#2563EB';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            Send Code
          </button>
        </form>

        <div className="signup-flow-footer">
          <p className="signup-flow-footer-text">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="signup-flow-login-link"
            >
              log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupFlow;