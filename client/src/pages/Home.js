import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <header className="home-header">
          <h1>Welcome to the Collaborative Code Editor</h1>
          <p>Code, collaborate, and create with others in real-time.</p>
        </header>
        <div className="home-actions">
          {currentUser ? (
            <>
              <button className="home-button" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </button>
              <button className="home-button" onClick={() => navigate('/logout')}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <button className="home-button" onClick={() => navigate('/login')}>
                Log In
              </button>
              <button className="home-button" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
              <button className="home-button guest-button" onClick={() => navigate('/join-room')}>
                Join as Guest
              </button>
            </>
          )}
        </div>
      </div>
      <div className="home-image"></div>
    </div>
  );
};

export default Home;
