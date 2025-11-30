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

         const [overview] = useState({
    departments: 4,
    activeElections: 1,
    upcoming: 1,
    completed: 3
  });

  const [list] = useState([
    {
      id: 1,
      title: 'Student Council President 2024',
      description: 'Election for the student council president role.',
      status: 'Active',
      students: 41,
      endDate: '23/10/2024',
      hasVoted: false
    }
  ]);

  const castVote = (id) => {
    console.log('Vote submitted for:', id);
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

            {list.map((item) => (
              <ElectionCard
                key={item.id}
                 election={item}
                onCastVote={castVote}
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
