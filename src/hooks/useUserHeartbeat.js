import { useEffect } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

const useUserHeartbeat = (roomId) => {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser || !roomId) return;

    const interval = setInterval(() => {
      const userRef = doc(db, 'rooms', roomId, 'users', currentUser.uid);
      updateDoc(userRef, {
        lastActive: serverTimestamp()
      });
    }, 15000); // every 15 seconds

    return () => clearInterval(interval);
  }, [currentUser, roomId]);
};

export default useUserHeartbeat;
