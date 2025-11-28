import React from 'react';
import './DepartmentSection.css';
import { getDepartments } from '../../repositories/DepartmentRepository';

const DepartmentSection = () => {
  const departments = getDepartments();

  return (
    <div className="section">
      <div className="section-header">
        <h2>My Departments</h2>
        <button className="view-all-btn">View all →</button>
      </div>
      <div className="departments-grid">
        {departments.map((dept, index) => (
          <div key={index} className="department-card">
            <div className="dept-header">
              <h4>{dept.name}</h4>
              {dept.private && <span className="private-badge">Private</span>}
            </div>
            <p className="dept-type">{dept.type}</p>
            <div className="dept-members">
              <span className="member-icon">👥</span>
              <span>{dept.members.length} members</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentSection;