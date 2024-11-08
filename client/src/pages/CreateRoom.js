import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // For generating unique room IDs
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import './CreateRoom.css';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const db = getFirestore();

  const handleCreateRoom = async () => {
    if (!roomName) {
      alert('Room name is required.');
      return;
    }

    const roomId = uuidv4(); // Generate unique room ID
    const roomData = {
      roomId,
      roomName,
      isPrivate,
      password: isPrivate ? password : null,
      createdBy: auth.currentUser?.email,
      createdAt: new Date(),
    };

    try {
      await setDoc(doc(db, 'rooms', roomId), roomData);
      alert('Room created successfully!');
      navigate(`/room/${roomId}`); // Redirect to the room page
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Please try again.');
    }
  };

  return (
    <div className="create-room-container">
      <h2>Create a Room</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleCreateRoom(); }}>
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
          />
          Private Room
        </label>
        {isPrivate && (
          <input
            type="password"
            placeholder="Set Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        <button type="submit">Create Room</button>
      </form>
    </div>
  );
};

export default CreateRoom;
