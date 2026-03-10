import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAnalysis } from '../api/index.js';
import { exportRewrittenPDF } from '../services/exportService.js';
import './RewritePage.css';

export default function RewritePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [accepted, setAccepted] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchAnalysis(id);
        const reqs = data.data.requirements;
        setAnalysis(data.data.analysis);
        setRequirements(reqs);

        // Default: accept all rewrites that have a suggestion
        const defaults = {};
        reqs.forEach((r) => {
          if (r.suggestedRewrite) defaults[r._id] = true;
        });
        setAccepted(defaults);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const toggleAccepted = (reqId) => {
    setAccepted((prev) => ({ ...prev, [reqId]: !prev[reqId] }));
  };

  const acceptAll = () => {
    const all = {};
    requirements.forEach((r) => { if (r.suggestedRewrite) all[r._id] = true; });
    setAccepted(all);
  };

  const rejectAll = () => {
    const none = {};
    requirements.forEach((r) => { if (r.suggestedRewrite) none[r._id] = false; });
    setAccepted(none);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      // Build final requirements list with accepted rewrites applied
      const finalRequirements = requirements.map((r) => ({
        index: r.index,
        originalText: r.originalText,
        finalText: r.suggestedRewrite && accepted[r._id]
          ? r.suggestedRewrite
          : r.originalText,
        wasRewritten: !!(r.suggestedRewrite && accepted[r._id]),
        issues: r.issues,
      }));
      exportRewrittenPDF(analysis, finalRequirements);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="rewrite-loading">
        <div className="loading-spinner"></div>
        <p>Loading requirements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rewrite-error">
        <h2>Failed to load</h2>
        <p>{error}</p>
        <button onClick={() => navigate(`/results/${id}`)}>Back to Results</button>
      </div>
    );
  }

  const rewritableCount = requirements.filter((r) => r.suggestedRewrite).length;
  const acceptedCount = Object.values(accepted).filter(Boolean).length;

  return (
    <div className="rewrite-page">
      <div className="rewrite-container">

        {/* ── Header ── */}
        <div className="rewrite-header">
          <div>
            <h1 className="rewrite-title">Rewritten SRS Document</h1>
            <p className="rewrite-subtitle">
              {analysis.fileName} · {rewritableCount} AI rewrites available ·{' '}
              <strong>{acceptedCount} accepted</strong>
            </p>
          </div>
          <button className="btn-back" onClick={() => navigate(`/results/${id}`)}>
            ← Back to Results
          </button>
        </div>

        {/* ── Controls ── */}
        <div className="rewrite-controls">
          <div className="rewrite-controls-left">
            <button className="rewrite-bulk-btn" onClick={acceptAll}>
              ✓ Accept All Rewrites
            </button>
            <button className="rewrite-bulk-btn secondary" onClick={rejectAll}>
              ✕ Keep All Originals
            </button>
          </div>
          <button
            className="btn-export-rewritten"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? 'Generating...' : '⬇ Download Rewritten SRS'}
          </button>
        </div>

        {/* ── Progress Bar ── */}
        <div className="rewrite-progress-bar">
          <div className="rewrite-progress-info">
            <span>{acceptedCount} of {rewritableCount} rewrites accepted</span>
            <span>{requirements.length - rewritableCount} requirements have no issues</span>
          </div>
          <div className="rewrite-progress-track">
            <div
              className="rewrite-progress-fill"
              style={{ width: rewritableCount > 0 ? `${(acceptedCount / rewritableCount) * 100}%` : '100%' }}
            />
          </div>
        </div>

        {/* ── Requirements List ── */}
        <div className="rewrite-list">
          {requirements.map((req) => {
            const hasRewrite = !!req.suggestedRewrite;
            const isAccepted = accepted[req._id];
            const finalText = hasRewrite && isAccepted ? req.suggestedRewrite : req.originalText;

            return (
              <div
                key={req._id}
                className={`rewrite-card ${
                  !hasRewrite ? 'rewrite-card--clean' :
                  isAccepted ? 'rewrite-card--accepted' : 'rewrite-card--rejected'
                }`}
              >
                {/* Card Header */}
                <div className="rewrite-card-header">
                  <div className="rewrite-card-header-left">
                    <span className="rewrite-req-index">
                      REQ-{String(req.index).padStart(3, '0')}
                    </span>
                    {!hasRewrite && (
                      <span className="rewrite-badge clean">✓ No issues</span>
                    )}
                    {hasRewrite && isAccepted && (
                      <span className="rewrite-badge accepted">✓ Rewrite accepted</span>
                    )}
                    {hasRewrite && !isAccepted && (
                      <span className="rewrite-badge rejected">↩ Keeping original</span>
                    )}
                  </div>

                  {hasRewrite && (
                    <button
                      className={`rewrite-toggle-btn ${isAccepted ? 'accepted' : 'rejected'}`}
                      onClick={() => toggleAccepted(req._id)}
                    >
                      {isAccepted ? '✕ Keep Original Instead' : '✓ Use AI Rewrite'}
                    </button>
                  )}
                </div>

                {/* Final Text (what will be in the document) */}
                <div className="rewrite-final-text">
                  <p>{finalText}</p>
                </div>

                {/* Show comparison if has rewrite */}
                {hasRewrite && (
                  <div className="rewrite-comparison">
                    <div className="rewrite-comparison-col original">
                      <span className="rewrite-col-label">Original</span>
                      <p>{req.originalText}</p>
                    </div>
                    <div className="rewrite-comparison-arrow">→</div>
                    <div className="rewrite-comparison-col suggested">
                      <span className="rewrite-col-label">AI Rewrite</span>
                      <p>{req.suggestedRewrite}</p>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* ── Bottom Export ── */}
        <div className="rewrite-footer">
          <button
            className="btn-export-rewritten large"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? 'Generating PDF...' : '⬇ Download Rewritten SRS as PDF'}
          </button>
          <p className="rewrite-footer-note">
            {acceptedCount} rewrites applied · {rewritableCount - acceptedCount} kept original ·{' '}
            {requirements.length - rewritableCount} unchanged
          </p>
        </div>

      </div>
    </div>
  );
}