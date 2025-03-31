// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../services/api';
import '../../styles/pages/AdminDashboard.scss';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    publications: 0,
    services: 0,
    seminars: 0,
    newspapers: 0,
    whistleblowerReports: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard statistics. Please try again later.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminModules = [
    {
      title: 'Publications',
      count: stats.publications,
      icon: '📚',
      link: '/admin/publications',
      color: '#3C64B1'
    },
    {
      title: 'Services',
      count: stats.services,
      icon: '🧭',
      link: '/admin/services',
      color: '#1A365D'
    },
    {
      title: 'Seminars',
      count: stats.seminars,
      icon: '🎤',
      link: '/admin/seminars',
      color: '#E9B949'
    },
    {
      title: 'Newspapers',
      count: stats.newspapers,
      icon: '📰',
      link: '/admin/newspapers',
      color: '#2A4A7F'
    },
    {
      title: 'Whistleblower Reports',
      count: stats.whistleblowerReports,
      icon: '🛡️',
      link: '/admin/whistleblower-reports',
      color: '#6B7280'
    }
  ];

  if (loading) return <div className="admin-dashboard__loading">Loading dashboard...</div>;
  if (error) return <div className="admin-dashboard__error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard__title">Admin Dashboard</h1>
      
      <div className="admin-dashboard__stats">
        {adminModules.map((module) => (
          <Link 
            to={module.link} 
            key={module.title}
            className="admin-dashboard__stat-card"
            style={{ borderTop: `4px solid ${module.color}` }}
          >
            <div className="admin-dashboard__stat-icon">{module.icon}</div>
            <div className="admin-dashboard__stat-info">
              <h3 className="admin-dashboard__stat-title">{module.title}</h3>
              <p className="admin-dashboard__stat-count">{module.count}</p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="admin-dashboard__quick-actions">
        <h2 className="admin-dashboard__section-title">Quick Actions</h2>
        <div className="admin-dashboard__action-buttons">
          <Link to="/admin/publications/new" className="admin-dashboard__action-button">
            Add Publication
          </Link>
          <Link to="/admin/seminars/new" className="admin-dashboard__action-button">
            Create Seminar
          </Link>
          <Link to="/admin/newspapers/new" className="admin-dashboard__action-button">
            Upload Newspaper
          </Link>
        </div>
      </div>
      
      <div className="admin-dashboard__recent-activity">
        <h2 className="admin-dashboard__section-title">Recent Activity</h2>
        <p className="admin-dashboard__empty-message">
          Activity tracking will be implemented in a future update.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;