// src/components/home/ServicesOverview.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../../services/serviceService';
import '../../styles/components/ServiceGrid.scss';

const ServicesOverview = () => {
  console.log('ServicesOverview: Component initialized');
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('ServicesOverview: Current state:', { 
    servicesCount: services.length, 
    loading, 
    error 
  });

  useEffect(() => {
    console.log('ServicesOverview: useEffect triggered');
    
    const fetchServices = async () => {
      console.log('ServicesOverview: Starting to fetch services...');
      setLoading(true);
      
      try {
        console.log('ServicesOverview: Calling getServices API...');
        const data = await getServices();
        console.log('ServicesOverview: API call successful!');
        console.log('Backend services data:', data);
        console.log('Number of services:', data?.length || 0);
        
        if (data && data.length > 0) {
          data.forEach((service, index) => {
            console.log(`Service ${index + 1}:`, {
              id: service.id,
              title: service.title,
              icon: service.icon,
              description: service.description?.substring(0, 50) + '...'
            });
          });
        } else {
          console.log('ServicesOverview: No services returned from API');
        }
        
        setServices(data || []);
        setLoading(false);
        console.log('ServicesOverview: State updated, loading set to false');
      } catch (err) {
        console.error('ServicesOverview: Error fetching services:', err);
        console.error('Error details:', err.message, err.stack);
        setError('Failed to load services. Please try again later.');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  console.log('ServicesOverview: About to render, checking conditions...');
  
  if (loading) {
    console.log('ServicesOverview: Rendering loading state');
    return <div className="service-grid__loading">Loading services...</div>;
  }
  
  if (error) {
    console.log('ServicesOverview: Rendering error state:', error);
    return <div className="service-grid__error">{error}</div>;
  }

  console.log('ServicesOverview: Rendering services, count:', services.length);

  // Map service icons to their respective image paths
  const getIconPath = (iconName, serviceTitle) => {
    const iconMap = {
      'governance': '/assets/icons/governance-icon.svg',
      'intellectual-property': '/assets/icons/ip-icon.svg',
      'intellectual property': '/assets/icons/ip-icon.svg',
      'ip': '/assets/icons/ip-icon.svg',
      'contracts': '/assets/icons/contracts-icon.svg',
      'contract': '/assets/icons/contracts-icon.svg',
      'compliance': '/assets/icons/compliance-icon.svg',
      'monitoring': '/assets/icons/monitoring-icon.svg',
      'whistleblower': '/assets/icons/whistleblower-icon.svg',
      'whistleblowing': '/assets/icons/whistleblower-icon.svg',
      'audit': '/assets/icons/compliance-icon.svg',
      'legal': '/assets/icons/contracts-icon.svg',
      'corporate': '/assets/icons/governance-icon.svg',
    };
    
    // Try to match by icon name first
    let sanitizedIconName = iconName?.toLowerCase().trim();
    console.log(`Icon name: ${iconName}, Sanitized: ${sanitizedIconName}`);
    
    let iconPath = iconMap[sanitizedIconName];
    
    // If no match, try to match by service title keywords
    if (!iconPath && serviceTitle) {
      const titleLower = serviceTitle.toLowerCase();
      if (titleLower.includes('governance') || titleLower.includes('corporate')) {
        iconPath = iconMap['governance'];
      } else if (titleLower.includes('intellectual') || titleLower.includes('property') || titleLower.includes('ip')) {
        iconPath = iconMap['ip'];
      } else if (titleLower.includes('contract')) {
        iconPath = iconMap['contracts'];
      } else if (titleLower.includes('compliance') || titleLower.includes('audit')) {
        iconPath = iconMap['compliance'];
      } else if (titleLower.includes('monitor')) {
        iconPath = iconMap['monitoring'];
      } else if (titleLower.includes('whistleblow')) {
        iconPath = iconMap['whistleblower'];
      }
    }
    
    // Fallback to default icon
    iconPath = iconPath || '/assets/icons/default-icon.svg';
    
    if (!iconMap[sanitizedIconName] && iconName) {
      console.warn(`Icon not found for: ${sanitizedIconName}, using fallback or title-based match`);
    }
    
    console.log(`Resolved icon path: ${iconPath}`);
    return iconPath;
  };

  return (
    <section className="services-section">
      <div className="container">
        <h2 className="section-title">Our Expertise, Your Peace of Mind</h2>
        
        {/* Debug info - remove this later */}
        {services.length > 0 && (
          <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
            <strong>Debug Info:</strong><br />
            Services loaded: {services.length}<br />
            {services.map((service, i) => (
              <div key={i}>
                {i + 1}. "{service.title}" - icon: "{service.icon}" → {getIconPath(service.icon, service.title)}
              </div>
            ))}
          </div>
        )}
        
        <div className="service-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-card__icon">
                <img 
                  src={getIconPath(service.icon, service.title)} 
                  alt={service.title} 
                  onError={(e) => {
                    console.error(`Failed to load icon for service: ${service.title}`);
                    console.error(`Attempted to load: ${e.target.src}`);
                    // Fallback to default icon
                    e.target.src = '/assets/icons/default-icon.svg';
                  }}
                />
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