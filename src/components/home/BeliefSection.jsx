// src/components/home/BeliefSection.jsx
import React from 'react';
import '../../styles/pages/HomePage.scss';

const BeliefSection = () => {
  return (
    <section className="belief-section">
      <div className="container">
        <h2 className="section-title">Our Belief</h2>
        
        <div className="belief-content">
          <p className="belief-text">
            Creative individual initiative is built upon two fundamental pillars: 
            private property and the protection of property rights. 
            Creating an environment that fosters these elements is a shared responsibility, 
            one that requires a strong foundation of transparency, rule of law, and informed
            decision-making.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BeliefSection;