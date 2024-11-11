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
          <h1>Welcome to the Collaborative Code Editor</h1>
          <p>Code, collaborate, and create with others in real-time.</p>
        </header>
        <div className="home-actions">
          {currentUser ? (
            <>
              <button
                className="home-button"
                onClick={() => navigate('/dashboard')}
                aria-label="Go to Dashboard"
              >
                Go to Dashboard
              </button>
              <button
                className="home-button"
                onClick={() => navigate('/logout')}
                aria-label="Log Out"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                className="home-button"
                onClick={() => navigate('/login')}
                aria-label="Log In"
              >
                Log In
              </button>
              <button
                className="home-button"
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
                Join as Guest
              </button>
            </>
          )}
        </div>
      </div>
      <div className="home-image" aria-label="Collaborative code editing hero image"></div>
      <div className="scroll-prompt">
        <span>Scroll down</span>
        <i className="fas fa-chevron-down"></i>
      </div>
    </div>
  );
};

export default Home;