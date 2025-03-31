// src/components/newspaper/ArchiveCarousel.jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import '../../styles/components/ArchiveCarousel.scss';

const ArchiveCarousel = ({ newspapers, selectedYear, onSelectYear, onSelectNewspaper }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  
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
  const nextSlide = useCallback(() => {
    if (groupedNewspapers.length <= 1) return;
    setCurrentSlide((prev) => (prev === groupedNewspapers.length - 1 ? 0 : prev + 1));
  }, [groupedNewspapers.length]);
  
  const prevSlide = useCallback(() => {
    if (groupedNewspapers.length <= 1) return;
    setCurrentSlide((prev) => (prev === 0 ? groupedNewspapers.length - 1 : prev - 1));
  }, [groupedNewspapers.length]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [prevSlide, nextSlide]);
  
  // Touch event handlers for swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 70) {
      // Swiped left
      nextSlide();
    } else if (touchEndX - touchStartX > 70) {
      // Swiped right
      prevSlide();
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMMM yyyy');
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
              aria-label="Filter by year"
            >
              <option value="All">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="archive-carousel__empty" role="status">
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
            aria-label="Filter by year"
          >
            <option value="All">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div 
        className="archive-carousel__container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button 
          className="archive-carousel__nav archive-carousel__nav--prev" 
          onClick={prevSlide}
          disabled={groupedNewspapers.length <= 1}
          aria-label="Previous issues"
        >
          ‹
        </button>
        
        <div className="archive-carousel__slider" role="region" aria-roledescription="carousel">
          {groupedNewspapers.length > 0 && (
            <div 
              className="archive-carousel__slides"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              aria-live="polite"
            >
              {groupedNewspapers.map((group, groupIndex) => (
                <div 
                  key={groupIndex} 
                  className="archive-carousel__slide"
                  aria-hidden={currentSlide !== groupIndex}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${groupIndex + 1} of ${groupedNewspapers.length}`}
                >
                  <div className="archive-carousel__grid">
                    {group.map(newspaper => (
                      <div 
                        key={newspaper.id} 
                        className="archive-carousel__item"
                        onClick={() => onSelectNewspaper(newspaper.id)}
                        role="button"
                        tabIndex={currentSlide === groupIndex ? 0 : -1}
                        aria-label={`Select newspaper: ${newspaper.title}, ${formatDate(newspaper.issue_date)}`}
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
        <div className="archive-carousel__pagination" role="tablist">
          {groupedNewspapers.map((_, index) => (
            <button
              key={index}
              className={`archive-carousel__pagination-dot ${index === currentSlide ? 'archive-carousel__pagination-dot--active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === currentSlide}
              role="tab"
            />
          ))}
        </div>
      )}
    </div>
  );
};

ArchiveCarousel.propTypes = {
  newspapers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      issue_date: PropTypes.string.isRequired,
      cover_image_path: PropTypes.string
    })
  ).isRequired,
  selectedYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSelectYear: PropTypes.func.isRequired,
  onSelectNewspaper: PropTypes.func.isRequired
};

export default ArchiveCarousel;