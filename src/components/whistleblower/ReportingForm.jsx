// src/components/whistleblower/ReportingForm.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { submitWhistleblowerReport } from '../../services/whistleblowerService';
import '../../styles/components/ReportingForm.scss';

const ReportingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    isAnonymous: false
  });
  
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null,
    referenceNumber: null
  });
  
  const [touched, setTouched] = useState({
    message: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // If anonymous is checked, clear name and email
    if (name === 'isAnonymous' && checked) {
      setFormData({
        ...formData,
        name: '',
        email: '',
        isAnonymous: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.message.trim()) {
      setStatus({
        ...status,
        error: 'Please provide a message for your report.'
      });
      return;
    }
    
    setStatus({ ...status, submitting: true, error: null });

    try {
      // If anonymous is checked, clear name and email before submitting
      const reportData = { ...formData };
      if (reportData.isAnonymous) {
        reportData.name = '';
        reportData.email = '';
      }

      const response = await submitWhistleblowerReport(reportData);
      setStatus({
        submitting: false,
        success: true,
        error: null,
        referenceNumber: response.referenceNumber || 'WB-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      });
      
      // Reset form after successful submission
      setFormData({ name: '', email: '', message: '', isAnonymous: false });
      setTouched({ message: false });
      
    } catch (error) {
      setStatus({
        submitting: false,
        success: false,
        error: 'There was an error submitting your report. Please try again or use the hotline.',
        referenceNumber: null
      });
    }
  };

  if (status.success) {
    return (
      <div className="reporting-form__success" role="alert">
        <h3>Report Submitted Successfully</h3>
        <p>Thank you for your report. Your information has been submitted securely.</p>
        {status.referenceNumber && (
          <div className="reporting-form__reference">
            <p>Your reference number is:</p>
            <div className="reporting-form__reference-number">{status.referenceNumber}</div>
            <p>Please save this number to check the status of your report in the future.</p>
          </div>
        )}
        <button 
          className="reporting-form__reset-button"
          onClick={() => setStatus({ submitting: false, success: false, error: null, referenceNumber: null })}
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <div className="reporting-form">
      <form onSubmit={handleSubmit} noValidate>
        <div className="reporting-form__field">
          <label htmlFor="name">
            Name 
            <span className="reporting-form__optional">(optional)</span>
            {formData.isAnonymous && <span className="reporting-form__disabled-field"> - disabled in anonymous mode</span>}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={formData.isAnonymous}
            placeholder="Your name"
            aria-describedby="name-description"
          />
          <span id="name-description" className="sr-only">
            Provide your name if you wish to be contacted about your report
          </span>
        </div>

        <div className="reporting-form__field">
          <label htmlFor="email">
            Email 
            <span className="reporting-form__optional">(optional)</span>
            {formData.isAnonymous && <span className="reporting-form__disabled-field"> - disabled in anonymous mode</span>}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={formData.isAnonymous}
            placeholder="Your email address"
            aria-describedby="email-description"
          />
          <span id="email-description" className="sr-only">
            Provide your email if you wish to be contacted about your report
          </span>
        </div>

        <div className="reporting-form__field">
          <label htmlFor="message">
            Message <span className="reporting-form__required">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            rows={6}
            placeholder="Describe the situation or concern in detail"
            aria-describedby="message-description"
            aria-invalid={touched.message && !formData.message.trim() ? 'true' : 'false'}
          />
          <span id="message-description" className="sr-only">
            Please provide a detailed description of the issue or concern
          </span>
          {touched.message && !formData.message.trim() && (
            <div className="reporting-form__field-error" role="alert">
              Please provide a message for your report.
            </div>
          )}
        </div>

        <div className="reporting-form__field reporting-form__checkbox">
          <input
            type="checkbox"
            id="isAnonymous"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleChange}
            aria-describedby="anonymous-description"
          />
          <label htmlFor="isAnonymous">Submit anonymously</label>
          <span id="anonymous-description" className="sr-only">
            Check this box if you wish to submit your report anonymously without providing your name or email
          </span>
        </div>

        <div className="reporting-form__security" role="note">
          <span className="reporting-form__encryption-icon">🔒</span>
          <span>256-bit SSL encryption</span>
        </div>

        {status.error && (
          <div className="reporting-form__error" role="alert">
            {status.error}
          </div>
        )}

        <button 
          type="submit" 
          className="reporting-form__submit-button"
          disabled={status.submitting}
        >
          {status.submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportingForm;