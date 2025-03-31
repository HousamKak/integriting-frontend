// src/pages/WhistleblowerPage.jsx
import React from 'react';
import ReportingForm from '../components/whistleblower/ReportingForm';
import '../styles/pages/WhistleblowerPage.scss';

const WhistleblowerPage = () => {
  return (
    <div className="whistleblower-page">
      <div className="whistleblower-hero">
        <div className="container">
          <div className="whistleblower-hero__content">
            <h1 className="whistleblower-hero__title">
              Whistleblower & Reporting Persons Protection
            </h1>
            <p className="whistleblower-hero__subtitle">
              This section provides information on confidential reporting mechanisms, legal protections 
              for whistleblowers, and how individuals can safely report misconduct.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="whistleblower-grid">
          <div className="whistleblower-info">
            <section className="whistleblower-section">
              <h2 className="whistleblower-section__title">About Whistleblower Protection</h2>
              <p className="whistleblower-section__text">
                Whistleblowing plays a vital role in preventing and addressing misconduct, fraud, and 
                illegal activities. Integriting is committed to providing safe channels for reporting 
                wrongdoing and ensuring that whistleblowers are protected from retaliation.
              </p>
              <p className="whistleblower-section__text">
                Our whistleblower protection services are designed to create a secure environment 
                where individuals can report concerns without fear of negative consequences.
              </p>
            </section>
            
            <section className="whistleblower-section">
              <h2 className="whistleblower-section__title">Legal Protections</h2>
              <p className="whistleblower-section__text">
                Various laws and regulations provide protections for whistleblowers, including:
              </p>
              <ul className="whistleblower-section__list">
                <li>Protection against retaliation, discrimination, and harassment</li>
                <li>Confidentiality safeguards to protect identities</li>
                <li>Legal remedies in case of violations</li>
                <li>Rights to anonymously report concerns</li>
                <li>Protections under international frameworks and directives</li>
              </ul>
              <p className="whistleblower-section__text">
                Our legal experts can provide guidance on the specific protections available in your 
                jurisdiction and situation.
              </p>
            </section>
            
            <section className="whistleblower-section">
              <h2 className="whistleblower-section__title">Types of Reportable Misconduct</h2>
              <p className="whistleblower-section__text">
                Whistleblower protections typically cover reports concerning:
              </p>
              <ul className="whistleblower-section__list">
                <li>Corruption and bribery</li>
                <li>Fraud and financial misconduct</li>
                <li>Violations of laws and regulations</li>
                <li>Environmental violations</li>
                <li>Health and safety risks</li>
                <li>Ethics violations and breaches of codes of conduct</li>
                <li>Discrimination and harassment</li>
                <li>Conflicts of interest</li>
              </ul>
            </section>
            
            <section className="whistleblower-section">
              <h2 className="whistleblower-section__title">Confidentiality Commitment</h2>
              <p className="whistleblower-section__text">
                We understand the importance of confidentiality in whistleblowing cases. Our reporting 
                channels and processes are designed to maintain the highest level of security and discretion.
              </p>
              <p className="whistleblower-section__text">
                All information provided through our reporting systems is handled with strict confidentiality, 
                and access is limited to authorized personnel only.
              </p>
            </section>
          </div>
          
          <div className="whistleblower-reporting">
            <div className="reporting-card">
              <h2 className="reporting-card__title">Confidential Reporting</h2>
              <p className="reporting-card__text">
                We are committed to ensuring the highest level of protection for whistleblowers and other 
                reporting persons. Your identity and all information you provide will remain strictly confidential.
              </p>
              
              <ReportingForm />
              
              <div className="reporting-card__alternative">
                <h3 className="reporting-card__alternative-title">Alternative Reporting Methods</h3>
                <div className="reporting-card__hotline">
                  <div className="reporting-card__hotline-icon">📞</div>
                  <div className="reporting-card__hotline-info">
                    <h4 className="reporting-card__hotline-title">Confidential Hotline</h4>
                    <p className="reporting-card__hotline-number">1-800-555-0123</p>
                    <p className="reporting-card__hotline-hours">Available 24/7</p>
                  </div>
                </div>
                
                <div className="reporting-card__email">
                  <p>For secure email reporting:</p>
                  <a href="mailto:whistleblower@integriting.com" className="reporting-card__email-link">
                    whistleblower@integriting.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="whistleblower-faq">
          <h2 className="whistleblower-faq__title">Frequently Asked Questions</h2>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-item__question">What is whistleblowing?</h3>
              <p className="faq-item__answer">
                Whistleblowing is the act of reporting suspected wrongdoing, misconduct, or illegal activities 
                within an organization. Whistleblowers are individuals who come forward to report such concerns.
              </p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-item__question">Can I remain anonymous when reporting?</h3>
              <p className="faq-item__answer">
                Yes, you can choose to submit an anonymous report through our reporting form or hotline. 
                However, providing contact information may be helpful if additional information is needed for investigation.
              </p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-item__question">What happens after I submit a report?</h3>
              <p className="faq-item__answer">
                Your report will be reviewed by designated personnel who specialize in whistleblower cases. 
                An initial assessment will be conducted, followed by an investigation if warranted. You may 
                be contacted for additional information if you provided contact details.
              </p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-item__question">How am I protected from retaliation?</h3>
              <p className="faq-item__answer">
                Various laws and regulations protect whistleblowers from retaliation. Additionally, our processes 
                include measures to maintain confidentiality and monitor for potential retaliatory actions. If you 
                experience retaliation, you should report it immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhistleblowerPage;
