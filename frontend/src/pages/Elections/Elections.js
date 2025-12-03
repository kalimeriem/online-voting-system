import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import StatsGrid from '../../components/StatsGrid/StatsGrid';
import ElectionCard from '../../components/ElectionCard/ElectionCard';
import CreateElectionModal from '../../modals/CreateElectionModal';
import { useNavigate } from 'react-router-dom';

import './Elections.css';
import { getElections, getStats, createElection } from '../../api/repositories/ElectionRepository';

const Elections = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user')) || {
    name: 'John',
    email: 'john@example.com'
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const handleCastVote = (electionId) => {
    navigate(`/elections/${electionId}`);
  };
  const [elections, setElections] = useState(getElections());
  const [stats, setStats] = useState(getStats());
  const handleCreateElection = (newElection) => {
    createElection(newElection, user.email);
    setElections(getElections());
    setStats(getStats());
  };
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="dashboard-wrapper">
      <Header user={user} />
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <div className="welcome-section">
            <div className="section">
              <h1 className="welcome-title">Elections {user.name}</h1>
              <p className="welcome-subtitle">
                Browse and participate in elections
              </p>
            </div>
            <button className="Create-election-btn" onClick={() => setShowCreateModal(true)}>
              <span >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Create Election
              </span>
            </button>
          </div>
          <CreateElectionModal
            open={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateElection}
            userEmail={user.email}
          />
          <div className="search-container">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="text" placeholder="Search elections..." />
          </div>
          <StatsGrid stats={stats} />
          <div className="section">
            <div className="elections-tabs">
              <button
                className={`tab${activeTab === 'active' ? ' active' : ''}`}
                onClick={() => setActiveTab('active')}
              >
                Active ({stats.activeElections})
              </button>
              <button
                className={`tab${activeTab === 'upcoming' ? ' active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming ({stats.upcoming})
              </button>
              <button
                className={`tab${activeTab === 'completed' ? ' active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                Completed ({stats.completed})
              </button>
            </div>
            <div className="elections-grid">
              {elections.filter(e => e.status.toLowerCase() === activeTab).map(election => (
                <ElectionCard
                  key={election.id}
                  election={election}
                  onCastVote={handleCastVote}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Elections;



