
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import StatsGrid from '../../components/StatsGrid/StatsGrid';
import '../../components/ElectionCard/ElectionCard.css';
import './Elections.css';
import './AdminElectionPanel.css';
import '../../components/StatsGrid/StatsGrid.css';

const UserElectionDetails = ({ election, user }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState(election.hasVoted || false);
  const navigate = useNavigate();

  const handleVoteSubmit = () => {
    if (selectedCandidate !== null && !hasVoted) {
      setHasVoted(true);
      alert(`Vote cast for ${election.candidates[selectedCandidate].name}`);
    }
  };

  const isEligible = election.eligibleVoters?.some(v => v.email === user.email);
  
  const totalVotes = (election.candidates || []).reduce((sum, c) => sum + (c.votes || 0), 0);
  const eligibleVoters = election.eligibleVoters ? election.eligibleVoters.length : 0;
  const durationDays = (() => {
    if (!election.startDate || !election.endDate) return '';
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return `${diff} days`;
  })();

  const statsForGrid = {
    departments: eligibleVoters,
    activeElections: totalVotes,
    upcoming: durationDays,
    completed: election.status
  };

  return (
    <div className="dashboard-wrapper">
      <Header user={user} />
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <div className="admin-panel-header-row">
            <button
              className="back-btn"
              onClick={() => navigate('/elections')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div>
              <div className="admin-panel-header">
                <span className="admin-panel-title">Vote in Election</span>
                <span className={`status-badge ${election.status.toLowerCase()}`}>{election.status}</span>
              </div>
              <div className="admin-panel-subtitle">Cast your vote for your preferred candidate</div>
            </div>
          </div>
          <div className="admin-panel-card">
            <div className="admin-election-details">
              <div>
                <div className="admin-election-details-title">Election Details</div>
                <div className="admin-election-details-desc">Basic information about this election</div>
                <div className="admin-election-details-row"><strong>Title</strong><br />{election.title}</div>
                <div className="admin-election-details-row"><strong>Description</strong><br />{election.description}</div>
              </div>
            </div>
            <StatsGrid stats={statsForGrid} />
            
            {!isEligible ? (
              <div className="admin-election-results">
                <div className="admin-election-results-title">Not Eligible</div>
                <div className="admin-election-results-desc">You are not eligible to vote in this election</div>
              </div>
            ) : hasVoted ? (
              <div className="admin-election-results">
                <div className="admin-election-results-title">Vote Submitted</div>
                <div className="admin-election-results-desc">Thank you for voting! Your vote has been recorded.</div>
              </div>
            ) : (
              <div className="admin-election-results">
                <div className="admin-election-results-title">Cast Your Vote</div>
                <div className="admin-election-results-desc">Select one candidate to vote for</div>
                <div style={{ marginBottom: '20px' }}>
                  {(election.candidates || []).map((candidate, idx) => (
                    <div
                      key={idx}
                      className={`candidates-list-item ${selectedCandidate === idx ? 'selected' : ''}`}
                      onClick={() => setSelectedCandidate(idx)}
                      style={{ cursor: 'pointer', marginBottom: '10px', padding: '15px', border: selectedCandidate === idx ? '2px solid #007bff' : '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: selectedCandidate === idx ? '#f0f8ff' : '#fff' }}
                    >
                      <div>
                        <div className="candidates-list-name">{candidate.name}</div>
                        <div className="candidates-list-desc">{candidate.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="candidates-add-btn"
                  disabled={selectedCandidate === null}
                  onClick={handleVoteSubmit}
                  style={{ backgroundColor: selectedCandidate === null ? '#ccc' : '#111827' }}
                >
                  Submit Vote
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserElectionDetails;