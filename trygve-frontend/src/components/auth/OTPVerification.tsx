import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../../css/OTPVerification.css';

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [expectedOTP, setExpectedOTP] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get the expected OTP and phone number from localStorage
    const storedOTP = localStorage.getItem('expectedOTP');
    const storedPhone = localStorage.getItem('phoneNumber');
    
    if (storedOTP) {
      setExpectedOTP(storedOTP);
      console.log('🔐 Expected OTP:', storedOTP);
      // Show existing OTP for demo purposes
      alert(`Your verification code is: ${storedOTP}\n\n(In production, this would be sent via SMS)`);
    } else {
      // Generate OTP only if it doesn't exist
      const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
      setExpectedOTP(newOTP);
      localStorage.setItem('expectedOTP', newOTP);
      console.log('🔐 NEW OTP GENERATED FOR:', storedPhone || 'Phone Number');
      console.log('🔐 YOUR NEW OTP IS:', newOTP);
      // Show OTP for demo purposes
      alert(`Your verification code is: ${newOTP}\n\n(In production, this would be sent via SMS)`);
    }
    if (storedPhone) {
      setPhoneNumber(storedPhone);
    }
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length === 6) {
      console.log('🔍 Entered OTP:', otpString);
      console.log('🔍 Expected OTP:', expectedOTP);
      
      if (otpString === expectedOTP) {
        console.log('✅ OTP VERIFIED SUCCESSFULLY!');
        // Clear stored OTP data
        localStorage.removeItem('expectedOTP');
        localStorage.removeItem('phoneNumber');
        setError('');
        navigate('/user-details');
      } else {
        console.log('❌ OTP VERIFICATION FAILED!');
        setError('Invalid OTP. Please check the console for the correct OTP.');
        // Clear the OTP inputs
        setOtp(['', '', '', '', '', '']);
        // Focus first input
        const firstInput = document.querySelector('input[name="otp-0"]') as HTMLInputElement;
        if (firstInput) firstInput.focus();
      }
    } else {
      setError('Please enter all 6 digits');
    }
  };

  const handleBackClick = () => {
    navigate('/signup-flow');
  };

  const handleResendCode = () => {
    // Generate new OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedOTP(newOTP);
    localStorage.setItem('expectedOTP', newOTP);
    
    // Clear any existing error
    setError('');
    // Clear the OTP inputs
    setOtp(['', '', '', '', '', '']);
    
    // Console log for debugging
    console.log('🔐 NEW OTP GENERATED FOR:', phoneNumber || 'Phone Number');
    console.log('🔐 YOUR NEW OTP IS:', newOTP);
    
    // Show alert with OTP for demo purposes
    alert(`Your verification code is: ${newOTP}\n\n(In production, this would be sent via SMS)`);
    
    // Focus first input after resend
    setTimeout(() => {
      const firstInput = document.querySelector('input[id="otp-0"]') as HTMLInputElement;
      if (firstInput) firstInput.focus();
    }, 100);
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
          
          {/* Success indicator when OTP is expected */}
          {expectedOTP && (
            <div className="otp-verification-success">
              <p className="otp-verification-success-text">
                🔐 OTP has been generated! Check the console for your verification code.
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
            className="otp-verification-submit-btn"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;