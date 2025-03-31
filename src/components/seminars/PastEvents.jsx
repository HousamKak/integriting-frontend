
// src/components/seminars/PastEvents.jsx
import React from 'react';
import EventCard from './EventCard';
import '../../styles/components/PastEvents.scss';

const PastEvents = ({ seminars, loading, error }) => {
  if (loading) return <div className="past-events__loading">Loading past events...</div>;
  if (error) return <div className="past-events__error">{error}</div>;
  if (seminars.length === 0) {
    return (
      <div className="past-events__empty">
        <p>No past events to display.</p>
      </div>
    );
  }

  return (
    <div className="past-events">
      <div className="past-events__grid">
        {seminars.map((seminar) => (
          <EventCard key={seminar.id} event={seminar} isPast={true} />
        ))}
      </div>
    </div>
  );
};

export default PastEvents;