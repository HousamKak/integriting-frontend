// src/components/publications/SearchBar.jsx
import React, { useState } from 'react';
import '../../styles/components/SearchBar.scss';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    // Perform search as you type (optional - can be removed if you want to search only on submit)
    onSearch(newQuery);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-bar__input"
        placeholder="Search publications..."
        value={query}
        onChange={handleChange}
      />
      <button type="submit" className="search-bar__button" aria-label="Search">
        <span className="search-bar__icon">🔍</span>
      </button>
    </form>
  );
};

export default SearchBar;