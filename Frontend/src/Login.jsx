import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mycontext } from './MyContext.jsx';
import toast from 'react-hot-toast';
import './Auth.css';
import { apiFetch } from './apiClient.js';

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useContext(Mycontext);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    captcha: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Simple captcha (replace with Google reCAPTCHA in production)
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

    // Validate captcha
    if (parseInt(formData.captcha) !== captchaQuestion.answer) {
      toast.error('Incorrect captcha answer!');
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiFetch(`/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
          captcha: formData.captcha,
        }),
      });

      if (data && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        toast.success('Login successful! Welcome back 🎉');
      } else {
        toast.error((data && data.message) || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error?.message || 'Network error. Please try again.';
      toast.error(message);
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
              <i className="fa-solid fa-right-to-bracket"></i>
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to continue to MitraAI</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="identifier">
                <i className="fa-solid fa-user"></i>
                Email or Username
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter your email or username"
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
                  placeholder="Enter your password"
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
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <button
              className="auth-link-btn"
              onClick={() => navigate('/forgot-password')}
            >
              <i className="fa-solid fa-key"></i>
              Forgot Password?
            </button>
            <div className="auth-divider">
              <span>Don't have an account?</span>
            </div>
            <button
              className="auth-switch-btn"
              onClick={() => navigate('/register')}
            >
              <i className="fa-solid fa-user-plus"></i>
              Create New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
