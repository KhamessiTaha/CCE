import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/logo.png';
import './Home.css';

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-logo">
          <img src={Logo} alt="Collaborative Code Editor Logo" />
        </div>
        <header className="home-header">
          <h1>
            <span className="gradient-text">Collaborative</span> Code Editor
          </h1>
          <p>Write, share, and build together in real-time.</p>
        </header>
        <div className="home-actions">
          {currentUser ? (
            <div className="button-group">
              <button
                className="home-button primary-button"
                onClick={() => navigate('/dashboard')}
                aria-label="Go to Dashboard"
              >
                Go to Dashboard
              </button>
              <button
                className="home-button secondary-button"
                onClick={() => navigate('/logout')}
                aria-label="Log Out"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="button-group">
              <button
                className="home-button primary-button"
                onClick={() => navigate('/login')}
                aria-label="Log In"
              >
                Log In
              </button>
              <button
                className="home-button secondary-button"
                onClick={() => navigate('/signup')}
                aria-label="Sign Up"
              >
                Sign Up
              </button>
              <button
                className="home-button guest-button"
                onClick={() => navigate('/join-room')}
                aria-label="Join as Guest"
              >
                Try as Guest
              </button>
            </div>
          )}
        </div>
        <div className="feature-points">
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <span>Real-time collaboration</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <span>Secure sharing</span>
          </div>
          <div className="feature">
            <span className="feature-icon">💻</span>
            <span>Multiple language support</span>
          </div>
        </div>
      </div>
      <div className="home-image" role="img" aria-label="Collaborative code editing illustration">
        <div className="overlay"></div>
      </div>
    </div>
  );
};

export default Home;