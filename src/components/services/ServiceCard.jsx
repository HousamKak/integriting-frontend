// src/components/services/ServiceCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../../styles/components/ServiceCard.scss';

const ServiceCard = ({ service }) => {
  const { id, title, description, icon } = service;
  
  console.log('ServiceCard rendering:', { id, title, icon });
  
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
    console.log(`ServiceCard - Icon name: ${iconName}, Sanitized: ${sanitizedIconName}`);
    
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
    
    console.log(`ServiceCard - Resolved icon path: ${iconPath}`);
    return iconPath;
  };
  
  // Determine card variant based on service type
  const getCardVariant = (iconName) => {
    const variants = {
      'governance': 'governance',
      'intellectual-property': 'intellectual-property',
      'contracts': 'contracts',
      'compliance': 'compliance',
      'monitoring': 'monitoring',
      'whistleblower': 'whistleblower',
    };
    
    return variants[iconName] || 'governance';
  };
  
  // Truncate description if too long
  const truncatedDescription = description?.length > 120
    ? `${description.substring(0, 120)}...`
    : description;

  return (
    <div className={`service-card service-card--${getCardVariant(icon)}`}>
      <div className="service-card__icon">
        {/* Use specific alt text for better accessibility */}
        <img 
          src={getIconPath(icon, title)} 
          alt={`${title} service icon`}
          onError={(e) => {
            console.error(`Failed to load icon for service: ${title}`);
            console.error(`Attempted to load: ${e.target.src}`);
            // Fallback to default icon
            e.target.src = '/assets/icons/default-icon.svg';
          }}
        />
      </div>
      <h3 className="service-card__title">{title}</h3>
      <p className="service-card__description">{truncatedDescription}</p>
      <Link to={`/services/${id}`} className="service-card__link" aria-label={`Learn more about ${title}`}>
        Learn more
      </Link>
    </div>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    icon: PropTypes.string
  }).isRequired
};

export default ServiceCard;