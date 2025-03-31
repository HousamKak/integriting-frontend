// src/components/whistleblower/ReportingForm.jsx
import React, { useState } from 'react';
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
    error: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });

    try {
      // If anonymous is checked, clear name and email
      const reportData = { ...formData };
      if (reportData.isAnonymous) {
        reportData.name = '';
        reportData.email = '';
      }

      await submitWhistleblowerReport(reportData);
      setStatus({ submitting: false, success: true, error: null });
      setFormData({ name: '', email: '', message: '', isAnonymous: false });
    } catch (error) {
      setStatus({
        submitting: false,
        success: false,
        error: 'There was an error submitting your report. Please try again or use the hotline.'
      });
    }
  };

  if (status.success) {
    return (
      <div className="reporting-form__success">
        <h3>Report Submitted Successfully</h3>
        <p>Thank you for your report. Your information has been submitted securely.</p>
        <p>If you provided contact information, we may reach out to you for additional details.</p>
        <button 
          className="reporting-form__reset-button"
          onClick={() => setStatus({ submitting: false, success: false, error: null })}
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <div className="reporting-form">
      <form onSubmit={handleSubmit}>
        <div className="reporting-form__field">
          <label htmlFor="name">Name (optional)</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={formData.isAnonymous}
          />
        </div>

        <div className="reporting-form__field">
          <label htmlFor="email">Email (optional)</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={formData.isAnonymous}
          />
        </div>

        <div className="reporting-form__field">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
          />
        </div>

        <div className="reporting-form__field reporting-form__checkbox">
          <input
            type="checkbox"
            id="isAnonymous"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleChange}
          />
          <label htmlFor="isAnonymous">Submit anonymously</label>
        </div>

        <div className="reporting-form__security">
          <span className="reporting-form__encryption-icon">🔒</span>
          <span>256-bit SSL encryption</span>
        </div>

        {status.error && (
          <div className="reporting-form__error">
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