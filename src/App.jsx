// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import routes from './routes';

// Import common components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Import styles
import './styles/global.scss';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          {/* Skip to content link for accessibility */}
          <a href="#main-content" className="skip-to-content">Skip to content</a>
          
          <Header />
          <main id="main-content" className="main-content" tabIndex="-1">
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;