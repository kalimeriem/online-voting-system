import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const admin = JSON.parse(localStorage.getItem('admin') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #e0e0e0',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        onClick={() => navigate('/dashboard')}
      >
        <div style={{
          width: '40px',
          height: '40px',
          background: '#0066FF',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '20px'
        }}>
          📊
        </div>
        <span style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
          VoteSystem
        </span>
      </div>

      {/* User Menu */}
      <div style={{ position: 'relative' }}>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'background 0.2s',
            background: showDropdown ? '#f5f7fa' : 'transparent'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f5f7fa'}
          onMouseLeave={(e) => e.currentTarget.style.background = showDropdown ? '#f5f7fa' : 'transparent'}
        >
          <div style={{
            width: '36px',
            height: '36px',
            background: '#0066FF',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {admin.name ? admin.name[0].toUpperCase() : admin.email?.[0].toUpperCase() || 'A'}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
              {admin.name || 'Admin'}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {admin.email}
            </div>
          </div>
          <span style={{ fontSize: '12px', color: '#666' }}>▼</span>
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <>
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99
              }}
              onClick={() => setShowDropdown(false)}
            />
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minWidth: '200px',
              zIndex: 100
            }}>
              <div style={{ padding: '8px' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#c33',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fee'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;