import React, { useState } from 'react';
import './CreateElectionModal.css';

const AddCandidatesModal = ({ isOpen, onClose, onAddCandidate, electionStatus }) => {
  const [candidateName, setCandidateName] = useState('');
  const [candidateDescription, setCandidateDescription] = useState('');
  const [error, setError] = useState('');

  const handleAddCandidate = () => {
    if (!candidateName.trim()) {
      setError('Please enter a candidate name');
      return;
    }

    onAddCandidate({
      name: candidateName,
      description: candidateDescription
    });

    setCandidateName('');
    setCandidateDescription('');
    setError('');
  };

  if (!isOpen) return null;

  const isDisabled = electionStatus !== 'UPCOMING';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Candidate</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {isDisabled && (
            <div style={{ padding: '12px', backgroundColor: '#fff3cd', borderRadius: '6px', borderLeft: '4px solid #ff9800', marginBottom: '16px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#ff6600' }}>
                ⚠️ Candidates can only be added to upcoming elections
              </p>
            </div>
          )}

          <div className="form-group">
            <label>Candidate Name *</label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => {
                setCandidateName(e.target.value);
                setError('');
              }}
              placeholder="John Smith"
              disabled={isDisabled}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={candidateDescription}
              onChange={(e) => setCandidateDescription(e.target.value)}
              placeholder="Brief description of the candidate"
              rows="4"
              disabled={isDisabled}
            />
          </div>

          {error && <div style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}>{error}</div>}
        </div>

        <div className="modal-footer">
          <button className="modal-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="modal-submit-btn" onClick={handleAddCandidate} disabled={isDisabled}>
            {isDisabled ? 'Only for Upcoming Elections' : 'Add Candidate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCandidatesModal;
