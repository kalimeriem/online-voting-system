import React, { useState } from 'react';
import './CreateElectionModal.css';
import { getDepartments } from '../api/repositories/DepartmentRepository';

const CreateElectionModal = ({ open, onClose, onCreate, userEmail }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [department, setDepartment] = useState('');
  const [customVoters, setCustomVoters] = useState([]);
  const [voterTab, setVoterTab] = useState('manual');
  const [voterEmail, setVoterEmail] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [candidateName, setCandidateName] = useState('');
  const [candidateDescription, setCandidateDescription] = useState('');

  const departments = getDepartments().filter(dept =>
    dept.members.some(m => m.email === userEmail && m.role === 'manager')
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (candidates.length === 0) {
      alert('Please add at least one candidate');
      return;
    }
    
    // Normalize to UTC midnight to avoid timezone issues
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    
    // Check if start date is in the future (tomorrow or later)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    if (start < tomorrow) {
      alert('Start date must be tomorrow or later');
      return;
    }
    
    // Check if end date is after start date
    if (end <= start) {
      alert('End date must be after start date');
      return;
    }
    
    onCreate({
      title,
      description,
      startDate,
      endDate,
      department,
      customVoters,
      candidates,
      status: 'upcoming',
      voters: 0,
      hasVoted: false,
      creator: userEmail
    });
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setDepartment('');
    setCustomVoters([]);
    setCandidates([]);
    setCandidateName('');
    setCandidateDescription('');
    onClose();
  };

  const handleAddVoter = () => {
    if (voterEmail && !customVoters.includes(voterEmail)) {
      setCustomVoters([...customVoters, voterEmail]);
      setVoterEmail('');
    }
  };

  const handleAddCandidate = () => {
    if (candidateName.trim()) {
      setCandidates([...candidates, {
        name: candidateName.trim(),
        description: candidateDescription.trim() || '',
        votes: 0
      }]);
      setCandidateName('');
      setCandidateDescription('');
    }
  };

  const handleRemoveCandidate = (index) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  // Get tomorrow's date in YYYY-MM-DD format for min date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get today's date in YYYY-MM-DD format (for reference)
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Election</h2>
        <form onSubmit={handleSubmit}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Election Title" required />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} min={getTomorrowDate()} required />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} required />
          <select value={department} onChange={e => setDepartment(e.target.value)}>
            <option value="">Select Department (Optional)</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
          
          <div className="candidates-section">
            <h3>Candidates (Required)</h3>
            <div className="candidates-input-group">
              <input 
                value={candidateName} 
                onChange={e => setCandidateName(e.target.value)} 
                placeholder="Candidate Name" 
              />
              <textarea 
                value={candidateDescription} 
                onChange={e => setCandidateDescription(e.target.value)} 
                placeholder="Candidate Description (Optional)" 
              />
              <div className="candidates-btn-group">
                <button type="button" className="candidate-add-btn" onClick={handleAddCandidate}>
                  + Add Candidate
                </button>
              </div>
            </div>
            <div className="candidates-list">
              {candidates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '12px', color: '#9ca3af', fontSize: '14px' }}>
                  <p>👤 No candidates added yet</p>
                  <p style={{ fontSize: '12px', margin: '4px 0 0 0' }}>Add at least one candidate to create an election</p>
                </div>
              ) : (
                candidates.map((candidate, idx) => (
                  <div key={idx} className="candidate-item">
                    <div className="candidate-item-info">
                      <div className="candidate-item-name">{candidate.name}</div>
                      {candidate.description && <div className="candidate-item-desc">{candidate.description}</div>}
                    </div>
                    <button type="button" className="candidate-remove-btn" onClick={() => handleRemoveCandidate(idx)}>
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="voter-tabs">
            <button type="button" className={voterTab === 'manual' ? 'active' : ''} onClick={() => setVoterTab('manual')}>Add Manually</button>
            <button type="button" className={voterTab === 'upload' ? 'active' : ''} onClick={() => setVoterTab('upload')}>Upload Spreadsheet</button>
          </div>
          {voterTab === 'manual' && (
            <div className="voter-manual">
              <input value={voterEmail} onChange={e => setVoterEmail(e.target.value)} placeholder="Voter Email Address" />
              <button type="button" onClick={handleAddVoter}>Add</button>
              <div className="voter-list">
                {customVoters.length === 0 ? (
                  <div className="no-voters">
                    <span className="voter-icon">👥</span>
                    <p>No voters added yet</p>
                    <p className="voter-hint">Add voters manually or upload a spreadsheet to get started</p>
                  </div>
                ) : (
                  <ul>
                    {customVoters.map((email, idx) => (
                      <li key={idx}>{email}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
          {voterTab === 'upload' && (
            <div className="voter-upload">
              <input type="file" accept=".csv,.xls,.xlsx,.txt" />
              <p className="voter-hint">Click to upload or drag and drop. CSV, TXT, XLS, or XLSX files.</p>
            </div>
          )}
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Create Election</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateElectionModal;