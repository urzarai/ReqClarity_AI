import { useState, useRef } from 'react';
import './DropZone.css';

const ACCEPTED_TYPES = {
  'application/pdf': '.pdf',
  'text/plain': '.txt',
};

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function DropZone({ onFileSelect, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState('');
  const inputRef = useRef(null);

  const validateFile = (file) => {
    if (!Object.keys(ACCEPTED_TYPES).includes(file.type)) {
      return 'Only PDF and TXT files are accepted.';
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File is too large. Maximum size is ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFile = (file) => {
    setDragError('');
    const error = validateFile(file);
    if (error) {
      setDragError(error);
      return;
    }
    onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleClick = () => {
    if (!disabled) inputRef.current.click();
  };

  return (
    <div className="dropzone-wrapper">
      <div
        className={[
          'dropzone',
          isDragging ? 'dropzone-dragging' : '',
          disabled ? 'dropzone-disabled' : '',
          dragError ? 'dropzone-error' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        aria-label="Upload file area"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleInputChange}
          className="dropzone-input"
          disabled={disabled}
        />

        <div className="dropzone-icon">
          {isDragging ? '📂' : '📁'}
        </div>

        <p className="dropzone-title">
          {isDragging
            ? 'Release to upload'
            : 'Drag & drop your SRS document here'}
        </p>
        <p className="dropzone-subtitle">
          or <span className="dropzone-browse">click to browse</span>
        </p>

        <div className="dropzone-accepted">
          <span className="dropzone-badge">PDF</span>
          <span className="dropzone-badge">TXT</span>
          <span className="dropzone-size">Max {MAX_SIZE_MB}MB</span>
        </div>
      </div>

      {dragError && (
        <div className="dropzone-error-msg">
          ⚠️ {dragError}
        </div>
      )}
    </div>
  );
}

export default DropZone;