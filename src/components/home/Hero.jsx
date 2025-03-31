// src/components/home/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/Hero.scss';

const Hero = () => {
  return (
    <section className="hero">
      {/* Add skip link for accessibility */}
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      
      <div className="hero__content">
        <h1 className="hero__title">Redefining Governance for a Sustainable Future</h1>
        <p className="hero__subtitle">
          A professional platform merging governance, law, and business with a focus on sustainable development, 
          legal insight, transparency, and whistleblower protection.
        </p>
        <div className="hero__cta">
          <Link 
            to="/services" 
            className="hero__button"
            aria-label="Learn more about our services"
          >
            What We Do
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;