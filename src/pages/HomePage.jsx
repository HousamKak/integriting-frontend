// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import Hero from '../components/home/Hero';
import ServiceGrid from '../components/services/ServiceGrid';
import { getServices } from '../services/serviceService';
import { getLatestNewspaper } from '../services/newspaperService';
import { getUpcomingSeminars } from '../services/seminarService';
import Button from '../components/common/Button';
import '../styles/pages/HomePage.scss';

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [latestNewspaper, setLatestNewspaper] = useState(null);
  const [upcomingSeminars, setUpcomingSeminars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data in parallel
        const [servicesData, newspaperData, seminarsData] = await Promise.all([
          getServices(),
          getLatestNewspaper(),
          getUpcomingSeminars()
        ]);
        
        setServices(servicesData);
        setLatestNewspaper(newspaperData);
        setUpcomingSeminars(seminarsData.slice(0, 3)); // Get first 3 upcoming seminars
        setLoading(false);
      } catch (error) {
        console.error('Error fetching home page data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="home-page">
      <Hero />
      
      <section className="belief-section">
        <div className="container">
          <h2 className="section-title">Our Belief</h2>
          
          <div className="belief-content">
            <p className="belief-text">
              Creative individual initiative and built upon two fundamental pillars, 
              private property, and the protection of property rights. 
              Creating an environment that fosters these elements is a shared responsibility, 
              one that requires a strong foundation of transparency, rule of law, and informed
              decision-making.
            </p>
          </div>
        </div>
      </section>
      
      <section className="services-section">
        <div className="container">
          <ServiceGrid services={services} loading={loading} />
        </div>
      </section>
      
      <section className="highlights-section">
        <div className="container">
          <div className="highlights-grid">
            <div className="highlight-card highlight-card--seminars">
              <h3 className="highlight-card__title">Upcoming Seminars</h3>
              
              {loading ? (
                <div className="highlight-card__loading">Loading seminars...</div>
              ) : upcomingSeminars.length > 0 ? (
                <div className="highlight-card__content">
                  <ul className="upcoming-list">
                    {upcomingSeminars.map(seminar => (
                      <li key={seminar.id} className="upcoming-item">
                        <div className="upcoming-item__date">
                          {formatDate(seminar.event_date)}
                        </div>
                        <div className="upcoming-item__title">
                          {seminar.title}
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <Button to="/seminars" variant="outline" className="highlight-card__button">
                    View All Seminars
                  </Button>
                </div>
              ) : (
                <div className="highlight-card__empty">
                  <p>No upcoming seminars scheduled at this time.</p>
                  <Button to="/seminars" variant="outline">View Past Seminars</Button>
                </div>
              )}
            </div>
            
            <div className="highlight-card highlight-card--journal">
              <h3 className="highlight-card__title">Latest Journal</h3>
              
              {loading ? (
                <div className="highlight-card__loading">Loading journal...</div>
              ) : latestNewspaper ? (
                <div className="highlight-card__content">
                  <div className="journal-preview">
                    <div className="journal-preview__image">
                      {latestNewspaper.cover_image_path ? (
                        <img 
                          src={latestNewspaper.cover_image_path} 
                          alt="The Integriting Journal" 
                        />
                      ) : (
                        <div className="journal-preview__placeholder">
                          <h4>THE INTEGRITING JOURNAL</h4>
                        </div>
                      )}
                    </div>
                    
                    <div className="journal-preview__info">
                      <h4 className="journal-preview__title">{latestNewspaper.title}</h4>
                      <div className="journal-preview__date">
                        {formatDate(latestNewspaper.issue_date)}
                      </div>
                      <Button to="/newspaper" variant="outline" className="journal-preview__button">
                        Read Journal
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="highlight-card__empty">
                  <p>No journal issues available at this time.</p>
                </div>
              )}
            </div>
            
            <div className="highlight-card highlight-card--whistleblower">
              <h3 className="highlight-card__title">Whistleblower Protection</h3>
              
              <div className="highlight-card__content">
                <p className="highlight-card__text">
                  We provide confidential reporting mechanisms and legal protections for whistleblowers. 
                  Your identity and information will remain strictly confidential.
                </p>
                
                <Button to="/whistleblower" variant="primary" className="highlight-card__button">
                  Report Misconduct
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="why-section">
        <div className="container">
          <h2 className="section-title">Why Integriting?</h2>
          
          <div className="values-grid">
            <div className="value-card">
              <div className="value-card__icon">🔍</div>
              <h3 className="value-card__title">Expertise</h3>
              <p className="value-card__text">
                Our team of specialists brings deep knowledge in governance, law, and compliance to help you navigate complex challenges.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-card__icon">⚖️</div>
              <h3 className="value-card__title">Integrity</h3>
              <p className="value-card__text">
                We uphold the highest ethical standards in our work, ensuring transparency and honesty in every interaction.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-card__icon">🛡️</div>
              <h3 className="value-card__title">Protection</h3>
              <p className="value-card__text">
                We are committed to safeguarding whistleblowers and creating secure environments for reporting misconduct.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-card__icon">🌱</div>
              <h3 className="value-card__title">Sustainability</h3>
              <p className="value-card__text">
                Our focus on sustainable governance helps organizations build resilient structures for long-term success.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
