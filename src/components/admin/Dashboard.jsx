// src/components/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardStats } from '../../services/api';
import '../../styles/pages/AdminDashboard.scss';

const AdminDashboardComponent = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    publications: 0,
    services: 0,
    seminars: 0,
    newspapers: 0,
    whistleblowerReports: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await getDashboardStats();
        setStats(statsData);
        
        // Recent activity would typically come from a separate API endpoint
        // For now, we'll use mock data
        setRecentActivity([
          { type: 'publication', action: 'created', item: 'The Role of Boards in Corporate Governance', date: new Date() },
          { type: 'seminar', action: 'updated', item: 'Enhancing Transparency in Governance', date: new Date(Date.now() - 86400000) },
          { type: 'whistleblower', action: 'statusChanged', item: 'Report #ABC123', date: new Date(Date.now() - 172800000) }
        ]);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date for activity feed
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="admin-dashboard__loading">Loading dashboard data...</div>;
  if (error) return <div className="admin-dashboard__error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__welcome">
        <h2>Welcome back, {currentUser?.username || 'Administrator'}</h2>
        <p>Here's an overview of your website's content and recent activity.</p>
      </div>
      
      <div className="admin-dashboard__stats">
        <div className="admin-dashboard__stat-card" style={{ borderTop: '4px solid #3C64B1' }}>
          <div className="admin-dashboard__stat-icon">📚</div>
          <div className="admin-dashboard__stat-info">
            <h3 className="admin-dashboard__stat-title">Publications</h3>
            <p className="admin-dashboard__stat-count">{stats.publications}</p>
          </div>
        </div>
        
        <div className="admin-dashboard__stat-card" style={{ borderTop: '4px solid #1A365D' }}>
          <div className="admin-dashboard__stat-icon">🧭</div>
          <div className="admin-dashboard__stat-info">
            <h3 className="admin-dashboard__stat-title">Services</h3>
            <p className="admin-dashboard__stat-count">{stats.services}</p>
          </div>
        </div>
        
        <div className="admin-dashboard__stat-card" style={{ borderTop: '4px solid #E9B949' }}>
          <div className="admin-dashboard__stat-icon">🎤</div>
          <div className="admin-dashboard__stat-info">
            <h3 className="admin-dashboard__stat-title">Seminars</h3>
            <p className="admin-dashboard__stat-count">{stats.seminars}</p>
          </div>
        </div>
        
        <div className="admin-dashboard__stat-card" style={{ borderTop: '4px solid #2A4A7F' }}>
          <div className="admin-dashboard__stat-icon">📰</div>
          <div className="admin-dashboard__stat-info">
            <h3 className="admin-dashboard__stat-title">Newspapers</h3>
            <p className="admin-dashboard__stat-count">{stats.newspapers}</p>
          </div>
        </div>
        
        <div className="admin-dashboard__stat-card" style={{ borderTop: '4px solid #6B7280' }}>
          <div className="admin-dashboard__stat-icon">🛡️</div>
          <div className="admin-dashboard__stat-info">
            <h3 className="admin-dashboard__stat-title">Whistleblower Reports</h3>
            <p className="admin-dashboard__stat-count">{stats.whistleblowerReports}</p>
          </div>
        </div>
      </div>
      
      <div className="admin-dashboard__row">
        <div className="admin-dashboard__quick-actions">
          <h3 className="admin-dashboard__section-title">Quick Actions</h3>
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
            <Link to="/admin/services/new" className="admin-dashboard__action-button">
              Add Service
            </Link>
          </div>
        </div>
        
        <div className="admin-dashboard__recent-activity">
          <h3 className="admin-dashboard__section-title">Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <ul className="admin-dashboard__activity-list">
              {recentActivity.map((activity, index) => (
                <li key={index} className="admin-dashboard__activity-item">
                  <div className="admin-dashboard__activity-icon">
                    {activity.type === 'publication' && '📝'}
                    {activity.type === 'seminar' && '🎯'}
                    {activity.type === 'newspaper' && '📰'}
                    {activity.type === 'service' && '🔧'}
                    {activity.type === 'whistleblower' && '🔔'}
                  </div>
                  <div className="admin-dashboard__activity-content">
                    <div className="admin-dashboard__activity-text">
                      <span className="admin-dashboard__activity-action">
                        {activity.action === 'created' && 'Created '}
                        {activity.action === 'updated' && 'Updated '}
                        {activity.action === 'deleted' && 'Deleted '}
                        {activity.action === 'statusChanged' && 'Changed status of '}
                      </span>
                      <span className="admin-dashboard__activity-item-name">{activity.item}</span>
                    </div>
                    <div className="admin-dashboard__activity-date">{formatDate(activity.date)}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-dashboard__empty-message">
              No recent activity to display.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardComponent;