import React from 'react';
import './ElectionCard.css';

const ElectionCard = ({ election, onCastVote }) => {
  return (
    <div className="card">


      <div className="header">
        <h3>{election.title}</h3>



        <span className={`status ${election.status.toLowerCase()}`}>
          {election.status}

        </span>

      </div>




      <p className="votedesc">{election.description}</p>

      <div className="details">
        <div className="detail">



          <span className="icon">👥</span>
          <span>Students</span>

        </div>
        <div className="detail">
          <span className="icon">📊</span>
          <span>{election.students} total cast</span>
        </div>

        <div className="detail">

          <span className="icon">📅</span>
          <span>End: {election.endDate}</span>

        </div>
      </div>

      <button 
        className="vote"

        onClick={() => onCastVote(election.id)}
      >
        Cast Your Vote
      </button>


      
    </div>
  );
};

export default ElectionCard;
