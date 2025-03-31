// src/components/home/ServicesOverview.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../../services/serviceService';
import '../../styles/components/ServiceGrid.scss';

const ServicesOverview = () => {
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
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div className="service-grid__loading">Loading services...</div>;
  if (error) return <div className="service-grid__error">{error}</div>;

  // Map service icons to their respective image paths
  const getIconPath = (iconName) => {
    const iconMap = {
      'governance': '/assets/icons/governance-icon.svg',
      'intellectual-property': '/assets/icons/ip-icon.svg',
      'contracts': '/assets/icons/contracts-icon.svg',
      'compliance': '/assets/icons/compliance-icon.svg',
      'monitoring': '/assets/icons/monitoring-icon.svg',
      'whistleblower': '/assets/icons/whistleblower-icon.svg',
    };
    
    return iconMap[iconName] || '/assets/icons/default-icon.svg';
  };

  return (
    <section className="services-section">
      <div className="container">
        <h2 className="section-title">Our Expertise, Your Peace of Mind</h2>
        
        <div className="service-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-card__icon">
                <img src={getIconPath(service.icon)} alt={service.title} />
              </div>
              <h3 className="service-card__title">{service.title}</h3>
              <p className="service-card__description">
                {service.description.length > 100 
                  ? `${service.description.substring(0, 100)}...` 
                  : service.description}
              </p>
              <Link to={`/services/${service.id}`} className="service-card__link">
                Learn more
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;