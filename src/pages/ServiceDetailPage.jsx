// src/pages/ServiceDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getServiceById } from '../services/serviceService';
import Button from '../components/common/Button';
import '../styles/pages/ServiceDetailPage.scss';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const data = await getServiceById(id);
        setService(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load service details. Please try again later.');
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id]);

  if (loading) return <div className="service-detail__loading">Loading service details...</div>;
  if (error) return <div className="service-detail__error">{error}</div>;
  if (!service) return <div className="service-detail__not-found">Service not found.</div>;

  // Get benefits from service data (if available from API)
  const benefits = service.benefits || [];

  return (
    <div className="service-detail">
      <div className="container">
        <div className="service-detail__breadcrumb">
          <Link to="/services" className="service-detail__breadcrumb-link">
            Services
          </Link>
          <span className="service-detail__breadcrumb-separator">›</span>
          <span className="service-detail__breadcrumb-current">{service.title}</span>
        </div>
        
        <div className="service-detail__header">
          <div className="service-detail__icon">
            <img 
              src={`/assets/icons/${service.icon}.svg`}
              onError={(e) => {
                e.target.src = '/assets/icons/default-icon.svg';
              }} 
              alt={service.title} 
            />
          </div>
          
          <h1 className="service-detail__title">{service.title}</h1>
        </div>
        
        <div className="service-detail__content">
          <div className="service-detail__description">
            <h2 className="service-detail__section-title">Description</h2>
            <div className="service-detail__text">
              <p>{service.description}</p>
              
              {service.detailed_description && (
                <p>{service.detailed_description}</p>
              )}
            </div>
          </div>
          
          {benefits.length > 0 && (
            <div className="service-detail__benefits">
              <h2 className="service-detail__section-title">Key Benefits</h2>
              <ul className="service-detail__benefits-list">
                {benefits.map((benefit, index) => (
                  <li key={index} className="service-detail__benefit-item">
                    <span className="service-detail__benefit-icon">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {service.process_steps && service.process_steps.length > 0 && (
            <div className="service-detail__process">
              <h2 className="service-detail__section-title">Our Process</h2>
              
              <div className="service-detail__process-steps">
                {service.process_steps.map((step, index) => (
                  <div key={index} className="process-step">
                    <div className="process-step__number">{index + 1}</div>
                    <h3 className="process-step__title">{step.title}</h3>
                    <p className="process-step__text">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="service-detail__cta">
          <h2 className="service-detail__cta-title">Ready to Get Started?</h2>
          <p className="service-detail__cta-text">
            Contact us today to discuss how we can help you with {service.title.toLowerCase()}.
          </p>
          <div className="service-detail__cta-buttons">
            <a href="mailto:info@integriting.com" className="service-detail__cta-button service-detail__cta-button--primary">
              Contact Us
            </a>
            <Link to="/services" className="service-detail__cta-button service-detail__cta-button--secondary">
              Explore Other Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;

