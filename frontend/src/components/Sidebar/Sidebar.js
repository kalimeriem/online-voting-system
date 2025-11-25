import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Departments', icon: '🏢' },
    { name: 'Elections', icon: '🗳️' },
    { name: 'Results', icon: '📋' }
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <span className="logo-icon">🗳️</span>
        <span className="logo-text">VoteSystem</span>
      </div>
      
      <nav className="nav-menu">
        {menuItems.map(item => (
          <div 
            key={item.name}
            className={`nav-item ${activeItem === item.name ? 'active' : ''}`}
            onClick={() => setActiveItem(item.name)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.name}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;