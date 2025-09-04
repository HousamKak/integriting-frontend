import React from 'react';
import '../../../styles/components/ui/Skeleton.scss'; // Reusing styles from skeleton

const LoadingSpinner = ({ 
  size = 'medium',
  text = '',
  overlay = false,
  className = '',
  ...props 
}) => {
  const baseClass = 'admin-loading-spinner';
  const classes = [
    baseClass,
    `${baseClass}--${size}`,
    className
  ].filter(Boolean).join(' ');

  const spinner = (
    <div className={classes} {...props}>
      <div className={`${baseClass}__spinner`} />
      {text && <span className={`${baseClass}__text`}>{text}</span>}
    </div>
  );

  if (overlay) {
    return (
      <div className="admin-loading-overlay">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;