// src/components/seminars/SeminarTabs.jsx
import React from 'react';
import '../../styles/components/SeminarTabs.scss';

const SeminarTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past Events' },
    { id: 'all', label: 'All' }
  ];

  return (
    <div className="seminar-tabs">
      <div className="seminar-tabs__container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`seminar-tabs__tab ${activeTab === tab.id ? 'seminar-tabs__tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeminarTabs;