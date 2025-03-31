// src/components/newspaper/ArchiveCarousel.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/components/ArchiveCarousel.scss';

const ArchiveCarousel = ({ newspapers, selectedYear, onSelectYear, onSelectNewspaper }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Reset current slide when year changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [selectedYear]);
  
  // Filter newspapers by selected year
  const filteredNewspapers = selectedYear === 'All' 
    ? newspapers 
    : newspapers.filter(paper => {
        const issueDate = new Date(paper.issue_date);
        return issueDate.getFullYear() === parseInt(selectedYear);
      });
  
  // Group by chunks of 4 (or less for the last group)
  const groupedNewspapers = [];
  for (let i = 0; i < filteredNewspapers.length; i += 4) {
    groupedNewspapers.push(filteredNewspapers.slice(i, i + 4));
  }
  
  // Handle carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === groupedNewspapers.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? groupedNewspapers.length - 1 : prev - 1));
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };
  
  // Extract available years from newspapers
  const years = [...new Set(newspapers.map(paper => {
    const date = new Date(paper.issue_date);
    return date.getFullYear();
  }))].sort((a, b) => b - a); // Sort years in descending order
  
  if (filteredNewspapers.length === 0) {
    return (
      <div className="archive-carousel">
        <div className="archive-carousel__header">
          <h2 className="archive-carousel__title">Archive</h2>
          
          <div className="archive-carousel__filter">
            <select 
              value={selectedYear} 
              onChange={(e) => onSelectYear(e.target.value)}
              className="archive-carousel__year-select"
            >
              <option value="All">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="archive-carousel__empty">
          <p>No issues available for the selected year.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="archive-carousel">
      <div className="archive-carousel__header">
        <h2 className="archive-carousel__title">Archive</h2>
        
        <div className="archive-carousel__filter">
          <select 
            value={selectedYear} 
            onChange={(e) => onSelectYear(e.target.value)}
            className="archive-carousel__year-select"
          >
            <option value="All">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="archive-carousel__container">
        <button 
          className="archive-carousel__nav archive-carousel__nav--prev" 
          onClick={prevSlide}
          disabled={groupedNewspapers.length <= 1}
          aria-label="Previous issues"
        >
          ‹
        </button>
        
        <div className="archive-carousel__slider">
          {groupedNewspapers.length > 0 && (
            <div 
              className="archive-carousel__slides"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {groupedNewspapers.map((group, groupIndex) => (
                <div key={groupIndex} className="archive-carousel__slide">
                  <div className="archive-carousel__grid">
                    {group.map(newspaper => (
                      <div 
                        key={newspaper.id} 
                        className="archive-carousel__item"
                        onClick={() => onSelectNewspaper(newspaper.id)}
                      >
                        <div className="archive-carousel__newspaper">
                          <div className="archive-carousel__cover">
                            {newspaper.cover_image_path ? (
                              <img 
                                src={newspaper.cover_image_path} 
                                alt={newspaper.title} 
                                className="archive-carousel__image"
                              />
                            ) : (
                              <div className="archive-carousel__placeholder">
                                <div className="archive-carousel__placeholder-title">
                                  THE INTEGRITING JOURNAL
                                </div>
                                <div className="archive-carousel__placeholder-content">
                                  {newspaper.title}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="archive-carousel__issue-info">
                            <h3 className="archive-carousel__issue-title">
                              {newspaper.title}
                            </h3>
                            <div className="archive-carousel__issue-date">
                              {formatDate(newspaper.issue_date)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button 
          className="archive-carousel__nav archive-carousel__nav--next" 
          onClick={nextSlide}
          disabled={groupedNewspapers.length <= 1}
          aria-label="Next issues"
        >
          ›
        </button>
      </div>
      
      {groupedNewspapers.length > 1 && (
        <div className="archive-carousel__pagination">
          {groupedNewspapers.map((_, index) => (
            <button
              key={index}
              className={`archive-carousel__pagination-dot ${index === currentSlide ? 'archive-carousel__pagination-dot--active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchiveCarousel;