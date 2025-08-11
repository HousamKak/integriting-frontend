// src/components/common/Header.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/Header.scss';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  // Navigation items
  const navItems = [
    { path: '/', label: 'Home', exact: true },
    { path: '/publications', label: 'Publications' },
    { path: '/services', label: 'Services' },
    { path: '/whistleblower', label: 'Whistleblower Protection' },
    { path: '/seminars', label: 'Seminars' },
    { path: '/newspaper', label: 'Journal' },
  ];

  // Admin navigation items
  const adminNavItems = [
    { path: '/admin', label: 'Dashboard', exact: true },
    { path: '/admin/publications', label: 'Manage Publications' },
    { path: '/admin/services', label: 'Manage Services' },
    { path: '/admin/seminars', label: 'Manage Seminars' },
    { path: '/admin/newspapers', label: 'Manage Newspapers' },
    { path: '/admin/whistleblower-reports', label: 'Reports' },
  ];

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    
    // Prevent body scrolling when menu is open
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  // Toggle user dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.header__user-menu')) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close mobile menu on location change
  useEffect(() => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  }, [location]);

  // Check if window is scrolled
  const handleScroll = useCallback(() => {
    if (window.scrollY > 30) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Determine if a nav item is active
  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  // Handle logout with confirmation
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`} role="banner">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      
      <div className="container header__container">
        <div className="header__logo">
          <Link to="/" aria-label="Home">
            <img
              src={scrolled 
                ? "/assets/logo/al-istiqsaiya-icon-blue-orange.svg" 
                : "/assets/logo/al-istiqsaiya-logo-colored.svg"
              }
              alt="Logo"
              className="header__logo-img"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="header__nav" aria-label="Main Navigation">
          <ul className="header__nav-list">
            {navItems.map((item) => (
              <li 
                key={item.path} 
                className={`header__nav-item ${isActive(item.path, item.exact) ? 'header__nav-item--active' : ''}`}
              >
                <Link to={item.path} aria-current={isActive(item.path, item.exact) ? 'page' : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}

            {currentUser ? (
              <li className="header__nav-item header__nav-item--user">
                <div className="header__user-menu">
                  <button 
                    className="header__user-button"
                    onClick={toggleDropdown}
                    aria-expanded={dropdownOpen}
                    aria-controls="user-dropdown"
                  >
                    {currentUser.username}
                    <span className="header__dropdown-icon" aria-hidden="true">▼</span>
                  </button>
                  <div 
                    id="user-dropdown"
                    className={`header__dropdown ${dropdownOpen ? 'header__dropdown--active' : ''}`}
                    aria-hidden={!dropdownOpen}
                  >
                    {currentUser.role === 'admin' && (
                      <Link to="/admin" className="header__dropdown-item">Admin Dashboard</Link>
                    )}
                    <button 
                      className="header__dropdown-item header__dropdown-item--button"
                      onClick={handleLogout}
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
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          <span className="header__mobile-toggle-bar" aria-hidden="true"></span>
          <span className="header__mobile-toggle-bar" aria-hidden="true"></span>
          <span className="header__mobile-toggle-bar" aria-hidden="true"></span>
        </button>

        {/* Mobile Navigation Menu */}
        <nav 
          id="mobile-nav"
          className={`header__mobile-nav ${mobileMenuOpen ? 'header__mobile-nav--active' : ''}`}
          aria-hidden={!mobileMenuOpen}
          aria-label="Mobile Navigation"
        >
          <ul className="header__mobile-nav-list">
            {navItems.map((item) => (
              <li 
                key={item.path} 
                className={`header__mobile-nav-item ${isActive(item.path, item.exact) ? 'header__mobile-nav-item--active' : ''}`}
              >
                <Link 
                  to={item.path}
                  aria-current={isActive(item.path, item.exact) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {currentUser ? (
              <>
                <li className="header__mobile-nav-divider" aria-hidden="true"></li>
                {currentUser.role === 'admin' && adminNavItems.map((item) => (
                  <li 
                    key={item.path} 
                    className={`header__mobile-nav-item ${isActive(item.path, item.exact) ? 'header__mobile-nav-item--active' : ''}`}
                  >
                    <Link 
                      to={item.path}
                      aria-current={isActive(item.path, item.exact) ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="header__mobile-nav-item">
                  <button 
                    className="header__mobile-nav-button"
                    onClick={handleLogout}
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