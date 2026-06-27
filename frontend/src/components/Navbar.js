import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <span>🏥</span> MediConnect
        </Link>
        <div className="navbar-links">
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          {user ? (
            <>
              <div className="nav-user">
                <span>👤</span>
                <span style={{ fontSize: '.9rem', fontWeight: 600 }}>{user.name}</span>
                <span className={`nav-badge ${user.role}`}>{user.role}</span>
              </div>
              {user.role === 'patient' && (
                <Link to="/book-appointment" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '.85rem' }}>
                  + Book Appointment
                </Link>
              )}
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '.875rem' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;