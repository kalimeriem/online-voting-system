import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authRepository } from '../api/repositories/authRepository';
import '../styles/global.css';


function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');


    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }


    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }


    setLoading(true);


    try {
      const response = await authRepository.register(
        formData.email,
        formData.password,
        formData.name
      );
      
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon">📊</div>
          <div className="logo-text">VoteSystem</div>
          <div className="logo-subtitle">Create your account</div>
        </div>


        <div className="auth-header">
          <h2>Get started</h2>
          <p>Create a new account to start voting</p>
        </div>


        {error && <div className="error-message">{error}</div>}


        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>


          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>


          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              Password must contain:
              <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                <li style={{ color: formData.password.length >= 8 ? '#00a854' : '#666' }}>
                  At least 8 characters
                </li>
                <li style={{ color: /[A-Z]/.test(formData.password) ? '#00a854' : '#666' }}>
                  One uppercase letter
                </li>
                <li style={{ color: /[a-z]/.test(formData.password) ? '#00a854' : '#666' }}>
                  One lowercase letter
                </li>
                <li style={{ color: /[0-9]/.test(formData.password) ? '#00a854' : '#666' }}>
                  One number
                </li>
              </ul>
            </div>
          </div>


          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>


          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>


        <div className="auth-footer">
          Already have an account? <a href="/login">Sign in</a>
        </div>


        <div className="auth-footer" style={{ marginTop: '12px', fontSize: '13px' }}>
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}


export default Register;
