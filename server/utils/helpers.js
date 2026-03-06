// Formats file size from bytes to human-readable
const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Sanitizes text — removes extra whitespace, weird characters
const sanitizeText = (text) => {
  return text
    .replace(/\r\n/g, '\n')       // normalize line endings
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')          // tabs to spaces
    .replace(/ +/g, ' ')          // multiple spaces to one
    .trim();
};

// Generates a simple summary label for a score
const getScoreLabel = (score) => {
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Critical';
};

// Gets color variable name based on score
const getScoreColor = (score) => {
  if (score >= 80) return 'var(--color-success)';
  if (score >= 60) return 'var(--color-warning)';
  return 'var(--color-danger)';
};

module.exports = { formatFileSize, sanitizeText, getScoreLabel, getScoreColor };