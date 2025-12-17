import React from "react";
import "./DepartmentSection.css";

const DepartmentSection = ({ departments, currentUserEmail }) => {
  return (
    <div className="team-sec">
      <div className="team-g">
        {departments.map((dept) => {
          const members = dept.members || [];
          const isMember = members.some(
            (m) => m.email === currentUserEmail
          );

          return (
            <div key={dept.id} className="card">
              <div className="title">
                <h4>{dept.name}</h4>

                {/* Only show private badge if backend sends it */}
                {dept.private && (
                  <span className="badge">Private</span>
                )}

                {isMember && (
                  <span className="badge member">You belong</span>
                )}
              </div>

              <p className="description">
                {dept.description}
              </p>

              {/* Show members only if backend sends them */}
              {dept.members && (
                <div className="members">
                  <span className="icon">👥</span>
                  <span>{dept.members.length} members</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentSection;
