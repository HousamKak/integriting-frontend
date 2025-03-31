// src/components/common/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/Header.scss';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  // Navigation items
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/publications', label: 'Publications' },
    { path: '/services', label: 'Services' },
    { path: '/whistleblower', label: 'Whistleblower Protection' },
    { path: '/seminars', label: 'Seminars' },
    { path: '/newspaper', label: 'Journal' },
  ];

  // Admin navigation items
  const adminNavItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/publications', label: 'Manage Publications' },
    { path: '/admin/services', label: 'Manage Services' },
    { path: '/admin/seminars', label: 'Manage Seminars' },
    { path: '/admin/newspapers', label: 'Manage Newspapers' },
    { path: '/admin/whistleblower-reports', label: 'Reports' },
  ];

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu on location change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Check if window is scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Determine if a nav item is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__container">
        <div className="header__logo">
          <Link to="/">
            <h1>Integriting</h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="header__nav">
          <ul className="header__nav-list">
            {navItems.map((item) => (
              <li 
                key={item.path} 
                className={`header__nav-item ${isActive(item.path) ? 'header__nav-item--active' : ''}`}
              >
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}

            {currentUser ? (
              <li className="header__nav-item header__nav-item--user">
                <div className="header__user-menu">
                  <button className="header__user-button">
                    {currentUser.username}
                    <span className="header__dropdown-icon">▼</span>
                  </button>
                  <div className="header__dropdown">
                    {currentUser.role === 'admin' && (
                      <Link to="/admin" className="header__dropdown-item">Admin Dashboard</Link>
                    )}
                    <button 
                      className="header__dropdown-item header__dropdown-item--button"
                      onClick={logout}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </li>
            ) : (
              <li className="header__nav-item">
                <Link to="/login" className="header__login-button">Log In</Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button 
          className={`header__mobile-toggle ${mobileMenuOpen ? 'header__mobile-toggle--active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation"
        >
          <span className="header__mobile-toggle-bar"></span>
          <span className="header__mobile-toggle-bar"></span>
          <span className="header__mobile-toggle-bar"></span>
        </button>

        {/* Mobile Navigation Menu */}
        <nav className={`header__mobile-nav ${mobileMenuOpen ? 'header__mobile-nav--active' : ''}`}>
          <ul className="header__mobile-nav-list">
            {navItems.map((item) => (
              <li 
                key={item.path} 
                className={`header__mobile-nav-item ${isActive(item.path) ? 'header__mobile-nav-item--active' : ''}`}
              >
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}

            {currentUser ? (
              <>
                <li className="header__mobile-nav-divider"></li>
                {currentUser.role === 'admin' && adminNavItems.map((item) => (
                  <li 
                    key={item.path} 
                    className={`header__mobile-nav-item ${isActive(item.path) ? 'header__mobile-nav-item--active' : ''}`}
                  >
                    <Link to={item.path}>{item.label}</Link>
                  </li>
                ))}
                <li className="header__mobile-nav-item">
                  <button 
                    className="header__mobile-nav-button"
                    onClick={logout}
                  >
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <li className="header__mobile-nav-item">
                <Link to="/login" className="header__mobile-nav-login">Log In</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
