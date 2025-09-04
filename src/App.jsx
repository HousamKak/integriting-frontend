// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/admin/ui';

// Import common components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Import page components
import HomePage from './pages/HomePage';
import PublicationsPage from './pages/PublicationsPage';
import PublicationDetailPage from './pages/PublicationDetailPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import WhistleblowerPage from './pages/WhistleblowerPage';
import SeminarsPage from './pages/SeminarsPage';
import NewspaperPage from './pages/NewspaperPage';
import LoginPage from './pages/LoginPage';

// Admin components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePublications from './pages/admin/ManagePublications';
import EditPublication from './pages/admin/EditPublication';
import ManageServices from './pages/admin/ManageServices';
import EditService from './pages/admin/EditService';
import ManageSeminars from './pages/admin/ManageSeminars';
import EditSeminar from './pages/admin/EditSeminar';
import ManageNewspapers from './pages/admin/ManageNewspapers';
import EditNewspaper from './pages/admin/EditNewspaper';
import WhistleblowerReports from './pages/admin/WhistleblowerReports';

// Auth utilities
import { isAuthenticated, isAdmin } from './services/auth';
import { Navigate } from 'react-router-dom';

// Import services
import { initAnalytics } from './services/analyticsService';

// Import styles
import './styles/global.scss';

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// AdminProtectedRoute component
const AdminProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Layout wrapper for public pages
const PublicLayout = ({ children }) => {
  return (
    <div className="app">
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <Header />
      <main id="main-content" className="main-content" tabIndex="-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  // Set the app title from environment variables and initialize analytics
  useEffect(() => {
    const appTitle = import.meta.env.VITE_APP_TITLE || 'Integriting';
    document.title = appTitle;
    
    // Initialize analytics if enabled
    initAnalytics();
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
        <Routes>
          {/* Public routes with Header/Footer */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/publications" element={<PublicLayout><PublicationsPage /></PublicLayout>} />
          <Route path="/publications/:id" element={<PublicLayout><PublicationDetailPage /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
          <Route path="/services/:id" element={<PublicLayout><ServiceDetailPage /></PublicLayout>} />
          <Route path="/whistleblower" element={<PublicLayout><WhistleblowerPage /></PublicLayout>} />
          <Route path="/seminars" element={<PublicLayout><SeminarsPage /></PublicLayout>} />
          <Route path="/newspaper" element={<PublicLayout><NewspaperPage /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
          
          {/* Admin routes with AdminLayout */}
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="publications" element={<ManagePublications />} />
            <Route path="publications/new" element={<EditPublication />} />
            <Route path="publications/:id" element={<EditPublication />} />
            <Route path="services" element={<ManageServices />} />
            <Route path="services/new" element={<EditService />} />
            <Route path="services/:id" element={<EditService />} />
            <Route path="seminars" element={<ManageSeminars />} />
            <Route path="seminars/new" element={<EditSeminar />} />
            <Route path="seminars/:id" element={<EditSeminar />} />
            <Route path="newspapers" element={<ManageNewspapers />} />
            <Route path="newspapers/new" element={<EditNewspaper />} />
            <Route path="newspapers/:id" element={<EditNewspaper />} />
            <Route path="whistleblower-reports" element={<WhistleblowerReports />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;