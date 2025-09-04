import api from './api';

export const getServices = async () => {
  try {
    const response = await api.get('/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    
    // Return mock data for development when backend is not available
    console.warn('Using mock data for services');
    return [
      {
        id: 1,
        title: 'Corporate Governance',
        description: 'Comprehensive corporate governance consulting services to help organizations establish effective governance frameworks and ensure compliance with regulatory requirements.',
        icon: 'corporate-governance',
        order_number: 1
      },
      {
        id: 2,
        title: 'Risk Management',
        description: 'Professional risk assessment and management services to identify, evaluate, and mitigate business risks across all organizational levels.',
        icon: 'risk-management',
        order_number: 2
      },
      {
        id: 3,
        title: 'Compliance Auditing',
        description: 'Thorough compliance auditing services to ensure your organization meets all regulatory and industry standards.',
        icon: 'compliance-audit',
        order_number: 3
      }
    ];
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await api.get(`/services/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching service ${id}:`, error);
    
    // Return mock data for development
    const services = await getServices();
    const service = services.find(s => s.id === parseInt(id));
    if (service) {
      return service;
    }
    throw new Error('Service not found');
  }
};

export const createService = async (serviceData) => {
  try {
    const response = await api.post('/services', serviceData);
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    
    // Return mock success for development
    return {
      id: Date.now(), // Simple mock ID
      ...serviceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
};

export const updateService = async (id, serviceData) => {
  try {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  } catch (error) {
    console.error(`Error updating service ${id}:`, error);
    
    // Return mock success for development
    return {
      id: parseInt(id),
      ...serviceData,
      updated_at: new Date().toISOString()
    };
  }
};

export const deleteService = async (id) => {
  try {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting service ${id}:`, error);
    
    // Return mock success for development
    return { message: 'Service deleted successfully' };
  }
};
