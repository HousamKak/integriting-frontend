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

export const getWhistleblowerReports = async () => {
  try {
    const response = await api.get('/whistleblower/reports');
    return response.data;
  } catch (error) {
    console.error('Error fetching whistleblower reports:', error);
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
