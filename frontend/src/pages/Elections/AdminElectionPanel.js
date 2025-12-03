
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import StatsGrid from '../../components/StatsGrid/StatsGrid';
import '../../components/ElectionCard/ElectionCard.css';
import './Elections.css';
import './AdminElectionPanel.css';
import '../../components/StatsGrid/StatsGrid.css';


const AdminElectionPanel = ({ election, user }) => {
			const [showLiveResults, setShowLiveResults] = useState(false);
			const [allowVoterAddition, setAllowVoterAddition] = useState(true);
		
		const departments = require('../../api/repositories/DepartmentRepository').getDepartments();
		const department = departments.find(d => d.name === election.department);
		const departmentMembersLength = department ? department.members.length : 0;
		const eligibleVotersLength = election.eligibleVoters ? election.eligibleVoters.length : 0;
		const additionalVoters = eligibleVotersLength - departmentMembersLength;
	const [activeTab, setActiveTab] = useState('overview');
	const [candidates, setCandidates] = useState(election.candidates || []);

	const handleEditCandidate = (idx) => {
		alert(`Edit candidate: ${candidates[idx].name}`);
		
	};

	const handleDeleteCandidate = (idx) => {
		if (window.confirm(`Are you sure you want to delete ${candidates[idx].name}?`)) {
			setCandidates(candidates.filter((_, i) => i !== idx));
		}
	};
	const navigate = useNavigate();
	const totalVotes = (election.candidates || []).reduce((sum, c) => sum + (c.votes || 0), 0);
	const eligibleVoters = election.eligibleVoters ? election.eligibleVoters.length : 0;
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
		upcoming: durationDays,
		completed: election.status
	};

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
							<span className="admin-panel-title">Admin Panel</span>
							<span className={`status-badge ${election.status.toLowerCase()}`}>{election.status}</span>
						</div>
						<div className="admin-panel-subtitle">Manage election settings and participants</div>
						</div>
					</div>
					<div className="admin-panel-card">
						
						<div className="admin-panel-tabs">
							{['overview', 'voters', 'candidates', 'settings'].map(tab => (
								<button
									key={tab}
									className={activeTab === tab ? 'tab active' : 'tab'}
									onClick={() => setActiveTab(tab)}
								>
									{tab.charAt(0).toUpperCase() + tab.slice(1)}
								</button>
							))}
						</div>
						{activeTab === 'overview' && (
							<>
								
								<div className="admin-election-details">
									<div>
										<div className="admin-election-details-title">Election Details</div>
										<div className="admin-election-details-desc">Basic information about this election</div>
										<div className="admin-election-details-row"><strong>Title</strong><br />{election.title}</div>
										<div className="admin-election-details-row"><strong>Description</strong><br />{election.description}</div>
									</div>
									<button className="admin-election-edit-btn">
										<span className="admin-election-edit-icon">
											<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
												<path d="M12 20h9" />
												<path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
											</svg>
											Edit
										</span>
									</button>
								</div>
								<StatsGrid stats={statsForGrid} />
								<div className="admin-election-results">
									<div className="admin-election-results-title">Current Results</div>
									<div className="admin-election-results-desc">Live vote counts for all candidates</div>
									{(election.candidates || []).map((candidate, idx) => {
										const percent = totalVotes ? ((candidate.votes || 0) / totalVotes * 100).toFixed(1) : 0;
										return (
											<div key={idx} className="admin-election-candidate-result">
												<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
													<div>
														<div className="admin-election-candidate-name">{candidate.name}</div>
														<div className="admin-election-candidate-desc">{candidate.description}</div>
													</div>
													<div style={{ textAlign: 'right', minWidth: 70 }}>
														<div className="admin-election-candidate-votes" style={{ fontWeight: 700 }}>{candidate.votes || 0} votes</div>
														<div className="admin-election-candidate-percent" style={{ color: '#64748b', fontSize: 14 }}>{percent}%</div>
													</div>
												</div>
												<div className="admin-election-candidate-bar-bg">
													<div className="admin-election-candidate-bar" style={{width: `${percent}%`}}></div>
												</div>
											</div>
										);
									})}
								</div>
							</>
						)}

						{activeTab === 'voters' && (
							<div className="admin-election-voters-tab">
								<div className="voters-tab-header">
									<div className="voters-tab-title">Manage Voters</div>
									<div className="voters-tab-desc">
										Department members + {additionalVoters > 0 ? additionalVoters : 0} additional voters
									</div>
								</div>
								<div className="voters-tab-actions">
									<button className="voters-add-btn">
										<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<path d="M16 21v-2a4 4 0 0 0-8 0v2" />
											<circle cx="12" cy="7" r="4" />
											<line x1="22" y1="19" x2="22" y2="19" />
											<line x1="18" y1="19" x2="18" y2="19" />
											<line x1="20" y1="19" x2="20" y2="19" />
										</svg>
										Add Voters
									</button>
								</div>
								<div>
									{(election.eligibleVoters || []).map((voter, idx) => (
										<div key={idx} className="voters-list-item">
											<span className="voters-list-email">{voter.email || voter}</span>
											<span className="voters-list-eligible">Eligible</span>
										</div>
									))}
								</div>
							</div>
						)}
						{activeTab === 'candidates' && (
							<div className="admin-election-candidates-tab">
								<div className="candidates-tab-header">
									<div className="candidates-tab-title">Manage Candidates</div>
									<div className="candidates-tab-desc">
										{candidates.length} candidate{candidates.length !== 1 ? 's' : ''} in this election
									</div>
								</div>
								<div className="candidates-tab-actions">
									<button className="candidates-add-btn">
										<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<path d="M16 21v-2a4 4 0 0 0-8 0v2" />
											<circle cx="12" cy="7" r="4" />
											<line x1="22" y1="19" x2="22" y2="19" />
											<line x1="18" y1="19" x2="18" y2="19" />
											<line x1="20" y1="19" x2="20" y2="19" />
										</svg>
										Add Candidate
									</button>
								</div>
								<div>
									{candidates.map((candidate, idx) => (
										<div key={idx} className="candidates-list-item">
											<div>
												<div className="candidates-list-name">{candidate.name}</div>
												<div className="candidates-list-desc">{candidate.description}</div>
												<div className="candidates-list-votes">{candidate.votes || 0} votes</div>
											</div>
											<div className="candidates-list-actions">
												<button title="Edit" className="candidates-edit-btn" onClick={() => handleEditCandidate(idx)}>
													<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
														<path d="M12 20h9" />
														<path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
													</svg>
												</button>
												<button title="Delete" className="candidates-delete-btn" onClick={() => handleDeleteCandidate(idx)}>
													<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
														<polyline points="3 6 5 6 21 6" />
														<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 6v6m4-6v6M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
													</svg>
												</button>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
						{activeTab === 'settings' && (
							<div className="admin-election-settings-tab">
								<div className="settings-header">
									<div className="settings-title">Election Settings</div>
									<div className="settings-desc">Configure visibility and access controls</div>
								</div>
								<div className="settings-options">
									<div className="settings-option-row">
										<div>
											<div className="settings-option-title">Show Live Results</div>
											<div className="settings-option-desc">Results are hidden until the election ends</div>
										</div>
										<label className="switch">
											<input type="checkbox" checked={showLiveResults} onChange={e => setShowLiveResults(e.target.checked)} />
											<span className="slider round"></span>
										</label>
									</div>
									<div className="settings-option-row">
										<div>
											<div className="settings-option-title">Allow Voter Addition</div>
											<div className="settings-option-desc">Voters can be added after election starts</div>
										</div>
										<label className="switch">
											<input type="checkbox" checked={allowVoterAddition} onChange={e => setAllowVoterAddition(e.target.checked)} />
											<span className="slider round"></span>
										</label>
									</div>
								</div>
								<hr className="settings-divider" />
								<button className="settings-save-btn">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
										<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
										<path d="M9 9v6" />
										<path d="M15 9v6" />
										<path d="M9 15h6" />
									</svg>
									Save Settings
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminElectionPanel;