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

  return (
    <div className="grid">
      {statItems.map((item, index) => (
        <div key={index} className="card">
    <div className="header">
            <span>{item.label}</span>
 <span className={`icon ${item.color}`}>{item.icon}</span>
          </div>
                      <div className="number">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;