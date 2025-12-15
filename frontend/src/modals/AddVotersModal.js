import React, { useState } from 'react';
import './CreateElectionModal.css';

const AddVotersModal = ({ isOpen, onClose, onAddVoters, electionStatus }) => {
  const [voterEmails, setVoterEmails] = useState('');
  const [error, setError] = useState('');

  const handleAddVoters = () => {
    if (!voterEmails.trim()) {
      setError('Please enter at least one email address');
      return;
    }

    const emails = voterEmails.split(',').map(e => e.trim()).filter(e => e);
    const validEmails = emails.filter(email => /\S+@\S+\.\S+/.test(email));

    if (validEmails.length === 0) {
      setError('Please enter valid email addresses (comma-separated)');
      return;
    }

    if (validEmails.length !== emails.length) {
      setError('Some email addresses are invalid');
      return;
    }

    onAddVoters(validEmails);
    setVoterEmails('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Voters</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Voter Email Addresses</label>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
              Enter email addresses separated by commas
            </p>
            <textarea
              value={voterEmails}
              onChange={(e) => {
                setVoterEmails(e.target.value);
                setError('');
              }}
              placeholder="email1@example.com, email2@example.com, email3@example.com"
              rows="6"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'monospace' }}
            />
            {error && <div style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}>{error}</div>}
          </div>

          {electionStatus === 'UPCOMING' && (
            <div style={{ padding: '12px', backgroundColor: '#e8f4f8', borderRadius: '6px', borderLeft: '4px solid #0088cc', marginBottom: '16px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#0088cc' }}>
                ℹ️ Voters can only be added before the election starts
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="modal-submit-btn" onClick={handleAddVoters}>Add Voters</button>
        </div>
      </div>
    </div>
  );
};

export default AddVotersModal;
