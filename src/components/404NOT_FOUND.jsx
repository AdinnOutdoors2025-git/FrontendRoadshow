import React from 'react';
import { useNavigate } from 'react-router-dom';
import FuzzyText from './404FuzzyText';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <FuzzyText 
        fontSize="clamp(3rem, 15vw, 10rem)"
        color="#ff4d4d"
        baseIntensity={0.2}
        hoverIntensity={0.5}
      >
        404
      </FuzzyText>
      <h2 style={{ margin: '20px 0', fontSize: '1.5rem' }}>
        Oops! The page you're looking for doesn't exist.
      </h2>
      <p style={{ marginBottom: '30px', maxWidth: '600px' }}>
        You seem to have wandered into the digital void. Let's get you back to safety.
      </p>
      <button 
        onClick={() => navigate('/')}
        style={{
          padding: '12px 24px',
          background: 'linear-gradient(90deg, #ff4d4d 0%, #f95700 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '30px',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(255, 77, 77, 0.3)'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        Take Me Home
      </button>
    </div>
  );
};

export default NotFound;