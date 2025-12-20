import React, { useState } from 'react';
import './InviteMemberModal.css';

const InviteMemberModal = ({ open, onClose, onInvite, departmentId }) => {
  const [email, setEmail] = useState('');
  const [customVoters, setCustomVoters] = useState([]);
  const [voterTab, setVoterTab] = useState('manual');
  const [voterEmail, setVoterEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // If in manual mode, invite all emails from the list
      if (voterTab === 'manual' && customVoters.length > 0) {
        // Send invitations for each email
        for (const voterEmail of customVoters) {
          await onInvite(voterEmail, departmentId);
        }
      } else if (voterTab === 'manual' && email.trim()) {
        // Single email input (backward compatibility)
        await onInvite(email.trim(), departmentId);
      }
      // Note: For spreadsheet upload, you would need to implement file processing
      
      // Reset form on success
      setEmail('');
      setCustomVoters([]);
      setVoterEmail('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to send invitation(s)');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setCustomVoters([]);
    setVoterEmail('');
    setError(null);
    onClose();
  };

  const handleAddVoter = () => {
    if (voterEmail.trim() && !customVoters.includes(voterEmail.trim())) {
      setCustomVoters([...customVoters, voterEmail.trim()]);
      setVoterEmail('');
    }
  };

  const handleRemoveVoter = (index) => {
    setCustomVoters(customVoters.filter((_, i) => i !== index));
  };

  const handleVoterKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddVoter();
    }
  };

  if (!open) return null;

  return (
    <div className="invite-member-modal-overlay" onClick={handleClose}>
      <div className="invite-member-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="invite-member-modal-header">
          <div>
            <h2 className="invite-member-modal-title">Invite Members</h2>
            <p className="invite-member-modal-instructions">
              Invite members to join this department
            </p>
          </div>
          <button
            className="invite-member-modal-close"
            onClick={handleClose}
            type="button"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="invite-member-modal-form">
          {/* Voter tabs */}
          <div className="invite-member-modal-tabs">
            <button 
              type="button" 
              className={`invite-member-modal-tab ${voterTab === 'manual' ? 'active' : ''}`}
              onClick={() => setVoterTab('manual')}
            >
              Add Manually
            </button>
            <button 
              type="button" 
              className={`invite-member-modal-tab ${voterTab === 'upload' ? 'active' : ''}`}
              onClick={() => setVoterTab('upload')}
            >
              Upload Spreadsheet
            </button>
          </div>

          {/* Manual email input */}
          {voterTab === 'manual' && (
            <div className="invite-member-modal-manual-section">
              <div className="invite-member-modal-field">
                <label htmlFor="voter-email" className="invite-member-modal-label">
                  Add Email Addresses
                </label>
                <div className="invite-member-email-input-group">
                  <input
                    id="voter-email"
                    type="email"
                    value={voterEmail}
                    onChange={(e) => setVoterEmail(e.target.value)}
                    onKeyPress={handleVoterKeyPress}
                    placeholder="member@gmail.com"
                    className="invite-member-modal-input"
                  />
                  <button
                    type="button"
                    onClick={handleAddVoter}
                    className="invite-member-add-btn"
                    disabled={!voterEmail.trim()}
                  >
                    Add
                  </button>
                </div>
                <p className="invite-member-modal-hint">
                  Press Enter or click Add to include email in the list
                </p>
              </div>

              {/* Voter list */}
              <div className="invite-member-voter-list">
                <h4 className="invite-member-voter-list-title">Emails to Invite</h4>
                {customVoters.length === 0 ? (
                  <div className="invite-member-no-voters">
                    <span className="invite-member-voter-icon">👥</span>
                    <p>No emails added yet</p>
                    <p className="invite-member-voter-hint">
                      Add email addresses above to invite members
                    </p>
                  </div>
                ) : (
                  <div className="invite-member-voter-items">
                    {customVoters.map((email, index) => (
                      <div key={index} className="invite-member-voter-item">
                        <span className="invite-member-voter-email">{email}</span>
                        <button
                          type="button"
                          className="invite-member-voter-remove-btn"
                          onClick={() => handleRemoveVoter(index)}
                          title="Remove email"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {customVoters.length > 0 && (
                  <div className="invite-member-voter-count">
                    {customVoters.length} email{customVoters.length !== 1 ? 's' : ''} to invite
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Spreadsheet upload */}
          {voterTab === 'upload' && (
            <div className="invite-member-modal-upload-section">
              <div className="invite-member-modal-field">
                <label htmlFor="spreadsheet-upload" className="invite-member-modal-label">
                  Upload Spreadsheet
                </label>
                <div className="invite-member-upload-area">
                  <input
                    id="spreadsheet-upload"
                    type="file"
                    accept=".csv,.xls,.xlsx,.txt"
                    className="invite-member-upload-input"
                  />
                  <div className="invite-member-upload-placeholder">
                    <span className="invite-member-upload-icon">📄</span>
                    <p className="invite-member-upload-text">Click to upload or drag and drop</p>
                    <p className="invite-member-upload-hint">CSV, TXT, XLS, or XLSX files</p>
                  </div>
                </div>
                <p className="invite-member-modal-upload-instructions">
                  File should contain one email address per line or column
                </p>
              </div>

              {/* Backward compatibility: Single email field for spreadsheet tab */}
              <div className="invite-member-modal-field">
                <label htmlFor="single-email" className="invite-member-modal-label">
                  Or enter a single email:
                </label>
                <input
                  id="single-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="member@gmail.com"
                  className="invite-member-modal-input"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="invite-member-modal-error">
              {error}
            </div>
          )}

          <div className="invite-member-modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="invite-member-modal-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (voterTab === 'manual' && customVoters.length === 0) || (voterTab === 'upload' && !email.trim())}
              className="invite-member-modal-create"
            >
              {loading ? 'Sending...' : 'Send Invitations'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;