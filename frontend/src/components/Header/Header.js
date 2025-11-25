import React from 'react';
import './Header.css';

const Header = ({ user }) => {
  return (
    <header className="header">
      <div className="welcome-section">
        <h1>Welcome back, {user.name}</h1>
        <p>Here's what's happening with your voting activities</p>
      </div>
      <div className="user-profile">
        <span>Delhi</span>
        <div className="profile-avatar">
          {user.name.split(' ').map(n => n,[],).join('')}  
          {/* OBJECT OBJECT BETWEEN[] */}
        </div>
      </div>
    </header>
  );
};

export default Header;