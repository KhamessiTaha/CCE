import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import './ActivityLog.css';

const ActivityLog = ({ roomId }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!roomId) return;

    const activitiesRef = collection(db, 'rooms', roomId, 'activities');
    const unsubscribe = onSnapshot(activitiesRef, (snapshot) => {
      const newActivities = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : new Date(),
      }));
      setActivities(newActivities.sort((a, b) => b.timestamp - a.timestamp));
    });

    return () => unsubscribe();
  }, [roomId]);

  return (
    <div className="activity-log-container">
      <h3>Recent Activity</h3>
      {activities.length > 0 ? (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              <p><strong>{activity.user}</strong> {activity.action}</p>
              <span>{activity.timestamp.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent activity.</p>
      )}
    </div>
  );
};

export default ActivityLog;
