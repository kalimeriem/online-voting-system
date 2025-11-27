import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import StatsGrid from '../../components/StatsGrid/StatsGrid';
import ElectionCard from '../../components/ElectionCard/ElectionCard';
import DepartmentSection from '../../components/DepartmentSection/DepartmentSection';
import RecentActivity from '../../components/RecentActivity/RecentActivity';
import './Dashboard.css';

const Dashboard = () => {
  const [user] = useState({
    name: 'John',
    email: 'john@example.com'
  });

  const [stats] = useState({
    departments: 4,
    activeElections: 1,
    upcoming: 1,
    completed: 3
  });

  const [elections] = useState([
    {
      id: 1,
      title: 'Student Council President 2024',
      description: 'Annual election for student council president position',
      status: 'Active',
      students: 41,
      endDate: '23/10/2024',
      hasVoted: false
    }
  ]);

  const handleCastVote = (electionId) => {
    console.log(`Casting vote for election ${electionId}`);
  };

  return (
    <div className="dashboard-wrapper">
      <Header user={user} />

      <div className="dashboard-container">
        <Sidebar />

        <div className="main-content">
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back, {user.name}</h1>
            <p className="welcome-subtitle">
              Here's what's happening with your voting activities
            </p>
          </div>

          <StatsGrid stats={stats} />

          <div className="section">
            <div className="section-header">
              <h2>Active Elections</h2>
              <button className="view-all-btn">View all →</button>
            </div>

            {elections.map(election => (
              <ElectionCard
                key={election.id}
                election={election}
                onCastVote={handleCastVote}
              />
            ))}
          </div>

          <DepartmentSection />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
