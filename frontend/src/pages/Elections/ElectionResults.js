import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import StatsGrid from '../../components/StatsGrid/StatsGrid';
import '../../components/ElectionCard/ElectionCard.css';
import './Elections.css';
import './AdminElectionPanel.css';
import '../../components/StatsGrid/StatsGrid.css';
import { getElectionResults } from '../../api/repositories/ElectionRepository';

const ElectionResults = ({ election, user }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch election results
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const resultsData = await getElectionResults(election.id);
        setResults(resultsData);
      } catch (err) {
        console.error("Failed to fetch election results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [election.id]);

  const totalVotes = results?.reduce((sum, c) => sum + (c.votes || 0), 0) || 0;
  const eligibleVoters = election.eligibleVoters ? election.eligibleVoters.length : 0;
  const turnout = eligibleVoters > 0 ? Math.round((totalVotes / eligibleVoters) * 100) : 0;
  
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
    upcoming: turnout + '%',
    completed: election.status
  };

  const getCandidatePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <Header user={user} />
        <div className="dashboard-container">
          <Sidebar />
          <div className="main-content">
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading results...</div>
          </div>
        </div>
      </div>
    );
  }

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
                <span className="admin-panel-title">Election Results</span>
                <span className={`status-badge ${election.status.toLowerCase()}`}>{election.status}</span>
              </div>
              <div className="admin-panel-subtitle">Final voting results and statistics</div>
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

            <div className="admin-election-results">
              <div className="admin-election-results-title">Results</div>
              <div className="admin-election-results-desc">Vote distribution among candidates</div>
              
              <div style={{ marginTop: '20px' }}>
                {totalVotes === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#999', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                    No votes cast in this election yet
                  </div>
                ) : (
                  results && results.length > 0 ? (
                    results.map((result, idx) => {
                      const candidate = result.candidate;
                      const percentage = getCandidatePercentage(result.votes);
                      const votes = result.votes || 0;
                      return (
                        <div
                          key={idx}
                          style={{
                            marginBottom: '20px',
                            padding: '15px',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
                                {candidate?.name || 'Unknown Candidate'}
                              </div>
                              {candidate?.description && (
                                <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                                  {candidate.description}
                                </div>
                              )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#007bff' }}>
                                {percentage}%
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                {votes} vote{votes !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          <div style={{
                            width: '100%',
                            height: '24px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div
                              style={{
                                height: '100%',
                                width: `${percentage}%`,
                                backgroundColor: '#007bff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                transition: 'width 0.3s ease'
                              }}
                            >
                              {percentage > 10 && `${percentage}%`}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                      No candidates in this election
                    </div>
                  )
                )}
              </div>

              <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px', borderLeft: '4px solid #007bff' }}>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  <strong>Total Votes Cast:</strong> {totalVotes} out of {eligibleVoters} eligible voters
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                  <strong>Voter Turnout:</strong> {turnout}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionResults;
