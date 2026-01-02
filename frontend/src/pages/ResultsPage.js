import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { voteRepository } from '../api/repositories/voteRepository';
import '../styles/global.css';

function ResultsPage() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, [pollId]);

  const fetchResults = async () => {
    try {
      const response = await voteRepository.getResults(parseInt(pollId));
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '700px' }}>
        <div className="auth-logo">
          <div className="logo-icon">📊</div>
          <div className="logo-text">Poll Results</div>
        </div>

        <div className="auth-header">
          <h2>{results.poll.title}</h2>
          {results.poll.description && <p>{results.poll.description}</p>}
          <p style={{ fontSize: '13px', color: '#999', marginTop: '8px' }}>
            {results.poll.hasEnded ? 'Poll Ended' : 'Poll Active'} • {results.totalVotes} total votes
          </p>
        </div>

        <div style={{ marginTop: '32px' }}>
          {results.results.map((option) => (
            <div key={option.optionId} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', color: '#333' }}>
                  {option.text}
                  {results.winner.optionId === option.optionId && ' 🏆'}
                </span>
                <span style={{ fontWeight: '600', color: '#0066FF' }}>
                  {option.percentage}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '12px',
                background: '#e0e0e0',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${option.percentage}%`,
                  height: '100%',
                  background: results.winner.optionId === option.optionId ? '#0066FF' : '#66b3ff',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                {option.votes} votes
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: '#f5f7fa',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            Winner
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#0066FF' }}>
            {results.winner.text}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
            with {results.winner.percentage}% ({results.winner.votes} votes)
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={() => navigate('/')}
          style={{ marginTop: '24px' }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;