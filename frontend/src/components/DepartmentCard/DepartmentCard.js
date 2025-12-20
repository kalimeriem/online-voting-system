import React from 'react';
import './DepartmentCard.css';

const DepartmentCard = ({ 
  department, 
  onClick, 
  showMembers = true 
}) => {
  const {
    id,
    name,
    description,
    desc, // Support both description and desc
    members = 0,
    role,
    isManager, // Support isManager flag
  } = department;

  // Use description or desc, whichever is available
  const deptDescription = description || desc || '';
  
  // Determine role badge text
  const roleBadge = role || (isManager ? 'Manager' : 'Member');

  return (
    <div 
      className={`department-card ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
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
            <span className="department-name">{name}</span>
            {roleBadge && (
              <span className="department-badge">{roleBadge}</span>
            )}
          </div>
          {deptDescription && (
            <div className="department-desc">{deptDescription}</div>
          )}
        </div>
      </div>

      {showMembers && (
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
            {members} {members === 1 ? 'member' : 'members'}
          </span>
        </div>
      )}
    </div>
  );
};

export default DepartmentCard;

