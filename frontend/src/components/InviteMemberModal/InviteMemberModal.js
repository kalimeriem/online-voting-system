import React, { useState } from 'react';
import './InviteMemberModal.css';

const InviteMemberModal = ({ open, onClose, onInvite, departmentId }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onInvite(email, departmentId);
      // Reset form on success
      setEmail('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="invite-member-modal-overlay" onClick={handleClose}>
      <div className="invite-member-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="invite-member-modal-header">
          <div>
            <h2 className="invite-member-modal-title">Invite Member</h2>
            <p className="invite-member-modal-instructions">
              Invite a new member
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
          <div className="invite-member-modal-field">
            <label htmlFor="member-email" className="invite-member-modal-label">
              Member Email
            </label>
            <input
              id="member-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@gmail.com"
              required
              className="invite-member-modal-input"
            />
          </div>

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
              disabled={loading}
              className="invite-member-modal-create"
            >
              {loading ? 'Sending...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;

