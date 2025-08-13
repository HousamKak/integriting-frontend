// src/services/analyticsService.js

// Check if analytics is enabled from environment variables
const isAnalyticsEnabled = () => {
  return import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
};

/**
 * Initialize analytics tracking
 */
export const initAnalytics = () => {
  if (!isAnalyticsEnabled()) {
    console.log('Analytics disabled via environment variable');
    return;
  }

  // Initialize your analytics provider here (Google Analytics, Mixpanel, etc.)
  console.log('Analytics initialized');
  
  // Example: Google Analytics initialization
  // gtag('config', 'GA_MEASUREMENT_ID');
};

/**
 * Track page views
 * @param {string} path - The page path
 * @param {string} title - The page title
 */
export const trackPageView = (path, title) => {
  if (!isAnalyticsEnabled()) return;

  console.log(`Analytics: Page view - ${path} (${title})`);
  
  // Example: Google Analytics page view
  // gtag('event', 'page_view', {
  //   page_title: title,
  //   page_location: window.location.href,
  //   page_path: path
  // });
};

/**
 * Track custom events
 * @param {string} action - The event action
 * @param {Object} properties - Additional event properties
 */
export const trackEvent = (action, properties = {}) => {
  if (!isAnalyticsEnabled()) return;

  console.log(`Analytics: Event - ${action}`, properties);
  
  // Example: Google Analytics custom event
  // gtag('event', action, properties);
};

/**
 * Track user interactions
 * @param {string} element - The UI element interacted with
 * @param {string} action - The action performed
 */
export const trackInteraction = (element, action) => {
  if (!isAnalyticsEnabled()) return;

  trackEvent('user_interaction', {
    element,
    action,
    timestamp: new Date().toISOString()
  });
};

// Export the analytics status for other components to check
export const analyticsEnabled = isAnalyticsEnabled();
