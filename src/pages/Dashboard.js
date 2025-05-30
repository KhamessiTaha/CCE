import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import './Dashboard.css';
import ActivityLog from '../components/ActivityLog';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRooms = async () => {
      if (!currentUser) return;
      setRoomsLoading(true);
      try {
        const roomsCollectionRef = collection(db, 'rooms');
        const roomsSnapshot = await getDocs(roomsCollectionRef);
        const userRoomList = roomsSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((room) => room.creatorEmail === currentUser.email);
        setRooms(userRoomList);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setRoomsLoading(false);
      }
    };

    fetchUserRooms();
  }, [currentUser]);

  // Fetch activities when a room is selected
  useEffect(() => {
    const fetchActivities = async () => {
      if (!selectedRoomId) {
        setActivities([]);
        return;
      }
      
      setLoading(true);
      try {
        const activitiesRef = collection(db, 'rooms', selectedRoomId, 'activities');
        const activitiesQuery = query(
          activitiesRef,
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        
        const activitiesSnapshot = await getDocs(activitiesQuery);
        const uniqueActivities = new Map();

        activitiesSnapshot.docs.forEach((doc) => {
          const activity = doc.data();
          const key = `${activity.user}-${activity.action}-${activity.timestamp?.seconds}`;
          if (!uniqueActivities.has(key)) {
            uniqueActivities.set(key, {
              id: doc.id,
              ...activity
            });
          }
        });

        const activityList = Array.from(uniqueActivities.values());
        setActivities(activityList);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [selectedRoomId]);

  const filteredRooms = rooms.filter(
    (room) => room.name?.toLowerCase().includes(searchTerm.toLowerCase()) || room.id.includes(searchTerm)
  );

  const handleRoomSelect = (roomId) => {
    setSelectedRoomId(roomId);
  };

  const handleRoomNavigate = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const getRoomStats = () => {
    const totalRooms = rooms.length;
    const privateRooms = rooms.filter(room => room.isPrivate).length;
    const publicRooms = totalRooms - privateRooms;
    
    return { totalRooms, privateRooms, publicRooms };
  };

  const { totalRooms, privateRooms, publicRooms } = getRoomStats();

  return (
    <div className="dashboard-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1 className="dashboard-title">
              Welcome to Your <span className="gradient-text">Dashboard</span>
            </h1>
            <div className="title-underline"></div>
            {currentUser && (
              <div className="user-info">
                <div className="user-avatar">👨‍💻</div>
                <div className="user-details">
                  <span className="user-greeting">Hello,</span>
                  <span className="user-email">{currentUser.email}</span>
                </div>
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="stats-bar">
            <div className="stat">
              <div className="stat-number">{totalRooms}</div>
              <div className="stat-label">Total Rooms</div>
            </div>
            <div className="stat">
              <div className="stat-number">{privateRooms}</div>
              <div className="stat-label">Private</div>
            </div>
            <div className="stat">
              <div className="stat-number">{publicRooms}</div>
              <div className="stat-label">Public</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="cta-buttons">
            <button 
              className="cta-button primary large" 
              onClick={() => navigate('/create-room')}
            >
              <div className="button-content">
                <span className="button-icon">➕</span>
                Create Room
              </div>
            </button>
            <button 
              className="cta-button secondary large" 
              onClick={() => navigate('/join-room')}
            >
              <div className="button-content">
                <span className="button-icon">🚪</span>
                Join Room
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="content-grid">
          {/* Rooms Section */}
          <div className="rooms-section">
            <div className="section-card">
              <div className="card-header">
                <h3 className="section-title">
                  <span className="section-icon">🏠</span>
                  Your Rooms
                </h3>
                <div className="search-bar">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search rooms by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="room-list">
                {roomsLoading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your rooms...</p>
                  </div>
                ) : filteredRooms.length > 0 ? (
                  <div className="room-grid">
                    {filteredRooms.map((room) => (
                      <div
                        key={room.id}
                        className={`room-card ${selectedRoomId === room.id ? 'selected' : ''}`}
                        onClick={() => handleRoomSelect(room.id)}
                        data-tip
                        data-for={`tooltip-${room.id}`}
                      >
                        <div className="room-header">
                          <div className="room-info">
                            <h4 className="room-name">
                              {room.name || `Room ${room.id.slice(0, 8)}`}
                            </h4>
                            <span className={`room-badge ${room.isPrivate ? 'private' : 'public'}`}>
                              {room.isPrivate ? '🔒 Private' : '🌐 Public'}
                            </span>
                          </div>
                          <button 
                            className="enter-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRoomNavigate(room.id);
                            }}
                          >
                            <span className="button-icon">→</span>
                          </button>
                        </div>
                        
                        <div className="room-meta">
                          <div className="room-stat">
                            <span className="stat-icon">👥</span>
                            <span>{room.participants || 0} participants</span>
                          </div>
                          <div className="room-stat">
                            <span className="stat-icon">📅</span>
                            <span>
                              {room.createdAt 
                                ? new Date(room.createdAt.seconds * 1000).toLocaleDateString()
                                : 'N/A'
                              }
                            </span>
                          </div>
                        </div>

                        <div className="card-hover-effect"></div>

                        <ReactTooltip id={`tooltip-${room.id}`} place="top" effect="solid">
                          <div className="tooltip-content">
                            <p><strong>Room ID:</strong> {room.id}</p>
                            <p><strong>Created by:</strong> {room.creatorEmail || 'Unknown'}</p>
                            <p><strong>Created:</strong> {room.createdAt ? new Date(room.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</p>
                            <p><strong>Type:</strong> {room.isPrivate ? 'Private' : 'Public'}</p>
                          </div>
                        </ReactTooltip>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🏠</div>
                    <h4>No rooms found</h4>
                    <p>
                      {searchTerm 
                        ? "Try adjusting your search terms" 
                        : "You haven't created any rooms yet. Create your first room to get started!"
                      }
                    </p>
                    {!searchTerm && (
                      <button 
                        className="cta-button primary"
                        onClick={() => navigate('/create-room')}
                      >
                        Create Your First Room
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activities Section */}
          {selectedRoomId && (
            <div className="activities-section">
              <div className="section-card">
                <div className="card-header">
                  <h3 className="section-title">
                    <span className="section-icon">📊</span>
                    Recent Activity
                  </h3>
                  <div className="activity-badge">
                    Live
                    <div className="pulse-dot"></div>
                  </div>
                </div>

                <div className="activity-content">
                  {loading ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p>Loading activities...</p>
                    </div>
                  ) : (
                    <div className="activity-wrapper">
                      <ActivityLog activities={activities} />
                      {activities.length === 0 && (
                        <div className="empty-state small">
                          <div className="empty-icon">📈</div>
                          <p>No recent activity in this room</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="quick-actions">
          <div className="section-card">
            <h3 className="section-title">
              <span className="section-icon">⚡</span>
              Quick Actions
            </h3>
            <div className="action-grid">
              <button 
                className="action-card"
                onClick={() => navigate('/create-room')}
              >
                <div className="action-icon">➕</div>
                <div className="action-text">
                  <h4>Create Room</h4>
                  <p>Start a new collaboration</p>
                </div>
              </button>
              <button 
                className="action-card"
                onClick={() => navigate('/join-room')}
              >
                <div className="action-icon">🚪</div>
                <div className="action-text">
                  <h4>Join Room</h4>
                  <p>Enter with room ID</p>
                </div>
              </button>
              <button 
                className="action-card"
                onClick={() => setSearchTerm('')}
              >
                <div className="action-icon">🔍</div>
                <div className="action-text">
                  <h4>Browse Rooms</h4>
                  <p>Explore your rooms</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;