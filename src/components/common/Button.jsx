// src/components/common/Button.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../../styles/components/Button.scss';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  type = 'button',
  to = null,
  className = '',
  fullWidth = false,
  ...rest
}) => {
  // Determine classes based on props
  const buttonClasses = `
    button 
    button--${variant} 
    button--${size} 
    ${fullWidth ? 'button--full-width' : ''} 
    ${className}
  `;

  // If 'to' prop is provided, render as Link
  if (to) {
    return (
      <Link 
        to={to} 
        className={buttonClasses}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'accent', 'outline', 'text']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  to: PropTypes.string,
  className: PropTypes.string,
  fullWidth: PropTypes.bool
};

export default Button;

