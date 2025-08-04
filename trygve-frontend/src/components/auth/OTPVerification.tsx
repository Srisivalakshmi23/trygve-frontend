import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { verifyPhoneOTP } from '../Firebase/Auth';
import { ConfirmationResult } from 'firebase/auth';
import '../../css/OTPVerification.css';

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get phone number from navigation state or localStorage
    const state = location.state as { phoneNumber?: string; countryCode?: string } | null;
    
    if (state?.phoneNumber) {
      setPhoneNumber(state.phoneNumber);
      console.log('� Phone number from navigation:', state.phoneNumber);
    } else {
      // Fallback to localStorage if navigation state is not available
      const storedPhone = localStorage.getItem('phoneNumber');
      if (storedPhone) {
        setPhoneNumber(storedPhone);
        console.log('� Phone number from localStorage:', storedPhone);
      } else {
        // No phone number available, redirect to signup
        console.warn('⚠️ No phone number found, redirecting to signup');
        navigate('/signup-flow');
        return;
      }
    }

    // Note: Firebase confirmationResult cannot be passed through navigation state
    // It should be handled in the same component where OTP is sent
    // For now, we'll redirect back to signup if no confirmation result is available
    console.log('ℹ️ OTP Verification component loaded');
    console.log('ℹ️ User should have received SMS with verification code');
  }, [location.state, navigate]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to move to previous field
    if (e.key === 'Backspace') {
      const currentValue = otp[index];
      
      // If current field has a value, clear it first
      if (currentValue !== '') {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
      // If current field is empty and we're not at the first field, move to previous field
      else if (currentValue === '' && index > 0) {
        // Move focus to previous field
        const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
          // Clear the previous field as well
          const newOtp = [...otp];
          newOtp[index - 1] = '';
          setOtp(newOtp);
        }
      }
    }
    // Handle Delete key
    else if (e.key === 'Delete') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
    // Handle arrow keys for navigation
    else if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
    else if (e.key === 'ArrowRight' && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (!confirmationResult) {
      setError('Verification session expired. Please go back and request a new code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔍 Verifying OTP:', otpString);
      
      // Verify OTP using Firebase
      const user = await verifyPhoneOTP(confirmationResult, otpString);
      
      console.log('✅ PHONE VERIFICATION SUCCESSFUL! User:', user.uid);
      console.log('📱 Phone verified:', user.phoneNumber);
      
      // Clear stored data
      localStorage.removeItem('expectedOTP');
      localStorage.removeItem('phoneNumber');
      
      // Navigate to welcome page after successful verification
      navigate('/welcome');

    } catch (error: any) {
      console.error('❌ OTP VERIFICATION FAILED:', error.message);
      setError('Invalid verification code. Please try again.');
      
      // Clear the OTP inputs
      setOtp(['', '', '', '', '', '']);
      
      // Focus first input
      const firstInput = document.querySelector('input[name="otp-0"]') as HTMLInputElement;
      if (firstInput) firstInput.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/signup-flow');
  };

  const handleResendCode = () => {
    // For now, redirect back to signup flow to resend code
    // In a full implementation, you'd want to call sendPhoneOTP again
    console.log('� Redirecting to signup flow to resend code');
    navigate('/signup-flow');
  };

  return (
    <div className="otp-verification-container">
      {/* Background Logo */}
      <div className="otp-verification-background-logo">
        <img src="/images/logo.jpg" alt="Trygve Background Logo" />
      </div>
      
      <div className="otp-verification-card">
        {/* Header */}
        <div className="otp-verification-header">
          <button
            onClick={handleBackClick}
            className="otp-verification-back-btn"
          >
            <ArrowLeft size={20} color="#2563EB" />
          </button>
          
          {/* <img src="/images/logo.png" alt="Trygve Logo" className="otp-verification-logo" /> */}
          
          <h1 className="otp-verification-title">
            OTP Verification
          </h1>
          
          <p className="otp-verification-subtitle">
            Enter the verification code we just sent to your number {phoneNumber || '+91 7******55'}.
          </p>
          
          {/* Error Message */}
          {error && (
            <div className="otp-verification-error">
              <p className="otp-verification-error-text">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="otp-verification-form">
          <label htmlFor="otp-inputs" className="otp-verification-label">
            Enter 6-digit verification code
          </label>
          <div className="otp-verification-inputs" id="otp-inputs" role="group" aria-label="6-digit verification code">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                name={`otp-${index}`}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="otp-verification-input"
                maxLength={1}
                autoComplete="one-time-code"
                aria-label={`Digit ${index + 1} of verification code`}
                inputMode="numeric"
                pattern="[0-9]"
              />
            ))}
          </div>

          <div className="otp-verification-resend-container">
            <p className="otp-verification-resend-text">
              Didn't receive code?{' '}
              <button
                type="button"
                onClick={handleResendCode}
                className="otp-verification-resend-btn"
              >
                Resend
              </button>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="otp-verification-submit-btn"
            style={{
              opacity: (loading || otp.join('').length !== 6) ? 0.6 : 1,
              cursor: (loading || otp.join('').length !== 6) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;