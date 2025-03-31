// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Social media icons
  const socialIcons = {
    linkedin: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
    twitter: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
      </svg>
    )
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <h2 className="footer__logo">Integriting</h2>
            <p className="footer__tagline">
              Redefining Governance for a Sustainable Future
            </p>
            <div className="footer__social">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer__social-link"
                aria-label="LinkedIn"
              >
                <span className="footer__social-icon" aria-hidden="true">
                  {socialIcons.linkedin}
                </span>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer__social-link"
                aria-label="Twitter"
              >
                <span className="footer__social-icon" aria-hidden="true">
                  {socialIcons.twitter}
                </span>
              </a>
            </div>
          </div>

          <div className="footer__links-group">
            <h3 className="footer__heading">Pages</h3>
            <ul className="footer__links">
              <li className="footer__link-item">
                <Link to="/" className="footer__link">Home</Link>
              </li>
              <li className="footer__link-item">
                <Link to="/publications" className="footer__link">Publications</Link>
              </li>
              <li className="footer__link-item">
                <Link to="/services" className="footer__link">Services</Link>
              </li>
              <li className="footer__link-item">
                <Link to="/seminars" className="footer__link">Seminars</Link>
              </li>
              <li className="footer__link-item">
                <Link to="/newspaper" className="footer__link">Journal</Link>
              </li>
            </ul>
          </div>

          <div className="footer__links-group">
            <h3 className="footer__heading">Services</h3>
            <ul className="footer__links">
              <li className="footer__link-item">
                <Link to="/services" className="footer__link">Governance Consulting</Link>
              </li>
              <li className="footer__link-item">
                <Link to="/services" className="footer__link">Intellectual Property Protection</Link>
              </li>
              <li className="footer__link-item">
                <Link to="/services" className="footer__link">Contracts & Agreements</Link>
              </li>
              <li className="footer__link-item">
                <Link to="/services" className="footer__link">Compliance Advisory</Link>
              </li>
              <li className="footer__link-item">
                <Link to="/services" className="footer__link">Whistleblower Protection</Link>
              </li>
            </ul>
          </div>

          <div className="footer__contact">
            <h3 className="footer__heading">Contact Us</h3>
            <address className="footer__address">
              <p>123 Governance Avenue</p>
              <p>Business District, City 10001</p>
              <p>Country</p>
            </address>
            <p className="footer__contact-item">
              <strong>Email:</strong> <a href="mailto:info@integriting.com" className="footer__link">info@integriting.com</a>
            </p>
            <p className="footer__contact-item">
              <strong>Phone:</strong> <a href="tel:+1234567890" className="footer__link">+1 (234) 567-890</a>
            </p>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            &copy; {currentYear} Integriting. All rights reserved.
          </div>
          <div className="footer__legal">
            <Link to="/privacy-policy" className="footer__legal-link">Privacy Policy</Link>
            <Link to="/terms-of-service" className="footer__legal-link">Terms of Service</Link>
            <Link to="/whistleblower" className="footer__legal-link">Whistleblower Protection</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;