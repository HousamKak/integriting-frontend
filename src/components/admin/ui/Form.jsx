import React, { createContext, useContext, useState } from 'react';
import '../../../styles/components/ui/Form.scss';

// Form Context
const FormContext = createContext();

// Form validation utilities
const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return null;
  },
  
  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Please enter a valid email address';
  },
  
  minLength: (min) => (value) => {
    if (!value) return null;
    return value.length >= min ? null : `Must be at least ${min} characters long`;
  },
  
  maxLength: (max) => (value) => {
    if (!value) return null;
    return value.length <= max ? null : `Must be no more than ${max} characters long`;
  },
  
  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },
  
  pattern: (regex, message) => (value) => {
    if (!value) return null;
    return regex.test(value) ? null : message;
  }
};

// Main Form Component
const Form = ({ 
  children, 
  onSubmit, 
  className = '',
  noValidate = true,
  ...props 
}) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const setError = (name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const setFieldTouched = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validateField = (name, value, validationRules) => {
    if (!validationRules) return null;
    
    for (const rule of validationRules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    // Get all form fields and their validation rules
    const formElements = document.querySelectorAll('[data-form-field]');
    
    formElements.forEach(element => {
      const name = element.name;
      const value = values[name];
      const rules = element.dataset.validationRules ? 
        JSON.parse(element.dataset.validationRules) : null;
      
      const error = validateField(name, value, rules);
      if (error) {
        formErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contextValue = {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setError,
    setTouched: setFieldTouched,
    validateField
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form 
        className={`admin-form ${className}`}
        onSubmit={handleSubmit}
        noValidate={noValidate}
        {...props}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

// Form Field Component
const FormField = ({ 
  name,
  label,
  children,
  required = false,
  validation = [],
  className = '',
  ...props 
}) => {
  const { values, errors, touched, setValue, setError, setTouched: setFieldTouched, validateField } = useContext(FormContext);
  
  const value = values[name] || '';
  const error = errors[name];
  const isTouched = touched[name];
  
  const validationRules = [
    ...(required ? [validators.required] : []),
    ...validation
  ];

  const handleChange = (newValue) => {
    setValue(name, newValue);
  };

  const handleBlur = () => {
    setFieldTouched(name);
    const error = validateField(name, value, validationRules);
    if (error) {
      setError(name, error);
    }
  };

  // Clone children to pass form props
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        name,
        value,
        onChange: (e) => handleChange(e.target ? e.target.value : e),
        onBlur: handleBlur,
        error: isTouched ? error : null,
        required,
        'data-form-field': true,
        'data-validation-rules': JSON.stringify(validationRules),
        ...child.props
      });
    }
    return child;
  });

  return (
    <div className={`admin-form-field ${className}`}>
      {label && (
        <label htmlFor={name} className="admin-form-field__label">
          {label}
          {required && <span className="admin-form-field__required">*</span>}
        </label>
      )}
      {childrenWithProps}
    </div>
  );
};

// Form Section Component
const FormSection = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`admin-form-section ${className}`}>
      {(title || subtitle) && (
        <div className="admin-form-section__header">
          {title && <h3 className="admin-form-section__title">{title}</h3>}
          {subtitle && <p className="admin-form-section__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="admin-form-section__content">
        {children}
      </div>
    </div>
  );
};

// Form Actions Component
const FormActions = ({ children, align = 'right', className = '' }) => {
  return (
    <div className={`admin-form-actions admin-form-actions--${align} ${className}`}>
      {children}
    </div>
  );
};

// Textarea Component
const Textarea = React.forwardRef(({
  rows = 4,
  resize = 'vertical',
  autoGrow = false,
  className = '',
  onChange,
  ...props
}, ref) => {
  const handleChange = (e) => {
    if (autoGrow) {
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
    }
    onChange?.(e);
  };

  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`admin-textarea admin-textarea--resize-${resize} ${className}`}
      onChange={handleChange}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

// Checkbox Component
const Checkbox = ({ 
  label, 
  description,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`admin-checkbox-wrapper ${className}`}>
      <label className={`admin-checkbox ${disabled ? 'admin-checkbox--disabled' : ''}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="admin-checkbox__input"
          {...props}
        />
        <span className="admin-checkbox__checkmark"></span>
        <div className="admin-checkbox__content">
          {label && <span className="admin-checkbox__label">{label}</span>}
          {description && <span className="admin-checkbox__description">{description}</span>}
        </div>
      </label>
    </div>
  );
};

// Radio Group Component
const RadioGroup = ({ 
  options = [], 
  value, 
  onChange, 
  disabled = false,
  layout = 'vertical',
  className = '',
  ...props 
}) => {
  return (
    <div className={`admin-radio-group admin-radio-group--${layout} ${className}`} {...props}>
      {options.map((option) => (
        <label 
          key={option.value} 
          className={`admin-radio ${disabled ? 'admin-radio--disabled' : ''}`}
        >
          <input
            type="radio"
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled || option.disabled}
            className="admin-radio__input"
          />
          <span className="admin-radio__checkmark"></span>
          <div className="admin-radio__content">
            <span className="admin-radio__label">{option.label}</span>
            {option.description && (
              <span className="admin-radio__description">{option.description}</span>
            )}
          </div>
        </label>
      ))}
    </div>
  );
};

// Hook to use form context
const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a Form component');
  }
  return context;
};

// Export all components and utilities
export { 
  Form, 
  FormField, 
  FormSection, 
  FormActions, 
  Textarea, 
  Checkbox, 
  RadioGroup, 
  useForm, 
  validators 
};