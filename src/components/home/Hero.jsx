// src/components/home/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/Hero.scss';

const Hero = () => {
  const scrollToContent = () => {
    const content = document.querySelector('.belief-section');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero__badge">Professional Excellence</div>
        <h1 className="hero__title">
          Redefining <span>Governance</span> for a Sustainable Future
        </h1>
        <p className="hero__subtitle">
          A professional platform merging governance, law, and business with a focus on sustainable development, 
          legal insight, transparency, and whistleblower protection.
        </p>
        
        <div className="hero__scroll-indicator" onClick={scrollToContent}>
          Explore Our Mission
        </div>
      </div>
    </section>
  );
};

export default Hero;