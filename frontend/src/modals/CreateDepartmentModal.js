import React, { useState } from 'react';
import './CreateDepartmentModal.css';

const CreateDepartmentModal = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onCreate({ name, description });
      // Reset form on success
      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create department');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="create-department-modal-overlay" onClick={handleClose}>
      <div className="create-department-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="create-department-modal-header">
          <div>
            <h2 className="create-department-modal-title">Create New Department</h2>
            <p className="create-department-modal-instructions">
              Set up a new department for organizing elections and members.
            </p>
          </div>
          <button
            className="create-department-modal-close"
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

        <form onSubmit={handleSubmit} className="create-department-modal-form">
          <div className="create-department-modal-field">
            <label htmlFor="department-name" className="create-department-modal-label">
              Department Name
            </label>
            <input
              id="department-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Computer Science"
              required
              className="create-department-modal-input"
            />
          </div>

          <div className="create-department-modal-field">
            <label htmlFor="department-description" className="create-department-modal-label">
              Description
            </label>
            <textarea
              id="department-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the department..."
              rows="4"
              className="create-department-modal-textarea"
            />
          </div>

          {error && (
            <div className="create-department-modal-error">
              {error}
            </div>
          )}

          <div className="create-department-modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="create-department-modal-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="create-department-modal-create"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDepartmentModal;

