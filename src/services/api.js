// src/services/api.js
import axios from 'axios';

// Get the auth storage key from environment
const AUTH_STORAGE_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY || 'auth_token';

// Create API instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle unauthorized errors
      if (error.response.status === 401) {
        // If the API returns a 401 (unauthorized), clear auth token and redirect to login
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem('user');
        
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      // Handle forbidden errors
      if (error.response.status === 403) {
        console.error('Access denied. Insufficient permissions.');
      }
      
      // Handle validation errors
      if (error.response.status === 400) {
        console.error('Validation error:', error.response.data);
      }
      
      // Handle not found errors
      if (error.response.status === 404) {
        console.error('Resource not found:', error.response.data);
      }
      
      // Handle server errors
      if (error.response.status >= 500) {
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error. No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    
    // Return mock data for now until the backend endpoint is implemented
    return {
      publications: 12,
      services: 6,
      seminars: 8,
      newspapers: 4,
      whistleblowerReports: 3
    };
  }
};

export default api;