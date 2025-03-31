// src/pages/ServiceDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getServiceById } from '../services/serviceService';
import Button from '../components/common/Button';
import '../styles/pages/ServiceDetailPage.scss';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock benefits data (in a real app, this could come from the API)
  const serviceBenefits = {
    'governance': [
      'Enhanced organizational transparency and accountability',
      'Improved decision-making processes',
      'Stronger stakeholder confidence and trust',
      'Better risk management and compliance',
      'Long-term sustainability and resilience'
    ],
    'intellectual-property': [
      'Secure protection of valuable intellectual assets',
      'Comprehensive legal safeguards for innovations',
      'Strategic IP portfolio management',
      'Prevention of unauthorized use and infringement',
      'Maximized commercial value of intellectual property'
    ],
    'contracts': [
      'Legally sound and comprehensive agreements',
      'Protection of interests and mitigation of risks',
      'Clear definition of rights, obligations, and expectations',
      'Customized solutions for specific business needs',
      'Expert guidance throughout negotiation and execution'
    ],
    'compliance': [
      'Adherence to relevant laws, regulations, and standards',
      'Reduced risk of penalties, fines, and legal actions',
      'Systematic approach to compliance management',
      'Regular updates on regulatory changes',
      'Enhanced organizational reputation and credibility'
    ],
    'monitoring': [
      'Continuous assessment of performance and compliance',
      'Early identification of issues and opportunities',
      'Data-driven insights for improvement',
      'Transparent reporting and accountability',
      'Adaptable frameworks for changing requirements'
    ],
    'whistleblower': [
      'Confidential and secure reporting channels',
      'Legal protection for reporting persons',
      'Prompt and thorough investigation of reports',
      'Prevention of retaliation and discrimination',
      'Enhanced organizational ethics and integrity'
    ]
  };

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const data = await getServiceById(id);
        setService(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load service details. Please try again later.');
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id]);

  if (loading) return <div className="service-detail__loading">Loading service details...</div>;
  if (error) return <div className="service-detail__error">{error}</div>;
  if (!service) return <div className="service-detail__not-found">Service not found.</div>;

  // Get benefits based on service icon/type
  const benefits = serviceBenefits[service.icon] || [];

  return (
    <div className="service-detail">
      <div className="container">
        <div className="service-detail__breadcrumb">
          <Link to="/services" className="service-detail__breadcrumb-link">
            Services
          </Link>
          <span className="service-detail__breadcrumb-separator">›</span>
          <span className="service-detail__breadcrumb-current">{service.title}</span>
        </div>
        
        <div className="service-detail__header">
          <div className="service-detail__icon">
            <img 
              src={`/assets/icons/${service.icon || 'default-service'}.svg`} 
              alt={service.title} 
            />
          </div>
          
          <h1 className="service-detail__title">{service.title}</h1>
        </div>
        
        <div className="service-detail__content">
          <div className="service-detail__description">
            <h2 className="service-detail__section-title">Description</h2>
            <div className="service-detail__text">
              <p>{service.description}</p>
              
              {/* Additional description - this would come from a more detailed API in a real app */}
              <p>
                Our experienced team provides comprehensive solutions tailored to your specific 
                needs. We work closely with you to understand your challenges and objectives, 
                delivering effective strategies that drive sustainable success.
              </p>
            </div>
          </div>
          
          {benefits.length > 0 && (
            <div className="service-detail__benefits">
              <h2 className="service-detail__section-title">Key Benefits</h2>
              <ul className="service-detail__benefits-list">
                {benefits.map((benefit, index) => (
                  <li key={index} className="service-detail__benefit-item">
                    <span className="service-detail__benefit-icon">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="service-detail__process">
            <h2 className="service-detail__section-title">Our Process</h2>
            
            <div className="service-detail__process-steps">
              <div className="process-step">
                <div className="process-step__number">1</div>
                <h3 className="process-step__title">Initial Consultation</h3>
                <p className="process-step__text">
                  We begin with a thorough discussion to understand your specific needs, 
                  challenges, and objectives.
                </p>
              </div>
              
              <div className="process-step">
                <div className="process-step__number">2</div>
                <h3 className="process-step__title">Assessment & Analysis</h3>
                <p className="process-step__text">
                  Our experts conduct a comprehensive assessment of your current situation 
                  and analyze the relevant factors.
                </p>
              </div>
              
              <div className="process-step">
                <div className="process-step__number">3</div>
                <h3 className="process-step__title">Strategy Development</h3>
                <p className="process-step__text">
                  We develop a customized strategy and solution tailored to your specific 
                  requirements and goals.
                </p>
              </div>
              
              <div className="process-step">
                <div className="process-step__number">4</div>
                <h3 className="process-step__title">Implementation & Support</h3>
                <p className="process-step__text">
                  Our team works with you to implement the solution and provides ongoing 
                  support to ensure success.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="service-detail__cta">
          <h2 className="service-detail__cta-title">Ready to Get Started?</h2>
          <p className="service-detail__cta-text">
            Contact us today to discuss how we can help you with {service.title.toLowerCase()}.
          </p>
          <div className="service-detail__cta-buttons">
            <a href="mailto:info@integriting.com" className="service-detail__cta-button service-detail__cta-button--primary">
              Contact Us
            </a>
            <Link to="/services" className="service-detail__cta-button service-detail__cta-button--secondary">
              Explore Other Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;

