import './ResultsSummary.css';

function ResultsSummary({ analysis }) {
  const { fileName, qualityScore, totalRequirements, issuesSummary, processingTime } = analysis;

  const getScoreLabel = (score) => {
    if (score >= 80) return { label: 'Good', className: 'summary-score-good' };
    if (score >= 60) return { label: 'Fair', className: 'summary-score-fair' };
    if (score >= 40) return { label: 'Poor', className: 'summary-score-poor' };
    return { label: 'Critical', className: 'summary-score-critical' };
  };

  const { label, className } = getScoreLabel(qualityScore);

  return (
    <div className="results-summary">

      {/* ── Score Block ── */}
      <div className={`summary-score-block ${className}`}>
        <div className="summary-score-number">{qualityScore}</div>
        <div className="summary-score-info">
          <span className="summary-score-label">{label}</span>
          <span className="summary-score-desc">Quality Score</span>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="summary-divider"></div>

      {/* ── File Info ── */}
      <div className="summary-file">
        <span className="summary-file-icon">📄</span>
        <div>
          <p className="summary-file-name">{fileName}</p>
          <p className="summary-file-meta">
            {totalRequirements} requirements · {processingTime}ms
          </p>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="summary-divider"></div>

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