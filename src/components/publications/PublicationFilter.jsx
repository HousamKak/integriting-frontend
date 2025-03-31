// src/components/publications/PublicationFilter.jsx
import React from 'react';
import '../../styles/components/PublicationFilter.scss';

const PublicationFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="publication-filter">
      <ul className="publication-filter__list">
        {categories.map(category => (
          <li 
            key={category} 
            className={`publication-filter__item ${activeCategory === category ? 'publication-filter__item--active' : ''}`}
          >
            <button
              className="publication-filter__button"
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublicationFilter;