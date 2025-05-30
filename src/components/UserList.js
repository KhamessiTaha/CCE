import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import useUserHeartbeat from '../hooks/useUserHeartbeat';
import './UserList.css';

const UserList = ({ roomId }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useUserHeartbeat(roomId);

  useEffect(() => {
    if (!roomId) {
      setError('Room ID is required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const usersRef = collection(db, 'rooms', roomId, 'users');
    const unsubscribe = onSnapshot(
      usersRef, 
      (snapshot) => {
        try {
          const usersList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            lastActive: doc.data().lastActive?.toDate()?.getTime() || Date.now()
          }));
          
          // Sort users: creator first, then by last active (newest first)
          usersList.sort((a, b) => {
            if (a.isCreator && !b.isCreator) return -1;
            if (b.isCreator && !a.isCreator) return 1;
            return b.lastActive - a.lastActive;
          });
          
          setUsers(usersList);
          setIsLoading(false);
        } catch (err) {
          console.error('Error processing users data:', err);
          setError('Failed to load users');
          setIsLoading(false);
        }
      },
      (err) => {
        console.error('Error listening to users:', err);
        setError('Failed to connect to users list');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [roomId]);

  const getUserStatus = useCallback((lastActive) => {
    const now = Date.now();
    const thirtySeconds = 30 * 1000;
    const fiveMinutes = 5 * 60 * 1000;
    const thirtyMinutes = 30 * 60 * 1000;
    
    const timeDiff = now - lastActive;
    
    if (timeDiff < thirtySeconds) return 'online';
    if (timeDiff < fiveMinutes) return 'idle';
    if (timeDiff < thirtyMinutes) return 'away';
    return 'offline';
  }, []);

  const getInitials = useCallback((name) => {
    if (!name || typeof name !== 'string') return '?';
    
    const cleanName = name.trim();
    if (!cleanName) return '?';
    
    const parts = cleanName.split(/[\s-_]+/).filter(part => part.length > 0);
    
    if (parts.length === 0) return cleanName.charAt(0).toUpperCase();
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    
    return parts
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }, []);

  const getRelativeTime = useCallback((lastActive) => {
    const now = Date.now();
    const diff = now - lastActive;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  }, []);

  const { onlineUsers, idleUsers, awayUsers, offlineUsers } = useMemo(() => {
    const categorized = {
      onlineUsers: [],
      idleUsers: [],
      awayUsers: [],
      offlineUsers: []
    };

    users.forEach(user => {
      const status = getUserStatus(user.lastActive);
      switch (status) {
        case 'online':
          categorized.onlineUsers.push(user);
          break;
        case 'idle':
          categorized.idleUsers.push(user);
          break;
        case 'away':
          categorized.awayUsers.push(user);
          break;
        default:
          categorized.offlineUsers.push(user);
      }
    });

    return categorized;
  }, [users, getUserStatus]);

  const renderUser = useCallback((user) => {
    const status = getUserStatus(user.lastActive);
    const isCurrentUser = currentUser ? 
      user.email === currentUser.email : 
      user.isGuest && user.id === localStorage.getItem(`room_${roomId}_guestId`);
    
    const displayName = user.isGuest ? 
      `Guest_${user.id.slice(-4)}` : 
      user.displayName || user.name || user.email?.split('@')[0] || 'Unknown User';

    return (
      <li 
        key={user.id} 
        className={`user-item ${isCurrentUser ? 'current-user' : ''} ${status}`}
        title={`${displayName} - ${status} - Last seen ${getRelativeTime(user.lastActive)}`}
      >
        <div className={`user-avatar ${user.isCreator ? 'creator' : ''} ${status}`}>
          <span className="avatar-text">{getInitials(displayName)}</span>
          <div className={`status-dot ${status}`}></div>
        </div>
        
        <div className="user-details">
          <div className="user-name-row">
            <span className="user-name">
              {displayName}
              {isCurrentUser && <span className="you-badge">You</span>}
            </span>
            {user.isCreator && <span className="creator-badge">Creator</span>}
          </div>
          
          {!user.isGuest && user.email && (
            <span className="user-email">{user.email}</span>
          )}
          
          <div className="user-status-info">
            <span className="status-text">
              {status === 'online' ? 'Active now' : 
               status === 'idle' ? 'Idle' : 
               status === 'away' ? 'Away' : 
               `Last seen ${getRelativeTime(user.lastActive)}`}
            </span>
          </div>
        </div>
      </li>
    );
  }, [currentUser, roomId, getUserStatus, getInitials, getRelativeTime]);

  const renderUserSection = (title, userList, isCollapsible = false) => {
    if (userList.length === 0) return null;
    
    return (
      <div className="user-section">
        <div className="section-header">
          <span className="section-title">{title}</span>
          <span className="section-count">{userList.length}</span>
        </div>
        <ul className="section-users">
          {userList.map(renderUser)}
        </ul>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="user-list-container">
        <div className="user-list-header">
          <h3>Connected Users</h3>
          <div className="loading-spinner"></div>
        </div>
        <div className="loading-state">
          <div className="loading-text">Loading users...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list-container">
        <div className="user-list-header">
          <h3>Connected Users</h3>
          <span className="error-badge">Error</span>
        </div>
        <div className="error-state">
          <div className="error-message">{error}</div>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalOnline = onlineUsers.length + idleUsers.length;

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h3>Connected Users</h3>
        <div className="user-stats">
          <span className="online-count">{totalOnline} online</span>
          <span className="total-count">of {users.length}</span>
        </div>
      </div>
      
      <div className="user-list-content">
        {users.length > 0 ? (
          <>
            {renderUserSection('Online', onlineUsers)}
            {renderUserSection('Idle', idleUsers)}
            {renderUserSection('Away', awayUsers)}
            {renderUserSection('Offline', offlineUsers)}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <div className="empty-message">No users connected</div>
            <div className="empty-submessage">Waiting for others to join...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;