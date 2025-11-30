import React from 'react';
import './DepartmentSection.css';

const DepartmentSection = () => {
  const teams = [
    { name: 'ENSIA School', description: 'Main school department', members: 150 },
     { name: 'Teachers', description: 'Teaching staff department', members: 25, restricted: true },
     { name: 'Students', description: 'Student body', members: 100 },
    { name: 'Staff', description: 'Administrative staff', members: 25, restricted: true }
  ];

  return (
    <div className="team-sec">
 <div className="team-head">
     <h2>Departments</h2>
        <button className="btn">View all →</button>
      </div>

      <div className="team-g">
        {teams.map((team, idx) => (



          <div key={idx} className="card">
                      <div className="title">
              <h4>{team.name}</h4>
              {team.restricted && <span className="badge">Private</span>}
            </div>
            <p className="description">{team.description}</p>
            <div className="members">
                      <span className="icon">👥</span>
              <span>{team.members} members</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentSection;

