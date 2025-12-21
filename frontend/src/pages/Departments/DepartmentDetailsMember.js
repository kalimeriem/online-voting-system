import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './DepartmentDetails.css';

import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import ConfirmDialog from '../../modals/ConfirmDialog';

import { departmentRepository } from '../../api/repositories/DepartmentRepositoryCorrected';
import { userRepository } from '../../api/repositories/UserRepository';

import {
  FiArrowLeft,
  FiUsers,
  FiSettings,
  FiBriefcase
} from 'react-icons/fi';

function DepartmentDetailsMember() {
  const { id } = useParams();
  const departmentId = parseInt(id);

  const [department, setDepartment] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('Member');
  const [user, setUser] = useState(null);
  // Settings menu state for the "Leave department" option
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userProfile = await userRepository.getProfile();
        setUser(userProfile);
        const allDepartments = await departmentRepository.getDepartments();
        const dept = allDepartments.find(d => d.id === departmentId);
        if (!dept) {
          setError('Department not found');
          return;
        }
        setDepartment({
          id: dept.id,
          name: dept.name,
          description: dept.description
        });
        // Static member preview
        setMembers([
          {
            id: 'static1',
            name: 'John Admin',
            email: 'john@company.com',
            isManager: true,
          },
          {
            id: 'static2',
            name: 'Jane Doe',
            email: 'jane@company.com',
            isManager: false,
          }
        ]);
        setUserRole(dept.role || 'Member');
      } catch (err) {
        console.error(err);
        setError('Failed to load department details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [departmentId]);

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  const handleLeaveDepartment = () => {
    setConfirmOpen(true);
  };
  const handleConfirmLeave = () => {
    setConfirmOpen(false);
    // Placeholder logic for leaving
    alert('You have left the department. (stub)');
  };
  const handleCancelLeave = () => {
    setConfirmOpen(false);
  };

  if (loading) {
    return (
      <div className="department-details-layout">
        <Header user={user} />
        <div className="department-details-container">
          <Sidebar />
          <div className="department-details-main">
            <p>Loading department details...</p>
          </div>
        </div>
      </div>
    );
  }
  if (error || !department) {
    return (
      <div className="department-details-layout">
        <Header user={user} />
        <div className="department-details-container">
          <Sidebar />
          <div className="department-details-main">
            <p className="error-text">{error}</p>
            <Link to="/departments" className="back-link"> ← Back to Departments </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="department-details-layout">
      <Header user={user} />
      <div className="department-details-container">
        <Sidebar />
        <div className="department-details-main">
          {/* Back link */}
          <Link to="/departments" className="back-link">
            <FiArrowLeft size={18} /> Back to Departments
          </Link>
          {/* Top section */}
          <div className="department-details-top">
            <div className="department-details-info-cards">
              <div className="department-info-main-card">
                <div className="department-info-icon"><FiBriefcase size={26} /></div>
                <div style={{ flex: 1 }}>
                  <div className="department-info-header-row">
                    <span className="department-info-title">{department.name}</span>
                    <span className="department-info-role-badge">{userRole}</span>
                  </div>
                  <div className="department-info-desc">{department.description || 'No description provided.'}</div>
                </div>
              </div>
              <div className="stats-cards-row">
                <div className="department-members-count-card">
                  <div className="department-members-summary-icon"><FiUsers size={22} color="#2563eb" /></div>
                  <div>
                    <div className="members-count-label">Total Members</div>
                    <div className="members-count-value">{members.length}</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Only settings button, with one menu item for leaving */}
            <div className="department-details-actions" style={{ position: 'relative' }}>
              <div style={{ display: 'inline-block', position: 'relative' }}>
                <button className="settings-btn" onClick={() => setSettingsMenuOpen((open) => !open)}>
                  <FiSettings size={16} /> Settings
                </button>
                {settingsMenuOpen && (
                  <div style={{ position: 'absolute', right: 0, marginTop: 4, background: '#fff', border: '1px solid #eee', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderRadius: 7, minWidth: 140, zIndex: 10 }}>
                    <button className="confirm-dialog-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: 10, border: 'none', background: 'none', color: '#dc2626' }} onClick={handleLeaveDepartment}>Leave department</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Members section */}
          <h3 className="members-section-title">Members</h3>
          <div className="members-list">
            {members.map(member => (
              <div key={member.id} className="member-item">
                <div className="member-avatar">{getInitials(member.name || member.email)}</div>
                <div className="member-info">
                  <div className="member-name">{member.name || 'Unknown'}</div>
                  <div className="member-email">{member.email}</div>
                </div>
                <span className={`member-role-badge ${member.isManager ? 'manager' : 'member'}`}>{member.isManager ? 'Manager' : 'Member'}</span>
                {/* No delete button for members in Member view */}
              </div>
            ))}
          </div>
          <ConfirmDialog
            open={confirmOpen}
            title="Leave department?"
            message={"Are you sure you want to leave this department?"}
            onConfirm={handleConfirmLeave}
            onCancel={handleCancelLeave}
          />
        </div>
      </div>
    </div>
  );
}

export default DepartmentDetailsMember;
