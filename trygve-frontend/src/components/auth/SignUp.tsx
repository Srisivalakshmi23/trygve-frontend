import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Phone, User, MapPin } from 'lucide-react';
import '../../css/SignUp.css';

const Signup: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'IN',
    name: 'India',
    dialCode: '+91',
    flag: '🇮🇳',
    phoneLength: 10
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
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

  // Enforce phone number length limit whenever selectedCountry changes
  useEffect(() => {
    if (phoneInputRef.current && loginMethod === 'phone') {
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
  }, [selectedCountry.phoneLength, selectedCountry.name, loginMethod]);

  // SAFETY NET: Monitor phone state and enforce limit
  useEffect(() => {
    if (loginMethod === 'phone' && formData.phone.length > selectedCountry.phoneLength) {
      const truncated = formData.phone.substring(0, selectedCountry.phoneLength);
      setFormData(prev => ({
        ...prev,
        phone: truncated
      }));
    }
  }, [formData.phone, selectedCountry.phoneLength, loginMethod]);

  // Generate OTP automatically when phone number is complete OR email is entered
  useEffect(() => {
    // Remove automatic OTP generation - OTP will only be generated on form submission or resend
    setGeneratedOTP('');
  }, [formData.phone, formData.email, selectedCountry.phoneLength, selectedCountry.dialCode, loginMethod]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log all form details to console
    console.log('📝 SIGNUP FORM SUBMISSION');
    console.log('========================');
    console.log('👤 Full Name:', formData.name);
    console.log('📧 Email:', formData.email || 'Not provided (using phone)');
    console.log('📱 Phone:', loginMethod === 'phone' ? selectedCountry.dialCode + formData.phone : 'Not provided (using email)');
    console.log('🌍 Country:', loginMethod === 'phone' ? `${selectedCountry.flag} ${selectedCountry.name}` : 'Not selected');
    console.log('🔐 Password:', formData.password ? '••••••••' : 'Not provided');
    console.log('📲 Login Method:', loginMethod);
    console.log('🔢 Generated OTP:', generatedOTP || 'Not generated');
    console.log('========================');
    
    if (loginMethod === 'phone') {
      // For phone signup, navigate to OTP verification with the generated OTP
      if (formData.phone.length === selectedCountry.phoneLength && generatedOTP) {
        localStorage.setItem('expectedOTP', generatedOTP);
        localStorage.setItem('phoneNumber', selectedCountry.dialCode + formData.phone);
        
        // Store additional user details in localStorage for verification
        localStorage.setItem('signupUserDetails', JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: selectedCountry.dialCode + formData.phone,
          country: selectedCountry.name,
          loginMethod: loginMethod,
          timestamp: new Date().toISOString()
        }));
        
        console.log('✅ User details stored in localStorage');
        console.log('🚀 Navigating to OTP verification...');
        navigate('/otp-verification');
      } else {
        alert('Please enter a complete phone number');
      }
    } else {
      // For email signup, store details and go to OTP
      localStorage.setItem('signupUserDetails', JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: '',
        country: '',
        loginMethod: loginMethod,
        timestamp: new Date().toISOString()
      }));
      
      console.log('✅ User details stored in localStorage');
      console.log('🚀 Navigating to OTP verification...');
      navigate('/otp-verification');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Log the entered data in real-time
    console.log(`📝 ${name.toUpperCase()} ENTERED:`, value);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    const country = countries.find(c => c.code === countryCode);
    
    if (country) {
      console.log('🌍 COUNTRY SELECTED:', country.name, `(${country.dialCode})`);
      setSelectedCountry(country);
      
      // Clear phone number when country changes
      setFormData(prev => ({
        ...prev,
        phone: ''
      }));
    }
  };

  return (
    <div className="signup-container">
      {/* Background Logo */}
      <div className="signup-background-logo">
        <img src="/images/logo.jpg" alt="Trygve Background Logo" />
      </div>
      
      <div className="signup-card">
        {/* Header */}
        <div className="signup-header">
          {/* <img src="/images/logo.png" alt="Trygve Logo" className="signup-logo" /> */}
          <h1 className="signup-title">
            Create Account
          </h1>
          <p className="signup-subtitle">
            Join Trygve for better healthcare
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          {/* Name Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '1rem',
                  paddingLeft: '3rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'Poppins, sans-serif',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your full name"
                onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                required
              />
              <User style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
                width: '20px',
                height: '20px'
              }} />
            </div>
          </div>

          {/* Login Method Toggle */}
          <div style={{
            background: '#F3F4F6',
            borderRadius: '12px',
            padding: '0.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: loginMethod === 'email' ? 'white' : 'transparent',
                  color: loginMethod === 'email' ? '#2563EB' : '#666',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  boxShadow: loginMethod === 'email' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                <Mail style={{ width: '16px', height: '16px' }} />
                <span>Email</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: loginMethod === 'phone' ? 'white' : 'transparent',
                  color: loginMethod === 'phone' ? '#2563EB' : '#666',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  boxShadow: loginMethod === 'phone' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                <Phone style={{ width: '16px', height: '16px' }} />
                <span>Phone</span>
              </button>
            </div>
          </div>

          {/* Email/Phone Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem',
              fontFamily: 'Poppins, sans-serif'
            }}>
              {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            
            {loginMethod === 'email' ? (
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    paddingLeft: '3rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    fontFamily: 'Poppins, sans-serif',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your email"
                  onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  required
                />
                <Mail style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF',
                  width: '20px',
                  height: '20px'
                }} />
              </div>
            ) : (
              <div>
                {/* Country Selector */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.875rem', color: '#666', fontFamily: 'Poppins, sans-serif' }}>
                    Country
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={selectedCountry.code}
                      onChange={handleCountryChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        paddingRight: '3rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        outline: 'none',
                        fontFamily: 'Poppins, sans-serif',
                        boxSizing: 'border-box',
                        marginTop: '0.5rem',
                        backgroundColor: 'white',
                        appearance: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.name} ({country.dialCode})
                        </option>
                      ))}
                    </select>
                    <MapPin style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9CA3AF',
                      width: '20px',
                      height: '20px',
                      pointerEvents: 'none',
                      marginTop: '0.25rem'
                    }} />
                  </div>
                </div>
                
                {/* Phone Number Input with Country Code */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  border: '2px solid #E5E7EB', 
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#F9FAFB',
                    borderRight: '2px solid #E5E7EB',
                    fontSize: '1rem',
                    fontFamily: 'Poppins, sans-serif',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
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
                      
                      // Log only meaningful updates
                      if (value !== formData.phone) {
                        console.log('📱 PHONE ENTERED:', selectedCountry.dialCode + value);
                      }
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
                      
                      console.log('📱 PHONE PASTED:', selectedCountry.dialCode + truncated);
                    }}
                    placeholder={`Enter ${selectedCountry.phoneLength} digits`}
                    maxLength={selectedCountry.phoneLength}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      border: 'none',
                      outline: 'none',
                      fontSize: '1rem',
                      fontFamily: 'Poppins, sans-serif',
                      backgroundColor: 'white'
                    }}
                    required
                  />
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: formData.phone.length === selectedCountry.phoneLength ? '#059669' : '#666',
                  marginTop: '0.25rem',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  {formData.phone.length}/{selectedCountry.phoneLength} digits
                  {formData.phone.length === selectedCountry.phoneLength && ' ✓'}
                </div>
                {generatedOTP && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#059669',
                    marginTop: '0.5rem',
                    fontFamily: 'Poppins, sans-serif',
                    background: '#F0FDF4',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    border: '1px solid #BBF7D0'
                  }}>
                    📱 OTP sent! Enter your verification code
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '1rem',
                  paddingRight: '3rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'Poppins, sans-serif',
                  boxSizing: 'border-box'
                }}
                placeholder="Create a password"
                onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
              >
                {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
              </button>
            </div>
          </div>

          {/* Terms and Privacy */}
          <div style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            marginBottom: '1.5rem',
            fontFamily: 'Poppins, sans-serif'
          }}>
            By creating an account, you agree to our{' '}
            <button type="button" style={{
              background: 'none',
              border: 'none',
              color: '#2563EB',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Terms of Service
            </button>{' '}
            and{' '}
            <button type="button" style={{
              background: 'none',
              border: 'none',
              color: '#2563EB',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Privacy Policy
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              background: '#2563EB',
              color: 'white',
              fontWeight: '600',
              padding: '1rem 2rem',
              borderRadius: '30px',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
              fontFamily: 'Poppins, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1D4ED8';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#2563EB';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
            }}
          >
            Create Account
          </button>
        </form>

        {/* Sign In Link */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', fontFamily: 'Poppins, sans-serif' }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563EB',
                cursor: 'pointer',
                fontWeight: '500',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;