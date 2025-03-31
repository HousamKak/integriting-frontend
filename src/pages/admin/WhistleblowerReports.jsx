// src/pages/admin/WhistleblowerReports.jsx
import React, { useState, useEffect } from 'react';
import { getWhistleblowerReports, updateReportStatus } from '../../services/whistleblowerService';
import Button from '../../components/common/Button';
import '../../styles/pages/WhistleblowerReports.scss';

const WhistleblowerReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReport, setExpandedReport] = useState(null);

  // Status options for reports
  const statusOptions = ['Pending', 'In Progress', 'Resolved'];

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getWhistleblowerReports();
        // Sort reports by creation date (newest first)
        const sortedReports = data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        setReports(sortedReports);
        setFilteredReports(sortedReports);
        setLoading(false);
      } catch (err) {
        setError('Failed to load reports. Please try again later.');
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Filter reports based on status
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter(report => report.status === activeFilter));
    }
  }, [activeFilter, reports]);

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setExpandedReport(null); // Close any expanded report when changing filter
  };

  // Toggle report expansion
  const toggleReportExpansion = (id) => {
    setExpandedReport(expandedReport === id ? null : id);
  };

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateReportStatus(id, newStatus);
      
      // Update reports in state
      const updatedReports = reports.map(report => 
        report.id === id ? { ...report, status: newStatus } : report
      );
      
      setReports(updatedReports);
    } catch (err) {
      setError('Failed to update report status. Please try again later.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="admin-loading">Loading reports...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="whistleblower-reports">
      <div className="admin-header">
        <h1>Whistleblower Reports</h1>
        <div className="reports-count">
          <span className="reports-count__badge">{reports.length}</span>
          Total Reports
        </div>
      </div>

      <div className="reports-filter">
        <button 
          className={`reports-filter__btn ${activeFilter === 'All' ? 'reports-filter__btn--active' : ''}`}
          onClick={() => handleFilterChange('All')}
        >
          All
        </button>
        {statusOptions.map(status => (
          <button 
            key={status}
            className={`reports-filter__btn ${activeFilter === status ? 'reports-filter__btn--active' : ''}`}
            onClick={() => handleFilterChange(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredReports.length > 0 ? (
        <div className="reports-list">
          {filteredReports.map(report => (
            <div key={report.id} className={`report-card ${expandedReport === report.id ? 'report-card--expanded' : ''}`}>
              <div 
                className="report-card__header"
                onClick={() => toggleReportExpansion(report.id)}
              >
                <div className="report-card__info">
                  <div className="report-card__meta">
                    <span className="report-card__date">{formatDate(report.created_at)}</span>
                    <span className={`report-card__status report-card__status--${report.status.toLowerCase().replace(' ', '-')}`}>
                      {report.status}
                    </span>
                  </div>
                  <h3 className="report-card__title">
                    {report.is_anonymous ? 'Anonymous Report' : (report.name || 'Unnamed Reporter')}
                  </h3>
                  <p className="report-card__preview">
                    {report.message.length > 150 
                      ? `${report.message.substring(0, 150)}...` 
                      : report.message}
                  </p>
                </div>
                <div className="report-card__toggle">
                  {expandedReport === report.id ? '−' : '+'}
                </div>
              </div>
              
              {expandedReport === report.id && (
                <div className="report-card__content">
                  <div className="report-card__details">
                    <div className="report-card__contact">
                      <h4>Reporter Information</h4>
                      {report.is_anonymous ? (
                        <p className="report-card__anonymous">This report was submitted anonymously</p>
                      ) : (
                        <>
                          <p><strong>Name:</strong> {report.name || 'Not provided'}</p>
                          <p><strong>Email:</strong> {report.email || 'Not provided'}</p>
                        </>
                      )}
                    </div>
                    
                    <div className="report-card__message">
                      <h4>Report Message</h4>
                      <div className="report-card__message-content">
                        {report.message}
                      </div>
                    </div>
                  </div>
                  
                  <div className="report-card__actions">
                    <div className="report-card__status-update">
                      <label htmlFor={`status-${report.id}`}>Update Status:</label>
                      <select 
                        id={`status-${report.id}`}
                        value={report.status}
                        onChange={(e) => handleStatusChange(report.id, e.target.value)}
                        className="report-card__status-select"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    
                    {!report.is_anonymous && report.email && (
                      <a 
                        href={`mailto:${report.email}`} 
                        className="report-card__email-btn"
                      >
                        Contact Reporter
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <p>No reports found matching your criteria.</p>
          <Button 
            onClick={() => handleFilterChange('All')} 
            variant="primary"
          >
            View All Reports
          </Button>
        </div>
      )}
    </div>
  );
};

export default WhistleblowerReports;
