import React from 'react';
import './StatsGrid.css';

const StatsGrid = ({ stats }) => {
  const statItems = [
    { 
      label: 'My Departments', 
      value: stats.departments, 
      icon: '📊', 
      color: 'blue' 
    },
    { 
      label: 'Active Elections', 
      value: stats.activeElections, 
      icon: '🗳️', 
      color: 'green' 
    },
    { 
      label: 'Upcoming', 
      value: stats.upcoming, 
      icon: '⏰', 
      color: 'orange' 
    },
    { 
      label: 'Completed', 
      value: stats.completed, 
      icon: '✅', 
      color: 'purple' 
    }
  ];

 const visibleItems = statItems.filter(item => item.value !== undefined);

return (
  <div className="stats-grid">
    {visibleItems.map((item, index) => (
      <div key={index} className="stat-card">
        <div className="stat-header">
          <span>{item.label}</span>
          <span className={`stat-icon ${item.color}`}>{item.icon}</span>
        </div>
        <div className="stat-number">{item.value}</div>
      </div>
    ))}
  </div>
);
};

export default StatsGrid;