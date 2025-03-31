// src/components/publications/SearchBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/SearchBar.scss';

const SearchBar = ({ onSearch, placeholder = "Search publications..." }) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);
  const searchBarRef = useRef(null);
  
  // Handle input changes
  const handleChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // If we want search-as-you-type functionality
    onSearch(newQuery);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
    
    // On mobile, blur the input to hide keyboard
    if (window.innerWidth < 768) {
      inputRef.current?.blur();
    }
  };
  
  // Toggle expanded state on mobile
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    
    // If expanding, focus the input
    if (!isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };
  
  // Close search on click outside (for mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target) && isExpanded) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div 
      className={`search-bar ${isExpanded ? 'search-bar--expanded' : ''}`}
      ref={searchBarRef}
    >
      <form 
        className="search-bar__form" 
        onSubmit={handleSubmit}
        role="search"
      >
        <input
          type="text"
          className="search-bar__input"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          ref={inputRef}
          aria-label="Search"
        />
        <button 
          type="submit" 
          className="search-bar__button" 
          aria-label={isExpanded ? "Search" : "Open search"}
          onClick={window.innerWidth < 768 ? toggleExpanded : undefined}
        >
          <span className="search-bar__icon">🔍</span>
        </button>
      </form>
      
      {window.innerWidth < 768 && (
        <button 
          className="search-bar__mobile-toggle"
          aria-label={isExpanded ? "Close search" : "Open search"}
          onClick={toggleExpanded}
        >
          <span className="search-bar__icon">
            {isExpanded ? '✕' : '🔍'}
          </span>
        </button>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default SearchBar;