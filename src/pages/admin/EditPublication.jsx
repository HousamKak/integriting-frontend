// src/pages/admin/EditPublication.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicationById, getCategories, createPublication, updatePublication } from '../../services/publicationService';
import { Button, Card, LoadingSpinner, Input, Select, FileUpload } from '../../components/admin/ui';
import '../../styles/pages/EditPublication.scss';

const EditPublication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewPublication = id === 'new';
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    published_date: '',
    pdf_file: null
  });
  
  const [categories, setCategories] = useState([]);
  const [pdfFilename, setPdfFilename] = useState('');
  const [loading, setLoading] = useState(!isNewPublication);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch publication and categories data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await getCategories();
        
        // Ensure categories data is properly formatted as an array
        const categoriesArray = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.categories || categoriesData?.data || []);
        setCategories(categoriesArray);
        
        // If editing existing publication, fetch its data
        if (!isNewPublication && id && id !== 'undefined') {
          const publicationData = await getPublicationById(id);
          
          // Format date for input field (YYYY-MM-DD)
          const publishedDate = new Date(publicationData.published_date);
          const formattedDate = publishedDate.toISOString().split('T')[0];
          
          setFormData({
            title: publicationData.title,
            summary: publicationData.summary,
            content: publicationData.content,
            category: publicationData.category,
            published_date: formattedDate,
            pdf_file: null
          });
          
          if (publicationData.pdf_file_path) {
            const filename = publicationData.pdf_file_path.split('/').pop();
            setPdfFilename(filename);
          }
        } else {
          // Set default date to today for new publications
          const today = new Date();
          setFormData(prev => ({
            ...prev,
            published_date: today.toISOString().split('T')[0]
          }));
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isNewPublication]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      
      if (file) {
        setPdfFilename(file.name);
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
      } else if (formData[key] !== null) {
        submitData.append(key, formData[key]);
      }
    });
    
    try {
      if (isNewPublication) {
        await createPublication(submitData);
      } else {
        await updatePublication(id, submitData);
      }
      
      navigate('/admin/publications');
    } catch (err) {
      setError('Failed to save publication. Please try again later.');
      setSaving(false);
    }
  };
  
  if (loading) return <div className="admin-loading">Loading publication data...</div>;
  
  return (
    <div className="edit-publication">
      <div className="admin-header">
        <h1>{isNewPublication ? 'Add New Publication' : 'Edit Publication'}</h1>
        <Button 
          onClick={() => navigate('/admin/publications')} 
          variant="outline"
        >
          Cancel
        </Button>
      </div>
      
      {error && <div className="admin-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="edit-publication__form">
        <div className="form-group">
          <label htmlFor="title">Publication Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Governance Best Practices for Transparency"
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
            placeholder="Brief summary of the publication..."
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {Array.isArray(categories) && categories.map(category => (
                <option key={category.id || category.name} value={category.name}>
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
          <label htmlFor="content">Content (Optional)</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            placeholder="Content of the publication (Markdown supported)..."
          />
          <div className="form-help">
            HTML and Markdown formatting supported. This content will be displayed before the PDF download.
          </div>
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
          {pdfFilename && (
            <div className="file-info">
              <span className="file-info__icon">📄</span>
              <span className="file-info__name">{pdfFilename}</span>
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <Button 
            type="submit" 
            variant="primary" 
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Publication'}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/publications')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPublication;