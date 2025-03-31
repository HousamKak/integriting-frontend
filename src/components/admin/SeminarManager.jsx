// src/components/admin/SeminarManager.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getSeminarById, 
  createSeminar, 
  updateSeminar 
} from '../../services/seminarService';
import ContentEditor from './ContentEditor';
import '../../styles/pages/EditSeminar.scss';

const SeminarManager = ({ seminarId = null }) => {
  const navigate = useNavigate();
  const isNewSeminar = seminarId === null;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    status: 'Upcoming',
    seats_available: '',
    location: '',
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(!isNewSeminar);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch seminar data if editing existing seminar
  useEffect(() => {
    const fetchSeminar = async () => {
      if (isNewSeminar) {
        // Set default event date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setFormData(prev => ({
          ...prev,
          event_date: tomorrow.toISOString().split('T')[0]
        }));
        setLoading(false);
        return;
      }
      
      try {
        const data = await getSeminarById(seminarId);
        
        // Format date for input field (YYYY-MM-DD)
        const eventDate = new Date(data.event_date);
        const formattedDate = eventDate.toISOString().split('T')[0];
        
        setFormData({
          title: data.title,
          description: data.description || '',
          event_date: formattedDate,
          status: data.status,
          seats_available: data.seats_available || '',
          location: data.location || '',
          image: null
        });
        
        // Set image preview if available
        if (data.image_path) {
          setImagePreview(data.image_path);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load seminar data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchSeminar();
  }, [seminarId, isNewSeminar]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      
      if (file) {
        // Preview image
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        
        // Update form data
        setFormData(prev => ({
          ...prev,
          image: file
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
    
    // Create form data object for file upload
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        submitData.append('image', formData[key]);
      } else if (formData[key] !== null && formData[key] !== '') {
        submitData.append(key, formData[key]);
      }
    });
    
    try {
      if (isNewSeminar) {
        await createSeminar(submitData);
      } else {
        await updateSeminar(seminarId, submitData);
      }
      
      navigate('/admin/seminars');
    } catch (err) {
      setError('Failed to save seminar. Please try again later.');
      setSaving(false);
    }
  };
  
  if (loading) return <div className="admin-loading">Loading seminar data...</div>;
  
  return (
    <div className="edit-seminar">
      <div className="admin-header">
        <h1>{isNewSeminar ? 'Add New Seminar' : 'Edit Seminar'}</h1>
        <Link 
          to="/admin/seminars" 
          className="admin-btn admin-btn-outline"
        >
          Back to Seminars
        </Link>
      </div>
      
      {error && <div className="admin-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="edit-seminar__form">
        <div className="form-group">
          <label htmlFor="title">Seminar Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Enhancing Transparency in Governance"
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
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="event_date">Event Date</label>
            <input
              type="date"
              id="event_date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Limited Seats">Limited Seats</option>
              <option value="Sold Out">Sold Out</option>
              <option value="Free">Free</option>
              <option value="Past">Past</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="seats_available">Seats Available</label>
            <input
              type="number"
              id="seats_available"
              name="seats_available"
              value={formData.seats_available}
              onChange={handleChange}
              min="0"
              placeholder="e.g., 50"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Conference Hall, Business Center"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Seminar Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            accept="image/*"
            className="file-input"
          />
          <div className="file-input-help">
            Recommended size: 800x450 pixels (16:9 ratio)
          </div>
          
          {imagePreview && (
            <div className="image-preview">
              <img 
                src={imagePreview} 
                alt="Seminar preview" 
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
            {saving ? 'Saving...' : 'Save Seminar'}
          </button>
          
          <button 
            type="button" 
            className="admin-btn admin-btn-outline" 
            onClick={() => navigate('/admin/seminars')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeminarManager;