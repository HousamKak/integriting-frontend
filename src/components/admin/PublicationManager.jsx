// src/components/admin/PublicationManager.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getPublications, 
  getCategories, 
  deletePublication,
  createPublication,
  updatePublication
} from '../../services/publicationService';
import ContentEditor from './ContentEditor';
import '../../styles/pages/ManagePublications.scss';

const PublicationManager = ({ publicationId = null }) => {
  const isNewPublication = publicationId === null;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category_id: '',
    published_date: new Date().toISOString().split('T')[0],
    pdf_file: null
  });
  
  const [pdfFileName, setPdfFileName] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!isNewPublication);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch publication and categories data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        
        // If editing an existing publication, fetch its data
        if (!isNewPublication) {
          const publicationsData = await getPublications();
          const publication = publicationsData.find(p => p.id === parseInt(publicationId));
          
          if (publication) {
            setFormData({
              title: publication.title,
              summary: publication.summary,
              content: publication.content,
              category_id: publication.category_id,
              published_date: new Date(publication.published_date).toISOString().split('T')[0],
              pdf_file: null
            });
            
            if (publication.pdf_file_path) {
              const filename = publication.pdf_file_path.split('/').pop();
              setPdfFileName(filename);
            }
          } else {
            setError('Publication not found');
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [publicationId, isNewPublication]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      
      if (file) {
        setPdfFileName(file.name);
        setFormData(prev => ({
          ...prev,
          pdf_file: file
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle content editor save
  const handleContentSave = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    // Validate PDF file for new publications
    if (isNewPublication && !formData.pdf_file) {
      setError('Please upload a PDF file for the publication');
      setSaving(false);
      return;
    }
    
    // Create form data object for file upload
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'pdf_file' && formData[key]) {
        submitData.append(key, formData[key]);
      } else if (formData[key] !== null && formData[key] !== undefined) {
        submitData.append(key, formData[key]);
      }
    });
    
    try {
      if (isNewPublication) {
        await createPublication(submitData);
      } else {
        await updatePublication(publicationId, submitData);
      }
      
      navigate('/admin/publications');
    } catch (err) {
      setError('Failed to save publication. Please check all fields and try again.');
      setSaving(false);
    }
  };
  
  if (loading) return <div className="admin-loading">Loading publication data...</div>;
  
  return (
    <div className="publication-manager">
      <div className="admin-header">
        <h1>{isNewPublication ? 'Add New Publication' : 'Edit Publication'}</h1>
        <Link 
          to="/admin/publications" 
          className="admin-btn admin-btn-outline"
        >
          Back to Publications
        </Link>
      </div>
      
      {error && <div className="admin-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="publication-form">
        <div className="form-group">
          <label htmlFor="title">Publication Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., The Role of Boards in Corporate Governance"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            rows={3}
            placeholder="A brief summary of the publication..."
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category_id">Category</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="published_date">Publication Date</label>
            <input
              type="date"
              id="published_date"
              name="published_date"
              value={formData.published_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <ContentEditor 
            content={formData.content} 
            onSave={handleContentSave}
            contentType="markdown"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="pdf_file">
            PDF File {!isNewPublication && '(Leave empty to keep current file)'}
          </label>
          <input
            type="file"
            id="pdf_file"
            name="pdf_file"
            onChange={handleChange}
            accept="application/pdf"
            className="file-input"
            required={isNewPublication}
          />
          {pdfFileName && (
            <div className="file-info">
              <span className="file-info__icon">📄</span>
              <span className="file-info__name">{pdfFileName}</span>
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="admin-btn admin-btn-primary" 
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Publication'}
          </button>
          
          <button 
            type="button" 
            className="admin-btn admin-btn-outline" 
            onClick={() => navigate('/admin/publications')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PublicationManager;