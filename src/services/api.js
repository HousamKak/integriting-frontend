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

// Add request logging for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

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
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`[API Error] ${error.response?.status || 'NO_RESPONSE'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message);
    if (error.response) {
      // Handle unauthorized errors
      if (error.response.status === 401) {
        // Check if this is a token verification failure vs role-based access
        const errorMessage = error.response?.data?.message?.toLowerCase() || '';
        
        // Only logout for actual authentication failures, not role-based access issues
        if (errorMessage.includes('token') || errorMessage.includes('invalid') || errorMessage.includes('expired') || errorMessage.includes('no token provided')) {
          console.log('Authentication failed, logging out user');
          localStorage.removeItem(AUTH_STORAGE_KEY);
          localStorage.removeItem('user');
          
          // Only redirect if we're not already on the login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        } else {
          console.log('Authorization failed but user remains logged in:', errorMessage);
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
      publicationsChange: +8,
      services: 6,
      servicesChange: +2,
      seminars: 8,
      seminarsChange: +3,
      newspapers: 4,
      newspapersChange: +1,
      whistleblowerReports: 3,
      reportsChange: +1,
      recentActivity: [
        {
          id: 1,
          type: 'publication',
          title: 'New Corporate Governance Guide published',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          user: 'Test Administrator'
        },
        {
          id: 2,
          type: 'seminar',
          title: 'Risk Management Seminar scheduled',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          user: 'Test Administrator'
        },
        {
          id: 3,
          type: 'report',
          title: 'New whistleblower report received',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
          user: 'System'
        }
      ]
    };
  }
};

export default api;