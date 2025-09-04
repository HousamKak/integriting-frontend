
// src/pages/admin/EditService.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById, createService, updateService } from '../../services/serviceService';
import { Button, Card, LoadingSpinner, Input, Select } from '../../components/admin/ui';
import '../../styles/pages/EditService.scss';

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewService = id === 'new';
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: ''
  });
  
  const [loading, setLoading] = useState(!isNewService);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Available icons
  const availableIcons = [
    { value: 'governance', label: 'Governance' },
    { value: 'intellectual-property', label: 'Intellectual Property' },
    { value: 'contracts', label: 'Contracts' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'monitoring', label: 'Monitoring' },
    { value: 'whistleblower', label: 'Whistleblower' }
  ];
  
  // Fetch service data if editing existing service
  useEffect(() => {
    const fetchService = async () => {
      if (isNewService || !id || id === 'undefined') {
        setLoading(false);
        return;
      }
      
      try {
        const data = await getServiceById(id);
        setFormData({
          title: data.title,
          description: data.description,
          icon: data.icon
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load service data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchService();
  }, [id, isNewService]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      if (isNewService) {
        await createService(formData);
      } else {
        await updateService(id, formData);
      }
      
      navigate('/admin/services');
    } catch (err) {
      setError('Failed to save service. Please try again later.');
      setSaving(false);
    }
  };
  
  if (loading) return <div className="admin-loading">Loading service data...</div>;
  
  return (
    <div className="edit-service">
      <div className="admin-header">
        <h1>{isNewService ? 'Add New Service' : 'Edit Service'}</h1>
        <Button 
          onClick={() => navigate('/admin/services')} 
          variant="outline"
        >
          Cancel
        </Button>
      </div>
      
      {error && <div className="admin-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="edit-service__form">
        <div className="form-group">
          <label htmlFor="title">Service Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Governance Consulting"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Describe what this service entails..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="icon">Icon</label>
          <select
            id="icon"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            required
          >
            <option value="">Select an icon</option>
            {availableIcons.map(icon => (
              <option key={icon.value} value={icon.value}>{icon.label}</option>
            ))}
          </select>
          
          {formData.icon && (
            <div className="icon-preview">
              <img 
                src={`/assets/icons/${formData.icon}.svg`} 
                alt={formData.icon} 
                className="icon-preview__image"
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
            {saving ? 'Saving...' : 'Save Service'}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/services')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditService;