// src/components/home/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import '../../styles/components/Hero.scss';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__title">Redefining Governance for a Sustainable Future</h1>
        <p className="hero__subtitle">
          A professional platform merging governance, law, and business with a focus on sustainable development, 
          legal insight, transparency, and whistleblower protection.
        </p>
        <div className="hero__cta">
          <Button 
            to="/services" 
            variant="accent" 
            size="large" 
            className="hero__button"
          >
            What We Do
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

