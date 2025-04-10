// src/services/auth.js
import api from './api';

/**
 * Log in a user with email and password
 * @param {Object} credentials - Object containing email and password
 * @returns {Promise} Promise with user data and token
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      // Store auth token and user data in localStorage
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Log out the current user
 */
export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Get the current authenticated user data from the API
 * @returns {Promise} Promise with current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

/**
 * Change the current user's password
 * @param {Object} passwordData - Object containing currentPassword and newPassword
 * @returns {Promise} Promise with success message
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/auth/password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

/**
 * Check if a user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token');
};

/**
 * Get the user data from localStorage
 * @returns {Object|null} User data object or null if not logged in
 */
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Check if the current user has admin role
 * @returns {boolean} True if user is admin, false otherwise
 */
export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin';
};

/**
 * Check if the current user has editor role or higher
 * @returns {boolean} True if user is editor or admin, false otherwise
 */
export const isEditorOrAbove = () => {
  const user = getUser();
  return user?.role === 'admin' || user?.role === 'editor';
};