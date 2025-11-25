import React from 'react';
import './DepartmentSection.css';

const DepartmentSection = () => {
  const departments = [
    { name: 'ENSIA School', type: 'Main school department', members: 150 },
    { name: 'Teachers', type: 'Teaching staff department', members: 25, private: true },
    { name: 'Students', type: 'Student body', members: 100 },
    { name: 'Staff', type: 'Administrative staff', members: 25, private: true }
  ];

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
              <span>{dept.members} members</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentSection;