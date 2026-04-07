// AdminPanel/AdminHeader.jsx
import React, { useState } from 'react';
import { useLogin } from '../Authentication/LoginContext';

const AdminHeader = () => {
  const { logoutUser } = useLogin();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="container-fluid Admin-navbar">

      {/* Logo */}
      <div className="Admin-navbar-logo">
        <img src="/images/RoadShowLogo.png" alt="AdinnRoadShowLogo" />
      </div>

      {/* Right Section */}
      <div className="Admin-navbar-right">

        {/* Notification Bell */}
        <div className="Admin-notification-icon">
          <img
            src="/images/notification-bell.svg"
            className="notification-bell"
            alt="notifications"
          />
          <span className="Admin-notification-badge">10</span>
        </div>

        {/* Profile */}
        <div className="Admin-profile" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <img src="/images/admin-proficPic.svg" alt="User" className="Admin-profile-img" />
          <span className="Admin-profile-name">Adinn Roadshow</span>
          <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} Admin-profile-downUp`}></i>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="Admin-dropdown-menu">
            <ul>
              <li>Profile</li>
              <li>Settings</li>
              <li
                onClick={() => {
                  logoutUser();
                  window.location.href = '/adminLogin';
                }}
              >
                Logout
              </li>
            </ul>
          </div>
        )}

      </div>
    </nav>
  );
};

export default AdminHeader;
