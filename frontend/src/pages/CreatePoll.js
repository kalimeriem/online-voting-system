import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pollRepository } from '../api/repositories/pollRepository';
import Navbar from '../components/Navbar';
import '../styles/dashboard.css';

function CreatePoll() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    endDate: '',
    isPublic: true,
    options: ['', ''],
    allowedEmails: '',
    allowedDomains: '',  // 🆕 NEW FIELD
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ''],
    });
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validOptions = formData.options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      setError('Please provide at least 2 options');
      return;
    }

    setLoading(true);

    try {
      const pollData = {
        title: formData.title,
        description: formData.description,
        endDate: new Date(formData.endDate).toISOString(),
        isPublic: formData.isPublic,
        options: validOptions,
      };

      if (!formData.isPublic) {
        // 🆕 UPDATED: Handle both emails and domains
        if (formData.allowedEmails.trim()) {
          pollData.allowedEmails = formData.allowedEmails
            .split(',')
            .map(email => email.trim())
            .filter(email => email);
        }
        
        if (formData.allowedDomains.trim()) {
          pollData.allowedDomains = formData.allowedDomains
            .split(',')
            .map(domain => domain.trim().replace('@', ''))  // Remove @ if user adds it
            .filter(domain => domain);
        }
      }

      const response = await pollRepository.createPoll(pollData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Navbar />
      
      <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
        <div className="page-header">
          <h1 className="page-title">Create New Poll</h1>
          <p className="page-subtitle">Set up your poll with options and settings</p>
        </div>

        <div className="section">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Poll Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g., Best Programming Language"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                className="form-input"
                placeholder="Brief description of your poll"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group">
              <label>End Date *</label>
              <input
                type="datetime-local"
                name="endDate"
                className="form-input"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Poll Type</label>
              <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={() => setFormData({ ...formData, isPublic: true })}
                  />
                  🌐 Public (Anyone with link can vote)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="isPublic"
                    checked={!formData.isPublic}
                    onChange={() => setFormData({ ...formData, isPublic: false })}
                  />
                  🔒 Private (Email verification required)
                </label>
              </div>
            </div>

            {!formData.isPublic && (
              <>
                <div className="form-group">
                  <label>Allowed Emails (comma separated)</label>
                  <input
                    type="text"
                    name="allowedEmails"
                    className="form-input"
                    placeholder="user1@example.com, user2@example.com"
                    value={formData.allowedEmails}
                    onChange={handleChange}
                  />
                  <small style={{ color: '#666', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                    Specific email addresses that can vote
                  </small>
                </div>

                {/* 🆕 NEW FIELD: Allowed Domains */}
                <div className="form-group">
                  <label>Allowed Domains (comma separated)</label>
                  <input
                    type="text"
                    name="allowedDomains"
                    className="form-input"
                    placeholder="company.com, university.edu"
                    value={formData.allowedDomains}
                    onChange={handleChange}
                  />
                  <small style={{ color: '#666', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                    Anyone with these email domains can vote (e.g., "company.com" allows all @company.com emails)
                  </small>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Options * (minimum 2)</label>
              {formData.options.map((option, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                  />
                  {formData.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      style={{
                        padding: '10px 16px',
                        background: '#fee',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#c33',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="btn-secondary"
                style={{ marginTop: '10px' }}
              >
                + Add Option
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Poll'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePoll;
