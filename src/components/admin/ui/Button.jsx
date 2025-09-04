import React from 'react';
import '../../../styles/components/ui/Button.scss';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClass = 'admin-btn';
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    `${baseClass}--${size}`,
    loading && `${baseClass}--loading`,
    disabled && `${baseClass}--disabled`,
    fullWidth && `${baseClass}--full-width`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading && (
        <span className={`${baseClass}__spinner`}>
          <svg className={`${baseClass}__spinner-svg`} viewBox="0 0 24 24">
            <circle
              className={`${baseClass}__spinner-circle`}
              cx="12"
              cy="12"
              r="10"
              fill="none"
              strokeWidth="2"
            />
          </svg>
        </span>
      )}
      
      {!loading && leftIcon && (
        <span className={`${baseClass}__icon ${baseClass}__icon--left`}>
          {leftIcon}
        </span>
      )}
      
      <span className={`${baseClass}__text`}>
        {children}
      </span>
      
      {!loading && rightIcon && (
        <span className={`${baseClass}__icon ${baseClass}__icon--right`}>
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button;