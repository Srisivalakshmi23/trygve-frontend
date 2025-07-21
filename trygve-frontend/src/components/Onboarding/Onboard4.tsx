import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Onboard4 = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login'); // This will need to be implemented later
  };

  // Add keyboard event listener for Enter key
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleGetStarted();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div
      className="w-screen h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-between"
      style={{ backgroundImage: `url('/images/onboard4.jpg')` }}
    >
      <div className="flex justify-end p-6">
        {/* No skip button on final page */}
      </div>

      <div style={{
        textAlign: 'center',
        color: 'white',
        padding: '40px 32px',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        marginLeft: '24px',
        marginRight: '24px',
        borderRadius: '12px'
      }}>
        {/* Logo */}
        <img 
          src="/images/logo.png" 
          alt="Trygve Logo" 
          style={{
            width: '100px',
            height: '100px',
            marginBottom: '24px',
            margin: '0 auto 24px auto',
            display: 'block'
          }}
        />
        
        {/* Title with Audiowide font */}
        <h2 style={{
          fontFamily: 'Audiowide, cursive',
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '16px',
          letterSpacing: '2px',
          lineHeight: '1.2'
        }}>Affordable Healthcare For Everyone</h2>
        
        {/* Subtitle with Poppins font */}
        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '16px',
          fontWeight: '400',
          marginBottom: '32px',
          opacity: 0.9,
          lineHeight: '1.5',
          maxWidth: '300px',
          margin: '0 auto 32px auto'
        }}>Quality care for every budget.</p>
        
        <button
          onClick={handleGetStarted}
          style={{
            backgroundColor: '#3B82F6',
            color: 'white',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: '600',
            fontSize: '16px',
            padding: '14px 40px',
            borderRadius: '25px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.3s ease',
            maxWidth: '280px'
          }}
          onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#2563EB'}
          onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#3B82F6'}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Onboard4;
