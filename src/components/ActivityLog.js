import React from 'react';
import './ActivityLog.css';

const ActivityLog = ({ activities = [] }) => {  // Provide default empty array
  if (!activities || activities.length === 0) {
    return <div className="activity-log">No recent activities</div>;
  }

  return (
    <div className="activity-log">
      {activities.map((activity) => (
        <div key={`${activity.user}-${activity.action}-${activity.timestamp?.seconds}`} className="activity-item">
          <strong>{activity.user}</strong> {activity.action}
          <div className="activity-timestamp">
            {activity.timestamp ? new Date(activity.timestamp.seconds * 1000).toLocaleString() : 'N/A'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityLog;