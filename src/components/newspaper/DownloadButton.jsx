// src/components/newspaper/DownloadButton.jsx
import React from 'react';
import '../../styles/components/DownloadButton.scss';

const DownloadButton = ({ pdfUrl }) => {
  return (
    <a 
      href={pdfUrl} 
      className="download-button" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <span className="download-button__icon">📥</span>
      <span className="download-button__text">Download PDF</span>
    </a>
  );
};

export default DownloadButton;