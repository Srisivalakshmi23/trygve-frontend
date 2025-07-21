import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import '../../css/UserDetails.css';

const UserDetails: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    emergencyContact: ''
  });
  const [selectedEmergencyCountry, setSelectedEmergencyCountry] = useState({
    code: 'IN',
    name: 'India',
    dialCode: '+91',
    flag: '🇮🇳',
    phoneLength: 10
  });
  const navigate = useNavigate();
  const emergencyPhoneInputRef = useRef<HTMLInputElement>(null);

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
    if (signupData) {
      const parsedData = JSON.parse(signupData);
      console.log('📱 Loading signup data into UserDetails:', parsedData);
      
      // Format phone number with country code
      const fullPhoneNumber = parsedData.countryCode && parsedData.phoneNumber 
        ? `${parsedData.countryCode} ${parsedData.phoneNumber}`
        : parsedData.phoneNumber || '';
      
      setFormData(prev => ({
        ...prev,
        phoneNumber: fullPhoneNumber
      }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmergencyCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    const country = countries.find(c => c.code === countryCode);
    
    if (country) {
      setSelectedEmergencyCountry(country);
      
      // Clear emergency contact number when country changes
      setFormData(prev => ({
        ...prev,
        emergencyContact: ''
      }));
    }
  };

  const handleEmergencyPhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove non-digits
    value = value.replace(/\D/g, '');
    
    // Truncate to country limit
    if (value.length > selectedEmergencyCountry.phoneLength) {
      value = value.substring(0, selectedEmergencyCountry.phoneLength);
    }
    
    setFormData(prev => ({
      ...prev,
      emergencyContact: value
    }));
  };

  const handleEmergencyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = e.key;
    const currentValue = formData.emergencyContact;
    
    // Allow control keys
    if (['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(char)) {
      return;
    }
    
    // Block if at limit
    if (currentValue.length >= selectedEmergencyCountry.phoneLength) {
      e.preventDefault();
      return;
    }
    
    // Block non-numbers
    if (!/[0-9]/.test(char)) {
      e.preventDefault();
    }
  };

  const handleEmergencyPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    
    const numericOnly = pastedText.replace(/\D/g, '');
    const truncated = numericOnly.substring(0, selectedEmergencyCountry.phoneLength);
    
    setFormData(prev => ({
      ...prev,
      emergencyContact: truncated
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save user details to localStorage
    localStorage.setItem('userDetailsData', JSON.stringify(formData));
    console.log('💾 Saved user details to localStorage:', formData);
    
    navigate('/signup-success');
  };

  const handleBackClick = () => {
    navigate('/otp-verification');
  };

  return (
    <div className="user-details-container">
      {/* Background Logo */}
      <div className="user-details-background-logo">
        <img src="/images/logo.jpg" alt="Trygve Background Logo" />
      </div>
      
      <div className="user-details-card">
        {/* Header */}
        <div className="user-details-header">
          <button
            onClick={handleBackClick}
            className="user-details-back-btn"
          >
            <ArrowLeft size={20} color="#2563EB" />
          </button>
          
          {/* <img src="/images/logo.png" alt="Trygve Logo" className="user-details-logo" /> */}
          
          <h1 className="user-details-title">
            Almost Done!
          </h1>
          
          <p className="user-details-subtitle">
            Please enter your details in the following section.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="user-details-form">
          <div className="user-details-inputs">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter Full Name"
              className="user-details-input"
              required
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Email Address..."
              className="user-details-input"
              required
            />

            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="user-details-input"
              readOnly
              style={{ backgroundColor: '#F3F4F6', cursor: 'not-allowed' }}
            />

            <div className="user-details-input-container">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Arasur, Coimbatore"
                className="user-details-input"
                required
              />
              <MapPin className="user-details-input-icon" size={20} />
            </div>

            {/* Emergency Contact Phone Input with Integrated Country Selector */}
            <div className="user-details-form-group">
              <label htmlFor="emergency-phone" className="user-details-form-label">
                Emergency Contact Number
              </label>
              <div className="user-details-phone-container">
                <select
                  value={selectedEmergencyCountry.code}
                  onChange={handleEmergencyCountryChange}
                  className="user-details-country-prefix-select"
                  autoComplete="country"
                >
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.dialCode}
                    </option>
                  ))}
                </select>
                <input
                  id="emergency-phone"
                  name="emergencyContact"
                  ref={emergencyPhoneInputRef}
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={handleEmergencyPhoneInput}
                  onKeyDown={handleEmergencyKeyDown}
                  onPaste={handleEmergencyPaste}
                  placeholder={`Enter ${selectedEmergencyCountry.phoneLength} digits`}
                  maxLength={selectedEmergencyCountry.phoneLength}
                  className="user-details-phone-input"
                  autoComplete="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                />
              </div>
              <div className={`user-details-phone-counter ${formData.emergencyContact.length === selectedEmergencyCountry.phoneLength ? 'complete' : ''}`}>
                {formData.emergencyContact.length}/{selectedEmergencyCountry.phoneLength} digits
                {formData.emergencyContact.length === selectedEmergencyCountry.phoneLength && ' ✓'}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="user-details-submit-btn"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDetails;
