// src/components/seminars/EventCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import '../../styles/components/EventCard.scss';

const EventCard = ({ event, isPast = false, onRegister }) => {
  const { id, title, image_path, event_date, status, seats_available, location } = event;
  
  // Format the date
  const formattedDate = format(new Date(event_date), 'MMMM d, yyyy');
  // Get the day of month for the circle display
  const dayOfMonth = format(new Date(event_date), 'd');
  
  // Determine status badge
  const renderStatusBadge = () => {
    if (isPast) return null;
    
    if (status === 'Limited Seats') {
      return <span className="event-card__badge event-card__badge--limited">Limited Seats</span>;
    } else if (status === 'Sold Out') {
      return <span className="event-card__badge event-card__badge--sold-out">Sold Out</span>;
    } else if (status === 'Free') {
      return <span className="event-card__badge event-card__badge--free">Free</span>;
    }
    
    return null;
  };

  // Handle registration click
  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (onRegister) {
      onRegister(id);
    }
  };

  // Handle view materials click
  const handleMaterialsClick = (e) => {
    e.preventDefault();
    // Implementation for downloading or accessing materials would go here
    console.log(`View materials for event: ${id}`);
  };

  // Determine default image if none provided
  const imageSrc = image_path || '/assets/images/default-seminar.jpg';

  return (
    <div className={`event-card ${isPast ? 'event-card--past' : ''}`}>
      <div className="event-card__date" aria-label={`Event day: ${dayOfMonth}`}>
        <span className="event-card__day">{dayOfMonth}</span>
      </div>
      
      <div className="event-card__image-container">
        <img 
          src={imageSrc} 
          alt={title} 
          className="event-card__image" 
        />
        {isPast && (
          <div className="event-card__past-overlay">
            <span>Past Event</span>
          </div>
        )}
      </div>
      
      <div className="event-card__content">
        <h3 className="event-card__title">{title}</h3>
        
        <div className="event-card__details">
          <div className="event-card__date-location">
            <span className="event-card__date-full">{formattedDate}</span>
            {location && <span className="event-card__location">{location}</span>}
          </div>
          {renderStatusBadge()}
        </div>
        
        <div className="event-card__actions">
          {isPast ? (
            <button 
              className="event-card__materials-button"
              onClick={handleMaterialsClick}
              aria-label={`View materials for ${title}`}
            >
              View Materials
            </button>
          ) : (
            <button 
              className="event-card__register-button"
              onClick={handleRegisterClick}
              disabled={status === 'Sold Out'}
              aria-label={`Register for ${title}${status === 'Sold Out' ? ' (Sold Out)' : ''}`}
            >
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    image_path: PropTypes.string,
    event_date: PropTypes.string.isRequired,
    status: PropTypes.string,
    seats_available: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string
  }).isRequired,
  isPast: PropTypes.bool,
  onRegister: PropTypes.func
};

export default EventCard;