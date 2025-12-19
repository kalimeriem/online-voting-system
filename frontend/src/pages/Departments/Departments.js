// Departments.js
import React, { useState, useEffect } from 'react';
import './Departments.css';

import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import CreateDepartmentModal from '../../components/CreateDepartmentModal/CreateDepartmentModal';

import { departmentRepository } from '../../api/repositories/DepartmentRepositoryCorrected';

function Departments() {
  const [search, setSearch] = useState('');
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch departments from backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await departmentRepository.getDepartments();

        // Normalize backend data to frontend shape
        const mapped = data.map((d) => ({
          id: d.id,
          name: d.name,
          desc: d.description,
          members: d.members ?? 0, // backend may not send members yet
          role: d.role ?? 'Member', // fallback role
        }));

        setDepts(mapped);
      } catch (err) {
        console.error(err);
        setError('Failed to load departments');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const filtered = depts.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateDepartment = async ({ name, description }) => {
    try {
      const newDepartment = await departmentRepository.createDepartment(name, description);
      
      // Add the new department to the list
      const mapped = {
        id: newDepartment.id,
        name: newDepartment.name,
        desc: newDepartment.description,
        members: newDepartment.members?.length ?? 0,
        role: 'Manager', // Creator is automatically a manager
      };
      
      setDepts([...depts, mapped]);
    } catch (err) {
      console.error('Error creating department:', err);
      throw new Error(err.response?.data?.message || 'Failed to create department');
    }
  };

  return (
    <div className="departments-layout">
      <Header />

      <div className="departments-container">
        <Sidebar />

        <div className="departments-main">
          {/* Top Header */}
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
              strokeLinecap="round"
              strokeLinejoin="round"
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

          <h2 className="departments-section-title">All Departments</h2>

          {/* States */}
          {loading && <p>Loading departments...</p>}
          {error && <p className="error-text">{error}</p>}

          {/* Departments Grid */}
          {!loading && !error && (
            <div className="departments-grid">
              {filtered.map((d) => (
                <div key={d.id} className="department-card">
                  <div className="department-card-top">
                    <div className="department-icon">
                      <svg width="20" height="20" fill="none">
                        <path
                          d="M3 7L10 3L17 7V15L10 19L3 15V7Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>

                    <div className="department-info">
                      <div className="department-row">
                        <span className="department-name">{d.name}</span>
                        <span className="department-badge">{d.role}</span>
                      </div>
                      <div className="department-desc">{d.desc}</div>
                    </div>
                  </div>

                  <div className="department-card-bottom">
                    <svg width="14" height="14" fill="none">
                      <path
                        d="M9.33333 12.25V11.0833C9.33333 10.4645 9.08781 9.87104 8.65023 9.43346C8.21265 8.99587 7.61921 8.75 7 8.75H3.5C2.88079 8.75 2.28735 8.99587 1.84977 9.43346C1.41219 9.87104 1.16667 10.4645 1.16667 11.0833V12.25"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <path
                        d="M5.25 5.83333C6.31257 5.83333 7.175 4.9709 7.175 3.90833C7.175 2.84577 6.31257 1.98333 5.25 1.98333C4.18743 1.98333 3.325 2.84577 3.325 3.90833C3.325 4.9709 4.18743 5.83333 5.25 5.83333Z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </svg>

                    <span className="department-members">
                      {d.members} members
                    </span>
                  </div>
                </div>
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