// src/components/common/NewsletterSignup.jsx
import React, { useState } from 'react';
import { subscribeToNewsletter, newsletterEnabled } from '../../services/newsletterService';

const NewsletterSignup = ({ className = '', showTitle = true }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Don't render if newsletter is disabled
  if (!newsletterEnabled) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await subscribeToNewsletter(email);
      setIsSuccess(true);
      setMessage('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`newsletter-signup ${className}`}>
      {showTitle && <h3>Subscribe to Our Newsletter</h3>}
      <p>Stay updated with our latest news and publications.</p>
      
      <form onSubmit={handleSubmit} className="newsletter-form">
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            disabled={loading}
            className="email-input"
          />
          <button 
            type="submit" 
            disabled={loading || !email}
            className="subscribe-btn"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        
        {message && (
          <div className={`message ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default NewsletterSignup;
