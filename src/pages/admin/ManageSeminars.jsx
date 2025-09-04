// src/pages/admin/ManageSeminars.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSeminars, deleteSeminar } from '../../services/seminarService';
import { Button, Card, LoadingSpinner } from '../../components/admin/ui';
import '../../styles/pages/ManageSeminars.scss';

const ManageSeminars = () => {
  const [seminars, setSeminars] = useState([]);
  const [filteredSeminars, setFilteredSeminars] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch seminars
  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        const data = await getAllSeminars();
        
        // Ensure data is properly formatted as an array
        const seminarsArray = Array.isArray(data) ? data : (data?.seminars || data?.data || []);
        
        setSeminars(seminarsArray);
        setFilteredSeminars(seminarsArray);
        setLoading(false);
      } catch (err) {
        setError('Failed to load seminars. Please try again later.');
        setLoading(false);
      }
    };

    fetchSeminars();
  }, []);

  // Filter seminars based on status
  useEffect(() => {
    if (!Array.isArray(seminars)) return;
    
    if (activeFilter === 'All') {
      setFilteredSeminars(seminars);
    } else {
      setFilteredSeminars(seminars.filter(seminar => seminar.status === activeFilter));
    }
  }, [activeFilter, seminars]);

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (id) => {
    setDeleteConfirm(id);
  };

  // Handle delete seminar
  const handleDelete = async (id) => {
    try {
      await deleteSeminar(id);
      setSeminars(seminars.filter(seminar => seminar.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete seminar. Please try again later.');
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
        <h1>Manage Seminars</h1>
        <Link to="/admin/seminars/new">
          <Button 
            variant="primary"
          >
          Add New Seminar
          </Button>
        </Link>
      </div>

      <div className="seminars-filter">
        <button 
          className={`seminars-filter__btn ${activeFilter === 'All' ? 'seminars-filter__btn--active' : ''}`}
          onClick={() => handleFilterChange('All')}
        >
          All
        </button>
        <button 
          className={`seminars-filter__btn ${activeFilter === 'Upcoming' ? 'seminars-filter__btn--active' : ''}`}
          onClick={() => handleFilterChange('Upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`seminars-filter__btn ${activeFilter === 'Past' ? 'seminars-filter__btn--active' : ''}`}
          onClick={() => handleFilterChange('Past')}
        >
          Past
        </button>
      </div>

      {filteredSeminars.length > 0 ? (
        <div className="seminars-list">
          {filteredSeminars.map(seminar => (
            <div key={seminar.id} className="seminar-card">
              <div className="seminar-card__image">
                {seminar.image_path ? (
                  <img src={seminar.image_path} alt={seminar.title} />
                ) : (
                  <div className="seminar-card__placeholder">No Image</div>
                )}
                <div className={`seminar-card__status seminar-card__status--${seminar.status.toLowerCase()}`}>
                  {seminar.status}
                </div>
              </div>
              
              <div className="seminar-card__content">
                <h3 className="seminar-card__title">{seminar.title}</h3>
                <div className="seminar-card__date">
                  <span className="seminar-card__date-icon">📅</span>
                  {formatDate(seminar.event_date)}
                </div>
                <p className="seminar-card__description">
                  {seminar.description?.length > 150 
                    ? `${seminar.description.substring(0, 150)}...` 
                    : seminar.description}
                </p>
                
                <div className="seminar-card__details">
                  {seminar.location && (
                    <div className="seminar-card__location">
                      <span className="seminar-card__location-icon">📍</span>
                      {seminar.location}
                    </div>
                  )}
                  {seminar.seats_available !== undefined && (
                    <div className="seminar-card__seats">
                      <span className="seminar-card__seats-icon">👥</span>
                      {seminar.seats_available > 0 ? `${seminar.seats_available} seats available` : 'Sold out'}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="seminar-card__actions">
                <Link 
                  to={`/admin/seminars/${seminar.id}`} 
                  className="admin-btn admin-btn-edit"
                >
                  Edit
                </Link>
                {deleteConfirm === seminar.id ? (
                  <div className="admin-confirm-delete">
                    <span>Are you sure?</span>
                    <button 
                      onClick={() => handleDelete(seminar.id)}
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
                    onClick={() => handleDeleteConfirm(seminar.id)}
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
          <p>No seminars found matching your criteria.</p>
          <Link to="/admin/seminars/new">
            <Button 
              variant="primary"
            >
              Add Seminar
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
};

export default ManageSeminars;