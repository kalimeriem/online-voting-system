import React from 'react';
import './DepartmentSection.css';

const DepartmentSection = ({ departments, currentUserEmail }) => {

  return (
    <div className="team-sec">
      <div className="team-head">
        <h2>Departments</h2>
        <button className="btn">View all →</button>
      </div>

      <div className="team-g">
        {departments.map((dept, idx) => {
          const isMember = dept.members.some(m => m.email === currentUserEmail);
          return (
            <div key={idx} className="card">
              <div className="title">
                <h4>{dept.name}</h4>
                {dept.private && <span className="badge">Private</span>}
                {isMember && <span className="badge member">You belong</span>}
              </div>
              <p className="description">{dept.type}</p>
              <div className="members">
                <span className="icon">👥</span>
                <span>{dept.members.length} members</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentSection;


