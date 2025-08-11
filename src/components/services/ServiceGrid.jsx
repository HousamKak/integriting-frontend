// Update ServiceGrid component to be used in both Home and Services pages
// src/components/services/ServiceGrid.jsx (update to existing component)
import React from 'react';
import ServiceCard from './ServiceCard';
import '../../styles/components/ServiceGrid.scss';

const ServiceGrid = ({ services, loading, error }) => {
  console.log('ServiceGrid: Received props:', { 
    servicesCount: services?.length || 0, 
    loading, 
    error 
  });
  
  if (services && services.length > 0) {
    console.log('ServiceGrid: Services data:', services);
  }
  
  if (loading) return <div className="service-grid__loading">Loading services...</div>;
  if (error) return <div className="service-grid__error">{error}</div>;

  return (
    <section className="service-grid">
      <div className="service-grid__header">
        <h2 className="service-grid__title">Our Expertise, Your Peace of Mind</h2>
        <div className="service-grid__underline"></div>
      </div>
      
      <div className="service-grid__container">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
};

export default ServiceGrid;