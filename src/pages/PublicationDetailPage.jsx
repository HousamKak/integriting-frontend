// src/pages/PublicationDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicationById } from '../services/publicationService';
import DownloadButton from '../components/newspaper/DownloadButton';
import '../styles/pages/PublicationDetailPage.scss';

const PublicationDetailPage = () => {
  const { id } = useParams();
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const data = await getPublicationById(id);
        setPublication(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load publication. Please try again later.');
        setLoading(false);
      }
    };

    fetchPublication();
  }, [id]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="publication-detail__loading">Loading publication...</div>;
  if (error) return <div className="publication-detail__error">{error}</div>;
  if (!publication) return <div className="publication-detail__not-found">Publication not found.</div>;

  return (
    <div className="publication-detail">
      <div className="container">
        <div className="publication-detail__breadcrumb">
          <Link to="/publications" className="publication-detail__breadcrumb-link">
            Publications
          </Link>
          <span className="publication-detail__breadcrumb-separator">›</span>
          <span className="publication-detail__breadcrumb-current">{publication.title}</span>
        </div>
        
        <div className="publication-detail__header">
          <div className="publication-detail__meta">
            <div className="publication-detail__category">
              {publication.category}
            </div>
            <div className="publication-detail__date">
              {formatDate(publication.published_date)}
            </div>
          </div>
          <h1 className="publication-detail__title">{publication.title}</h1>
        </div>
        
        <div className="publication-detail__content">
          <div className="publication-detail__summary">
            <p className="publication-detail__summary-text">{publication.summary}</p>
          </div>
          
          <div className="publication-detail__body">
            {publication.content && (
              <div 
                className="publication-detail__formatted-content"
                dangerouslySetInnerHTML={{ __html: publication.content }}
              />
            )}
            
            {!publication.content && (
              <div className="publication-detail__fallback">
                <p>For the complete publication, please download the PDF document.</p>
              </div>
            )}
          </div>
          
          {publication.pdf_file_path && (
            <div className="publication-detail__download">
              <h3 className="publication-detail__download-title">Download Publication</h3>
              <p className="publication-detail__download-text">
                Access the complete publication in PDF format.
              </p>
              <DownloadButton 
                pdfUrl={publication.pdf_file_path}
                fileName={`${publication.title.toLowerCase().replace(/\s+/g, '-')}.pdf`}
                size="large"
              />
            </div>
          )}
        </div>
        
        <div className="publication-detail__related">
          <h2 className="publication-detail__related-title">Related Resources</h2>
          <p className="publication-detail__related-text">
            Explore more publications and resources on governance and compliance.
          </p>
          <div className="publication-detail__related-actions">
            <Link 
              to="/publications" 
              className="publication-detail__related-button"
            >
              Browse Publications
            </Link>
            <Link 
              to="/services" 
              className="publication-detail__related-button publication-detail__related-button--secondary"
            >
              Explore Our Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationDetailPage;