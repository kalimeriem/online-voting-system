
import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import '../../components/ElectionCard/ElectionCard.css';
import './Elections.css';
import StatsGrid from '../../components/StatsGrid/StatsGrid';

const UserElectionDetails = ({ election, user }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [stats, setStats] = useState({
    department: election.department || 'No Department',
    totalVotes: election.voters || (election.eligibleVoters ? election.eligibleVoters.length : 0),
    startDate: election.startDate,
    endDate: election.endDate
  });
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
            <StatsGrid stats={stats} />
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