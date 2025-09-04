import React from 'react';
import '../../../styles/components/ui/Skeleton.scss';

// Base Skeleton Component
const Skeleton = ({ 
  width = '100%', 
  height = '1rem', 
  variant = 'rectangular',
  animation = 'pulse',
  className = '',
  style = {},
  ...props 
}) => {
  const baseClass = 'admin-skeleton';
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    `${baseClass}--${animation}`,
    className
  ].filter(Boolean).join(' ');

  const skeletonStyle = {
    width,
    height,
    ...style
  };

  return (
    <div 
      className={classes} 
      style={skeletonStyle}
      aria-hidden="true"
      {...props} 
    />
  );
};

// Text Skeleton
const TextSkeleton = ({ 
  lines = 1, 
  spacing = '0.5rem',
  lastLineWidth = '60%',
  className = '',
  ...props 
}) => {
  return (
    <div className={`admin-skeleton-text ${className}`} {...props}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          height="1em"
          width={index === lines - 1 && lines > 1 ? lastLineWidth : '100%'}
          style={{ 
            marginBottom: index < lines - 1 ? spacing : 0 
          }}
        />
      ))}
    </div>
  );
};

// Avatar Skeleton
const AvatarSkeleton = ({ 
  size = '2.5rem',
  variant = 'circular',
  className = '',
  ...props 
}) => {
  return (
    <Skeleton
      width={size}
      height={size}
      variant={variant}
      className={`admin-skeleton-avatar ${className}`}
      {...props}
    />
  );
};

// Card Skeleton
const CardSkeleton = ({ 
  hasHeader = true,
  headerHeight = '1.5rem',
  bodyLines = 3,
  hasActions = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`admin-skeleton-card ${className}`} {...props}>
      {hasHeader && (
        <div className="admin-skeleton-card__header">
          <Skeleton height={headerHeight} width="70%" />
        </div>
      )}
      
      <div className="admin-skeleton-card__body">
        <TextSkeleton lines={bodyLines} />
      </div>
      
      {hasActions && (
        <div className="admin-skeleton-card__actions">
          <Skeleton height="2rem" width="5rem" variant="rounded" />
          <Skeleton height="2rem" width="4rem" variant="rounded" />
        </div>
      )}
    </div>
  );
};

// Table Skeleton
const TableSkeleton = ({ 
  rows = 5, 
  columns = 4,
  hasHeader = true,
  className = '',
  ...props 
}) => {
  return (
    <div className={`admin-skeleton-table ${className}`} {...props}>
      {hasHeader && (
        <div className="admin-skeleton-table__header">
          {Array.from({ length: columns }, (_, index) => (
            <Skeleton key={index} height="1.5rem" width="80%" />
          ))}
        </div>
      )}
      
      <div className="admin-skeleton-table__body">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="admin-skeleton-table__row">
            {Array.from({ length: columns }, (_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                height="1rem" 
                width={`${60 + Math.random() * 30}%`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// List Skeleton
const ListSkeleton = ({ 
  items = 5,
  hasAvatar = false,
  hasSecondaryText = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`admin-skeleton-list ${className}`} {...props}>
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className="admin-skeleton-list__item">
          {hasAvatar && <AvatarSkeleton size="2rem" />}
          
          <div className="admin-skeleton-list__content">
            <Skeleton height="1rem" width="70%" />
            {hasSecondaryText && (
              <Skeleton height="0.875rem" width="50%" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Dashboard Skeleton
const DashboardSkeleton = ({ className = '', ...props }) => {
  return (
    <div className={`admin-skeleton-dashboard ${className}`} {...props}>
      {/* Header Skeleton */}
      <div className="admin-skeleton-dashboard__header">
        <Skeleton height="3rem" width="60%" variant="rounded" />
      </div>
      
      {/* Stats Grid Skeleton */}
      <div className="admin-skeleton-dashboard__stats">
        {Array.from({ length: 5 }, (_, index) => (
          <CardSkeleton key={index} hasHeader={false} bodyLines={2} />
        ))}
      </div>
      
      {/* Content Grid Skeleton */}
      <div className="admin-skeleton-dashboard__content">
        <CardSkeleton hasHeader={true} bodyLines={4} />
        <CardSkeleton hasHeader={true} bodyLines={6} />
        <CardSkeleton hasHeader={true} bodyLines={3} />
      </div>
    </div>
  );
};

// Export all components
export { 
  Skeleton, 
  TextSkeleton, 
  AvatarSkeleton, 
  CardSkeleton, 
  TableSkeleton, 
  ListSkeleton, 
  DashboardSkeleton 
};

export default Skeleton;