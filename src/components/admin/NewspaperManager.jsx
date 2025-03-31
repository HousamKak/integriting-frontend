// src/components/admin/NewspaperManager.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getNewspaperById, 
  createNewspaper, 
  updateNewspaper 
} from '../../services/newspaperService';
import ContentEditor from './ContentEditor';
import '../../styles/pages/EditNewspaper.scss';

const NewspaperManager = ({ newspaperId = null }) => {
  const navigate = useNavigate();
  const isNewNewspaper = newspaperId === null;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issue_date: new Date().toISOString().split('T')[0],
    pdf_file: null,
    cover_image: null
  });
  
  const [pdfFileName, setPdfFileName] = useState('');
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [loading, setLoading] = useState(!isNewNewspaper);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch newspaper data if editing existing newspaper
  useEffect(() => {
    const fetchNewspaper = async () => {
      if (isNewNewspaper) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await getNewspaperById(newspaperId);
        
        setFormData({
          title: data.title,
          description: data.description || '',
          issue_date: new Date(data.issue_date).toISOString().split('T')[0],
          pdf_file: null,
          cover_image: null
        });
        
        // Set PDF filename from path
        if (data.pdf_file_path) {
          const filename = data.pdf_file_path.split('/').pop();
          setPdfFileName(filename);
        }
        
        // Set cover image preview if available
        if (data.cover_image_path) {
          setCoverImagePreview(data.cover_image_path);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load newspaper data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchNewspaper();
  }, [newspaperId, isNewNewspaper]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      
      if (file) {
        // For PDF file
        if (name === 'pdf_file') {
          setPdfFileName(file.name);
        }
        
        // For cover image
        if (name === 'cover_image') {
          const reader = new FileReader();
          reader.onload = () => {
            setCoverImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
        
        // Update form data
        setFormData(prev => ({
          ...prev,
          [name]: file
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle description save from ContentEditor
  const handleDescriptionSave = (description) => {
    setFormData(prev => ({
      ...prev,
      description
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    // Validate PDF file for new newspaper
    if (isNewNewspaper && !formData.pdf_file) {
      setError('Please upload a PDF file for the newspaper');
      setSaving(false);
      return;
    }
    
    // Create form data object for file upload
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if ((key === 'pdf_file' || key === 'cover_image') && formData[key]) {
        submitData.append(key, formData[key]);
      } else if (formData[key] !== null) {
        submitData.append(key, formData[key]);
      }
    });
    
    try {
      if (isNewNewspaper) {
        await createNewspaper(submitData);
      } else {
        await updateNewspaper(newspaperId, submitData);
      }
      
      navigate('/admin/newspapers');
    } catch (err) {
      setError('Failed to save newspaper. Please try again later.');
      setSaving(false);
    }
  };
  
  if (loading) return <div className="admin-loading">Loading newspaper data...</div>;
  
  return (
    <div className="edit-newspaper">
      <div className="admin-header">
        <h1>{isNewNewspaper ? 'Add New Issue' : 'Edit Issue'}</h1>
        <Link 
          to="/admin/newspapers" 
          className="admin-btn admin-btn-outline"
        >
          Back to Newspapers
        </Link>
      </div>
      
      {error && <div className="admin-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="edit-newspaper__form">
        <div className="form-group">
          <label htmlFor="title">Issue Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Governance Challenges of Tomorrow"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <ContentEditor 
            content={formData.description} 
            onSave={handleDescriptionSave}
            contentType="text"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="issue_date">Issue Date</label>
          <input
            type="date"
            id="issue_date"
            name="issue_date"
            value={formData.issue_date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="pdf_file">
            PDF File {!isNewNewspaper && '(Leave empty to keep current file)'}
          </label>
          <input
            type="file"
            id="pdf_file"
            name="pdf_file"
            onChange={handleChange}
            accept="application/pdf"
            className="file-input"
            required={isNewNewspaper}
          />
          {pdfFileName && (
            <div className="file-info">
              <span className="file-info__icon">📄</span>
              <span className="file-info__name">{pdfFileName}</span>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="cover_image">
            Cover Image {!isNewNewspaper && '(Leave empty to keep current image)'}
          </label>
          <input
            type="file"
            id="cover_image"
            name="cover_image"
            onChange={handleChange}
            accept="image/*"
            className="file-input"
          />
          <div className="file-input-help">
            Recommended size: 600x800 pixels (newspaper cover ratio)
          </div>
          
          {coverImagePreview && (
            <div className="image-preview">
              <img 
                src={coverImagePreview} 
                alt="Cover preview" 
                className="image-preview__img"
              />
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="admin-btn admin-btn-primary" 
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Issue'}
          </button>
          
          <button 
            type="button" 
            className="admin-btn admin-btn-outline" 
            onClick={() => navigate('/admin/newspapers')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewspaperManager;