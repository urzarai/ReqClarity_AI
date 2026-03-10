import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HistoryPage.css';

const STORAGE_KEY = 'reqclarity_history';

const getScoreColor = (score) => {
  if (score >= 90) return '#22c55e';
  if (score >= 75) return '#84cc16';
  if (score >= 60) return '#eab308';
  if (score >= 40) return '#f97316';
  return '#ef4444';
};

const getScoreLabel = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Critical';
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    setHistory(stored);
  }, []);

  const handleClearHistory = () => {
    if (confirmClear) {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const handleRemoveItem = (id) => {
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setHistory(updated);
  };

  return (
    <div className="history-page">
      <div className="history-container">

        {/* ── Header ── */}
        <div className="history-header">
          <div>
            <h1 className="history-title">Analysis History</h1>
            <p className="history-subtitle">
              Your past analyses are stored locally in your browser.
              {history.length > 0 && ` ${history.length} analysis${history.length > 1 ? 'es' : ''} found.`}
            </p>
          </div>
          {history.length > 0 && (
            <button
              className={`history-clear-btn ${confirmClear ? 'confirm' : ''}`}
              onClick={handleClearHistory}
            >
              {confirmClear ? '⚠️ Click again to confirm' : 'Clear History'}
            </button>
          )}
        </div>

        {/* ── Empty State ── */}
        {history.length === 0 && (
          <div className="history-empty">
            <span className="history-empty-icon">📂</span>
            <h3>No analyses yet</h3>
            <p>Upload an SRS document to get started. Your analyses will appear here.</p>
            <button
              className="history-upload-btn"
              onClick={() => navigate('/upload')}
            >
              Analyze a Document →
            </button>
          </div>
        )}

        {/* ── History List ── */}
        {history.length > 0 && (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-card">

                {/* Left — file info */}
                <div className="history-card-left">
                  <div className="history-file-icon">📄</div>
                  <div className="history-file-info">
                    <p className="history-file-name">{item.fileName}</p>
                    <p className="history-file-date">{formatDate(item.date)}</p>
                  </div>
                </div>

                {/* Center — score badge */}
                <div className="history-card-center">
                  <div
                    className="history-score-badge"
                    style={{
                      color: getScoreColor(item.score),
                      borderColor: getScoreColor(item.score),
                      backgroundColor: `${getScoreColor(item.score)}15`,
                    }}
                  >
                    <span className="history-score-number">{item.score}</span>
                    <span className="history-score-label">{getScoreLabel(item.score)}</span>
                  </div>
                </div>

                {/* Right — actions */}
                <div className="history-card-right">
                  <button
                    className="history-action-btn primary"
                    onClick={() => navigate(`/results/${item.id}`)}
                  >
                    View Results
                  </button>
                  <button
                    className="history-action-btn secondary"
                    onClick={() => navigate(`/dashboard/${item.id}`)}
                  >
                    Dashboard
                  </button>
                  <button
                    className="history-remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                    title="Remove from history"
                  >
                    ✕
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}