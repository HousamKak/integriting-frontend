// src/pages/PublicationsPage.jsx
import React, { useState, useEffect } from 'react';
import { getPublications, getCategories } from '../services/publicationService';
import PublicationFilter from '../components/publications/PublicationFilter';
import SearchBar from '../components/publications/SearchBar';
import PublicationCard from '../components/publications/PublicationCard';
import '../styles/pages/PublicationsPage.scss';

const PublicationsPage = () => {
  const [publications, setPublications] = useState([]);
  const [filteredPublications, setFilteredPublications] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch publications and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [publicationsData, categoriesData] = await Promise.all([
          getPublications(),
          getCategories()
        ]);
        
        setPublications(publicationsData);
        setFilteredPublications(publicationsData);
        setCategories(['All', ...categoriesData.map(cat => cat.name)]);
        setLoading(false);
      } catch (err) {
        setError('Failed to load publications. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter publications based on category and search query
  useEffect(() => {
    let filtered = [...publications];
    
    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(publication => publication.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(publication =>
        publication.title.toLowerCase().includes(query) ||
        publication.summary.toLowerCase().includes(query)
      );
    }
    
    setFilteredPublications(filtered);
  }, [activeCategory, searchQuery, publications]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="publications-page">
      <div className="container">
        <div className="publications-header">
          <h1 className="publications-header__title">Legal Review</h1>
          <p className="publications-header__subtitle">
            Explore our collection of publications on governance, compliance, and legal insights.
          </p>
        </div>
        
        <div className="publications-controls">
          <PublicationFilter 
            categories={categories} 
            activeCategory={activeCategory} 
            onCategoryChange={handleCategoryChange} 
          />
          
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {loading ? (
          <div className="publications-loading">Loading publications...</div>
        ) : error ? (
          <div className="publications-error">{error}</div>
        ) : filteredPublications.length > 0 ? (
          <div className="publications-grid">
            {filteredPublications.map(publication => (
              <PublicationCard key={publication.id} publication={publication} />
            ))}
          </div>
        ) : (
          <div className="publications-empty">
            <p>No publications found matching your criteria.</p>
            <p>Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationsPage;