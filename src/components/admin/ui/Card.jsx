import React from 'react';
import '../../../styles/components/ui/Card.scss';

const Card = ({
  children,
  title,
  subtitle,
  headerActions,
  padding = 'normal',
  shadow = 'medium',
  border = true,
  className = '',
  ...props
}) => {
  const baseClass = 'admin-card';
  const classes = [
    baseClass,
    `${baseClass}--padding-${padding}`,
    `${baseClass}--shadow-${shadow}`,
    border && `${baseClass}--bordered`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {(title || subtitle || headerActions) && (
        <div className={`${baseClass}__header`}>
          <div className={`${baseClass}__header-content`}>
            {title && <h3 className={`${baseClass}__title`}>{title}</h3>}
            {subtitle && <p className={`${baseClass}__subtitle`}>{subtitle}</p>}
          </div>
          {headerActions && (
            <div className={`${baseClass}__header-actions`}>
              {headerActions}
            </div>
          )}
        </div>
      )}
      
      <div className={`${baseClass}__body`}>
        {children}
      </div>
    </div>
  );
};

// Card variants
Card.Stats = ({ icon, title, value, change, changeType, color = 'blue', ...props }) => (
  <Card padding="normal" className={`admin-card--stats admin-card--stats-${color}`} {...props}>
    <div className="admin-card-stats">
      <div className="admin-card-stats__icon">
        {icon}
      </div>
      <div className="admin-card-stats__content">
        <div className="admin-card-stats__title">{title}</div>
        <div className="admin-card-stats__value">{value}</div>
        {change && (
          <div className={`admin-card-stats__change admin-card-stats__change--${changeType || 'neutral'}`}>
            {changeType === 'increase' && '↗'}
            {changeType === 'decrease' && '↘'}
            {changeType === 'neutral' && '→'}
            {change}
          </div>
        )}
      </div>
    </div>
  </Card>
);

export default Card;