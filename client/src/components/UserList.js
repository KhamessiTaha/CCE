import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import './UserList.css';

const UserList = ({ roomId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = collection(db, 'rooms', roomId, 'users');
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    });

    return () => unsubscribe();
  }, [roomId]);

  return (
    <div className="user-list-container">
      <h3>Connected Users</h3>
      <ul>
        {users.length > 0 ? users.map((user) => (
          <li key={user.id} className={user.isCreator ? 'room-master' : ''}>
            {user.isCreator ? (
              <span className="user-name">
                {user.name} 👑
              </span>
            ) : (
              <span className="user-name">
                {user.isGuest ? `Guest_${user.id.slice(-4)}` : user.email}
              </span>
            )}
          </li>
        )) : <p>No users connected.</p>}
      </ul>
    </div>
  );
};

export default UserList;