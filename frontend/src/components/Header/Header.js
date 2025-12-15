import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function DashboardHeader({ user, toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <div className="dashboard-header">
      <div className="header-container">

        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          ☰
        </button>

       
        <div className="logo-section">
          <div className="logo-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="brand-name">VoteSystem</span>
        </div>

        
        <div className="right-section">
          <button className="icon-button">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="notification-dot"></span>
          </button>




          <div className="user-profile">
            <div className="user-avatar">
              <span className="user-initials">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'DM'}
              </span>

            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Desiali'}</span>
              <span className="user-email">{user?.email || 'incpanslat648@gmail.com'}</span>
            </div>
          </div>



          <button className="icon-button" onClick={handleLogout} title="Logout">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
