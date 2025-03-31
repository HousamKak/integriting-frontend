// src/components/publications/PublicationCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/PublicationCard.scss';

const PublicationCard = ({ publication }) => {
  const { id, title, summary, category, published_date, pdf_file_path, file_size } = publication;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format file size to KB or MB
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${Math.round(kb)} KB`;
    } else {
      return `${(kb / 1024).toFixed(1)} MB`;
    }
  };

  return (
    <div className="publication-card">
      <div className={`publication-card__category publication-card__category--${category?.toLowerCase().replace(/\s+/g, '-')}`}>
        {category}
      </div>
      
      <h3 className="publication-card__title">
        <Link to={`/publications/${id}`}>{title}</Link>
      </h3>
      
      <div className="publication-card__date">
        {formatDate(published_date)}
      </div>
      
      <p className="publication-card__summary">{summary}</p>
      
      <div className="publication-card__footer">
        <div className="publication-card__meta">
          <span className="publication-card__file-size">
            {formatFileSize(file_size)}
          </span>
        </div>
        
        <div className="publication-card__actions">
          <Link to={`/publications/${id}`} className="publication-card__link">
            Read More
          </Link>
          
          {pdf_file_path && (
            <a 
              href={pdf_file_path} 
              target="_blank" 
              rel="noopener noreferrer"
              className="publication-card__download"
              title="Download PDF"
            >
              <span className="publication-card__download-icon">📥</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicationCard;