// src/components/publications/PublicationsList.jsx
import React, { useState, useEffect } from 'react';
import PublicationCard from './PublicationCard';
import PublicationFilter from './PublicationFilter';
import SearchBar from './SearchBar';
import { getPublications, getCategories } from '../../services/publicationService';
import '../../styles/components/PublicationsList.scss';

const PublicationsList = () => {
  const [publications, setPublications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [publicationsData, categoriesData] = await Promise.all([
          getPublications(),
          getCategories()
        ]);
        
        setPublications(publicationsData);
        setCategories(['All', ...categoriesData.map(cat => cat.name)]);
        setLoading(false);
      } catch (err) {
        setError('Failed to load publications. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter publications based on selected category and search query
  const filteredPublications = publications.filter(pub => {
    const matchesCategory = activeCategory === 'All' || pub.category === activeCategory;
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pub.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="publications-list__loading">Loading publications...</div>;
  if (error) return <div className="publications-list__error">{error}</div>;

  return (
    <div className="publications-list">
      <div className="publications-list__header">
        <h2 className="publications-list__title">Legal Review</h2>
        
        <div className="publications-list__controls">
          <PublicationFilter 
            categories={categories} 
            activeCategory={activeCategory} 
            onCategoryChange={handleCategoryChange} 
          />
          
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
      
      <div className="publications-list__grid">
        {filteredPublications.length > 0 ? (
          filteredPublications.map(publication => (
            <PublicationCard key={publication.id} publication={publication} />
          ))
        ) : (
          <div className="publications-list__empty">
            <p>No publications found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationsList;