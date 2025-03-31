// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <h2 className="footer__logo">Integriting</h2>
            <p className="footer__tagline">
              Redefining Governance for a Sustainable Future
            </p>
            <div className="footer__social">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">
                <i className="footer__social-icon">LinkedIn</i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer__social-link">
                <i className="footer__social-icon">Twitter</i>
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

