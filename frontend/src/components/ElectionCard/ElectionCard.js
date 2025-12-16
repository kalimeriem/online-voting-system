import React from "react";
import "./ElectionCard.css";

const ElectionCard = ({ election, departmentName, onCastVote }) => {
  const isEligible = true; // backend already filters eligible elections
  const canVote = isEligible && !election.hasVoted;

  // Sum votes from candidates
  const totalVotes =
    election.candidates?.reduce(
      (sum, c) => sum + (c.votes || 0),
      0
    ) || 0;

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
        {/* Department name */}
        <div className="detail">
          <span className="icon">🏫</span>
          <span>{departmentName}</span>
        </div>

        {/* Votes cast */}
        <div className="detail">
          <span className="icon">📊</span>
          <span>{totalVotes} votes cast</span>
        </div>

        {/* End date */}
        <div className="detail">
          <span className="icon">📅</span>
          <span>
            End: {new Date(election.endDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <button
        className="vote"
        onClick={() => onCastVote(election.id)}
        disabled={!canVote}
      >
        {election.hasVoted ? "Voted" : "Cast Your Vote"}
      </button>
    </div>
  );
};

export default ElectionCard;
