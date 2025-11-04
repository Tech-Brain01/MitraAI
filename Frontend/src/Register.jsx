import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mycontext } from './MyContext.jsx';
import toast from 'react-hot-toast';
import './Auth.css';
import { apiFetch } from './apiClient.js';

const Register = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useContext(Mycontext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    captcha: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Simple captcha
  const [captchaQuestion] = useState(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: num1 + num2 };
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }

    // Validate captcha
    if (parseInt(formData.captcha) !== captchaQuestion.answer) {
      toast.error('Incorrect captcha answer!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiFetch(`/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          captcha: formData.captcha,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        toast.success('Registration successful! Welcome to MitraAI 🎉');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
              <i className="fa-solid fa-user-plus"></i>
            </div>
            <h2>Create Account</h2>
            <p>Join MitraAI and start your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">
                <i className="fa-solid fa-user"></i>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a unique username"
                minLength="3"
                maxLength="30"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <i className="fa-solid fa-envelope"></i>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="fa-solid fa-lock"></i>
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  minLength="6"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <i className="fa-solid fa-lock"></i>
                Confirm Password
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  minLength="6"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="captcha">
                <i className="fa-solid fa-shield-halved"></i>
                Security Check: {captchaQuestion.num1} + {captchaQuestion.num2} = ?
              </label>
              <input
                type="number"
                id="captcha"
                name="captcha"
                value={formData.captcha}
                onChange={handleChange}
                placeholder="Enter the answer"
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
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-plus"></i>
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <div className="auth-divider">
              <span>Already have an account?</span>
            </div>
            <button
              className="auth-switch-btn"
              onClick={() => navigate('/login')}
            >
              <i className="fa-solid fa-right-to-bracket"></i>
              Sign In Instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

