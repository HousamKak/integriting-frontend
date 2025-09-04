// src/services/auth.js
import api from './api';

// Get the auth storage key from environment
const AUTH_STORAGE_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY || 'auth_token';

/**
 * Log in a user with email and password
 * @param {Object} credentials - Object containing email and password
 * @returns {Promise} Promise with user data and token
 */
export const login = async (credentials) => {
  try {
    // Always try the real API first
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      // Store auth token and user data in localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    
    // If API is not available or returns a network error, fall back to mock authentication
    // (This should only happen in development when the backend is not available)
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      // Check if these are test credentials
      const testEmail = import.meta.env.VITE_TEST_ADMIN_EMAIL || 'admin@integriting.com';
      const testPassword = import.meta.env.VITE_TEST_ADMIN_PASSWORD || 'admin123';
      
      if (credentials.email === testEmail && credentials.password === testPassword) {
        // Mock successful login for test credentials when API is unavailable
        const mockResponse = {
          token: 'test_token_' + Date.now(),
          user: {
            id: 1,
            email: testEmail,
            name: 'Test Administrator',
            role: 'admin',
            permissions: ['read', 'write', 'delete', 'admin']
          }
        };
        
        // Store auth token and user data in localStorage
        localStorage.setItem(AUTH_STORAGE_KEY, mockResponse.token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        
        return mockResponse;
      } else {
        throw new Error('Unable to connect to server. Try using test credentials: admin@integriting.com / admin123');
      }
    }
    
    // For other errors (like invalid credentials), throw the original error
    throw error;
  }
};

/**
 * Log out the current user
 */
export const logout = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
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
  return !!localStorage.getItem(AUTH_STORAGE_KEY);
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