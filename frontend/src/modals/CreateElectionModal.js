import React, { useState } from 'react';

const CreateElectionModal = ({ open, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [voterType, setVoterType] = useState('department');
  const [department, setDepartment] = useState('');
  const [customVoters, setCustomVoters] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      title,
      description,
      startDate,
      endDate,
      voterType,
      department,
      customVoters,
      status: 'upcoming',
      students: 0,
      hasVoted: false
    });
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setDepartment('');
    setCustomVoters([]);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Election</h2>
        <form onSubmit={handleSubmit}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Election Title" required />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
          <select value={voterType} onChange={e => setVoterType(e.target.value)}>
            <option value="department">Department Members</option>
            <option value="custom">Custom Voter List</option>
          </select>
          {voterType === 'department' && (
            <input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Department" />
          )}
          {voterType === 'custom' && (
            <input value={customVoters.join(', ')} onChange={e => setCustomVoters(e.target.value.split(','))} placeholder="Custom Voter Emails (comma separated)" />
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
