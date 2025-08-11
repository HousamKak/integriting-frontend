// src/pages/ServicesPage.jsx
import React, { useEffect, useState } from 'react';
import { getServices } from '../services/serviceService';
import ServiceGrid from '../components/services/ServiceGrid';
import '../styles/pages/ServicesPage.scss';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="services-page">
      <div className="services-header">
        <div className="container">
          <h1 className="services-header__title">Our Services</h1>
          <p className="services-header__subtitle">
            Expert solutions in governance, legal support, and compliance to help your organization 
            navigate complex challenges and achieve sustainable success.
          </p>
        </div>
      </div>
      
      <div className="services-content">
        <div className="container">
          <ServiceGrid services={services} loading={loading} error={error} />
        
        <div className="services-approach">
          <h2 className="services-approach__title">Our Approach</h2>
          
          <div className="services-approach__grid">
            <div className="approach-card">
              <div className="approach-card__icon">📋</div>
              <h3 className="approach-card__title">Assessment</h3>
              <p className="approach-card__text">
                We begin with a thorough assessment of your organization's needs, challenges, and objectives.
              </p>
            </div>
            
            <div className="approach-card">
              <div className="approach-card__icon">🔍</div>
              <h3 className="approach-card__title">Analysis</h3>
              <p className="approach-card__text">
                Our experts analyze your current systems, processes, and practices to identify areas for improvement.
              </p>
            </div>
            
            <div className="approach-card">
              <div className="approach-card__icon">📝</div>
              <h3 className="approach-card__title">Strategy</h3>
              <p className="approach-card__text">
                We develop customized strategies and solutions tailored to your specific requirements.
              </p>
            </div>
            
            <div className="approach-card">
              <div className="approach-card__icon">🚀</div>
              <h3 className="approach-card__title">Implementation</h3>
              <p className="approach-card__text">
                Our team works closely with you to implement solutions effectively and efficiently.
              </p>
            </div>
          </div>
        </div>
        
        <div className="services-cta">
          <div className="services-cta__content">
            <h2 className="services-cta__title">Need a Customized Solution?</h2>
            <p className="services-cta__text">
              Contact us to discuss your specific requirements and how we can help you achieve your goals.
            </p>
            <a href="mailto:info@integriting.com" className="services-cta__button">Contact Us</a>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;

