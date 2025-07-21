import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Onboard3 = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/onboard4');
  };

  const handleSkip = () => {
    navigate('/onboard4');
  };

  // Add keyboard event listener for Enter key
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleNext();
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
      style={{ backgroundImage: `url('/images/onboard3.jpg')` }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px' }}>
        <button
          onClick={handleSkip}
          style={{
            color: 'white',
            fontFamily: 'Audiowide, cursive',
            fontWeight: '600',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
          onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
        >
          Skip
        </button>
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
        }}>Seamless Care, Delivered</h2>
        
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
        }}>Consult, treat, and heal—hassle-free.</p>
        
        <button
          onClick={handleNext}
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
            transition: 'all 0.3s ease',
            minWidth: '140px'
          }}
          onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#2563EB'}
          onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#3B82F6'}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Onboard3;
