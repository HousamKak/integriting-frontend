

// src/pages/admin/EditNewspaper.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNewspaperById, createNewspaper, updateNewspaper } from '../../services/newspaperService';
import Button from '../../components/common/Button';
import '../../styles/pages/EditNewspaper.scss';

const EditNewspaper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewNewspaper = id === 'new';
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issue_date: '',
    pdf_file: null,
    cover_image: null
  });
  
  const [pdfFilename, setPdfFilename] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(!isNewNewspaper);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch newspaper data if editing existing newspaper
  useEffect(() => {
    const fetchNewspaper = async () => {
      if (isNewNewspaper) return;
      
      try {
        const data = await getNewspaperById(id);
        
        // Format date for input field (YYYY-MM-DD)
        const issueDate = new Date(data.issue_date);
        const formattedDate = issueDate.toISOString().split('T')[0];
        
        setFormData({
          title: data.title,
          description: data.description,
          issue_date: formattedDate,
          pdf_file: null,
          cover_image: null
        });
        
        // Get PDF filename from path
        if (data.pdf_file_path) {
          const filename = data.pdf_file_path.split('/').pop();
          setPdfFilename(filename);
        }
        
        // Set image preview if available
        if (data.cover_image_path) {
          setImagePreview(data.cover_image_path);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load newspaper data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchNewspaper();
  }, [id, isNewNewspaper]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      
      if (file) {
        // For PDF file
        if (name === 'pdf_file') {
          setPdfFilename(file.name);
        }
        
        // For cover image
        if (name === 'cover_image') {
          const reader = new FileReader();
          reader.onload = () => {
            setImagePreview(reader.result);
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
        await updateNewspaper(id, submitData);
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
        <Button 
          onClick={() => navigate('/admin/newspapers')} 
          variant="outline"
        >
          Cancel
        </Button>
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
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Briefly describe the content of this issue..."
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
          <label htmlFor="pdf_file">PDF File {!isNewNewspaper && '(Leave empty to keep current file)'}</label>
          <input
            type="file"
            id="pdf_file"
            name="pdf_file"
            onChange={handleChange}
            accept="application/pdf"
            className="file-input"
            required={isNewNewspaper}
          />
          {pdfFilename && (
            <div className="file-info">
              <span className="file-info__icon">📄</span>
              <span className="file-info__name">{pdfFilename}</span>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="cover_image">Cover Image {!isNewNewspaper && '(Leave empty to keep current image)'}</label>
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
          
          {imagePreview && (
            <div className="image-preview">
              <img 
                src={imagePreview} 
                alt="Cover preview" 
                className="image-preview__img"
              />
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <Button 
            type="submit" 
            variant="primary" 
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Issue'}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/newspapers')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditNewspaper;