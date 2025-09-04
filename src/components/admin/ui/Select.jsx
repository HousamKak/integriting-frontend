import React, { useState, useRef, useEffect } from 'react';
import '../../../styles/components/ui/Select.scss';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option...',
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  searchable = false,
  multiple = false,
  size = 'medium',
  className = '',
  id,
  name
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);
  
  const selectId = id || `select-${name}` || `select-${Math.random().toString(36).substr(2, 9)}`;

  // Filter options based on search term
  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Get selected option(s) for display
  const getSelectedOptions = () => {
    if (multiple) {
      return options.filter(option => value?.includes(option.value));
    }
    return options.find(option => option.value === value);
  };

  const selectedOptions = getSelectedOptions();

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleOptionClick = (option) => {
    if (multiple) {
      const newValue = value?.includes(option.value)
        ? value.filter(v => v !== option.value)
        : [...(value || []), option.value];
      onChange(newValue);
    } else {
      onChange(option.value);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleRemoveOption = (optionValue, e) => {
    e.stopPropagation();
    if (multiple) {
      const newValue = value.filter(v => v !== optionValue);
      onChange(newValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
    if (e.key === 'Enter' && !searchable) {
      e.preventDefault();
      handleToggle();
    }
  };

  const baseClass = 'admin-select';
  const wrapperClasses = [
    `${baseClass}-wrapper`,
    `${baseClass}-wrapper--${size}`,
    error && `${baseClass}-wrapper--error`,
    disabled && `${baseClass}-wrapper--disabled`,
    className
  ].filter(Boolean).join(' ');

  const selectClasses = [
    baseClass,
    isOpen && `${baseClass}--open`,
    multiple && `${baseClass}--multiple`
  ].filter(Boolean).join(' ');

  const renderSelectedValue = () => {
    if (multiple) {
      if (!selectedOptions?.length) {
        return <span className={`${baseClass}__placeholder`}>{placeholder}</span>;
      }
      
      return (
        <div className={`${baseClass}__tags`}>
          {selectedOptions.slice(0, 2).map(option => (
            <span key={option.value} className={`${baseClass}__tag`}>
              {option.label}
              <button
                type="button"
                className={`${baseClass}__tag-remove`}
                onClick={(e) => handleRemoveOption(option.value, e)}
                aria-label={`Remove ${option.label}`}
              >
                ×
              </button>
            </span>
          ))}
          {selectedOptions.length > 2 && (
            <span className={`${baseClass}__tag ${baseClass}__tag--more`}>
              +{selectedOptions.length - 2} more
            </span>
          )}
        </div>
      );
    }

    if (!selectedOptions) {
      return <span className={`${baseClass}__placeholder`}>{placeholder}</span>;
    }

    return <span className={`${baseClass}__value`}>{selectedOptions.label}</span>;
  };

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={selectId} className={`${baseClass}-label`}>
          {label}
          {required && <span className={`${baseClass}-required`}>*</span>}
        </label>
      )}

      <div className={`${baseClass}-container`} ref={selectRef}>
        <button
          type="button"
          id={selectId}
          className={selectClasses}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${selectId}-error` : 
            helperText ? `${selectId}-helper` : undefined
          }
        >
          <div className={`${baseClass}__content`}>
            {renderSelectedValue()}
          </div>
          
          <div className={`${baseClass}__arrow`}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className={`${baseClass}__dropdown`}>
            {searchable && (
              <div className={`${baseClass}__search`}>
                <input
                  ref={searchInputRef}
                  type="text"
                  className={`${baseClass}__search-input`}
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            
            <ul className={`${baseClass}__options`} role="listbox">
              {filteredOptions.length === 0 ? (
                <li className={`${baseClass}__option ${baseClass}__option--empty`}>
                  {searchTerm ? 'No options found' : 'No options available'}
                </li>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = multiple 
                    ? value?.includes(option.value)
                    : value === option.value;
                  
                  return (
                    <li
                      key={option.value}
                      className={`${baseClass}__option ${isSelected ? `${baseClass}__option--selected` : ''}`}
                      onClick={() => handleOptionClick(option)}
                      role="option"
                      aria-selected={isSelected}
                    >
                      {multiple && (
                        <div className={`${baseClass}__checkbox`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            tabIndex={-1}
                          />
                        </div>
                      )}
                      <span className={`${baseClass}__option-label`}>
                        {option.label}
                      </span>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <div id={`${selectId}-error`} className={`${baseClass}-error`}>
          {error}
        </div>
      )}

      {helperText && !error && (
        <div id={`${selectId}-helper`} className={`${baseClass}-helper`}>
          {helperText}
        </div>
      )}
    </div>
  );
};

export default Select;