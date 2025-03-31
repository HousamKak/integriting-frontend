// src/components/seminars/UpcomingEvents.jsx
// We'll update our previous implementation to make it more focused for the Seminars page
import React from 'react';
import EventCard from './EventCard';
import '../../styles/components/UpcomingEvents.scss';

const UpcomingEvents = ({ seminars, loading, error }) => {
  // Group seminars by month
  const groupedSeminars = seminars.reduce((acc, seminar) => {
    const date = new Date(seminar.event_date);
    const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    if (!acc[month]) {
      acc[month] = [];
    }
    
    acc[month].push(seminar);
    return acc;
  }, {});
  
  // Create an array of months from the grouped object
  const months = Object.keys(groupedSeminars);

  if (loading) return <div className="upcoming-events__loading">Loading events...</div>;
  if (error) return <div className="upcoming-events__error">{error}</div>;
  if (months.length === 0) {
    return (
      <div className="upcoming-events__empty">
        <p>No upcoming events scheduled at this time. Please check back soon.</p>
      </div>
    );
  }

  return (
    <div className="upcoming-events">
      <div className="upcoming-events__timeline">
        {months.map((month) => (
          <div key={month} className="upcoming-events__month-group">
            <div className="upcoming-events__month">
              {month}
            </div>
            <div className="upcoming-events__cards">
              {groupedSeminars[month].map((seminar) => (
                <EventCard key={seminar.id} event={seminar} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;