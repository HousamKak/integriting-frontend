// src/components/services/ServiceCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../../styles/components/ServiceCard.scss';

const ServiceCard = ({ service }) => {
  const { id, title, description, icon } = service;
  
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
  
  // Get icon path - using proper asset paths
  const getIconPath = (iconName) => {
    return `/assets/icons/${iconName || 'default-service'}.svg`;
  };
  
  // Truncate description if too long
  const truncatedDescription = description?.length > 120
    ? `${description.substring(0, 120)}...`
    : description;

  return (
    <div className={`service-card service-card--${getCardVariant(icon)}`}>
      <div className="service-card__icon">
        <img src={getIconPath(icon)} alt={`${title} icon`} />
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