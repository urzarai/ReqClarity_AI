import './FilePreview.css';

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

function FilePreview({ file, onRemove, disabled }) {
  const isPDF = file.type === 'application/pdf';
  const icon = isPDF ? '📄' : '📝';
  const typeLabel = isPDF ? 'PDF Document' : 'Text File';

  return (
    <div className="file-preview">
      <div className="file-preview-icon">{icon}</div>

      <div className="file-preview-info">
        <p className="file-preview-name">{file.name}</p>
        <div className="file-preview-meta">
          <span className="file-preview-type">{typeLabel}</span>
          <span className="file-preview-dot">·</span>
          <span className="file-preview-size">{formatSize(file.size)}</span>
        </div>
      </div>

      <div className="file-preview-status">
        <span className="file-preview-ready">✓ Ready to analyze</span>
      </div>

      {!disabled && (
        <button
          className="file-preview-remove"
          onClick={onRemove}
          title="Remove file"
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default FilePreview;