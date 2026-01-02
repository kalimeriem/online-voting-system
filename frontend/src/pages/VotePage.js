import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';  // 🆕 LINE 3
import { pollRepository } from '../api/repositories/pollRepository';
import { voteRepository } from '../api/repositories/voteRepository';
import '../styles/global.css';

function VotePage() {
  const { uniqueUrl } = useParams();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();  // 🆕 LINE 11
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [voterEmail, setVoterEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [wantsResult, setWantsResult] = useState(false);
  const [step, setStep] = useState('vote'); // 'vote', 'otp', 'success'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPoll();
  }, [uniqueUrl]);

  const fetchPoll = async () => {
    try {
      const response = await pollRepository.getPollByUrl(uniqueUrl);
      setPoll(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Poll not found');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async () => {
    if (!voterEmail) {
      setError('Please enter your email');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await voteRepository.requestOTP(voterEmail, poll.id);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async () => {
    if (!selectedOption) {
      setError('Please select an option');
      return;
    }

    // For private polls, need email and OTP
    if (!poll.isPublic && (!voterEmail || !otp)) {
      setError('Please enter your email and OTP');
      return;
    }

    // For public polls, if user wants results, require email
    if (poll.isPublic && wantsResult && !voterEmail) {
      setError('Please enter your email to receive results');
      return;
    }

    // 🆕 LINES 76-80: Check reCAPTCHA
    if (!executeRecaptcha) {
      setError('reCAPTCHA not ready. Please wait and try again.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const recaptchaToken = await executeRecaptcha('vote');  // 🆕 LINE 87

      await voteRepository.castVote(
        poll.id,
        selectedOption,
        voterEmail || null,
        otp || null,
        wantsResult,
        recaptchaToken  // 🆕 LINE 94
      );
      setStep('success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">Loading...</div>
      </div>
    );
  }

  if (error && !poll) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="error-message">{error}</div>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="logo-icon">✅</div>
            <div className="logo-text">Vote Submitted!</div>
          </div>
          <div className="success-message">
            Your vote has been recorded successfully!
            {wantsResult && voterEmail && (
              <div style={{ marginTop: '12px' }}>
                📧 You will receive the results at <strong>{voterEmail}</strong> when the poll ends.
              </div>
            )}
          </div>
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            Thank you for participating!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="auth-logo">
          <div className="logo-icon">📊</div>
          <div className="logo-text">VoteSystem</div>
        </div>

        <div className="auth-header">
          <h2>{poll.title}</h2>
          {poll.description && <p>{poll.description}</p>}
          <p style={{ fontSize: '13px', color: '#999', marginTop: '8px' }}>
            Ends: {new Date(poll.endDate).toLocaleString()}
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Options Selection */}
        <div className="form-group">
          <label>Select your choice:</label>
          {poll.options.map((option) => (
            <div
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              style={{
                padding: '16px',
                border: selectedOption === option.id ? '2px solid #0066FF' : '1px solid #e0e0e0',
                borderRadius: '8px',
                marginBottom: '10px',
                cursor: 'pointer',
                background: selectedOption === option.id ? '#e6f0ff' : 'white',
                transition: 'all 0.2s',
              }}
            >
              <input
                type="radio"
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
                style={{ marginRight: '10px' }}
              />
              {option.text}
            </div>
          ))}
        </div>

        {/* Private Poll - Email and OTP */}
        {!poll.isPublic && (
          <>
            <div className="form-group">
              <label>Email (required for private poll)</label>
              <input
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={voterEmail}
                onChange={(e) => setVoterEmail(e.target.value)}
                required
                disabled={step === 'otp'}
              />
              {step !== 'otp' && (
                <button
                  className="btn-secondary"
                  onClick={handleRequestOTP}
                  disabled={submitting || !voterEmail}
                  style={{ marginTop: '10px', width: '100%' }}
                >
                  {submitting ? 'Sending...' : 'Send OTP to Email'}
                </button>
              )}
            </div>

            {/* OTP Input - Show after OTP is sent */}
            {step === 'otp' && (
              <div className="form-group">
                <label>Enter OTP sent to your email</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength="6"
                  style={{ fontSize: '20px', textAlign: 'center', letterSpacing: '4px' }}
                />
              </div>
            )}

            {/* Checkbox for private polls to get results */}
            {step === 'otp' && (
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={wantsResult}
                    onChange={(e) => setWantsResult(e.target.checked)}
                  />
                  Email me the results when poll ends
                </label>
              </div>
            )}
          </>
        )}

        {/* Public Poll - Email (required if wants results) */}
        {poll.isPublic && (
          <>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={wantsResult}
                  onChange={(e) => setWantsResult(e.target.checked)}
                />
                Email me the results when poll ends
              </label>
            </div>

            {wantsResult && (
              <div className="form-group">
                <label>Email (required to receive results)</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={voterEmail}
                  onChange={(e) => setVoterEmail(e.target.value)}
                  required
                />
              </div>
            )}
          </>
        )}

        {/* Submit Vote Button */}
        {(poll.isPublic || step === 'otp') && (
          <button
            className="btn-primary"
            onClick={handleVote}
            disabled={submitting || !selectedOption || (!poll.isPublic && !otp) || (wantsResult && !voterEmail)}
          >
            {submitting ? 'Submitting...' : 'Submit Vote'}
          </button>
        )}
      </div>
    </div>
  );
}

export default VotePage;
