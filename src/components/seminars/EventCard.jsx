// src/components/seminars/EventCard.jsx
import React from 'react';
import { format } from 'date-fns';
import '../../styles/components/EventCard.scss';

const EventCard = ({ event, isPast = false }) => {
  const { id, title, image_path, event_date, status, seats_available, location } = event;
  
  // Format the date
  const formattedDate = format(new Date(event_date), 'MMMM d, yyyy');
  // Get the day of month for the circle display
  const dayOfMonth = format(new Date(event_date), 'd');
  
  // Determine status badge
  let statusBadge = null;
  if (!isPast) {
    if (status === 'Limited Seats') {
      statusBadge = <span className="event-card__badge event-card__badge--limited">Limited Seats</span>;
    } else if (status === 'Sold Out') {
      statusBadge = <span className="event-card__badge event-card__badge--sold-out">Sold Out</span>;
    } else if (status === 'Free') {
      statusBadge = <span className="event-card__badge event-card__badge--free">Free</span>;
    }
  }

  // Handle registration click
  const handleRegisterClick = () => {
    // This would typically open a registration form modal or redirect to a registration page
    console.log(`Register for event: ${id}`);
  };

  // Handle view materials click
  const handleMaterialsClick = () => {
    // This would typically download or open materials for past events
    console.log(`View materials for event: ${id}`);
  };

  return (
    <div className={`event-card ${isPast ? 'event-card--past' : ''}`}>
      <div className="event-card__date">
        <span className="event-card__day">{dayOfMonth}</span>
      </div>
      
      <div className="event-card__image-container">
        <img 
          src={image_path || '/assets/images/default-seminar.jpg'} 
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
          {statusBadge}
        </div>
        
        <div className="event-card__actions">
          {isPast ? (
            <button 
              className="event-card__materials-button"
              onClick={handleMaterialsClick}
            >
              View Materials
            </button>
          ) : (
            <button 
              className="event-card__register-button"
              onClick={handleRegisterClick}
              disabled={status === 'Sold Out'}
            >
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;