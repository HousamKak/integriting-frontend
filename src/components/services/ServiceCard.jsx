// src/components/services/ServiceCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/ServiceCard.scss';

// Import icons
import GovernanceIcon from '../../assets/icons/governance-icon.svg';
import IntellectualPropertyIcon from '../../assets/icons/ip-icon.svg';
import ContractsIcon from '../../assets/icons/contracts-icon.svg';
import ComplianceIcon from '../../assets/icons/compliance-icon.svg';
import MonitoringIcon from '../../assets/icons/monitoring-icon.svg';
import WhistleblowerIcon from '../../assets/icons/whistleblower-icon.svg';

const iconMap = {
  'governance': GovernanceIcon,
  'intellectual-property': IntellectualPropertyIcon,
  'contracts': ContractsIcon,
  'compliance': ComplianceIcon,
  'monitoring': MonitoringIcon,
  'whistleblower': WhistleblowerIcon,
};

const ServiceCard = ({ service }) => {
  const { id, title, description, icon } = service;
  const IconComponent = iconMap[icon] || iconMap['governance']; // Default to governance icon if not found

  return (
    <div className="service-card">
      <div className="service-card__icon">
        <img src={IconComponent} alt={`${title} icon`} />
      </div>
      <h3 className="service-card__title">{title}</h3>
      <p className="service-card__description">{description}</p>
      <Link to={`/services/${id}`} className="service-card__link">
        Learn more
      </Link>
    </div>
  );
};

export default ServiceCard;