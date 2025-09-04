import React, { forwardRef } from 'react';
import '../../../styles/components/ui/Input.scss';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  error,
  helperText,
  leftIcon,
  rightIcon,
  size = 'medium',
  disabled = false,
  required = false,
  className = '',
  id,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const baseClass = 'admin-input';
  const inputId = id || `input-${name}` || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const wrapperClasses = [
    `${baseClass}-wrapper`,
    `${baseClass}-wrapper--${size}`,
    error && `${baseClass}-wrapper--error`,
    disabled && `${baseClass}-wrapper--disabled`,
    className
  ].filter(Boolean).join(' ');

  const inputClasses = [
    baseClass,
    leftIcon && `${baseClass}--has-left-icon`,
    rightIcon && `${baseClass}--has-right-icon`
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={`${baseClass}-label`}
        >
          {label}
          {required && <span className={`${baseClass}-required`}>*</span>}
        </label>
      )}
      
      <div className={`${baseClass}-container`}>
        {leftIcon && (
          <div className={`${baseClass}-icon ${baseClass}-icon--left`}>
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : 
            helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        
        {rightIcon && (
          <div className={`${baseClass}-icon ${baseClass}-icon--right`}>
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <div id={`${inputId}-error`} className={`${baseClass}-error`}>
          {error}
        </div>
      )}
      
      {helperText && !error && (
        <div id={`${inputId}-helper`} className={`${baseClass}-helper`}>
          {helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;