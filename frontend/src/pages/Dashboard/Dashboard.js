import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import StatsGrid from '../../components/StatsGrid/StatsGrid';
import ElectionCard from '../../components/ElectionCard/ElectionCard';
import DepartmentSection from '../../components/DepartmentSection/DepartmentSection';
import RecentActivity from '../../components/RecentActivity/RecentActivity';
import { getDepartments } from '../../api/repositories/DepartmentRepository';
import { getElectionsFromAPI, getStats, getUserVote } from '../../api/repositories/ElectionRepository';
import './Dashboard.css';

const Dashboard = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user')) || {
    name: 'John',
    email: 'john@example.com'
  });

  const [overview, setOverview] = useState({
    departments: 0,
    activeElections: 0,
    upcoming: 0,
    completed: 0
  });

  const [departments, setDepartments] = useState([]);
  const [elections, setElections] = useState([]);

  // Helper function to compute election status
  const computeStatus = (election) => {
    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    if (now < startDate) return 'UPCOMING';
    if (now > endDate) return 'ENDED';
    return 'ACTIVE';
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const deps = getDepartments();
        const stats = getStats();
        const allElections = await getElectionsFromAPI();
        
        // Compute proper statuses and check vote status
        const electionsWithStatus = await Promise.all(
          allElections.map(async (e) => {
            try {
              const userVote = await getUserVote(e.id);
              return {
                ...e,
                status: computeStatus(e),
                hasVoted: userVote ? true : false
              };
            } catch (err) {
              return {
                ...e,
                status: computeStatus(e),
                hasVoted: false
              };
            }
          })
        );
        
        setDepartments(deps);
        setElections(electionsWithStatus);
        
        // Calculate stats
        const activeCount = electionsWithStatus.filter(e => e.status === 'ACTIVE').length;
        const upcomingCount = electionsWithStatus.filter(e => e.status === 'UPCOMING').length;
        const completedCount = electionsWithStatus.filter(e => e.status === 'ENDED').length;
        
        setOverview({
          departments: deps.length,
          activeElections: activeCount,
          upcoming: upcomingCount,
          completed: completedCount
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadData();
  }, []);

  const castVote = (id) => {
    console.log('Vote submitted for:', id);
    // Optional: update election's hasVoted
    setElections(prev =>
      prev.map(e => e.id === id ? { ...e, hasVoted: true } : e)
    );
  };

  return (
    <div className="dashboard">
      <Header user={user} />

      <div className="dashboard-container">
        <Sidebar />

        <div className="main">
          <div className="welcome">
            <h1 className="welcome-t">Welcome back, {user.name}</h1>
            <p className="welcome-sub">Here’s a quick look at your voting status</p>
          </div>

          <StatsGrid stats={overview} />

          <div className="section">
            <div className="section-head">
              <h2>Active Elections</h2>
              <button className="view-all">View all →</button>
            </div>

            {elections.map(election => (
              <ElectionCard
                key={election.id}
                election={election}
                onCastVote={castVote}
              />
            ))}
          </div>

          <DepartmentSection departments={departments} currentUserEmail={user.email} />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
