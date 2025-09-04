import React, { useState, useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Breadcrumb } from './ui';
import '../../styles/admin/AdminLayout.scss';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/admin',
      exact: true
    },
    {
      id: 'publications',
      label: 'Publications',
      icon: '📚',
      path: '/admin/publications',
      subItems: [
        { label: 'All Publications', path: '/admin/publications' },
        { label: 'Add New', path: '/admin/publications/new' }
      ]
    },
    {
      id: 'services',
      label: 'Services',
      icon: '🛠️',
      path: '/admin/services',
      subItems: [
        { label: 'All Services', path: '/admin/services' },
        { label: 'Add New', path: '/admin/services/new' }
      ]
    },
    {
      id: 'seminars',
      label: 'Seminars',
      icon: '🎤',
      path: '/admin/seminars',
      subItems: [
        { label: 'All Seminars', path: '/admin/seminars' },
        { label: 'Add New', path: '/admin/seminars/new' }
      ]
    },
    {
      id: 'newspapers',
      label: 'E-Journals',
      icon: '📰',
      path: '/admin/newspapers',
      subItems: [
        { label: 'All E-Journals', path: '/admin/newspapers' },
        { label: 'Upload New', path: '/admin/newspapers/new' }
      ]
    },
    {
      id: 'whistleblower',
      label: 'Reports',
      icon: '🛡️',
      path: '/admin/whistleblower-reports'
    }
  ];

  const isActiveMenu = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={`admin-layout ${sidebarCollapsed ? 'admin-layout--collapsed' : ''}`}>
      {/* Mobile Header */}
      <div className="admin-layout__mobile-header">
        <button 
          className="admin-layout__mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="admin-layout__mobile-title">Admin Panel</div>
        <div className="admin-layout__mobile-header-actions">
          <button
            className="admin-layout__mobile-back-btn"
            onClick={() => navigate('/')}
            aria-label="Back to Website"
            title="Back to Website"
          >
            🏠
          </button>
          <div className="admin-layout__user-avatar">
            {currentUser?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`admin-layout__sidebar ${mobileMenuOpen ? 'admin-layout__sidebar--mobile-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="admin-layout__sidebar-header">
          <div className="admin-layout__logo">
            <div className="admin-layout__logo-icon">⚡</div>
            {!sidebarCollapsed && <span className="admin-layout__logo-text">Integriting</span>}
          </div>
          <button 
            className="admin-layout__sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="admin-layout__nav">
          <ul className="admin-layout__nav-list">
            {menuItems.map((item) => (
              <li key={item.id} className="admin-layout__nav-item">
                <button
                  className={`admin-layout__nav-link ${isActiveMenu(item) ? 'admin-layout__nav-link--active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="admin-layout__nav-icon">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <>
                      <span className="admin-layout__nav-text">{item.label}</span>
                      {item.subItems && (
                        <span className="admin-layout__nav-arrow">▼</span>
                      )}
                    </>
                  )}
                </button>
                
                {/* Sub-menu */}
                {item.subItems && !sidebarCollapsed && isActiveMenu(item) && (
                  <ul className="admin-layout__nav-submenu">
                    {item.subItems.map((subItem, index) => (
                      <li key={index} className="admin-layout__nav-subitem">
                        <button
                          className={`admin-layout__nav-sublink ${location.pathname === subItem.path ? 'admin-layout__nav-sublink--active' : ''}`}
                          onClick={() => navigate(subItem.path)}
                        >
                          {subItem.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-layout__sidebar-footer">
          <div className="admin-layout__user-info">
            <div className="admin-layout__user-avatar-large">
              {currentUser?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            {!sidebarCollapsed && (
              <div className="admin-layout__user-details">
                <div className="admin-layout__username">{currentUser?.username || 'Administrator'}</div>
                <div className="admin-layout__user-role">Admin</div>
              </div>
            )}
          </div>
          <div className="admin-layout__footer-actions">
            <button
              className="admin-layout__back-to-site-btn"
              onClick={() => navigate('/')}
              title={sidebarCollapsed ? 'Back to Website' : ''}
            >
              <span className="admin-layout__back-to-site-icon">🏠</span>
              {!sidebarCollapsed && <span>Back to Website</span>}
            </button>
            <button
              className="admin-layout__logout-btn"
              onClick={handleLogout}
              title={sidebarCollapsed ? 'Logout' : ''}
            >
              <span className="admin-layout__logout-icon">🚪</span>
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="admin-layout__mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="admin-layout__main">
        <div className="admin-layout__content">
          <Breadcrumb />
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;