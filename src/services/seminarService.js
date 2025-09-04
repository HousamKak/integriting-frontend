import api from './api';

export const getAllSeminars = async () => {
  try {
    const response = await api.get('/seminars');
    return response.data;
  } catch (error) {
    console.error('Error fetching seminars:', error);
    throw error;
  }
};

export const getUpcomingSeminars = async () => {
  try {
    const response = await api.get('/seminars/upcoming');
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming seminars:', error);
    throw error;
  }
};

export const getPastSeminars = async () => {
  try {
    const response = await api.get('/seminars/past');
    return response.data;
  } catch (error) {
    console.error('Error fetching past seminars:', error);
    throw error;
  }
};

export const getSeminarById = async (id) => {
  try {
    const response = await api.get(`/seminars/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching seminar ${id}:`, error);
    throw error;
  }
};

export const createSeminar = async (formData) => {
  try {
    const response = await api.post('/seminars', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating seminar:', error);
    throw error;
  }
};

export const updateSeminar = async (id, formData) => {
  try {
    const response = await api.put(`/seminars/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating seminar ${id}:`, error);
    throw error;
  }
};

export const deleteSeminar = async (id) => {
  try {
    const response = await api.delete(`/seminars/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting seminar ${id}:`, error);
    throw error;
  }
};
