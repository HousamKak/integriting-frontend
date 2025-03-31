// src/components/publications/PublicationFilter.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/PublicationFilter.scss';

const PublicationFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <nav className="publication-filter" aria-label="Publication categories">
      <ul className="publication-filter__list">
        {categories.map(category => (
          <li 
            key={category} 
            className={`publication-filter__item ${activeCategory === category ? 'publication-filter__item--active' : ''}`}
          >
            <button
              className="publication-filter__button"
              onClick={() => onCategoryChange(category)}
              aria-current={activeCategory === category ? 'page' : undefined}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

PublicationFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired
};

export default PublicationFilter;