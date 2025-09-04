import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../../../styles/components/ui/Modal.scss';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  className = ''
}) => {
  useEffect(() => {
    if (!isOpen) return;

    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEsc) {
        onClose();
      }
    };

    // Disable body scroll
    document.body.style.overflow = 'hidden';
    
    // Add escape listener
    if (closeOnEsc) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, closeOnEsc]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  const modalClasses = [
    'admin-modal',
    `admin-modal--${size}`,
    className
  ].filter(Boolean).join(' ');

  return createPortal(
    <div 
      className="admin-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className={modalClasses}>
        <div className="admin-modal__header">
          {title && (
            <h2 id="modal-title" className="admin-modal__title">
              {title}
            </h2>
          )}
          
          {showCloseButton && (
            <button
              className="admin-modal__close-button"
              onClick={onClose}
              aria-label="Close modal"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="admin-modal__body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;