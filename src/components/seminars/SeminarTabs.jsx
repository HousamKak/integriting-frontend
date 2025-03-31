// src/components/seminars/SeminarTabs.jsx
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/SeminarTabs.scss';

const SeminarTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past Events' },
    { id: 'all', label: 'All' }
  ];
  
  const tabsRef = useRef(null);
  
  // Scroll active tab into view if needed
  useEffect(() => {
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      const activeElement = tabsElement.querySelector('.seminar-tabs__tab--active');
      if (activeElement) {
        const containerWidth = tabsElement.clientWidth;
        const activeElementLeft = activeElement.offsetLeft;
        const activeElementWidth = activeElement.clientWidth;
        
        // Only scroll if the active element is not fully visible
        if (activeElementLeft < tabsElement.scrollLeft || 
            activeElementLeft + activeElementWidth > tabsElement.scrollLeft + containerWidth) {
          tabsElement.scrollLeft = activeElementLeft - (containerWidth / 2) + (activeElementWidth / 2);
        }
      }
    }
  }, [activeTab]);

  return (
    <div className="seminar-tabs" role="tablist" aria-label="Seminar categories">
      <div className="seminar-tabs__container" ref={tabsRef}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`seminar-tabs__tab ${activeTab === tab.id ? 'seminar-tabs__tab--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id ? 'true' : 'false'}
            aria-controls={`${tab.id}-panel`}
            id={`${tab.id}-tab`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

SeminarTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired
};

export default SeminarTabs;