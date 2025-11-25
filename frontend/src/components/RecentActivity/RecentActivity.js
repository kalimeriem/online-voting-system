import React from 'react';
import './RecentActivity.css';

const RecentActivity = () => {
  const activities = [
    {
      action: 'Voted in Student Council President 2024',
      time: '2 hours ago',
      icon: '✅',
      color: 'green'
    },
    {
      action: 'Joined ENSIA School department',
      time: '1 day ago',
      icon: '🏢',
      color: 'blue'
    },
    {
      action: 'Teacher of the Year election completed',
      time: '3 days ago',
      icon: '🏆',
      color: 'purple'
    }
  ];

  return (
    <div className="section">
      <h2>Recent Activity</h2>
      <p className="section-subtitle">Your latest voting activities</p>
      
      <div className="activity-list">
        {activities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className={`activity-icon ${activity.color}`}>
              {activity.icon}
            </div>
            <div className="activity-content">
              <p className="activity-text">{activity.action}</p>
              <span className="activity-time">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;