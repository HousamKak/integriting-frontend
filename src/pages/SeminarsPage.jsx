
// src/pages/SeminarsPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllSeminars, getUpcomingSeminars, getPastSeminars } from '../services/seminarService';
import SeminarTabs from '../components/seminars/SeminarTabs';
import UpcomingEvents from '../components/seminars/UpcomingEvents';
import PastEvents from '../components/seminars/PastEvents';
import '../styles/pages/SeminarsPage.scss';

const SeminarsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingSeminars, setUpcomingSeminars] = useState([]);
  const [pastSeminars, setPastSeminars] = useState([]);
  const [allSeminars, setAllSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeminars = async () => {
      try {
        setLoading(true);
        
        // Fetch seminars based on active tab to minimize unnecessary requests
        if (activeTab === 'upcoming') {
          const data = await getUpcomingSeminars();
          setUpcomingSeminars(data);
        } else if (activeTab === 'past') {
          const data = await getPastSeminars();
          setPastSeminars(data);
        } else if (activeTab === 'all') {
          const data = await getAllSeminars();
          setAllSeminars(data);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load seminars. Please try again later.');
        setLoading(false);
      }
    };

    fetchSeminars();
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="seminars-page">
      <div className="seminars-hero">
        <div className="container">
          <div className="seminars-hero__content">
            <h1 className="seminars-hero__title">Seminars</h1>
            <p className="seminars-hero__subtitle">
              Upcoming, anti-corruption, economic crimes, and whistleblower protection
            </p>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="seminars-content">
          <div className="seminars-intro">
            <p className="seminars-intro__text">
              Join our expert-led seminars on governance, compliance, anti-corruption, 
              economic crimes, and whistleblower protection. Gain valuable insights and 
              practical knowledge to enhance your organization's governance framework.
            </p>
          </div>
          
          <SeminarTabs activeTab={activeTab} onTabChange={handleTabChange} />
          
          <div className="seminars-content__tab-panel">
            {activeTab === 'upcoming' && (
              <UpcomingEvents 
                seminars={upcomingSeminars} 
                loading={loading} 
                error={error} 
              />
            )}
            
            {activeTab === 'past' && (
              <PastEvents 
                seminars={pastSeminars} 
                loading={loading} 
                error={error} 
              />
            )}
            
            {activeTab === 'all' && (
              <div className="all-events">
                <h2 className="all-events__upcoming-title">Upcoming Events</h2>
                <UpcomingEvents 
                  seminars={allSeminars.filter(seminar => seminar.status === 'Upcoming')} 
                  loading={loading} 
                  error={error} 
                />
                
                <h2 className="all-events__past-title">Past Events</h2>
                <PastEvents 
                  seminars={allSeminars.filter(seminar => seminar.status === 'Past')} 
                  loading={loading} 
                  error={error} 
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="seminars-info">
          <div className="info-card">
            <h2 className="info-card__title">Why Attend Our Seminars?</h2>
            <ul className="info-card__list">
              <li>Learn from industry-leading experts in governance and compliance</li>
              <li>Gain practical knowledge and actionable insights</li>
              <li>Network with professionals in your field</li>
              <li>Stay updated on the latest regulations and best practices</li>
              <li>Receive valuable resources and materials</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h2 className="info-card__title">Custom Training Programs</h2>
            <p className="info-card__text">
              In addition to our scheduled seminars, we offer customized training programs 
              tailored to your organization's specific needs and challenges.
            </p>
            <p className="info-card__text">
              Contact us to discuss how we can develop a training program that addresses 
              your unique requirements.
            </p>
            <a href="mailto:training@integriting.com" className="info-card__button">
              Request Information
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeminarsPage;