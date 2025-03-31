// src/services/publicationService.js
import api from './api';

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
    throw error;
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
    throw error;
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