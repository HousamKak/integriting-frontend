// src/routes.js
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/auth';

// Import pages
import HomePage from './pages/HomePage';
import PublicationsPage from './pages/PublicationsPage';
import PublicationDetailPage from './pages/PublicationDetailPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import WhistleblowerPage from './pages/WhistleblowerPage';
import SeminarsPage from './pages/SeminarsPage';
import NewspaperPage from './pages/NewspaperPage';
import LoginPage from './pages/LoginPage';

// Admin pages
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

// ProtectedRoute component - redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Routes configuration
const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/publications',
    element: <PublicationsPage />,
  },
  {
    path: '/publications/:id',
    element: <PublicationDetailPage />,
  },
  {
    path: '/services',
    element: <ServicesPage />,
  },
  {
    path: '/services/:id',
    element: <ServiceDetailPage />,
  },
  {
    path: '/whistleblower',
    element: <WhistleblowerPage />,
  },
  {
    path: '/seminars',
    element: <SeminarsPage />,
  },
  {
    path: '/newspaper',
    element: <NewspaperPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
  },
  {
    path: '/admin/publications',
    element: <ProtectedRoute><ManagePublications /></ProtectedRoute>,
  },
  {
    path: '/admin/publications/new',
    element: <ProtectedRoute><EditPublication /></ProtectedRoute>,
  },
  {
    path: '/admin/publications/:id',
    element: <ProtectedRoute><EditPublication /></ProtectedRoute>,
  },
  {
    path: '/admin/services',
    element: <ProtectedRoute><ManageServices /></ProtectedRoute>,
  },
  {
    path: '/admin/services/new',
    element: <ProtectedRoute><EditService /></ProtectedRoute>,
  },
  {
    path: '/admin/services/:id',
    element: <ProtectedRoute><EditService /></ProtectedRoute>,
  },
  {
    path: '/admin/seminars',
    element: <ProtectedRoute><ManageSeminars /></ProtectedRoute>,
  },
  {
    path: '/admin/seminars/new',
    element: <ProtectedRoute><EditSeminar /></ProtectedRoute>,
  },
  {
    path: '/admin/seminars/:id',
    element: <ProtectedRoute><EditSeminar /></ProtectedRoute>,
  },
  {
    path: '/admin/newspapers',
    element: <ProtectedRoute><ManageNewspapers /></ProtectedRoute>,
  },
  {
    path: '/admin/newspapers/new',
    element: <ProtectedRoute><EditNewspaper /></ProtectedRoute>,
  },
  {
    path: '/admin/newspapers/:id',
    element: <ProtectedRoute><EditNewspaper /></ProtectedRoute>,
  },
  {
    path: '/admin/whistleblower-reports',
    element: <ProtectedRoute><WhistleblowerReports /></ProtectedRoute>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
];

export default routes;

