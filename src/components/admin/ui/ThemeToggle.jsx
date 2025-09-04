import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import '../../../styles/components/ui/ThemeToggle.scss';

const ThemeToggle = ({ 
  size = 'medium',
  showLabel = false,
  className = '',
  ...props 
}) => {
  const { theme, toggleTheme } = useTheme();

  const baseClass = 'admin-theme-toggle';
  const classes = [
    baseClass,
    `${baseClass}--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      {...props}
    >
      <div className={`${baseClass}__slider`}>
        <div className={`${baseClass}__icon`}>
          {theme === 'light' ? '☀️' : '🌙'}
        </div>
      </div>
      
      {showLabel && (
        <span className={`${baseClass}__label`}>
          {theme === 'light' ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;