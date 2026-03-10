import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DropZone from '../components/upload/DropZone';
import FilePreview from '../components/upload/FilePreview';
import './UploadPage.css';

const UPLOAD_STATES = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error',
};

function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState(UPLOAD_STATES.IDLE);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setUploadState(UPLOAD_STATES.IDLE);
    setErrorMsg('');
    setProgress(0);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadState(UPLOAD_STATES.IDLE);
    setErrorMsg('');
    setProgress(0);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setUploadState(UPLOAD_STATES.UPLOADING);
    setProgress(20);

    try {
      setProgress(40);
      setUploadState(UPLOAD_STATES.PROCESSING);

      const { uploadDocument } = await import('../api/index.js');
      const data = await uploadDocument(file);

      setProgress(100);

      // Save analysisId to localStorage for history
      const history = JSON.parse(localStorage.getItem('reqclarity_history') || '[]');
      history.unshift({
        id: data.analysisId,
        fileName: file.name,
        score: data.documentScore.overallScore,
        label: data.documentScore.label,
        date: new Date().toISOString(),
      });
      localStorage.setItem('reqclarity_history', JSON.stringify(history.slice(0, 50)));

      setUploadState(UPLOAD_STATES.SUCCESS);

      setTimeout(() => {
        navigate(`/results/${data.analysisId}`);
      }, 800);

    } catch (error) {
      console.error('Upload error:', error);
      setErrorMsg(error.message || 'Something went wrong. Please try again.');
      setUploadState(UPLOAD_STATES.ERROR);
      setProgress(0);
    }
  };

  const isLoading =
    uploadState === UPLOAD_STATES.UPLOADING ||
    uploadState === UPLOAD_STATES.PROCESSING;

  return (
    <div className="upload-page">
      <div className="upload-container">

        {/* ── Page Header ── */}
        <div className="upload-header">
          <h1 className="upload-title">Upload Your SRS Document</h1>
          <p className="upload-subtitle">
            Upload a PDF or plain text file of your Software Requirements
            Specification. ReqClarity AI will analyze it for quality defects
            and generate improvement suggestions.
          </p>
        </div>

        {/* ── Upload Card ── */}
        <div className="upload-card">

          {/* Drop Zone or File Preview */}
          {!file ? (
            <DropZone onFileSelect={handleFileSelect} disabled={isLoading} />
          ) : (
            <FilePreview
              file={file}
              onRemove={handleRemoveFile}
              disabled={isLoading}
            />
          )}

          {/* Progress Bar */}
          {uploadState === UPLOAD_STATES.UPLOADING && (
            <div className="upload-progress">
              <div className="progress-header">
                <span className="progress-label">Uploading...</span>
                <span className="progress-percent">{progress}%</span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Processing State */}
          {uploadState === UPLOAD_STATES.PROCESSING && (
            <div className="upload-processing">
              <div className="processing-spinner"></div>
              <div className="processing-text">
                <p className="processing-title">Analyzing your document...</p>
                <p className="processing-subtitle">
                  Running rule-based detection and AI analysis. This may take a moment.
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {uploadState === UPLOAD_STATES.SUCCESS && (
            <div className="upload-success">
              <span className="upload-success-icon">✅</span>
              <div>
                <p className="upload-success-title">Analysis complete!</p>
                <p className="upload-success-subtitle">
                  Redirecting to your results...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {uploadState === UPLOAD_STATES.ERROR && (
            <div className="upload-error">
              <span>⚠️</span>
              <p>{errorMsg || 'Something went wrong. Please try again.'}</p>
            </div>
          )}

          {/* Analyze Button */}
          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={!file || isLoading}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner"></span>
                {uploadState === UPLOAD_STATES.UPLOADING
                  ? 'Uploading...'
                  : 'Analyzing...'}
              </>
            ) : (
              'Analyze Document →'
            )}
          </button>

          {/* Helper Note */}
          {!file && (
            <p className="upload-helper-note">
              Your document is processed securely and never shared with third parties.
            </p>
          )}
        </div>

        {/* ── Info Cards ── */}
        <div className="upload-info-grid">
          <div className="upload-info-card">
            <span className="upload-info-icon">🔍</span>
            <div>
              <h4>What we detect</h4>
              <p>Ambiguity, non-testability, and incompleteness in every requirement.</p>
            </div>
          </div>
          <div className="upload-info-card">
            <span className="upload-info-icon">🤖</span>
            <div>
              <h4>AI-powered rewrites</h4>
              <p>Gemini AI generates context-aware suggestions for each flagged requirement.</p>
            </div>
          </div>
          <div className="upload-info-card">
            <span className="upload-info-icon">⚡</span>
            <div>
              <h4>Fast results</h4>
              <p>100 requirements analyzed in under 30 seconds with a full quality report.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default UploadPage;