import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authRepository } from '../api/repositories/authRepository';
import '../styles/global.css';


function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';


  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);


  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');


    if (code.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }


    setLoading(true);


    try {
      const response = await authRepository.verifyEmail(email, code);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleResend = async () => {
    setError('');
    setResending(true);


    try {
      const response = await authRepository.resendCode(email);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };


  if (!email) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="error-message">No email found. Please register first.</div>
          <button className="btn-primary" onClick={() => navigate('/register')}>
            Go to Register
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon">✉️</div>
          <div className="logo-text">VoteSystem</div>
          <div className="logo-subtitle">Verify your email</div>
        </div>


        <div className="auth-header">
          <h2>Check your email</h2>
          <p>We sent a verification code to <strong>{email}</strong></p>
        </div>


        {error && <div className="error-message">{error}</div>}


        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label>Verification Code</label>
            <input
              type="text"
              className="form-input"
              placeholder=""
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength="6"
              style={{ fontSize: '24px', textAlign: 'center', letterSpacing: '8px' }}
              required
            />
          </div>


          <button type="submit" className="btn-primary" disabled={loading || code.length !== 6}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>


        <div className="auth-footer" style={{ marginTop: '20px' }}>
          Didn't receive the code?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); handleResend(); }}>
            {resending ? 'Sending...' : 'Resend'}
          </a>
        </div>


        <div className="auth-footer" style={{ marginTop: '12px' }}>
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
}


export default VerifyEmail;
