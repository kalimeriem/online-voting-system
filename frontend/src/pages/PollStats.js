import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pollRepository } from '../api/repositories/pollRepository';
import Navbar from '../components/Navbar';
import '../styles/dashboard.css';

function PollStats() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🆕 NEW STATE for adding voters
  const [showAddVoters, setShowAddVoters] = useState(false);
  const [newVoterEmails, setNewVoterEmails] = useState('');
  const [addingVoters, setAddingVoters] = useState(false);
  const [addVotersMessage, setAddVotersMessage] = useState('');

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, [pollId]);

  const fetchStats = async () => {
    try {
      const response = await pollRepository.getPollStats(parseInt(pollId));
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const copyPollUrl = () => {
    const url = `http://localhost:3000/vote/${stats.poll.uniqueUrl}`;
    navigator.clipboard.writeText(url);
  };

  // 🆕 NEW FUNCTION: Handle adding voters
  const handleAddVoters = async () => {
    setAddVotersMessage('');
    
    const emails = newVoterEmails
      .split('\n')
      .map(e => e.trim())
      .filter(e => e);

    if (emails.length === 0) {
      setAddVotersMessage('⚠️ Please enter at least one email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(e => !emailRegex.test(e));
    if (invalidEmails.length > 0) {
      setAddVotersMessage(`⚠️ Invalid emails: ${invalidEmails.join(', ')}`);
      return;
    }

    setAddingVoters(true);
    try {
      const response = await pollRepository.addVoters(parseInt(pollId), emails);
      setAddVotersMessage(`✅ ${response.data.message}`);
      setNewVoterEmails('');
      setTimeout(() => setShowAddVoters(false), 2000);
    } catch (err) {
      setAddVotersMessage(`❌ ${err.response?.data?.message || 'Failed to add voters'}`);
    } finally {
      setAddingVoters(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        <Navbar />
        <div style={{ padding: '32px', textAlign: 'center' }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        <Navbar />
        <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Navbar />

      <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="page-header">
          <h1 className="page-title">{stats.poll.title}</h1>
          <p className="page-subtitle">
            {stats.poll.hasEnded ? '🔴 Poll Ended' : '🟢 Poll Active'} • {stats.totalVotes} total votes
          </p>
        </div>

        <div className="section" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn-primary" 
              onClick={copyPollUrl}
              disabled={stats.poll.hasEnded}
              style={stats.poll.hasEnded ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              📋 Copy Poll URL
            </button>

            {/* 🆕 NEW BUTTON: Add Voters (only for private, active polls) */}
            {!stats.poll.isPublic && !stats.poll.hasEnded && (
              <button 
                className="btn-primary"
                onClick={() => setShowAddVoters(!showAddVoters)}
                style={{ background: '#28a745' }}
              >
                ➕ Add Voters
              </button>
            )}

            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* 🆕 NEW SECTION: Add Voters UI */}
        {showAddVoters && (
          <div className="section" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: '600' }}>
              Add Eligible Voters
            </h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
              Enter email addresses (one per line):
            </p>
            <textarea
              placeholder="voter1@example.com&#10;voter2@example.com&#10;voter3@example.com"
              value={newVoterEmails}
              onChange={(e) => setNewVoterEmails(e.target.value)}
              rows="6"
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontFamily: 'monospace',
                resize: 'vertical'
              }}
            />
            <div style={{ marginTop: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button 
                className="btn-primary"
                onClick={handleAddVoters} 
                disabled={addingVoters}
                style={{ background: '#28a745' }}
              >
                {addingVoters ? 'Adding...' : 'Add Voters'}
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowAddVoters(false)}
              >
                Cancel
              </button>
              {addVotersMessage && (
                <span style={{ fontSize: '14px', marginLeft: '8px' }}>
                  {addVotersMessage}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="section">
          <h2 className="section-title">Results</h2>
          
          <div style={{ marginTop: '24px' }}>
            {stats.results.map((option) => (
              <div key={option.optionId} style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', fontSize: '16px', color: '#333' }}>
                    {option.text}
                    {stats.poll.hasEnded && stats.winner.optionId === option.optionId && ' 🏆'}
                  </span>
                  <span style={{ fontWeight: '700', fontSize: '16px', color: '#0066FF' }}>
                    {option.percentage}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '16px',
                  background: '#e0e0e0',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${option.percentage}%`,
                    height: '100%',
                    background: stats.winner.optionId === option.optionId ? '#0066FF' : '#66b3ff',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '6px' }}>
                  {option.votes} votes
                </div>
              </div>
            ))}
          </div>

          {stats.poll.hasEnded && (
            <div style={{
              marginTop: '32px',
              padding: '24px',
              background: '#f5f7fa',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                🏆 Winner
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#0066FF' }}>
                {stats.winner.text}
              </div>
              <div style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>
                {stats.winner.percentage}% • {stats.winner.votes} votes
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PollStats;
