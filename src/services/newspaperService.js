import api from './api';

export const getNewspapers = async (year = null) => {
  try {
    let url = '/newspapers';
    if (year) {
      url += `?year=${year}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching newspapers:', error);
    throw error;
  }
};

export const getLatestNewspaper = async () => {
  try {
    const response = await api.get('/newspapers/latest');
    return response.data;
  } catch (error) {
    console.error('Error fetching latest newspaper:', error);
    throw error;
  }
};

export const getNewspaperById = async (id) => {
  try {
    const response = await api.get(`/newspapers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching newspaper ${id}:`, error);
    throw error;
  }
};

export const createNewspaper = async (formData) => {
  try {
    const response = await api.post('/newspapers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating newspaper:', error);
    throw error;
  }
};

export const updateNewspaper = async (id, formData) => {
  try {
    const response = await api.put(`/newspapers/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating newspaper ${id}:`, error);
    throw error;
  }
};

export const deleteNewspaper = async (id) => {
  try {
    const response = await api.delete(`/newspapers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting newspaper ${id}:`, error);
    throw error;
  }
};
