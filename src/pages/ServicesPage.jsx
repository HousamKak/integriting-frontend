// src/pages/ServicesPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getServices } from '../services/serviceService';
import ServiceGrid from '../components/services/ServiceGrid';
import '../styles/pages/ServicesPage.scss';

/**
 * ServicesPage Component
 * 
 * A comprehensive services page showcasing the company's offerings with an elegant,
 * professional design. Features a sophisticated hero section, approach methodology,
 * and call-to-action area.
 * 
 * @component
 * @returns {JSX.Element} The complete services page
 */
const ServicesPage = () => {
  // State management with proper TypeScript-like validation
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Validates the services data structure
   * @param {Array} servicesData - Array of service objects
   * @returns {boolean} Whether the data is valid
   */
  const validateServicesData = useCallback((servicesData) => {
    if (!Array.isArray(servicesData)) {
      throw new TypeError('Services data must be an array');
    }
    
    servicesData.forEach((service, index) => {
      if (typeof service !== 'object' || service === null) {
        throw new TypeError(`Service at index ${index} must be an object`);
      }
    });
    
    return true;
  }, []);

  /**
   * Fetches services data with comprehensive error handling
   */
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getServices();
      
      // Runtime type validation
      validateServicesData(data);
      
      setServices(data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      
      // Provide specific error messages based on error type
      if (err instanceof TypeError) {
        setError('Invalid services data format. Please contact support.');
      } else if (err.name === 'NetworkError' || err.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to load services. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [validateServicesData]);

  /**
   * Smooth scroll handler for the scroll indicator
   */
  const handleScrollToContent = useCallback(() => {
    const contentElement = document.querySelector('.services-content');
    if (contentElement) {
      contentElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Retry function for error states
  const handleRetry = useCallback(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <div className="services-page">
      {/* Hero Section - Elegant and sophisticated */}
      <header className="services-header" role="banner">
        <div className="container">
          <div className="services-header__badge">
            Professional Services
          </div>
          
          <h1 className="services-header__title">
            Our <span>Services</span>
          </h1>
          
          <p className="services-header__subtitle">
            Expert solutions in governance, legal support, and compliance to help your organization 
            navigate complex challenges and achieve sustainable success through innovative strategies 
            and proven methodologies.
          </p>
        </div>
        
        <button 
          className="services-header__scroll-indicator"
          onClick={handleScrollToContent}
          aria-label="Scroll to services content"
          type="button"
        >
          Explore Services
        </button>
      </header>
      
      {/* Main Content Area */}
      <main className="services-content" role="main">
        <div className="container">
          {/* Services Grid with enhanced error handling */}
          <ServiceGrid 
            services={services} 
            loading={loading} 
            error={error}
            onRetry={handleRetry}
          />
        
          {/* Our Approach Section - Refined methodology showcase */}
          <section className="services-approach" aria-labelledby="approach-title">
            <h2 id="approach-title" className="services-approach__title">
              Our Approach
            </h2>
            
            <div className="services-approach__grid" role="list">
              <article className="approach-card" role="listitem">
                <div className="approach-card__icon" aria-hidden="true">📋</div>
                <h3 className="approach-card__title">Assessment</h3>
                <p className="approach-card__text">
                  We begin with a thorough assessment of your organization's needs, challenges, 
                  and strategic objectives to ensure our solutions align perfectly with your goals.
                </p>
              </article>
              
              <article className="approach-card" role="listitem">
                <div className="approach-card__icon" aria-hidden="true">🔍</div>
                <h3 className="approach-card__title">Analysis</h3>
                <p className="approach-card__text">
                  Our experts analyze your current systems, processes, and practices using 
                  industry-leading methodologies to identify areas for optimization and improvement.
                </p>
              </article>
              
              <article className="approach-card" role="listitem">
                <div className="approach-card__icon" aria-hidden="true">📝</div>
                <h3 className="approach-card__title">Strategy</h3>
                <p className="approach-card__text">
                  We develop customized strategies and actionable solutions tailored to your 
                  specific requirements, ensuring maximum impact and sustainable results.
                </p>
              </article>
              
              <article className="approach-card" role="listitem">
                <div className="approach-card__icon" aria-hidden="true">🚀</div>
                <h3 className="approach-card__title">Implementation</h3>
                <p className="approach-card__text">
                  Our dedicated team works closely with you to implement solutions effectively 
                  and efficiently, providing ongoing support throughout the entire process.
                </p>
              </article>
            </div>
          </section>
          
          {/* Call to Action Section - Professional and engaging */}
          <section className="services-cta" aria-labelledby="cta-title">
            <div className="services-cta__content">
              <h2 id="cta-title" className="services-cta__title">
                Need a <span>Customized Solution</span>?
              </h2>
              <p className="services-cta__text">
                Contact us to discuss your specific requirements and discover how our expert team 
                can help you achieve your organizational goals with tailored solutions.
              </p>
              <a 
                href="mailto:info@integriting.com" 
                className="services-cta__button"
                aria-label="Contact us via email at info@integriting.com"
              >
                Contact Us Today
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// PropTypes for development-time type checking (since we're not using TypeScript)
ServicesPage.propTypes = {
  // No props for this component, but we include PropTypes import for consistency
};

// Default export for the component
export default ServicesPage;