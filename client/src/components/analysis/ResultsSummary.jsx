import './ResultsSummary.css';

function ResultsSummary({ analysis }) {
  const { fileName, fileType, qualityScore, totalRequirements, issuesSummary, processingTime, createdAt } = analysis;

  const getScoreConfig = (score) => {
    if (score >= 90) return { label: 'Excellent', cls: 'summary-score-excellent', color: '#22c55e' };
    if (score >= 75) return { label: 'Good', cls: 'summary-score-good', color: '#84cc16' };
    if (score >= 60) return { label: 'Fair', cls: 'summary-score-fair', color: '#eab308' };
    if (score >= 40) return { label: 'Poor', cls: 'summary-score-poor', color: '#f97316' };
    return { label: 'Critical', cls: 'summary-score-critical', color: '#ef4444' };
  };

  const { label, cls, color } = getScoreConfig(qualityScore);

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  // processingTime may be in ms (number) or seconds (string like "5.79")
  const formatTime = (t) => {
    if (!t) return '';
    const num = parseFloat(t);
    if (num > 100) return `${(num / 1000).toFixed(1)}s`; // came as ms
    return `${num}s`;
  };

  return (
    <div className="results-summary">

      {/* ── Score Block ── */}
      <div className={`summary-score-block ${cls}`} style={{ borderColor: color }}>
        <div className="summary-score-number" style={{ color }}>{qualityScore}</div>
        <div className="summary-score-info">
          <span className="summary-score-label" style={{ color }}>{label}</span>
          <span className="summary-score-desc">Quality Score</span>
        </div>
      </div>

      <div className="summary-divider" />

      {/* ── File Info ── */}
      <div className="summary-file">
        <span className="summary-file-icon">
          {fileType === 'pdf' ? '📕' : '📄'}
        </span>
        <div>
          <p className="summary-file-name">{fileName}</p>
          <p className="summary-file-meta">
            {totalRequirements} requirements · {formatTime(processingTime)}
            {createdAt && <> · {formatDate(createdAt)}</>}
          </p>
        </div>
      </div>

      <div className="summary-divider" />

      {/* ── Issue Counts ── */}
      <div className="summary-issues">
        <div className="summary-issue-item summary-issue-ambiguity">
          <span className="summary-issue-count">{issuesSummary.ambiguity}</span>
          <span className="summary-issue-label">Ambiguous</span>
        </div>
        <div className="summary-issue-item summary-issue-testability">
          <span className="summary-issue-count">{issuesSummary.nonTestability}</span>
          <span className="summary-issue-label">Non-Testable</span>
        </div>
        <div className="summary-issue-item summary-issue-incompleteness">
          <span className="summary-issue-count">{issuesSummary.incompleteness}</span>
          <span className="summary-issue-label">Incomplete</span>
        </div>
        <div className="summary-issue-item summary-issue-total">
          <span className="summary-issue-count">{issuesSummary.total}</span>
          <span className="summary-issue-label">Total Issues</span>
        </div>
      </div>

    </div>
  );
}

export default ResultsSummary;