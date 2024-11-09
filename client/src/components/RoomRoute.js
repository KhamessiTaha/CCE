import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoomRoute = ({ children }) => {
  const { roomId } = useParams();
  const { currentUser } = useAuth();
  const guestId = localStorage.getItem(`room_${roomId}_guestId`);
  
  // Allow access if user is logged in OR has a valid guest ID for this room
  if (currentUser || guestId) {
    return children;
  }

  // If no auth and no guest ID, redirect to join room page
  return <Navigate to="/join-room" />;
};

export default RoomRoute;