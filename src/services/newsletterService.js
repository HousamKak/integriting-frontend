// src/services/newsletterService.js
import api from './api';

// Check if newsletter functionality is enabled from environment variables
const isNewsletterEnabled = () => {
  return import.meta.env.VITE_ENABLE_NEWSLETTER === 'true';
};

/**
 * Subscribe to newsletter
 * @param {string} email - The email address to subscribe
 * @param {Object} preferences - Newsletter preferences (optional)
 * @returns {Promise} Promise with subscription result
 */
export const subscribeToNewsletter = async (email, preferences = {}) => {
  if (!isNewsletterEnabled()) {
    throw new Error('Newsletter functionality is disabled');
  }

  try {
    const response = await api.post('/newsletter/subscribe', {
      email,
      preferences,
      subscribedAt: new Date().toISOString()
    });
    return response.data;
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    throw error;
  }
};

/**
 * Unsubscribe from newsletter
 * @param {string} email - The email address to unsubscribe
 * @returns {Promise} Promise with unsubscription result
 */
export const unsubscribeFromNewsletter = async (email) => {
  if (!isNewsletterEnabled()) {
    throw new Error('Newsletter functionality is disabled');
  }

  try {
    const response = await api.post('/newsletter/unsubscribe', { email });
    return response.data;
  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    throw error;
  }
};

/**
 * Update newsletter preferences
 * @param {string} email - The email address
 * @param {Object} preferences - Updated preferences
 * @returns {Promise} Promise with update result
 */
export const updateNewsletterPreferences = async (email, preferences) => {
  if (!isNewsletterEnabled()) {
    throw new Error('Newsletter functionality is disabled');
  }

  try {
    const response = await api.put('/newsletter/preferences', {
      email,
      preferences
    });
    return response.data;
  } catch (error) {
    console.error('Newsletter preferences update error:', error);
    throw error;
  }
};

/**
 * Get newsletter subscription status
 * @param {string} email - The email address to check
 * @returns {Promise} Promise with subscription status
 */
export const getSubscriptionStatus = async (email) => {
  if (!isNewsletterEnabled()) {
    return { subscribed: false, enabled: false };
  }

  try {
    const response = await api.get(`/newsletter/status/${email}`);
    return { ...response.data, enabled: true };
  } catch (error) {
    console.error('Newsletter status check error:', error);
    throw error;
  }
};

// Export the newsletter status for other components to check
export const newsletterEnabled = isNewsletterEnabled();
