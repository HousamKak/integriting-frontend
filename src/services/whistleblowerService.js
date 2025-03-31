// src/services/whistleblowerService.js
import api from './api';

export const submitWhistleblowerReport = async (reportData) => {
  try {
    const response = await api.post('/whistleblower/report', reportData);
    return response.data;
  } catch (error) {
    console.error('Error submitting whistleblower report:', error);
    throw error;
  }
};

export const getReportStatus = async (referenceNumber) => {
  try {
    const response = await api.get(`/whistleblower/status/${referenceNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching report status:', error);
    throw error;
  }
};

// Admin-only functions (protected by authentication middleware on backend)
export const getWhistleblowerReports = async () => {
  try {
    const response = await api.get('/whistleblower/reports');
    return response.data;
  } catch (error) {
    console.error('Error fetching whistleblower reports:', error);
    throw error;
  }
};

export const getReportById = async (id) => {
  try {
    const response = await api.get(`/whistleblower/reports/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching report ${id}:`, error);
    throw error;
  }
};

export const updateReportStatus = async (id, status) => {
  try {
    const response = await api.put(`/whistleblower/reports/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating report ${id} status:`, error);
    throw error;
  }
};

export const addReportNote = async (id, note) => {
  try {
    const response = await api.post(`/whistleblower/reports/${id}/notes`, { note });
    return response.data;
  } catch (error) {
    console.error(`Error adding note to report ${id}:`, error);
    throw error;
  }
};

export const getReportStatistics = async () => {
  try {
    const response = await api.get('/whistleblower/statistics');
    return response.data;
  } catch (error) {
    console.error('Error fetching report statistics:', error);
    throw error;
  }
};