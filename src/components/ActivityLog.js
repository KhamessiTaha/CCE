import React from 'react';
import './ActivityLog.css';

const ActivityLog = ({ activities }) => {
  return (
    <div className="activity-log-container">
      {activities.length > 0 ? (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              <span className="activity-user">{activity.user} </span>
              <span className="activity-action">{activity.action}</span>
              <span className="activity-timestamp">
                {activity.timestamp ? new Date(activity.timestamp.seconds * 1000).toLocaleString() : 'Just now'}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No activities to show.</p>
      )}
    </div>
  );
};

export default ActivityLog;
