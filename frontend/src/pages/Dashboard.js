import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pollRepository } from '../api/repositories/pollRepository';
import Navbar from '../components/Navbar';
import '../styles/dashboard.css';



function Dashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [visibilityFilter, setVisibilityFilter] = useState('all'); // NEW: all, public, private
  const [sortBy, setSortBy] = useState('recent'); // recent, oldest



  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      navigate('/login');
      return;
    }
    setAdmin(JSON.parse(adminData));
    fetchPolls();
    // eslint-disable-next-line
  }, [navigate]);



  const fetchPolls = async () => {
    try {
      const response = await pollRepository.getMyPolls();
      setPolls(response.data);
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (e, pollId, pollTitle) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    
    if (!window.confirm(`Are you sure you want to delete "${pollTitle}"? This action cannot be undone.`)) {
      return;
    }


    setDeletingId(pollId);
    try {
      await pollRepository.deletePoll(pollId);
      setPolls(polls.filter(p => p.id !== pollId));
    } catch (error) {
      console.error('Error deleting poll:', error);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter and sort polls
  const getFilteredAndSortedPolls = () => {
    let filtered = [...polls];

    // Apply status filter
    if (filter === 'active') {
      filtered = filtered.filter(p => !p.hasEnded);
    } else if (filter === 'completed') {
      filtered = filtered.filter(p => p.hasEnded);
    }

    // NEW: Apply visibility filter
    if (visibilityFilter === 'public') {
      filtered = filtered.filter(p => p.isPublic);
    } else if (visibilityFilter === 'private') {
      filtered = filtered.filter(p => !p.isPublic);
    }

    // Apply sort
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return filtered;
  };

  const filteredPolls = getFilteredAndSortedPolls();
  const activePolls = polls.filter(p => !p.hasEnded);
  const completedPolls = polls.filter(p => p.hasEnded);
  const publicPolls = polls.filter(p => p.isPublic); // NEW
  const privatePolls = polls.filter(p => !p.isPublic); // NEW
  const totalVotes = polls.reduce((sum, p) => sum + p.totalVotes, 0);



  if (!admin) return null;



  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Navbar />
      
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="page-header">
          <h1 className="page-title">Welcome, {admin.name || 'Admin'}</h1>
          <p className="page-subtitle">Here's what's happening with your voting activities</p>
        </div>



        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-info">
                <h3>Total Polls</h3>
                <div className="stat-value">{polls.length}</div>
              </div>
              <div className="stat-icon icon-blue">📊</div>
            </div>
          </div>



          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-info">
                <h3>Active Polls</h3>
                <div className="stat-value">{activePolls.length}</div>
              </div>
              <div className="stat-icon icon-green">✅</div>
            </div>
          </div>



          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-info">
                <h3>Total Votes</h3>
                <div className="stat-value">{totalVotes}</div>
              </div>
              <div className="stat-icon icon-orange">🗳️</div>
            </div>
          </div>



          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-info">
                <h3>Completed</h3>
                <div className="stat-value">{completedPolls.length}</div>
              </div>
              <div className="stat-icon icon-purple">✔️</div>
            </div>
          </div>
        </div>



        {/* Polls Section with Filters */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">My Polls</h2>
            <button className="btn-secondary" onClick={() => navigate('/create-poll')}>
              + Create New Poll
            </button>
          </div>

          {/* Filter and Sort Controls */}
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            marginBottom: '24px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Status:</span>
              <button 
                className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter('all')}
              >
                All ({polls.length})
              </button>
              <button 
                className={filter === 'active' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter('active')}
              >
                Active ({activePolls.length})
              </button>
              <button 
                className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setFilter('completed')}
              >
                Completed ({completedPolls.length})
              </button>
            </div>

            {/* NEW: Visibility Filter */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Visibility:</span>
              <button 
                className={visibilityFilter === 'all' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setVisibilityFilter('all')}
              >
                All
              </button>
              <button 
                className={visibilityFilter === 'public' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setVisibilityFilter('public')}
              >
                🌐 Public ({publicPolls.length})
              </button>
              <button 
                className={visibilityFilter === 'private' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setVisibilityFilter('private')}
              >
                🔒 Private ({privatePolls.length})
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Sort:</span>
              <button 
                className={sortBy === 'recent' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setSortBy('recent')}
              >
                Most Recent
              </button>
              <button 
                className={sortBy === 'oldest' ? 'filter-btn active' : 'filter-btn'}
                onClick={() => setSortBy('oldest')}
              >
                Oldest
              </button>
            </div>
          </div>



          {loading ? (
            <div>Loading...</div>
          ) : filteredPolls.length > 0 ? (
            <div className="polls-list">
              {filteredPolls.map((poll) => (
                <div 
                  key={poll.id} 
                  className="poll-card"
                  onClick={() => navigate(`/poll/${poll.id}/stats`)}
                >
                  <div className="poll-header">
                    <div>
                      <div className="poll-title">{poll.title}</div>
                      <div className="poll-description">{poll.description}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={poll.hasEnded ? 'poll-badge badge-ended' : 'poll-badge badge-active'}>
                        {poll.hasEnded ? 'Ended' : 'Active'}
                      </span>
                      <button
                        className="btn-delete-icon"
                        onClick={(e) => handleDelete(e, poll.id, poll.title)}
                        disabled={deletingId === poll.id}
                        title="Delete poll"
                      >
                        {deletingId === poll.id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  </div>
                  <div className="poll-meta">
                    <div className="meta-item">
                      <span>👥</span>
                      {poll.totalVotes} votes cast
                    </div>
                    <div className="meta-item">
                      <span>⏰</span>
                      {poll.hasEnded ? 'Ended' : 'Ends'} {new Date(poll.endDate).toLocaleDateString()}
                    </div>
                    <div className="meta-item">
                      <span>{poll.isPublic ? '🌐' : '🔒'}</span>
                      {poll.isPublic ? 'Public' : 'Private'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <div className="empty-title">No polls found</div>
              <div className="empty-text">
                Try adjusting your filters or create a new poll
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



export default Dashboard;
