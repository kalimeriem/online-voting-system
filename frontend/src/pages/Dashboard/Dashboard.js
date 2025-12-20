import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import StatsGrid from "../../components/StatsGrid/StatsGrid";
import ElectionCard from "../../components/ElectionCard/ElectionCard";
import DepartmentSection from "../../components/DepartmentSection/DepartmentSection";
import RecentActivity from "../../components/RecentActivity/RecentActivity";

import { userRepository } from "../../api/repositories/UserRepository";
import { departmentRepository } from "../../api/repositories/DepartmentRepositoryCorrected";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [overview, setOverview] = useState({
    departments: 0,
    activeElections: 0,
    upcoming: 0,
    completed: 0,
  });

  const [elections, setElections] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentMap, setDepartmentMap] = useState({});

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Get profile
        const profile = await userRepository.getProfile();
        setUser(profile);

        // Get dashboard data
        const dashboard = await userRepository.getDashboard();
        setElections(dashboard.activeElections);
        setRecentActivities(dashboard.recentActivities);

        // Get user's departments
        const userDepartments = await departmentRepository.getDepartments();
        setDepartments(userDepartments);

        // Build departmentId → name map
        const map = {};
        userDepartments.forEach((dept) => {
          map[dept.id] = dept.name;
        });
        setDepartmentMap(map);

        // Overview
        setOverview({
          departments: userDepartments.length,
          activeElections: dashboard.activeElections.length,
          upcoming: 0,
          completed: 0,
        });
      } catch (err) {
        console.error("Dashboard load failed:", err);
      }
    }

    loadDashboard();
  }, []);

  const castVote = (id) => {
    setElections((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, hasVoted: true } : e
      )
    );
  };

  if (!user) return <div>Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <Header user={user} />

      <div className="dashboard-container">
        <Sidebar />

        <div className="main">
          <div className="welcome">
            <h1 className="welcome-t">Welcome back, {user.name}</h1>
            <p className="welcome-sub">
              Here’s a quick look at your voting status
            </p>
          </div>

          <StatsGrid stats={overview} />

          {/* Active Elections */}
          <div className="section">
            <div className="section-head">
              <h2>Active Elections</h2>
              <button
                className="view-all"
                onClick={() => navigate("/elections")}
              >
                View all →
              </button>
            </div>

            {elections.length > 0 ? (
              elections.map((election) => (
                <ElectionCard
                  key={election.id}
                  election={election}
                  departmentName={
                    departmentMap[election.departmentId] ||
                    "No Department"
                  }
                  onCastVote={castVote}
                />
              ))
            ) : (
              <p className="empty-message">
                No active elections at the moment.
              </p>
            )}
          </div>

          {/* Departments */}
          <div className="section">
            <div className="section-head">
              <h2>Departments</h2>
              <button 
                className="view-all"
                onClick={() => navigate("/departments")}
              >
                View all →
              </button>
            </div>

            {departments.length > 0 ? (
              <DepartmentSection
                departments={departments.slice(0, 6)}
                currentUserEmail={user.email}
              />
            ) : (
              <p className="empty-message">
                You are not part of any departments yet.
              </p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="section">
            <div className="section-head">
              <h2>Recent Activity</h2>
            </div>

            {recentActivities.length > 0 ? (
              <RecentActivity activities={recentActivities} />
            ) : (
              <p className="empty-message">
                No recent activity to show.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
