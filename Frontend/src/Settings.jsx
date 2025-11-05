import { useState, useContext } from 'react';
import { Mycontext } from './MyContext.jsx';
import toast from 'react-hot-toast';
import './Settings.css';
import { apiFetch } from './apiClient.js';

const Settings = ({ onClose }) => {
  const { user, setUser } = useContext(Mycontext);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        username: formData.username,
        email: formData.email,
      };

      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const data = await apiFetch('/auth/update-profile', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Profile updated successfully!');
        setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        // This else block handles API errors where data.success is false
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      // This catch block handles network errors or 500-level errors
      console.error('Update profile error:', error);
      // Use error.message, not data.message, as 'data' is not in scope here
      toast.error(error.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-container" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <div className="settings-title">
            <i className="fa-solid fa-gear"></i>
            <h2>Settings</h2>
          </div>
          <button className="settings-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fa-solid fa-user"></i>
            Profile
          </button>
          <button
            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <i className="fa-solid fa-shield-halved"></i>
            Security
          </button>
          <button
            className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <i className="fa-solid fa-crown"></i>
            Account
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h3>Profile Information</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    <i className="fa-solid fa-user"></i>
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Your username"
                    minLength="3"
                    maxLength="30"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fa-solid fa-envelope"></i>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                  />
                </div>

                <button
                  type="submit"
                  className="settings-save-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check"></i>
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>Change Password</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>
                    <i className="fa-solid fa-lock"></i>
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fa-solid fa-key"></i>
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    minLength="6"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <i className="fa-solid fa-key"></i>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    minLength="6"
                  />
                </div>

                <button
                  type="submit"
                  className="settings-save-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check"></i>
                      Update Password
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="settings-section">
              <h3>Account Information</h3>
              <div className="account-info-grid">
                <div className="account-info-card">
                  <div className="account-info-icon">
                    <i className="fa-solid fa-crown"></i>
                  </div>
                  <div className="account-info-details">
                    <h4>Current Plan</h4>
                    <p className="plan-badge">{user?.plan?.toUpperCase() || 'FREE'}</p>
                  </div>
                </div>

                <div className="account-info-card">
                  <div className="account-info-icon">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="account-info-details">
                    <h4>Username</h4>
                    <p>{user?.username}</p>
                  </div>
                </div>

                <div className="account-info-card">
                  <div className="account-info-icon">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div className="account-info-details">
                    <h4>Email</h4>
                    <p>{user?.email}</p>
                  </div>
                </div>

                <div className="account-info-card">
                  <div className="account-info-icon">
                    <i className="fa-solid fa-calendar"></i>
                  </div>
                  <div className="account-info-details">
                    <h4>Member Since</h4>
                    <p>November 2025</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;