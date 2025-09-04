import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardStats, getSystemHealth } from '../../services/api';
import { Card, Button } from '../../components/admin/ui';
import '../../styles/pages/AdminDashboard.scss';

const AdminDashboard = () => {
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
  const [systemHealth, setSystemHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const statsData = await getDashboardStats();
        
        // Handle stats data from API response - ensure it's an object with expected structure
        const processedStats = {
          publications: statsData?.publications || 0,
          publicationsChange: statsData?.publicationsChange || 0,
          services: statsData?.services || 0,
          servicesChange: statsData?.servicesChange || 0,
          seminars: statsData?.seminars || 0,
          seminarsChange: statsData?.seminarsChange || 0,
          newspapers: statsData?.newspapers || 0,
          newspapersChange: statsData?.newspapersChange || 0,
          whistleblowerReports: statsData?.whistleblowerReports || 0,
          reportsChange: statsData?.reportsChange || 0,
          recentActivity: Array.isArray(statsData?.recentActivity) ? statsData.recentActivity : []
        };
        
        setStats(processedStats);
        
        // Set recent activity from API
        if (processedStats.recentActivity && processedStats.recentActivity.length > 0) {
          setRecentActivity(processedStats.recentActivity);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    const fetchSystemHealth = async () => {
      try {
        setHealthLoading(true);
        const healthData = await getSystemHealth();
        setSystemHealth(healthData);
        setHealthLoading(false);
      } catch (err) {
        console.error('System health fetch error:', err);
        setSystemHealth({
          status: 'unhealthy',
          services: {
            backend: { status: 'unhealthy', error: err.message },
            database: { status: 'unhealthy', error: err.message }
          }
        });
        setHealthLoading(false);
      }
    };

    fetchDashboardData();
    fetchSystemHealth();
  }, []);

  const statsCards = [
    {
      title: 'Publications',
      value: stats.publications,
      icon: '📚',
      color: 'blue',
      change: stats.publicationsChange ? `${stats.publicationsChange > 0 ? '+' : ''}${stats.publicationsChange}%` : null,
      changeType: stats.publicationsChange > 0 ? 'increase' : stats.publicationsChange < 0 ? 'decrease' : 'neutral',
      link: '/admin/publications'
    },
    {
      title: 'Services',
      value: stats.services,
      icon: '🛠️',
      color: 'green',
      change: stats.servicesChange ? `${stats.servicesChange > 0 ? '+' : ''}${stats.servicesChange}%` : null,
      changeType: stats.servicesChange > 0 ? 'increase' : stats.servicesChange < 0 ? 'decrease' : 'neutral',
      link: '/admin/services'
    },
    {
      title: 'Seminars',
      value: stats.seminars,
      icon: '🎤',
      color: 'orange',
      change: stats.seminarsChange ? `${stats.seminarsChange > 0 ? '+' : ''}${stats.seminarsChange}%` : null,
      changeType: stats.seminarsChange > 0 ? 'increase' : stats.seminarsChange < 0 ? 'decrease' : 'neutral',
      link: '/admin/seminars'
    },
    {
      title: 'E-Journals',
      value: stats.newspapers,
      icon: '📰',
      color: 'purple',
      change: stats.newspapersChange ? `${stats.newspapersChange > 0 ? '+' : ''}${stats.newspapersChange}%` : null,
      changeType: stats.newspapersChange > 0 ? 'increase' : stats.newspapersChange < 0 ? 'decrease' : 'neutral',
      link: '/admin/newspapers'
    },
    {
      title: 'Reports',
      value: stats.whistleblowerReports,
      icon: '🛡️',
      color: 'red',
      change: stats.reportsChange ? `${stats.reportsChange > 0 ? '+' : ''}${stats.reportsChange}%` : null,
      changeType: stats.reportsChange > 0 ? 'increase' : stats.reportsChange < 0 ? 'decrease' : 'neutral',
      link: '/admin/whistleblower-reports'
    }
  ];

  const quickActions = [
    { title: 'Add Publication', icon: '📝', link: '/admin/publications/new', color: 'blue' },
    { title: 'Create Seminar', icon: '🎯', link: '/admin/seminars/new', color: 'green' },
    { title: 'Upload E-Journal', icon: '📤', link: '/admin/newspapers/new', color: 'orange' },
    { title: 'Add Service', icon: '➕', link: '/admin/services/new', color: 'purple' },
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMinutes > 0) return `${diffMinutes}m ago`;
    return 'Just now';
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'green';
      case 'degraded': return 'yellow';
      case 'unhealthy': return 'red';
      default: return 'gray';
    }
  };

  const getHealthStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'degraded': return '⚠️';
      case 'unhealthy': return '❌';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__error">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Welcome Header */}
      <div className="admin-dashboard__header">
        <div className="admin-dashboard__welcome">
          <h1 className="admin-dashboard__title">
            Welcome back, {currentUser?.username || 'Administrator'}! 👋
          </h1>
          <p className="admin-dashboard__subtitle">
            Here's what's happening with your platform today
          </p>
        </div>
        <div className="admin-dashboard__date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="admin-dashboard__stats-grid">
        {statsCards.map((card, index) => (
          <Link key={index} to={card.link} className="admin-dashboard__stat-link">
            <Card.Stats
              icon={card.icon}
              title={card.title}
              value={card.value}
              change={card.change}
              changeType={card.changeType}
              color={card.color}
            />
          </Link>
        ))}
      </div>


      {/* Main Content Grid */}
      <div className="admin-dashboard__content-grid">
        
        {/* Quick Actions */}
        <Card 
          title="Quick Actions" 
          subtitle="Frequently used actions"
          className="admin-dashboard__quick-actions-card"
        >
          <div className="admin-dashboard__quick-actions">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`admin-dashboard__quick-action admin-dashboard__quick-action--${action.color}`}
              >
                <div className="admin-dashboard__quick-action-icon">
                  {action.icon}
                </div>
                <span className="admin-dashboard__quick-action-title">
                  {action.title}
                </span>
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card 
          title="Recent Activity" 
          subtitle="Latest updates and changes"
          className="admin-dashboard__activity-card"
        >
          <div className="admin-dashboard__activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="admin-dashboard__activity-item">
                  <div className="admin-dashboard__activity-icon">
                    {activity.icon}
                  </div>
                  <div className="admin-dashboard__activity-content">
                    <div className="admin-dashboard__activity-text">
                      <span className="admin-dashboard__activity-action">
                        {activity.action === 'created' && 'Created '}
                        {activity.action === 'updated' && 'Updated '}
                        {activity.action === 'deleted' && 'Deleted '}
                        {activity.action === 'received' && 'Received '}
                      </span>
                      <span className="admin-dashboard__activity-item-name">
                        {activity.item}
                      </span>
                    </div>
                    <div className="admin-dashboard__activity-meta">
                      <span className="admin-dashboard__activity-user">by {activity.user}</span>
                      <span className="admin-dashboard__activity-time">
                        {getTimeAgo(activity.date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="admin-dashboard__empty-activity">
                <div className="admin-dashboard__empty-icon">📊</div>
                <p>No recent activity to display</p>
              </div>
            )}
          </div>
        </Card>

        {/* System Health Status */}
        <Card 
          title="System Health" 
          subtitle="Backend and database monitoring"
          className="admin-dashboard__health-card"
        >
          {healthLoading ? (
            <div className="admin-dashboard__health-loading">
              <div className="loading-spinner"></div>
              <p>Checking status...</p>
            </div>
          ) : systemHealth ? (
            <div className="admin-dashboard__health-content">
              {/* Overall Status */}
              <div className="admin-dashboard__health-overview">
                <div className="admin-dashboard__health-main-status">
                  <div className={`admin-dashboard__health-light admin-dashboard__health-light--${getHealthStatusColor(systemHealth.status)}`}></div>
                  <span className="admin-dashboard__health-status-text">
                    System {systemHealth.status?.toUpperCase()}
                  </span>
                </div>
                {systemHealth.uptime && (
                  <div className="admin-dashboard__health-uptime">
                    Uptime: {formatUptime(systemHealth.uptime)}
                  </div>
                )}
              </div>

              {/* Services */}
              <div className="admin-dashboard__health-services">
                <div className="admin-dashboard__health-service">
                  <div className={`admin-dashboard__health-service-light admin-dashboard__health-service-light--${getHealthStatusColor(systemHealth.services?.backend?.status)}`}></div>
                  <span className="admin-dashboard__health-service-name">Backend API</span>
                </div>
                <div className="admin-dashboard__health-service">
                  <div className={`admin-dashboard__health-service-light admin-dashboard__health-service-light--${getHealthStatusColor(systemHealth.services?.database?.status)}`}></div>
                  <span className="admin-dashboard__health-service-name">Database</span>
                </div>
              </div>

              {/* Error Messages (only if errors exist) */}
              {(systemHealth.services?.backend?.error || systemHealth.services?.database?.error) && (
                <div className="admin-dashboard__health-errors">
                  {systemHealth.services?.backend?.error && (
                    <div className="admin-dashboard__health-error">
                      <div className="admin-dashboard__health-error-light"></div>
                      Backend: {systemHealth.services.backend.error}
                    </div>
                  )}
                  {systemHealth.services?.database?.error && (
                    <div className="admin-dashboard__health-error">
                      <div className="admin-dashboard__health-error-light"></div>
                      Database: {systemHealth.services.database.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="admin-dashboard__health-error">
              <div className="admin-dashboard__health-error-icon">⚠️</div>
              <p>Unable to load system status</p>
            </div>
          )}
        </Card>


      </div>
    </div>
  );
};

export default AdminDashboard;