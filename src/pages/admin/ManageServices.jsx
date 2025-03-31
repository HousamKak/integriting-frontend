// src/pages/admin/ManageServices.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getServices, deleteService } from '../../services/serviceService';
import Button from '../../components/common/Button';
import '../../styles/pages/ManageServices.scss';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
        setLoading(false);
      } catch (err) {
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
    
    // TODO: Update order on the server
    // This would require a backend endpoint to handle batch updates
    // For now, we'll just update the UI
  };

  if (loading) return <div className="admin-loading">Loading services...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="manage-services">
      <div className="admin-header">
        <h1>Manage Services</h1>
        <Button to="/admin/services/new" variant="accent">Add New Service</Button>
      </div>

      <div className="admin-info">
        <p>Drag and drop services to reorder them on the homepage. Changes to order will be saved automatically.</p>
      </div>

      {services.length > 0 ? (
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
                  <img src={`/assets/icons/${service.icon || 'default-service'}.svg`} alt={service.title} />
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
          <Button to="/admin/services/new" variant="primary">Add Service</Button>
        </div>
      )}
    </div>
  );
};

export default ManageServices;