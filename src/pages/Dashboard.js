import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
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

  useEffect(() => {
    const fetchUserRooms = async () => {
      if (!currentUser) return;
      try {
        const roomsCollectionRef = collection(db, 'rooms');
        const roomsSnapshot = await getDocs(roomsCollectionRef);
        const userRoomList = roomsSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((room) => room.creatorEmail === currentUser.email);
        setRooms(userRoomList);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchUserRooms();
  }, [currentUser]);

  const filteredRooms = rooms.filter(
    (room) => room.name?.toLowerCase().includes(searchTerm.toLowerCase()) || room.id.includes(searchTerm)
  );

  const handleRoomSelect = (roomId) => {
    setSelectedRoomId(roomId);
  };

  const handleRoomNavigate = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to Your Dashboard</h2>
      {currentUser && (
        <div className="user-info">
          <p>Logged in as: {currentUser.email}</p>
        </div>
      )}
      <div className="dashboard-actions">
        <button className="dashboard-button" onClick={() => navigate('/create-room')}>Create a Room</button>
        <button className="dashboard-button" onClick={() => navigate('/join-room')}>Join a Room</button>
      </div>
      {selectedRoomId && <ActivityLog roomId={selectedRoomId} />}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search rooms by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="room-list">
        <h3>Your Rooms</h3>
        {filteredRooms.length > 0 ? (
          <ul>
            {filteredRooms.map((room) => (
              <li
                key={room.id}
                onClick={() => handleRoomSelect(room.id)}
                data-tip
                data-for={`tooltip-${room.id}`}
                className={selectedRoomId === room.id ? 'selected-room' : ''}
              >
                {room.name || `Room ID: ${room.id}`} 
                {room.isPrivate ? (
                  <span className="private-tag">(Private)</span>
                ) : (
                  <span className="public-tag">(Public)</span>
                )}
                <button onClick={(e) => {
                  e.stopPropagation(); // Prevents the main click event
                  handleRoomNavigate(room.id);
                }}>
                  Enter
                </button>
                <ReactTooltip id={`tooltip-${room.id}`} place="top" effect="solid">
                  <p>Created by: {room.creatorEmail || 'Unknown'}</p>
                  <p>Created at: {room.createdAt ? new Date(room.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</p>
                  <p>Participants: {room.participants || 'N/A'}</p>
                </ReactTooltip>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't created any rooms yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
