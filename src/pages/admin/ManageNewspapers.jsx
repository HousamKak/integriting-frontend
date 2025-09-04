// src/pages/admin/ManageNewspapers.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNewspapers, deleteNewspaper } from '../../services/newspaperService';
import { Button, Card, LoadingSpinner } from '../../components/admin/ui';
import '../../styles/pages/ManageNewspapers.scss';

const ManageNewspapers = () => {
  const [newspapers, setNewspapers] = useState([]);
  const [filteredNewspapers, setFilteredNewspapers] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch newspapers
  useEffect(() => {
    const fetchNewspapers = async () => {
      try {
        const data = await getNewspapers();
        
        // Ensure data is properly formatted as an array
        const newspapersArray = Array.isArray(data) ? data : (data?.newspapers || data?.data || []);
        
        setNewspapers(newspapersArray);
        setFilteredNewspapers(newspapersArray);
        
        // Extract unique years from issue_date
        const years = [...new Set(newspapersArray.map(newspaper => {
          const date = new Date(newspaper.issue_date);
          return date.getFullYear();
        }))].sort((a, b) => b - a); // Sort years in descending order
        
        setAvailableYears(['All', ...years]);
        setLoading(false);
      } catch (err) {
        setError('Failed to load newspapers. Please try again later.');
        setLoading(false);
      }
    };

    fetchNewspapers();
  }, []);

  // Filter newspapers based on selected year
  useEffect(() => {
    if (selectedYear === 'All') {
      setFilteredNewspapers(newspapers);
    } else {
      const year = parseInt(selectedYear);
      setFilteredNewspapers(newspapers.filter(newspaper => {
        const issueDate = new Date(newspaper.issue_date);
        return issueDate.getFullYear() === year;
      }));
    }
  }, [selectedYear, newspapers]);

  // Handle year filter change
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (id) => {
    setDeleteConfirm(id);
  };

  // Handle delete newspaper
  const handleDelete = async (id) => {
    try {
      await deleteNewspaper(id);
      setNewspapers(newspapers.filter(newspaper => newspaper.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete newspaper. Please try again later.');
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Card variant="error"><p>{error}</p></Card>;

  return (
    <Card>
      <div className="admin-header">
        <h1>Manage E-Newspapers</h1>
        <Link to="/admin/newspapers/new">
          <Button 
            variant="primary"
          >
            Add New Issue
          </Button>
        </Link>
      </div>

      <div className="admin-filters">
        <div className="admin-filter">
          <label htmlFor="yearFilter">Filter by year:</label>
          <select 
            id="yearFilter" 
            value={selectedYear}
            onChange={handleYearChange}
            className="admin-select"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredNewspapers.length > 0 ? (
        <div className="newspaper-grid">
          {filteredNewspapers.map(newspaper => (
            <div key={newspaper.id} className="newspaper-card">
              <div className="newspaper-card__cover">
                {newspaper.cover_image_path ? (
                  <img src={newspaper.cover_image_path} alt={newspaper.title} />
                ) : (
                  <div className="newspaper-card__placeholder">
                    <h3 className="newspaper-card__placeholder-title">THE INTEGRITING JOURNAL</h3>
                    <div className="newspaper-card__placeholder-content">{newspaper.title}</div>
                  </div>
                )}
              </div>
              
              <div className="newspaper-card__content">
                <h3 className="newspaper-card__title">{newspaper.title}</h3>
                <div className="newspaper-card__date">
                  {formatDate(newspaper.issue_date)}
                </div>
                {newspaper.description && (
                  <p className="newspaper-card__description">
                    {newspaper.description.length > 100 
                      ? `${newspaper.description.substring(0, 100)}...` 
                      : newspaper.description}
                  </p>
                )}
              </div>
              
              <div className="newspaper-card__actions">
                <a 
                  href={newspaper.pdf_file_path} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="admin-btn admin-btn-view"
                >
                  View PDF
                </a>
                <Link 
                  to={`/admin/newspapers/${newspaper.id}`} 
                  className="admin-btn admin-btn-edit"
                >
                  Edit
                </Link>
                {deleteConfirm === newspaper.id ? (
                  <div className="admin-confirm-delete">
                    <span>Are you sure?</span>
                    <button 
                      onClick={() => handleDelete(newspaper.id)}
                      className="admin-btn admin-btn-confirm"
                    >
                      Yes
                    </button>
                    <button 
                      onClick={cancelDelete}
                      className="admin-btn admin-btn-cancel"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleDeleteConfirm(newspaper.id)}
                    className="admin-btn admin-btn-delete"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <p>No newspapers found for this year. Please select another year or add a new issue.</p>
          <Link to="/admin/newspapers/new">
            <Button 
              variant="primary"
            >
              Add New Issue
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
};
export default ManageNewspapers;
