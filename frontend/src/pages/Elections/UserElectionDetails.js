
import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import '../../components/ElectionCard/ElectionCard.css';
import './Elections.css';

const UserElectionDetails = ({ election, user }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  return (
    <div className="dashboard-wrapper">
      <Header user={user} />
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <div className="election-card">
            <div className="election-header">
              <h3>{election.title}</h3>
              <span className={`status-badge ${election.status.toLowerCase()}`}>{election.status}</span>
            </div>
            <p className="election-description">{election.description}</p>
            <div className="election-stats">
              <div className="stat-item">
                <span className="stat-icon">👥</span>
                <span>Department: {election.department || 'N/A'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📊</span>
                <span>{election.candidates.reduce((sum, c) => sum + (c.votes || 0), 0)} total votes</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📅</span>
                <span>Start: {election.startDate} | End: {election.endDate}</span>
              </div>
            </div>
            <div className="vote-section">
              <h3>Cast Your Vote</h3>
              <p>Select one candidate to vote for</p>
              {election.candidates.map((candidate, idx) => (
                <div
                  key={idx}
                  className={`candidate-card${selectedCandidate === idx ? ' selected' : ''}`}
                  onClick={() => setSelectedCandidate(idx)}
                >
                  <strong>{candidate.name}</strong> <span>{candidate.description}</span>
                </div>
              ))}
              <button
                className="submit-vote-btn"
                disabled={selectedCandidate === null}
                // onClick={() => onVote(selectedCandidate)}
              >
                Submit Vote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserElectionDetails;
