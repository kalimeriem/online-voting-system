import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Departments.css';

import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import CreateDepartmentModal from '../../modals/CreateDepartmentModal';
import DepartmentCard from '../../components/DepartmentCard/DepartmentCard';

import { departmentRepository } from '../../api/repositories/DepartmentRepositoryCorrected';
import { userRepository } from '../../api/repositories/UserRepository';
import { invitationRepository } from '../../api/repositories/InvitationRepository';

function Departments() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [invitations, setInvitations] = useState([]);
  const [loadingInvitations, setLoadingInvitations] = useState(true);

  // Fetch user + departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await userRepository.getProfile();
        setUser(userProfile);

        const data = await departmentRepository.getDepartments();
        const mapped = data.map((d) => ({
          id: d.id,
          name: d.name,
          desc: d.description,
          members: d.members ?? 0,
          role: d.role ?? 'Member',
        }));

        setDepts(mapped);
      } catch (err) {
        console.error(err);
        setError('Failed to load departments');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch invitations (received only)
  useEffect(() => {
    if (!user?.email) return;

    const fetchInvitations = async () => {
      try {
        const data = await invitationRepository.listInvitations();

        const receivedInvitations = data.filter(
          (inv) =>
            inv.email === user.email &&
            inv.type === 'DEPARTMENT' &&
            inv.status === 'PENDING'
        );

        setInvitations(receivedInvitations);
      } catch (err) {
        console.error('Failed to load invitations', err);
      } finally {
        setLoadingInvitations(false);
      }
    };

    fetchInvitations();
  }, [user]);

  const filtered = depts.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateDepartment = async ({ name, description }) => {
    try {
      const newDepartment = await departmentRepository.createDepartment(
        name,
        description
      );

      const mapped = {
        id: newDepartment.id,
        name: newDepartment.name,
        desc: newDepartment.description,
        members: newDepartment.members?.length ?? 0,
        role: 'Manager',
      };

      setDepts((prev) => [...prev, mapped]);
    } catch (err) {
      console.error('Error creating department:', err);
      throw new Error(
        err.response?.data?.message || 'Failed to create department'
      );
    }
  };

  const handleRespondInvitation = async (invitationId, accept) => {
    try {
      await invitationRepository.respondToInvitation(invitationId, accept);
      setInvitations((prev) =>
        prev.filter((inv) => inv.id !== invitationId)
      );
    } catch (err) {
      console.error('Failed to respond to invitation', err);
    }
  };

  return (
    <div className="departments-layout">
      <Header user={user} />

      <div className="departments-container">
        <Sidebar />

        <div className="departments-main">
          {/* Header */}
          <div className="departments-top">
            <div>
              <h1 className="departments-title">Departments</h1>
              <p className="departments-subtitle">
                Manage and browse organizational departments
              </p>
            </div>

            <button
              className="departments-create-btn"
              onClick={() => setIsModalOpen(true)}
            >
              <span>+ Create Department</span>
            </button>
          </div>

          {/* Search */}
          <div className="departments-search">
            <svg
              className="departments-search-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              type="text"
              placeholder="Search departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Summary */}
          <div className="departments-summary-card">
            <div className="departments-summary-icon">
              <svg width="20" height="20" fill="none">
                <path
                  d="M3 7L10 3L17 7V15L10 19L3 15V7Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            <div>
              <div className="departments-summary-label">
                Total Departments
              </div>
              <div className="departments-summary-value">
                {loading ? '—' : depts.length}
              </div>
            </div>
          </div>

          {/* ✅ Pending Invitations (ONLY if not empty) */}
          {!loadingInvitations && invitations.length > 0 && (
            <>
              <h2 className="departments-section-title">
                Pending Invitations
              </h2>

              <div className="departments-invitations">
                {invitations.map((inv) => (
                  <div key={inv.id} className="invitation-card">
                    <div className="invitation-info">
                      <strong>{inv.department?.name}</strong>
                      <p>{inv.department?.description}</p>
                    </div>

                    <div className="invitation-actions">
                      <button
                        className="invitation-btn accept"
                        onClick={() =>
                          handleRespondInvitation(inv.id, true)
                        }
                      >
                        Accept
                      </button>
                      <button
                        className="invitation-btn decline"
                        onClick={() =>
                          handleRespondInvitation(inv.id, false)
                        }
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Departments */}
          <h2 className="departments-section-title">All Departments</h2>

          {loading && <p>Loading departments...</p>}
          {error && <p className="error-text">{error}</p>}

          {!loading && !error && (
            <div className="departments-grid">
              {filtered.map((d) => (
                <DepartmentCard
                  key={d.id}
                  department={d}
                  onClick={() =>
                    navigate(`/departments/${d.id}`)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateDepartmentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateDepartment}
      />
    </div>
  );
}

export default Departments;
