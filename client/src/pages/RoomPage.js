import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import CodeEditor from '../components/CodeEditor';
import Chat from '../components/Chat';
import './RoomPage.css';

const RoomPage = () => {
  const { roomId } = useParams();
  const { currentUser } = useAuth();
  const db = getFirestore();
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      const roomRef = doc(db, 'rooms', roomId);
      const roomSnap = await getDoc(roomRef);
      if (roomSnap.exists()) {
        setRoomData(roomSnap.data());
      } else {
        console.error('Room not found');
      }
    };

    fetchRoomData();

    // Real-time updates for the room
    const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), (doc) => {
      setRoomData(doc.data());
    });

    return () => unsubscribe();
  }, [db, roomId]);

  return (
    <div className="room-page-container">
      <header>
        <h2>{roomData ? `Room: ${roomData.roomName}` : 'Loading...'}</h2>
        <p>Welcome, {currentUser ? currentUser.email : 'Guest'}!</p>
      </header>
      <div className="room-content">
        <CodeEditor roomId={roomId} />
        <Chat roomId={roomId} />
      </div>
    </div>
  );
};

export default RoomPage;
