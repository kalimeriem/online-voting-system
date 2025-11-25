import React from 'react';
import './ElectionCard.css';

const ElectionCard = ({ election, onCastVote }) => {
  return (
    <div className="election-card">
      <div className="election-header">
        <h3>{election.title}</h3>
        <span className={`status-badge ${election.status.toLowerCase()}`}>
          {election.status}
        </span>
      </div>
      <p className="election-description">{election.description}</p>
      
      <div className="election-stats">
        <div className="stat-item">
          <span className="stat-icon">👥</span>
          <span>Students</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📊</span>
          <span>{election.students} total cast</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📅</span>
          <span>End: {election.endDate}</span>
        </div>
      </div>
      
      <button 
        className="cast-vote-btn"
        onClick={() => onCastVote(election.id)}
      >
        Cast Your Vote
      </button>
    </div>
  );
};

export default ElectionCard;