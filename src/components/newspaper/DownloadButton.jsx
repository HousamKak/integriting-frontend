// src/components/newspaper/DownloadButton.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/components/DownloadButton.scss';

const DownloadButton = ({ pdfUrl, fileName, size = 'medium' }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle download click with loading state
  const handleDownloadClick = () => {
    setIsLoading(true);
    
    // Simulate a small delay to show loading state
    // In a real app, this would happen naturally during download
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <a 
      href={pdfUrl} 
      className={`download-button download-button--${size} ${isLoading ? 'download-button--loading' : ''}`}
      target="_blank" 
      rel="noopener noreferrer"
      download={fileName}
      onClick={handleDownloadClick}
      aria-label="Download PDF"
    >
      {!isLoading && <span className="download-button__icon">📥</span>}
      <span className="download-button__text">Download PDF</span>
    </a>
  );
};

DownloadButton.propTypes = {
  pdfUrl: PropTypes.string.isRequired,
  fileName: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default DownloadButton;