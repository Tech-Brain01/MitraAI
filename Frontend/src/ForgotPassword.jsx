import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Auth.css';
import { apiFetch } from './apiClient.js';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (data && data.success) {
        setIsSubmitted(true);
        toast.success('Password reset link sent to your email!');
      } else {
        toast.error((data && data.message) || 'Failed to send reset link');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      const message = error?.message || 'Network error. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="auth-overlay">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-icon success">
                <i className="fa-solid fa-envelope-circle-check"></i>
              </div>
              <h2>Check Your Email</h2>
              <p>We've sent a password reset link to <strong>{email}</strong></p>
            </div>

            <div className="auth-success-message">
              <p>Click the link in the email to reset your password.</p>
              <p className="small-text">Didn't receive the email? Check your spam folder.</p>
            </div>

            <button
              className="auth-submit-btn"
              onClick={() => navigate('/login')}
            >
              <i className="fa-solid fa-arrow-left"></i>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <button 
              type="button" 
              className="auth-back-btn" 
              onClick={() => navigate('/')}
              aria-label="Back to home"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div className="auth-icon">
              <i className="fa-solid fa-key"></i>
            </div>
            <h2>Forgot Password?</h2>
            <p>Enter your email to receive a password reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">
                <i className="fa-solid fa-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i>
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <button
              className="auth-link-btn"
              onClick={() => navigate('/login')}
            >
              <i className="fa-solid fa-arrow-left"></i>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
