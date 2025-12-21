import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './DepartmentDetails.css';

import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import InviteMemberModal from '../../modals/InviteMemberModal';
import ConfirmDialog from '../../modals/ConfirmDialog';

import { departmentRepository } from '../../api/repositories/DepartmentRepositoryCorrected';
import { invitationRepository } from '../../api/repositories/InvitationRepository';
import { userRepository } from '../../api/repositories/UserRepository';

import {
  FiArrowLeft,
  FiUsers,
  FiUserPlus,
  FiSettings,
  FiBriefcase,
  FiClock,
  FiMail,
  FiTrash2,
  FiEdit2,
  FiTrash
} from 'react-icons/fi';

function DepartmentDetailsAdmin() {
  const { id } = useParams();
  const departmentId = parseInt(id);

  const [department, setDepartment] = useState(null);
  const [members, setMembers] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invitationsLoading, setInvitationsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [userRole, setUserRole] = useState('Member');
  const [user, setUser] = useState(null);

  // State for settings menu and member delete confirmation
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  // Fetch department (keeps the rest unchanged)
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

  // ...pending invitations fetch code unchanged...
  const fetchPendingInvitations = async () => {
    try {
      setInvitationsLoading(true);
      const allInvitations = await invitationRepository.listInvitations();
      const departmentInvitations = allInvitations.filter(invitation => 
        invitation.departmentId === departmentId && 
        invitation.type === 'DEPARTMENT' &&
        invitation.status === 'PENDING'
      );
      setPendingInvitations(departmentInvitations);
    } catch (err) {
      console.error('Failed to load pending invitations:', err);
    } finally {
      setInvitationsLoading(false);
    }
  };
  useEffect(() => {
    if (departmentId) {
      fetchPendingInvitations();
      const intervalId = setInterval(fetchPendingInvitations, 30000);
      return () => clearInterval(intervalId);
    }
  }, [departmentId]);

  const handleInviteMember = async (email, departmentId) => {
    try {
      await invitationRepository.sendInvitation(email, departmentId);
      await fetchPendingInvitations();
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || 'Failed to send invitation');
    }
  };
  const handleDeleteInvitation = async (invitationId) => {
    try {
      await invitationRepository.respondToInvitation(invitationId, false);
      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch (err) {
      console.error('Failed to delete invitation', err);
    }
  };

  // Admin: Member remove logic with confirmation
  const askDeleteMember = (member) => {
    setMemberToDelete(member);
    setConfirmOpen(true);
  };
  const handleConfirmDeleteMember = () => {
    setMembers(prev => prev.filter(m => m.id !== memberToDelete.id));
    setConfirmOpen(false);
    setMemberToDelete(null);
  };
  const handleCancelDeleteMember = () => {
    setConfirmOpen(false);
    setMemberToDelete(null);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
                <div className="department-pending-invitations-card">
                  <div className="pending-invitations-icon"><FiClock size={22} color="#f59e0b" /></div>
                  <div>
                    <div className="pending-invitations-label">Pending Invitations</div>
                    <div className="pending-invitations-value">{pendingInvitations.length}</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Action buttons: Settings w/ edit/delete department as dropdown menu */}
            <div className="department-details-actions" style={{ position: 'relative' }}>
              <button className="invite-members-btn" onClick={() => setIsInviteModalOpen(true)}><FiUserPlus size={18} /> Invite Members</button>
              <div style={{ display: 'inline-block', position: 'relative' }}>
                <button className="settings-btn" onClick={() => setSettingsMenuOpen((open) => !open)}>
                  <FiSettings size={16} /> Settings
                </button>
                {settingsMenuOpen && (
                  <div style={{ position: "absolute", right: 0, marginTop: 4, background: "#fff", border: "1px solid #eee", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", borderRadius: 7, minWidth: 140, zIndex: 10 }}>
                    <button className="confirm-dialog-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: 10, border: 'none', background: 'none' }} onClick={() => alert('Edit department..')}><FiEdit2 size={16}/>Edit</button>
                    <button className="confirm-dialog-btn" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: 10, border: 'none', background: 'none', color: '#dc2626' }} onClick={() => alert('Delete department..')}><FiTrash size={16}/>Delete</button>
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
                { !member.isManager && (
                  <button className="delete-invitation-btn" onClick={() => askDeleteMember(member)} title="Remove member"><FiTrash2 size={16} /></button>
                )}
              </div>
            ))}
          </div>
          <ConfirmDialog
            open={confirmOpen}
            title={memberToDelete ? `Remove ${memberToDelete.name}?` : ''}
            message={memberToDelete ? `Are you sure you want to remove ${memberToDelete.email} from this department?` : ''}
            onConfirm={handleConfirmDeleteMember}
            onCancel={handleCancelDeleteMember}
          />
          {/* Pending Invitations section & modal unchanged */}
          <h3 className="pending-invitations-section-title">Pending Invitations</h3>
          {invitationsLoading ? (
            <div className="loading-invitations"><p>Loading pending invitations...</p></div>
          ) : pendingInvitations.length === 0 ? (<div className="no-pending-invitations"><p>No pending invitations.</p></div>) : (
            <div className="pending-invitations-list">
              {pendingInvitations.map(invitation => (
                <div key={invitation.id} className="pending-invitation-item">
                  <div className="pending-invitation-avatar"><FiMail size={18} /></div>
                  <div className="pending-invitation-info">
                    <div className="pending-invitation-email">{invitation.email}</div>
                    <div className="pending-invitation-details"><span className="pending-invitation-date">Invited on: {formatDate(invitation.createdAt)}</span>{invitation.invitedBy && (<span className="pending-invitation-inviter"> • Invited by: {invitation.invitedBy.name || invitation.invitedBy.email}</span>)}</div>
                  </div>
                  <button className="delete-invitation-btn" onClick={() => handleDeleteInvitation(invitation.id)} title="Delete invitation"><FiTrash2 size={16} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <InviteMemberModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteMember}
        departmentId={departmentId}
      />
    </div>
  );
}

export default DepartmentDetailsAdmin;
