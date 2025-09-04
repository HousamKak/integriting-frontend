// src/services/publicationService.js
import api from './api';

// Mock data for development
const mockPublications = [
  {
    id: 1,
    title: 'Corporate Governance Best Practices',
    category: 'Governance',
    summary: 'A comprehensive guide to implementing effective corporate governance practices.',
    published_date: '2024-01-15',
    file_size: 2048576,
    pdf_file: '/uploads/publications/governance-guide.pdf'
  },
  {
    id: 2,
    title: 'Compliance Framework Update 2024',
    category: 'Compliance',
    summary: 'Latest updates to compliance frameworks and regulatory requirements.',
    published_date: '2024-02-20',
    file_size: 1536000,
    pdf_file: '/uploads/publications/compliance-2024.pdf'
  },
  {
    id: 3,
    title: 'Risk Management Strategies',
    category: 'Risk Management',
    summary: 'Strategic approaches to identifying and mitigating organizational risks.',
    published_date: '2024-03-10',
    file_size: 3072000,
    pdf_file: '/uploads/publications/risk-management.pdf'
  }
];

const mockCategories = [
  { name: 'Governance' },
  { name: 'Compliance' },
  { name: 'Risk Management' },
  { name: 'Legal' }
];

export const getPublications = async (category = null) => {
  try {
    let url = '/publications';
    if (category && category !== 'All') {
      url += `?category=${category}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching publications:', error);
    // Return mock data if API fails
    let filteredData = mockPublications;
    if (category && category !== 'All') {
      filteredData = mockPublications.filter(pub => pub.category === category);
    }
    return filteredData;
  }
};

export const getPublicationById = async (id) => {
  try {
    const response = await api.get(`/publications/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching publication ${id}:`, error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/publications/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return mock data if API fails
    return mockCategories;
  }
};

export const createPublication = async (formData) => {
  try {
    const response = await api.post('/publications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating publication:', error);
    throw error;
  }
};

export const updatePublication = async (id, formData) => {
  try {
    const response = await api.put(`/publications/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating publication ${id}:`, error);
    throw error;
  }
};

export const deletePublication = async (id) => {
  try {
    const response = await api.delete(`/publications/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting publication ${id}:`, error);
    throw error;
  }
};