

// src/pages/NewspaperPage.jsx
import React, { useState, useEffect } from 'react';
import { getLatestNewspaper, getNewspapers, getNewspaperById } from '../services/newspaperService';
import NewspaperPreview from '../components/newspaper/NewspaperPreview';
import ArchiveCarousel from '../components/newspaper/ArchiveCarousel';
import '../styles/pages/NewspaperPage.scss';

const NewspaperPage = () => {
  const [latestNewspaper, setLatestNewspaper] = useState(null);
  const [newspapers, setNewspapers] = useState([]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [displayedNewspaper, setDisplayedNewspaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch newspapers
  useEffect(() => {
    const fetchNewspapers = async () => {
      try {
        setLoading(true);
        
        // Fetch latest newspaper and all newspapers in parallel
        const [latestData, allData] = await Promise.all([
          getLatestNewspaper(),
          getNewspapers()
        ]);
        
        setLatestNewspaper(latestData);
        setDisplayedNewspaper(latestData);
        setNewspapers(allData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load newspapers. Please try again later.');
        setLoading(false);
      }
    };

    fetchNewspapers();
  }, []);

  // Handle year selection
  const handleYearChange = (year) => {
    setSelectedYear(year);
    
    // Reset displayed newspaper to latest when changing year
    setDisplayedNewspaper(latestNewspaper);
  };

  // Handle newspaper selection from archive
  const handleSelectNewspaper = async (id) => {
    try {
      setLoading(true);
      const data = await getNewspaperById(id);
      setDisplayedNewspaper(data);
      setLoading(false);
      
      // Scroll to preview section
      document.getElementById('newspaper-preview').scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setError('Failed to load selected newspaper. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="newspaper-page">
      <div className="newspaper-hero">
        <div className="container">
          <div className="newspaper-hero__content">
            <h1 className="newspaper-hero__title">
              The Integriting Journal
            </h1>
            <p className="newspaper-hero__subtitle">
              A downloadable PDF featuring 8-12 pages of investigative reports and analyses 
              focused on emerging trends, future risks, and governance challenges.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div id="newspaper-preview" className="newspaper-page__preview">
          <NewspaperPreview 
            newspaper={displayedNewspaper} 
            loading={loading} 
            error={error}
          />
        </div>
        
        <div className="newspaper-page__archive">
          <ArchiveCarousel 
            newspapers={newspapers}
            selectedYear={selectedYear}
            onSelectYear={handleYearChange}
            onSelectNewspaper={handleSelectNewspaper}
          />
        </div>
        
        <div className="newspaper-page__info">
          <div className="info-card">
            <h2 className="info-card__title">About The Integriting Journal</h2>
            <p className="info-card__text">
              The Integriting Journal is a quarterly publication that provides in-depth analysis 
              of governance challenges, compliance issues, and emerging trends in the field of 
              corporate governance and ethics.
            </p>
            <p className="info-card__text">
              Each issue features expert insights, case studies, and practical guidance to help 
              organizations navigate complex governance landscapes and implement effective 
              strategies for sustainable success.
            </p>
          </div>
          
          <div className="info-card">
            <h2 className="info-card__title">Subscribe to Updates</h2>
            <p className="info-card__text">
              Stay informed about new issues of The Integriting Journal and upcoming events by 
              subscribing to our newsletter.
            </p>
            <form className="info-card__form">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="info-card__input"
                required
              />
              <button type="submit" className="info-card__button">
                Subscribe
              </button>
            </form>
            <p className="info-card__disclaimer">
              Your email will only be used to send you The Integriting Journal updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewspaperPage;