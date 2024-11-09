// CreateRoom.js
import React, { useState } from 'react';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './CreateRoom.css';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    
    if (!roomName.trim()) {
      setError('Room name is required');
      return;
    }

    if (isPrivate && !password.trim()) {
      setError('Password is required for private rooms');
      return;
    }

    try {
      // First create the room document
      const roomRef = await addDoc(collection(db, 'rooms'), {
        name: roomName,
        isPrivate: isPrivate,
        password: isPrivate ? password : null,
        createdAt: new Date(),
        createdBy: currentUser.uid,
        creatorEmail: currentUser.email
      });

      // Then add the creator as the first user in the room's users collection
      const creatorRef = doc(collection(db, 'rooms', roomRef.id, 'users'), currentUser.uid);
      await setDoc(creatorRef, {
        email: currentUser.email,
        name: 'Room_Master',
        isCreator: true,
        joinedAt: new Date(),
        role: 'admin'
      });

      navigate(`/room/${roomRef.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
      setError('Failed to create room. Please try again.');
    }
  };

  return (
    <div className="create-room-container">
      <h2>Create a New Room</h2>
      <form onSubmit={handleCreateRoom}>
        <div className="form-group">
          <label>Room Name</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            Make room private
          </label>
        </div>

        {isPrivate && (
          <div className="form-group">
            <label>Room Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter room password"
              required={isPrivate}
            />
          </div>
        )}

        {error && <p className="error-text">{error}</p>}
        
        <button type="submit">Create Room</button>
      </form>
    </div>
  );
};

export default CreateRoom;