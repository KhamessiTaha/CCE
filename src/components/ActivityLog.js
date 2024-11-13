import React from 'react';
import { FileText, Upload, Trash2, Edit, Plus, Users } from 'lucide-react';
import './ActivityLog.css';

const ActivityLog = ({ activities }) => {
  // Function to determine activity type and return appropriate icon
  const getActivityIcon = (action) => {
    if (action.includes('created')) return <Plus className="activity-icon activity-type-create" />;
    if (action.includes('modified') || action.includes('updated')) return <Edit className="activity-icon activity-type-update" />;
    if (action.includes('deleted')) return <Trash2 className="activity-icon activity-type-delete" />;
    if (action.includes('renamed')) return <FileText className="activity-icon activity-type-rename" />;
    if (action.includes('uploaded')) return <Upload className="activity-icon activity-type-upload" />;
    if (action.includes('joined')) return <Users className="activity-icon activity-type-join" />;
    return <FileText className="activity-icon" />;
  };

  // Function to get activity type class
  const getActivityTypeClass = (action) => {
    if (action.includes('created')) return 'activity-type-create';
    if (action.includes('modified') || action.includes('updated')) return 'activity-type-update';
    if (action.includes('deleted')) return 'activity-type-delete';
    if (action.includes('renamed')) return 'activity-type-rename';
    if (action.includes('uploaded')) return 'activity-type-upload';
    if (action.includes('joined')) return 'activity-type-join';
    return '';
  };

  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = new Date(timestamp.seconds * 1000);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 1000 / 60);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="activity-empty">
        No activities to show
      </div>
    );
  }

  return (
    <div className="activity-log-container">
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            {getActivityIcon(activity.action)}
            <span className="activity-user">{activity.user}</span>
            <span className={`activity-action ${getActivityTypeClass(activity.action)}`}>
              {activity.action}
            </span>
            <span className="activity-timestamp">
              {formatTimestamp(activity.timestamp)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;