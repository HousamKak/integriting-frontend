// src/components/home/WhyIntegriting.jsx
import React from 'react';
import '../../styles/pages/HomePage.scss';

const WhyIntegriting = () => {
  const values = [
    {
      icon: '🔍',
      title: 'Expertise',
      text: 'Our team of specialists brings deep knowledge in governance, law, and compliance to help you navigate complex challenges.'
    },
    {
      icon: '⚖️',
      title: 'Integrity',
      text: 'We uphold the highest ethical standards in our work, ensuring transparency and honesty in every interaction.'
    },
    {
      icon: '🛡️',
      title: 'Protection',
      text: 'We are committed to safeguarding whistleblowers and creating secure environments for reporting misconduct.'
    },
    {
      icon: '🌱',
      title: 'Sustainability',
      text: 'Our focus on sustainable governance helps organizations build resilient structures for long-term success.'
    }
  ];

  return (
    <section className="why-section">
      <div className="container">
        <h2 className="section-title">Why Integriting?</h2>
        
        <div className="values-grid">
          {values.map((value, index) => (
            <div key={index} className="value-card">
              <div className="value-card__icon">{value.icon}</div>
              <h3 className="value-card__title">{value.title}</h3>
              <p className="value-card__text">{value.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyIntegriting;