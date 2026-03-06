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
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState(UPLOAD_STATES.IDLE);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

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

  const simulateProgress = () => {
    // Simulates upload progress bar — real progress wired on Day 16
    return new Promise((resolve) => {
      let current = 0;
      const interval = setInterval(() => {
        current += Math.random() * 15;
        if (current >= 100) {
          current = 100;
          clearInterval(interval);
          resolve();
        }
        setProgress(Math.min(Math.round(current), 100));
      }, 200);
    });
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setUploadState(UPLOAD_STATES.UPLOADING);
    setProgress(0);
    setErrorMsg('');

    try {
      // Simulate upload progress
      await simulateProgress();
      setUploadState(UPLOAD_STATES.PROCESSING);

      // TODO: Day 16 — replace this with real API call
      // const formData = new FormData();
      // formData.append('document', file);
      // const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // navigate(`/results/${data.analysisId}`);

      // Placeholder — simulates processing delay
      await new Promise((r) => setTimeout(r, 1500));
      setUploadState(UPLOAD_STATES.SUCCESS);

      // Will navigate to results page once backend is ready on Day 16
      // navigate(`/results/${analysisId}`);

    } catch (err) {
      setUploadState(UPLOAD_STATES.ERROR);
      setErrorMsg('Upload failed. Please check your connection and try again.');
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

          {/* Success State — temporary until Day 16 */}
          {uploadState === UPLOAD_STATES.SUCCESS && (
            <div className="upload-success">
              <span className="upload-success-icon">✅</span>
              <div>
                <p className="upload-success-title">Upload successful!</p>
                <p className="upload-success-subtitle">
                  Backend processing will be connected on Day 16. Results page coming soon.
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {uploadState === UPLOAD_STATES.ERROR && (
            <div className="upload-error">
              <span>⚠️</span>
              <p>{errorMsg}</p>
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
              <p>Claude AI generates context-aware suggestions for each flagged requirement.</p>
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