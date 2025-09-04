// Data Export Utilities

/**
 * Convert array of objects to CSV format
 */
export const arrayToCSV = (data, columns = null) => {
  if (!data || data.length === 0) {
    return '';
  }

  // Use provided columns or extract from first object
  const headers = columns || Object.keys(data[0]);
  
  // Create CSV header
  const csvHeader = headers.join(',');
  
  // Create CSV rows
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  );
  
  return [csvHeader, ...csvRows].join('\n');
};

/**
 * Download data as CSV file
 */
export const downloadCSV = (data, filename = 'export.csv', columns = null) => {
  const csv = arrayToCSV(data, columns);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};

/**
 * Convert array of objects to JSON format
 */
export const downloadJSON = (data, filename = 'export.json') => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, filename);
};

/**
 * Generate and download PDF (requires a PDF library)
 * This is a simplified example - you might want to use libraries like jsPDF or Puppeteer
 */
export const generatePDF = async (data, options = {}) => {
  const {
    title = 'Export',
    filename = 'export.pdf',
    columns = null,
    pageOrientation = 'portrait'
  } = options;

  // This is a placeholder implementation
  // In a real app, you'd use a library like jsPDF or send to a backend service
  console.warn('PDF generation requires a PDF library. Falling back to CSV.');
  downloadCSV(data, filename.replace('.pdf', '.csv'), columns);
};

/**
 * Generic blob download function
 */
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Format data for export based on column configurations
 */
export const formatDataForExport = (data, columnConfig) => {
  if (!columnConfig) return data;
  
  return data.map(row => {
    const formattedRow = {};
    
    columnConfig.forEach(config => {
      const { key, label, formatter } = config;
      const value = row[key];
      
      // Use custom formatter if provided
      if (formatter && typeof formatter === 'function') {
        formattedRow[label || key] = formatter(value, row);
      } else {
        formattedRow[label || key] = value;
      }
    });
    
    return formattedRow;
  });
};

/**
 * Export options for common data types
 */
export const exportFormats = {
  CSV: 'csv',
  JSON: 'json',
  PDF: 'pdf'
};

/**
 * Main export function that handles different formats
 */
export const exportData = async (data, format, options = {}) => {
  const {
    filename = `export_${new Date().toISOString().slice(0, 10)}`,
    columns = null,
    title = 'Export'
  } = options;

  // Format data if column configuration is provided
  const formattedData = columns ? formatDataForExport(data, columns) : data;
  
  switch (format) {
    case exportFormats.CSV:
      downloadCSV(formattedData, `${filename}.csv`);
      break;
      
    case exportFormats.JSON:
      downloadJSON(formattedData, `${filename}.json`);
      break;
      
    case exportFormats.PDF:
      await generatePDF(formattedData, { 
        filename: `${filename}.pdf`, 
        title,
        columns: columns?.map(col => col.key) 
      });
      break;
      
    default:
      console.error(`Unsupported export format: ${format}`);
  }
};

/**
 * Hook for using export functionality in React components
 */
export const useDataExport = () => {
  const handleExport = async (data, format, options = {}) => {
    try {
      await exportData(data, format, options);
      return { success: true };
    } catch (error) {
      console.error('Export failed:', error);
      return { success: false, error: error.message };
    }
  };

  return { exportData: handleExport, exportFormats };
};

/**
 * Bulk export with progress tracking
 */
export const bulkExport = async (datasets, format, options = {}, onProgress = null) => {
  const results = [];
  const total = datasets.length;
  
  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];
    
    try {
      await exportData(dataset.data, format, {
        ...options,
        filename: dataset.filename || `export_${i + 1}`
      });
      
      results.push({ success: true, filename: dataset.filename });
    } catch (error) {
      results.push({ success: false, error: error.message, filename: dataset.filename });
    }
    
    // Report progress
    if (onProgress) {
      onProgress({
        completed: i + 1,
        total,
        percentage: Math.round(((i + 1) / total) * 100)
      });
    }
  }
  
  return results;
};