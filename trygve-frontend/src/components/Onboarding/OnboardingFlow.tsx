import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

// 
const OnboardingFlow: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const slides = [
  {
    background: '/images/onboard1.jpg',
    title: 'TRYGVE',
    subtitle: 'Trusted Guardian of Life'
  },
  {
    background: '/images/onboard2.jpg',
    title: 'Your Health, Our Priority',
    subtitle: 'Trusted doctors and care at your doorstep.'
  },
  {
    background: '/images/onboard3.jpg',
    title: 'Seamless Care, Delivered',
    subtitle: 'Consult, treat, and heal—hassle-free.'
  },
  {
    background: '/images/onboard4.jpg',
    title: 'Affordable Healthcare for Everyone',
    subtitle: 'Quality care for every budget.'
  }
];


    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const lastSlide = () =>{
        setCurrentSlide((_) => slides.length -1 );
    }

    const handleGetStarted = () => {
        navigate('/welcome');
    };

    // Handle keyboard events
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && currentSlide === 0) {
                nextSlide();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentSlide]);
    
    return (
        <div className="slider-container">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`slide ${index === currentSlide ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${slide.background})` }}
                >
                    <div className="slide-content">
                        <h1 className="logo">{slide.title}</h1>
                        <p className="tagline">{slide.subtitle}</p>
                        {/* {index === 0 && (
                            <p className="enter-hint" style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.9rem',
                                marginTop: '2rem',
                                fontWeight: '300'
                            }}>
                                Press Enter to continue
                            </p>
                        )} */}
                        {index === slides.length - 1 && (
                            <button className="get-started-btn" onClick={handleGetStarted}>
                                Get Started
                            </button>
                        )}
                    </div>
                </div>
            ))}
            
            {currentSlide > 0 && currentSlide !== slides.length - 1 && (
                <div className="slider-controls">
                    <button className="skip-btn" onClick={lastSlide}>Skip</button>
                    <div className="dots">
                        {slides.map((_, index) => (
                            index!==0 && (  
                            <span
                                key={index}
                                className={`dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            ></span>
                        )))}
                    </div>
                    <button className="next-btn" onClick={nextSlide}>Next →</button>
                </div>
            )}
        </div>
    );
};

export default OnboardingFlow;