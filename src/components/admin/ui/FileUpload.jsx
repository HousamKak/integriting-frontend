import React, { useState, useRef, useCallback } from 'react';
import { Button } from './index';
import '../../../styles/components/ui/FileUpload.scss';

const FileUpload = ({
  accept = "*/*",
  multiple = false,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  onFilesSelected,
  onFilesRemoved,
  disabled = false,
  className = '',
  dragActiveText = "Drop files here...",
  dragInactiveText = "Drag & drop files here, or click to select",
  showFileList = true,
  showProgress = true,
  ...props
}) => {
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const validateFile = useCallback((file) => {
    const errors = [];
    
    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size exceeds ${formatFileSize(maxSize)}`);
    }
    
    // Check file type if accept is specified
    if (accept !== "*/*") {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.match(type.replace('*', '.*'));
      });
      
      if (!isValidType) {
        errors.push(`File type not supported. Accepted types: ${accept}`);
      }
    }
    
    return errors;
  }, [accept, maxSize]);

  const processFiles = useCallback((fileList) => {
    const newFiles = Array.from(fileList).map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      errors: validateFile(file),
      status: 'pending' // pending, uploading, completed, error
    }));

    // Check max files limit
    const totalFiles = multiple ? files.length + newFiles.length : newFiles.length;
    if (totalFiles > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
    setFiles(updatedFiles);
    onFilesSelected?.(updatedFiles);
  }, [files, multiple, maxFiles, validateFile, onFilesSelected]);

  const removeFile = useCallback((fileId) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
    onFilesRemoved?.(updatedFiles);
    
    // Remove from progress tracking
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  }, [files, onFilesRemoved]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (disabled) return;
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  }, [disabled, processFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled && !isDragActive) {
      setIsDragActive(true);
    }
  }, [disabled, isDragActive]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragActive(false);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset input value to allow selecting same file again
    e.target.value = '';
  }, [processFiles]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    const type = file.type.split('/')[0];
    switch (type) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'application':
        if (file.type.includes('pdf')) return '📄';
        if (file.type.includes('word')) return '📝';
        if (file.type.includes('excel') || file.type.includes('spreadsheet')) return '📊';
        if (file.type.includes('powerpoint') || file.type.includes('presentation')) return '📽️';
        return '📎';
      case 'text': return '📄';
      default: return '📎';
    }
  };

  const baseClass = 'admin-file-upload';
  const wrapperClasses = [
    baseClass,
    isDragActive && `${baseClass}--drag-active`,
    disabled && `${baseClass}--disabled`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses} {...props}>
      <div
        className={`${baseClass}__dropzone`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className={`${baseClass}__input`}
          disabled={disabled}
        />
        
        <div className={`${baseClass}__content`}>
          <div className={`${baseClass}__icon`}>
            {isDragActive ? '📂' : '📁'}
          </div>
          
          <div className={`${baseClass}__text`}>
            <p className={`${baseClass}__primary-text`}>
              {isDragActive ? dragActiveText : dragInactiveText}
            </p>
            
            <p className={`${baseClass}__secondary-text`}>
              {accept !== "*/*" && `Supported formats: ${accept}`}
              {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
              {multiple && ` • Max files: ${maxFiles}`}
            </p>
          </div>
          
          <Button
            variant="outline"
            size="small"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Browse Files
          </Button>
        </div>
      </div>

      {showFileList && files.length > 0 && (
        <div className={`${baseClass}__file-list`}>
          <h4 className={`${baseClass}__file-list-title`}>
            Selected Files ({files.length})
          </h4>
          
          {files.map((fileData) => (
            <div key={fileData.id} className={`${baseClass}__file-item`}>
              <div className={`${baseClass}__file-info`}>
                <span className={`${baseClass}__file-icon`}>
                  {getFileIcon(fileData.file)}
                </span>
                
                <div className={`${baseClass}__file-details`}>
                  <span className={`${baseClass}__file-name`}>
                    {fileData.name}
                  </span>
                  <span className={`${baseClass}__file-meta`}>
                    {formatFileSize(fileData.size)}
                  </span>
                  
                  {fileData.errors.length > 0 && (
                    <div className={`${baseClass}__file-errors`}>
                      {fileData.errors.map((error, index) => (
                        <span key={index} className={`${baseClass}__file-error`}>
                          ⚠️ {error}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {showProgress && uploadProgress[fileData.id] !== undefined && (
                <div className={`${baseClass}__progress`}>
                  <div 
                    className={`${baseClass}__progress-bar`}
                    style={{ width: `${uploadProgress[fileData.id]}%` }}
                  />
                </div>
              )}
              
              <button
                className={`${baseClass}__remove-btn`}
                onClick={() => removeFile(fileData.id)}
                aria-label={`Remove ${fileData.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;