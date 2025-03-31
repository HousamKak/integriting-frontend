// src/components/newspaper/NewspaperPreview.jsx
import React from 'react';
import DownloadButton from './DownloadButton';
import '../../styles/components/NewspaperPreview.scss';

const NewspaperPreview = ({ newspaper, loading, error }) => {
  if (loading) return <div className="newspaper-preview__loading">Loading newspaper...</div>;
  if (error) return <div className="newspaper-preview__error">{error}</div>;
  if (!newspaper) return <div className="newspaper-preview__empty">No newspaper available at this time.</div>;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="newspaper-preview">
      <div className="newspaper-preview__header">
        <h2 className="newspaper-preview__subtitle">Latest Issue</h2>
        <h3 className="newspaper-preview__issue-date">{formatDate(newspaper.issue_date)}</h3>
      </div>
      
      <div className="newspaper-preview__content">
        <div className="newspaper-preview__image-container">
          <img 
            src={newspaper.cover_image_path || '/assets/images/default-newspaper.jpg'} 
            alt="THE INTEGRITING JOURNAL" 
            className="newspaper-preview__image" 
          />
          <div className="newspaper-preview__overlay">
            <h2 className="newspaper-preview__title">THE INTEGRITING JOURNAL</h2>
            <h3 className="newspaper-preview__headline">{newspaper.title}</h3>
          </div>
        </div>
        
        <div className="newspaper-preview__details">
          <h3 className="newspaper-preview__details-title">{newspaper.title}</h3>
          
          <div className="newspaper-preview__description">
            {newspaper.description ? (
              <p>{newspaper.description}</p>
            ) : (
              <p>
                A downloadable PDF featuring 8-12 pages of investigative reports and analyses 
                focused on emerging trends, future risks, and governance challenges.
              </p>
            )}
          </div>
          
          <div className="newspaper-preview__columns">
            <div className="newspaper-preview__column">
              <h4>Future Risks and Opportunities</h4>
              <p>
                An exploration of emerging governance challenges and opportunities that 
                organizations may face in the coming years, with practical insights for 
                preparation and adaptation.
              </p>
            </div>
            
            <div className="newspaper-preview__column">
              <h4>Emerging Governance Trends</h4>
              <p>
                Analysis of evolving best practices in corporate governance, regulatory 
                developments, and innovative approaches to transparency and accountability.
              </p>
            </div>
          </div>
          
          <DownloadButton pdfUrl={newspaper.pdf_file_path} />
        </div>
      </div>
    </div>
  );
};

export default NewspaperPreview;