import React, { useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './JoinRoom.css';

const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const db = getFirestore();
  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    if (!roomId) {
      setError('Room ID is required.');
      return;
    }

    try {
      const roomRef = doc(db, 'rooms', roomId);
      const roomSnap = await getDoc(roomRef);

      if (roomSnap.exists()) {
        const roomData = roomSnap.data();
        if (roomData.isPrivate) {
          setIsPrivate(true);
          if (roomData.password === password) {
            navigate(`/room/${roomId}`); // Navigate to room if password is correct
          } else {
            setError('Incorrect password.');
          }
        } else {
          navigate(`/room/${roomId}`); // Navigate to room if it's public
        }
      } else {
        setError('Room not found. Please check the Room ID.');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      setError('Failed to join room. Please try again.');
    }
  };

  return (
    <div className="join-room-container">
      <h2>Join a Room</h2>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => {
          setRoomId(e.target.value);
          setError(''); // Clear error when typing
        }}
        required
      />
      {isPrivate && (
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      )}
      {error && <p className="error-text">{error}</p>}
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
};

export default JoinRoom;
