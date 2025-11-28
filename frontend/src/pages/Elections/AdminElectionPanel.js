import React from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import '../../components/ElectionCard/ElectionCard.css';
import './Elections.css';

const AdminElectionPanel = ({ election, user }) => {
	return (
		<div className="dashboard-wrapper">
			<Header user={user} />
			<div className="dashboard-container">
				<Sidebar />
				<div className="main-content">
					<div className="election-card">
						<div className="election-header">
							<h3>{election.title} <span >(Admin)</span></h3>
							<span className={`status-badge ${election.status.toLowerCase()}`}>{election.status}</span>
						</div>
						<p className="election-description">{election.description}</p>
						<div className="election-stats">
							<div className="stat-item">
								<span className="stat-icon">👥</span>
								<span>Department: {election.department || 'N/A'}</span>
							</div>
							<div className="stat-item">
								<span className="stat-icon">📊</span>
								<span>{election.candidates.reduce((sum, c) => sum + (c.votes || 0), 0)} total votes</span>
							</div>
							<div className="stat-item">
								<span className="stat-icon">📅</span>
								<span>Start: {election.startDate} | End: {election.endDate}</span>
							</div>
						</div>
						<div className="admin-section">
							<h3>Admin Controls</h3>
							<p>Welcome, {user.name}. You are the creator of this election.</p>
							{/* Add admin controls here */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminElectionPanel;
