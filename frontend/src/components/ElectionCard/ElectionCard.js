import React from 'react';
import './ElectionCard.css';

const ElectionCard = ({ election, onCastVote }) => {
  const currentUser = JSON.parse(localStorage.getItem('user')) || { email: 'john@example.com' };
  const currentUserEmail = currentUser.email;
  const isCreator = election.creator === currentUserEmail;
  const isEligible = Array.isArray(election.eligibleVoters)
  ? election.eligibleVoters.some(v => v.email === currentUserEmail)
  : false;
  const canVote = isEligible && !election.hasVoted && !isCreator;  return (
    <div className="card">
      <div className="header">
        <h3>{election.title}</h3>
        <span className={`status ${election.status.toLowerCase()}`}>{election.status}</span>
      </div>

      <p className="votedesc">{election.description}</p>

      <div className="details">
        <div className="detail">
          <span className="icon">👥</span>
          <span>Students</span>
        </div>
        <div className="detail">
          <span className="icon">📊</span>
          <span>{election.voters} total cast</span>
        </div>
        <div className="detail">
          <span className="icon">📅</span>
          <span>End: {election.endDate}</span>
        </div>
      </div>

      <button 
        className="vote"
        onClick={() => onCastVote(election.id)}
        disabled={!canVote && !isCreator}
      >
        {isCreator ? 'View Admin Panel' : 
         election.hasVoted ? 'Already Voted' : 
         !isEligible ? 'Not Eligible' : 'Cast Your Vote'}
      </button>
    </div>
  );
};

export default ElectionCard;
