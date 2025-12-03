import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import StatsGrid from '../../components/StatsGrid/StatsGrid';
import ElectionCard from '../../components/ElectionCard/ElectionCard';
import DepartmentSection from '../../components/DepartmentSection/DepartmentSection';
import RecentActivity from '../../components/RecentActivity/RecentActivity';
import { getDepartments } from '../../api/repositories/DepartmentRepository';
import { getElections, getStats } from '../../api/repositories/ElectionRepository';
import './Dashboard.css';

const Dashboard = () => {
  const [user] = useState({
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

  useEffect(() => {
    const deps = getDepartments();
    const stats = getStats();
    const allElections = getElections();

    setDepartments(deps);
    setElections(allElections);
    setOverview({
      departments: deps.length,
      ...stats
    });
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
