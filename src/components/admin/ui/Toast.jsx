import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import '../../../styles/components/ui/Toast.scss';

// Toast types
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Toast component
const Toast = ({ 
  id, 
  type = TOAST_TYPES.INFO, 
  title, 
  message, 
  duration = 5000, 
  onClose,
  persistent = false,
  action
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, persistent]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.(id);
    }, 200); // Match animation duration
  };

  const getIcon = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return '✓';
      case TOAST_TYPES.ERROR:
        return '✕';
      case TOAST_TYPES.WARNING:
        return '⚠';
      case TOAST_TYPES.INFO:
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`admin-toast admin-toast--${type} ${isExiting ? 'admin-toast--exiting' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className="admin-toast__icon">
        {getIcon()}
      </div>
      
      <div className="admin-toast__content">
        {title && <div className="admin-toast__title">{title}</div>}
        {message && <div className="admin-toast__message">{message}</div>}
        {action && (
          <div className="admin-toast__action">
            {action}
          </div>
        )}
      </div>

      {!persistent && (
        <button
          className="admin-toast__close"
          onClick={handleClose}
          aria-label="Close notification"
        >
          ✕
        </button>
      )}

      {!persistent && duration > 0 && (
        <div 
          className="admin-toast__progress"
          style={{
            animationDuration: `${duration}ms`
          }}
        />
      )}
    </div>
  );
};

// Toast Container
const ToastContainer = ({ position = 'top-right' }) => {
  return (
    <div className={`admin-toast-container admin-toast-container--${position}`} id="toast-container">
      {/* Toasts will be rendered here */}
    </div>
  );
};

// Toast Manager
class ToastManager {
  constructor() {
    this.toasts = [];
    this.subscribers = [];
    this.nextId = 1;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(callback => callback(this.toasts));
  }

  add(toast) {
    const id = this.nextId++;
    const newToast = { id, ...toast };
    this.toasts = [...this.toasts, newToast];
    this.notify();
    return id;
  }

  remove(id) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }

  // Convenience methods
  success(message, options = {}) {
    return this.add({
      type: TOAST_TYPES.SUCCESS,
      message,
      ...options
    });
  }

  error(message, options = {}) {
    return this.add({
      type: TOAST_TYPES.ERROR,
      message,
      duration: 7000, // Longer for errors
      ...options
    });
  }

  warning(message, options = {}) {
    return this.add({
      type: TOAST_TYPES.WARNING,
      message,
      ...options
    });
  }

  info(message, options = {}) {
    return this.add({
      type: TOAST_TYPES.INFO,
      message,
      ...options
    });
  }
}

// Global toast manager instance
const toastManager = new ToastManager();

// React component that renders all toasts
const ToastProvider = ({ children, position = 'top-right' }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const handleToastClose = (id) => {
    toastManager.remove(id);
  };

  return (
    <>
      {children}
      {createPortal(
        <div className={`admin-toast-container admin-toast-container--${position}`}>
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              {...toast}
              onClose={handleToastClose}
            />
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

// Export toast utilities
export { Toast, ToastContainer, ToastProvider, TOAST_TYPES };
export default toastManager;