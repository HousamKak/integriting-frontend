// src/pages/admin/ManageServices.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getServices, deleteService } from '../../services/serviceService';
import { Button, Card, LoadingSpinner } from '../../components/admin/ui';
import '../../styles/pages/ManageServices.scss';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Map service icons to their respective image paths
  const getIconPath = (iconName, serviceTitle) => {
    const iconMap = {
      'governance': '/assets/icons/governance-icon.svg',
      'intellectual-property': '/assets/icons/ip-icon.svg',
      'intellectual property': '/assets/icons/ip-icon.svg',
      'ip': '/assets/icons/ip-icon.svg',
      'contracts': '/assets/icons/contracts-icon.svg',
      'contract': '/assets/icons/contracts-icon.svg',
      'compliance': '/assets/icons/compliance-icon.svg',
      'monitoring': '/assets/icons/monitoring-icon.svg',
      'whistleblower': '/assets/icons/whistleblower-icon.svg',
      'whistleblowing': '/assets/icons/whistleblower-icon.svg',
      'audit': '/assets/icons/compliance-icon.svg',
      'legal': '/assets/icons/contracts-icon.svg',
      'corporate': '/assets/icons/governance-icon.svg',
    };
    
    // Try to match by icon name first
    let sanitizedIconName = iconName?.toLowerCase().trim();
    let iconPath = iconMap[sanitizedIconName];
    
    // If no match, try to match by service title keywords
    if (!iconPath && serviceTitle) {
      const titleLower = serviceTitle.toLowerCase();
      if (titleLower.includes('governance') || titleLower.includes('corporate')) {
        iconPath = iconMap['governance'];
      } else if (titleLower.includes('intellectual') || titleLower.includes('property') || titleLower.includes('ip')) {
        iconPath = iconMap['ip'];
      } else if (titleLower.includes('contract')) {
        iconPath = iconMap['contracts'];
      } else if (titleLower.includes('compliance') || titleLower.includes('audit')) {
        iconPath = iconMap['compliance'];
      } else if (titleLower.includes('monitor')) {
        iconPath = iconMap['monitoring'];
      } else if (titleLower.includes('whistleblow')) {
        iconPath = iconMap['whistleblower'];
      }
    }
    
    return iconPath || '/assets/icons/default-icon.svg';
  };

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        
        // Ensure data is an array - handle different response formats
        const servicesArray = Array.isArray(data) ? data : (data?.services || data?.data || []);
        
        setServices(servicesArray);
        setLoading(false);
      } catch (err) {
        console.error('Error in fetchServices:', err);
        setError('Failed to load services. Please try again later.');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Handle delete confirmation
  const handleDeleteConfirm = (id) => {
    setDeleteConfirm(id);
  };

  // Handle delete service
  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      setServices(services.filter(service => service.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete service. Please try again later.');
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Handle drag and drop reordering
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetIndex) => {
    const sourceIndex = e.dataTransfer.getData('index');
    if (sourceIndex === targetIndex) return;

    // Create copy of services array
    const newServices = [...services];
    const [movedService] = newServices.splice(sourceIndex, 1);
    newServices.splice(targetIndex, 0, movedService);
    
    // Update order_number of each service
    const updatedServices = newServices.map((service, index) => {
      return { ...service, order_number: index + 1 };
    });
    
    setServices(updatedServices);
    
    // Update order on the server
    try {
      const orderUpdates = updatedServices.map(service => ({
        id: service.id,
        order_number: service.order_number
      }));
      
      const response = await fetch('/api/services/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('integriting_auth_token')}`
        },
        body: JSON.stringify({ orders: orderUpdates })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update service order');
      }
      
      console.log('Service order updated successfully');
    } catch (err) {
      console.error('Error updating service order:', err);
      setError('Failed to save service order. Please try again.');
      // Revert the changes if the API call fails
      window.location.reload();
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <Card variant="error"><p>{error}</p></Card>;
  }

  try {
    return (
      <Card>
        <div className="admin-header">
          <h1>Manage Services</h1>
          <Link to="/admin/services/new">
            <Button 
              variant="primary"
            >
              Add New Service
            </Button>
          </Link>
        </div>

      <div className="admin-info">
        <p>Drag and drop services to reorder them on the homepage. Changes to order will be saved automatically.</p>
      </div>

      {Array.isArray(services) && services.length > 0 ? (
        <div className="services-grid">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="service-card"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="service-card__content">
                <div className="service-card__icon">
                  <img 
                    src={getIconPath(service.icon, service.title)} 
                    alt={service.title}
                    onError={(e) => {
                      e.target.src = '/assets/icons/default-icon.svg';
                    }}
                  />
                </div>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__description">
                  {service.description.length > 100 
                    ? `${service.description.substring(0, 100)}...` 
                    : service.description
                  }
                </p>
              </div>
              
              <div className="service-card__actions">
                <Link 
                  to={`/admin/services/${service.id}`} 
                  className="admin-btn admin-btn-edit"
                >
                  Edit
                </Link>
                {deleteConfirm === service.id ? (
                  <div className="admin-confirm-delete">
                    <span>Are you sure?</span>
                    <button 
                      onClick={() => handleDelete(service.id)}
                      className="admin-btn admin-btn-confirm"
                    >
                      Yes
                    </button>
                    <button 
                      onClick={cancelDelete}
                      className="admin-btn admin-btn-cancel"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleDeleteConfirm(service.id)}
                    className="admin-btn admin-btn-delete"
                  >
                    Delete
                  </button>
                )}
              </div>
              
              <div className="service-card__order">
                <span className="service-card__order-number">{service.order_number || index + 1}</span>
                <div className="service-card__drag-handle" title="Drag to reorder">
                  ⋮⋮
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <p>No services found. Add your first service to get started.</p>
          <Link to="/admin/services/new">
            <Button 
              variant="primary"
            >
              Add Service
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
  } catch (renderError) {
    console.error('Error rendering ManageServices:', renderError);
    return <Card><p>Error rendering services: {renderError.message}</p></Card>;
  }
};

export default ManageServices;