import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Login.css';

const Login: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'otp' | 'verification' | 'complete'>('welcome');
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'IN',
    name: 'India',
    dialCode: '+91',
    flag: '🇮🇳',
    phoneLength: 10
  });
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    otp: ['', '', '', '', '', '']
  });
  const [generatedOTP, setGeneratedOTP] = useState<string>('');
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

  // Load signup data from localStorage when component mounts
  useEffect(() => {
    const signupData = localStorage.getItem('signupFormData');
    const userDetailsData = localStorage.getItem('userDetailsData');
    
    console.log('🔄 Loading data on component mount:');
    console.log('🔄 signupFormData:', signupData);
    console.log('🔄 userDetailsData:', userDetailsData);
    
    if (signupData) {
      const parsedData = JSON.parse(signupData);
      console.log('🔄 Parsed signupData:', parsedData);
      setFormData(prev => ({
        ...prev,
        phone: parsedData.phoneNumber || '',
      }));
      
      // Set country based on signup data
      if (parsedData.countryCode) {
        const country = countries.find(c => c.dialCode === parsedData.countryCode);
        if (country) {
          setSelectedCountry(country);
        }
      }
    }

    // Load email from user details if available
    if (userDetailsData) {
      const parsedUserDetails = JSON.parse(userDetailsData);
      console.log('🔄 Parsed userDetailsData:', parsedUserDetails);
      setFormData(prev => ({
        ...prev,
        email: parsedUserDetails.email || '',
      }));
    }
  }, []);

  // Enforce phone number length limit whenever selectedCountry changes
  useEffect(() => {
    if (phoneInputRef.current) {
      const currentValue = phoneInputRef.current.value.replace(/\D/g, '');
      if (currentValue.length > selectedCountry.phoneLength) {
        const truncated = currentValue.substring(0, selectedCountry.phoneLength);
        phoneInputRef.current.value = truncated;
        setFormData(prev => ({
          ...prev,
          phone: truncated
        }));
      }
      
      // Update placeholder
      phoneInputRef.current.placeholder = `Enter ${selectedCountry.phoneLength} digits`;
    }
  }, [selectedCountry.phoneLength, selectedCountry.name]);

  // SAFETY NET: Monitor phone state and enforce limit
  useEffect(() => {
    if (formData.phone.length > selectedCountry.phoneLength) {
      const truncated = formData.phone.substring(0, selectedCountry.phoneLength);
      setFormData(prev => ({
        ...prev,
        phone: truncated
      }));
    }
  }, [formData.phone, selectedCountry.phoneLength]);

  const checkEmailExists = (email: string): boolean => {
    // Check if user has completed signup process
    const userDetailsData = localStorage.getItem('userDetailsData');
    const signupData = localStorage.getItem('signupFormData');
    
    console.log('🔍 Checking email existence for:', email);
    console.log('🔍 userDetailsData:', userDetailsData);
    console.log('🔍 signupData:', signupData);
    
    // First check userDetailsData (from UserDetails component)
    if (userDetailsData) {
      try {
        const parsedUserDetails = JSON.parse(userDetailsData);
        console.log('🔍 Parsed userDetailsData:', parsedUserDetails);
        if (parsedUserDetails.email === email) {
          console.log('✅ Email found in userDetailsData');
          return true;
        }
      } catch (error) {
        console.log('❌ Error parsing userDetailsData:', error);
      }
    }
    
    // Also check signupData (from SignupFlow component) as fallback
    if (signupData) {
      try {
        const parsedSignupData = JSON.parse(signupData);
        console.log('🔍 Parsed signupData:', parsedSignupData);
        // Some users might have completed signup but not user details yet
        // In this case, we'll allow them to login if they have the signup data
        if (parsedSignupData.phoneNumber || parsedSignupData.countryCode) {
          console.log('✅ User has signup data, allowing login');
          return true;
        }
      } catch (error) {
        console.log('❌ Error parsing signupData:', error);
      }
    }
    
    console.log('❌ Email not found in any stored data');
    return false;
  };

  const handleOTPSubmit = () => {
    if (formData.phone.length === selectedCountry.phoneLength && formData.email) {
      // Check if email exists in signup data
      if (!checkEmailExists(formData.email)) {
        alert('Account not found. This email is not registered. Please sign up first.');
        return;
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(otp);
      
      console.log('🔐 OTP GENERATED FOR LOGIN:');
      console.log('🔐 Email:', formData.email);
      console.log('🔐 Phone:', selectedCountry.dialCode + formData.phone);
      console.log('🔐 YOUR OTP IS:', otp);
      console.log('🔐 Please enter this OTP to continue');
      
      // Store OTP for verification step
      localStorage.setItem('loginOTP', otp);
      localStorage.setItem('loginPhone', selectedCountry.dialCode + formData.phone);
      localStorage.setItem('loginEmail', formData.email);
      
      setStep('verification');
    } else {
      alert('Please enter both email and complete phone number');
    }
  };

  const handleVerificationSubmit = () => {
    const enteredOTP = formData.otp.join('');
    const expectedOTP = localStorage.getItem('loginOTP');
    
    console.log('🔍 Entered OTP:', enteredOTP);
    console.log('🔍 Expected OTP:', expectedOTP);
    
    if (enteredOTP === expectedOTP) {
      console.log('✅ LOGIN OTP VERIFIED SUCCESSFULLY!');
      // Clear stored OTP data
      localStorage.removeItem('loginOTP');
      localStorage.removeItem('loginPhone');
      localStorage.removeItem('loginEmail');
      setStep('complete');
    } else {
      console.log('❌ LOGIN OTP VERIFICATION FAILED!');
      alert('Invalid OTP. Please check the console for the correct OTP.');
      // Clear the OTP inputs
      setFormData(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }));
    }
  };

  const handleFinalContinue = () => {
    navigate('/dashboard');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    const country = countries.find(c => c.code === countryCode);
    
    if (country) {
      setSelectedCountry(country);
      
      // Clear phone number when country changes
      setFormData(prev => ({
        ...prev,
        phone: ''
      }));
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOTP = [...formData.otp];
      newOTP[index] = value;
      setFormData({ ...formData, otp: newOTP });
      
      // Auto-focus next input when typing
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to move to previous field
    if (e.key === 'Backspace') {
      const currentValue = formData.otp[index];
      
      // If current field has a value, clear it first
      if (currentValue !== '') {
        const newOTP = [...formData.otp];
        newOTP[index] = '';
        setFormData({ ...formData, otp: newOTP });
      }
      // If current field is empty and we're not at the first field, move to previous field
      else if (currentValue === '' && index > 0) {
        // Move focus to previous field
        const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
          // Clear the previous field as well
          const newOTP = [...formData.otp];
          newOTP[index - 1] = '';
          setFormData({ ...formData, otp: newOTP });
        }
      }
    }
    // Handle Delete key
    else if (e.key === 'Delete') {
      const newOTP = [...formData.otp];
      newOTP[index] = '';
      setFormData({ ...formData, otp: newOTP });
    }
    // Handle arrow keys for navigation
    else if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
    else if (e.key === 'ArrowRight' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  // Welcome Screen (matches image 2, first screen)
  if (step === 'welcome') {
    return (
      <div className="login-container">
        {/* Background Logo */}
        <div className="login-background-logo">
          <img src="/images/logo.jpg" alt="Trygve Background Logo" />
        </div>
        
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            {/* <img src="/images/logo.png" alt="Trygve Logo" className="login-logo" /> */}
            <h1 className="login-welcome-title">
              Welcome to
            </h1>
            <h1 className="login-brand-title">
              trygve
            </h1>
            <p className="login-subtitle">
              Your trusted partner for personalized healthcare right at your doorstep
            </p>
          </div>

          {/* Buttons */}
          <div className="login-buttons">
            <button
              onClick={() => navigate('/signup-flow')}
              className="login-signup-btn"
            >
              Sign up
            </button>
            
            <button
              onClick={() => setStep('otp')}
              className="login-signin-btn"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // OTP Verification Screen (matches image 2, second screen)
  if (step === 'otp') {
    return (
      <div className="login-otp-container">
        <div className="login-otp-card">
          {/* Back Button */}
          <button
            onClick={() => setStep('welcome')}
            className="login-back-btn"
          >
            ←
          </button>

          {/* Illustration */}
          <div className="login-illustration-container">
            <div className="login-illustration-circle">
              <div className="login-illustration-icon">
                <span>✓</span>
              </div>
            </div>
            
            <h2 className="login-otp-title">
              OTP Verification
            </h2>
            
            <p className="login-otp-subtitle">
              Enter email and phone number to send one time password.
            </p>
          </div>

          {/* Form */}
          <div className="login-form">
            <div className="login-form-group">
              <label className="login-form-label">
                Email id
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="login-form-input"
              />
            </div>
            
            {/* Country Selector */}
            <div className="login-form-group">
              <label className="login-form-label">
                Country
              </label>
              <select
                value={selectedCountry.code}
                onChange={handleCountryChange}
                className="login-country-select"
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name} ({country.dialCode})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Phone Number Input */}
            <div style={{ marginBottom: '2rem' }}>
              <label className="login-form-label">
                Phone Number
              </label>
              <div className="login-phone-container">
                <div className="login-phone-prefix">
                  <span>{selectedCountry.flag}</span>
                  <span>{selectedCountry.dialCode}</span>
                </div>
                <input
                  ref={phoneInputRef}
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    let value = target.value;
                    
                    // Remove non-digits immediately
                    value = value.replace(/\D/g, '');
                    
                    // Truncate to exact limit
                    if (value.length > selectedCountry.phoneLength) {
                      value = value.substring(0, selectedCountry.phoneLength);
                    }
                    
                    // Force update the input value directly
                    target.value = value;
                    
                    // Update state
                    setFormData(prev => ({ 
                      ...prev, 
                      phone: value 
                    }));
                  }}
                  onKeyDown={(e) => {
                    const char = e.key;
                    const currentValue = formData.phone;
                    
                    // Allow control keys
                    if (['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(char)) {
                      return;
                    }
                    
                    // Block if at limit
                    if (currentValue.length >= selectedCountry.phoneLength) {
                      e.preventDefault();
                      return;
                    }
                    
                    // Block non-numbers
                    if (!/[0-9]/.test(char)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text');
                    
                    const numericOnly = pastedText.replace(/\D/g, '');
                    const truncated = numericOnly.substring(0, selectedCountry.phoneLength);
                    
                    // Force update the input value directly
                    const target = e.target as HTMLInputElement;
                    target.value = truncated;
                    
                    setFormData(prev => ({
                      ...prev,
                      phone: truncated
                    }));
                  }}
                  placeholder={`Enter ${selectedCountry.phoneLength} digits`}
                  maxLength={selectedCountry.phoneLength}
                  className="login-phone-input"
                />
              </div>
              <div className={`login-phone-counter ${formData.phone.length === selectedCountry.phoneLength ? 'complete' : ''}`}>
                {formData.phone.length}/{selectedCountry.phoneLength} digits
                {formData.phone.length === selectedCountry.phoneLength && ' ✓'}
              </div>
            </div>
          </div>

          <button
            onClick={handleOTPSubmit}
            disabled={formData.phone.length !== selectedCountry.phoneLength || !formData.email}
            className="login-send-btn"
            style={{
              background: (formData.phone.length === selectedCountry.phoneLength && formData.email) ? '#2563EB' : '#9CA3AF',
              cursor: (formData.phone.length === selectedCountry.phoneLength && formData.email) ? 'pointer' : 'not-allowed'
            }}
          >
            Send Code
          </button>
        </div>
      </div>
    );
  }

  // Verification Code Screen (matches image 2, third screen)
  if (step === 'verification') {
    return (
      <div className="login-verification-container">
        <div className="login-verification-card">
          {/* Back Button */}
          <button
            onClick={() => setStep('otp')}
            className="login-verification-back-btn"
          >
            ←
          </button>

          <h2 className="login-verification-title">
            Verification Code
          </h2>
          
          <p className="login-verification-subtitle">
            We have sent the verification code to your email address.
          </p>

          {/* OTP Input */}
          <div className="login-otp-inputs">
            {formData.otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleOTPKeyDown(index, e)}
                className="login-otp-input"
              />
            ))}
          </div>

          <button
            onClick={handleVerificationSubmit}
            className="login-continue-btn"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Welcome Back Screen (matches image 2, fourth screen)
  if (step === 'complete') {
    return (
      <div className="login-complete-container">
        <div className="login-complete-card">
          {/* Success Icon */}
          <div className="login-success-icon-container">
            <div className="login-success-icon">
              <span>✓</span>
            </div>
          </div>

          <h2 className="login-complete-title">
            Welcome Back to TRYGVE!
          </h2>
          
          <p className="login-complete-subtitle">
            Your trusted guardian of life is ready to serve you!
          </p>

          <button
            onClick={handleFinalContinue}
            className="login-final-continue-btn"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Login;