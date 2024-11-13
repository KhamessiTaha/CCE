import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, onSnapshot, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import CodeEditor from '../components/CodeEditor';
import Chat from '../components/Chat';
import UserList from '../components/UserList';
import './RoomPage.css';

const RoomPage = () => {
  const { roomId } = useParams();
  const { currentUser } = useAuth();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLoggedJoin, setHasLoggedJoin] = useState(false);

  // Function to log activities
  const logActivity = async (action) => {
    try {
      const activitiesRef = collection(db, 'rooms', roomId, 'activities');
      await addDoc(activitiesRef, {
        user: currentUser ? currentUser.email : `Guest_${localStorage.getItem(`room_${roomId}_guestId`)?.slice(-4)}`,
        action,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  };

  // New functions for logging specific actions
  const handleFileCreation = async (fileName) => {
    await logActivity(`created a file: ${fileName}`);
  };

  const handleFileModification = async (fileName) => {
    await logActivity(`modified the file: ${fileName}`);
  };

  const handleFileDeletion = async (fileName) => {
    await logActivity(`deleted the file: ${fileName}`);
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomRef = doc(db, 'rooms', roomId);
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
          setRoomData({ id: roomSnap.id, ...roomSnap.data() });

          // Log "joined the room" only once per session
          if (!hasLoggedJoin) {
            logActivity('joined the room');
            setHasLoggedJoin(true);
          }
        } else {
          setError('Room not found');
        }
      } catch (err) {
        console.error('Error fetching room:', err);
        setError('Failed to load room data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();

    // Listen for real-time updates
    const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), (doc) => {
      if (doc.exists()) {
        setRoomData({ id: doc.id, ...doc.data() });
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [roomId, hasLoggedJoin]);

  if (loading) {
    return (
      <div className="room-loading">
        <h2>Loading room data...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="room-error">
        <h2>Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="room-page-container">
      <header className="room-header">
        <div className="room-info">
          <h2>Room: {roomData?.name}</h2>
          <span className="room-id">Room ID: {roomId}</span>
          {roomData?.isPrivate && <span className="private-badge">Private Room</span>}
        </div>
        <div className="user-welcome">
          <p>Welcome, {currentUser ? currentUser.email : `Guest_${localStorage.getItem(`room_${roomId}_guestId`)?.slice(-4)}`}!</p>
          {roomData?.creatorEmail && (
            <p className="room-creator">Created by: {roomData.creatorEmail}</p>
          )}
        </div>
      </header>

      <div className="room-content">
        <div className="editor-section">
          <CodeEditor
            roomId={roomId}
            logActivity={logActivity}
            onFileCreate={handleFileCreation}
            onFileModify={handleFileModification}
            onFileDelete={handleFileDeletion}
          />
        </div>

        <div className="side-section">
          <div className="user-list-container">
            <UserList roomId={roomId} />
          </div>
          <div className="chat-container">
            <Chat roomId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
