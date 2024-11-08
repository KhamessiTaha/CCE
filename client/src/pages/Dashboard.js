import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h2>Welcome to Your Dashboard</h2>
      <div className="dashboard-actions">
        <button className="dashboard-button" onClick={() => navigate('/create-room')}>
          Create a Room
        </button>
        <button className="dashboard-button" onClick={() => navigate('/join-room')}>
          Join a Room
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
