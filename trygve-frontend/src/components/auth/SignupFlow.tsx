import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { setupRecaptcha, sendPhoneOTP, verifyPhoneOTP } from '../Firebase/Auth';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import '../../css/SignupFlow.css';

const SignupFlow: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'verification'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
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

  // Initialize reCAPTCHA when component mounts
  useEffect(() => {
    try {
      const verifier = setupRecaptcha('recaptcha-container');
      setRecaptchaVerifier(verifier);
      console.log('✅ reCAPTCHA initialized');
    } catch (error) {
      console.error('❌ Failed to initialize reCAPTCHA:', error);
      setError('Failed to initialize verification system');
    }

    // Cleanup on unmount
    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (phoneNumber.length !== selectedCountry.phoneLength) {
      setError('Please enter a complete phone number');
      return;
    }

    if (!recaptchaVerifier) {
      setError('Verification system not ready. Please refresh the page.');
      return;
    }

    setLoading(true);

    try {
      const fullPhoneNumber = selectedCountry.dialCode + phoneNumber;
      console.log('📱 Sending OTP to:', fullPhoneNumber);

      // Send OTP using Firebase
      const confirmationResult = await sendPhoneOTP(fullPhoneNumber, recaptchaVerifier);
      
      // Store verification data for OTP verification page
      const formData = {
        phoneNumber: phoneNumber,
        countryCode: selectedCountry.dialCode,
        countryName: selectedCountry.name,
        fullPhoneNumber: fullPhoneNumber,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('signupFormData', JSON.stringify(formData));
      localStorage.setItem('phoneVerificationId', confirmationResult.verificationId || '');
      
      console.log('✅ OTP sent successfully to:', fullPhoneNumber);
      console.log('📝 Verification data stored in localStorage');
      
      // Store the confirmation result and move to verification step
      setConfirmationResult(confirmationResult);
      setStep('verification');

    } catch (error: any) {
      console.error('❌ Failed to send OTP:', error.message);
      setError(error.message || 'Failed to send verification code. Please try again.');
      
      // Reset reCAPTCHA on error
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        try {
          const newVerifier = setupRecaptcha('recaptcha-container');
          setRecaptchaVerifier(newVerifier);
        } catch (setupError) {
          console.error('❌ Failed to reset reCAPTCHA:', setupError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    const enteredOTP = otp.join('');
    
    if (enteredOTP.length !== 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }

    if (!confirmationResult) {
      setError('Verification session expired. Please request a new code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔍 Verifying OTP:', enteredOTP);
      
      // Verify OTP using Firebase
      const user = await verifyPhoneOTP(confirmationResult, enteredOTP);
      
      console.log('✅ PHONE VERIFICATION SUCCESSFUL! User:', user.uid);
      console.log('📱 Phone verified:', user.phoneNumber);
      
      // Navigate to user details collection
      navigate('/user-details');

    } catch (error: any) {
      console.error('❌ OTP VERIFICATION FAILED:', error.message);
      setError('Invalid verification code. Please try again.');
      // Clear the OTP inputs
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOtp(newOTP);
      
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
      const currentValue = otp[index];
      
      // If current field has a value, clear it first
      if (currentValue !== '') {
        const newOTP = [...otp];
        newOTP[index] = '';
        setOtp(newOTP);
      }
      // If current field is empty and we're not at the first field, move to previous field
      else if (currentValue === '' && index > 0) {
        // Move focus to previous field
        const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
          // Clear the previous field as well
          const newOTP = [...otp];
          newOTP[index - 1] = '';
          setOtp(newOTP);
        }
      }
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

  // Render OTP Verification Step
  if (step === 'verification') {
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
              onClick={() => setStep('phone')}
              className="signup-flow-back-btn"
            >
              <ArrowLeft size={20} color="#2563EB" />
            </button>
            
            <h1 className="signup-flow-title">
              Verification Code
            </h1>
            
            <p className="signup-flow-subtitle">
              We have sent the verification code to {selectedCountry.dialCode} {phoneNumber}
            </p>
            
            {/* Error Message */}
            {error && (
              <div className="signup-flow-error">
                <p className="signup-flow-error-text">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* OTP Input */}
          <div className="signup-flow-otp-container">
            <div className="signup-flow-otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  className="signup-flow-otp-input"
                />
              ))}
            </div>

            <button
              onClick={handleOTPVerification}
              disabled={loading || otp.join('').length !== 6}
              className="signup-flow-submit-btn"
              style={{
                opacity: (loading || otp.join('').length !== 6) ? 0.6 : 1,
                cursor: (loading || otp.join('').length !== 6) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>

          {/* Footer */}
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
  }

  // Render Phone Input Step
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
          
          {/* Error Message */}
          {error && (
            <div className="signup-flow-error">
              <p className="signup-flow-error-text">
                {error}
              </p>
            </div>
          )}
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
            disabled={phoneNumber.length !== selectedCountry.phoneLength || loading}
            className="signup-flow-submit-btn"
            style={{
              background: (phoneNumber.length === selectedCountry.phoneLength && !loading) ? '#2563EB' : '#9CA3AF',
              cursor: (phoneNumber.length === selectedCountry.phoneLength && !loading) ? 'pointer' : 'not-allowed'
            }}
            onMouseEnter={(e) => {
              if (phoneNumber.length === selectedCountry.phoneLength && !loading) {
                e.currentTarget.style.background = '#1D4ED8';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (phoneNumber.length === selectedCountry.phoneLength && !loading) {
                e.currentTarget.style.background = '#2563EB';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>

        {/* reCAPTCHA Container - Hidden */}
        <div id="recaptcha-container" style={{ display: 'none' }}></div>

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