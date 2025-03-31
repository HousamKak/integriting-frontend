// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser, getUser as getUserFromStorage } from '../services/auth';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize authentication state on component mount
  useEffect(() => {
    const initAuth = async () => {
      // First try to get user from localStorage
      const storedUser = getUserFromStorage();
      
      if (storedUser) {
        setCurrentUser(storedUser);
        
        // Verify token is still valid by fetching current user data
        try {
          const userData = await getCurrentUser();
          // Update with latest user data from server
          setCurrentUser(userData);
        } catch (err) {
          // If token is invalid, log out
          logoutService();
          setCurrentUser(null);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    try {
      const userData = await loginService({ email, password });
      setCurrentUser(userData.user);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    logoutService();
    setCurrentUser(null);
  };

  // Authentication value to provide
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isEditor: currentUser?.role === 'editor',
    login,
    logout,
    error,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;