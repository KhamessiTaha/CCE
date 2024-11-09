import React, { useState } from 'react';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import './JoinRoom.css';

const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const generateGuestId = () => {
    return `guest_${Math.random().toString(36).substr(2, 9)}`;
  };

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
          if (roomData.password !== password) {
            setError('Incorrect password.');
            return;
          }
        }

        // Generate a unique ID and user data
        const currentUser = auth.currentUser;
        const userId = currentUser ? currentUser.uid : generateGuestId();
        
        const userData = {
          isGuest: !currentUser,
          email: currentUser ? currentUser.email : null,
          name: currentUser ? currentUser.email : `Guest_${userId.slice(-4)}`,
          joinedAt: new Date(),
        };

        // Add user to room
        const userRef = doc(collection(db, 'rooms', roomId, 'users'), userId);
        await setDoc(userRef, userData);

        // Store guest ID in localStorage if not logged in
        if (!currentUser) {
          localStorage.setItem(`room_${roomId}_guestId`, userId);
        }

        // Navigate to room
        navigate(`/room/${roomId}`);
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
          setError(''); 
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