import { useState } from 'react';
import IssueTag from './IssueTag';
import './RequirementCard.css';

function RequirementCard({ requirement }) {
  const [expanded, setExpanded] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [copied, setCopied] = useState(false);

  // Support both prop shapes (text/score from ResultsPage OR originalText/requirementScore from direct use)
  const text = requirement.text || requirement.originalText || '';
  const score = requirement.score ?? requirement.requirementScore ?? 0;
  const index = requirement.index;
  const { suggestedRewrite, rewriteExplanation, issues } = requirement;

  const hasIssues = issues && issues.length > 0;
  const hasSuggestion = !!suggestedRewrite;

  const getScoreConfig = (s) => {
    if (s >= 80) return { cls: 'score-good', color: '#10b981' };
    if (s >= 60) return { cls: 'score-fair', color: '#f59e0b' };
    if (s >= 40) return { cls: 'score-poor', color: '#ef4444' };
    return { cls: 'score-critical', color: '#7f1d1d' };
  };

  const { cls, color } = getScoreConfig(score);

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestedRewrite);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`req-card ${hasIssues ? 'req-card-has-issues' : 'req-card-clean'}`}>

      {/* ── Card Header ── */}
      <div className="req-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="req-card-header-left">
          <span className="req-index">REQ-{String(index).padStart(3, '0')}</span>
          {hasIssues ? (
            <div className="req-issue-tags">
              {issues.slice(0, 3).map((issue, i) => (
                <IssueTag key={i} type={issue.type} flaggedWord={issue.flaggedWord} />
              ))}
              {issues.length > 3 && (
                <span className="req-issue-overflow">+{issues.length - 3} more</span>
              )}
            </div>
          ) : (
            <span className="req-clean-badge">✓ No issues found</span>
          )}
        </div>

        <div className="req-card-header-right">
          <div className={`req-score ${cls}`} style={{ borderColor: color, color }}>
            {score}
          </div>
          <button
            className="req-expand-btn"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            <span className={`req-expand-icon ${expanded ? 'rotated' : ''}`}>▼</span>
          </button>
        </div>
      </div>

      {/* ── Original Text (always visible) ── */}
      <p className="req-original-text">{text}</p>

      {/* ── Expanded Content ── */}
      {expanded && (
        <div className="req-expanded">

          {/* Issue Details */}
          {hasIssues && (
            <div className="req-issues-detail">
              <h4 className="req-section-label">
                <span className="req-section-icon">🔍</span> Issues Detected
              </h4>
              <div className="req-issues-list">
                {issues.map((issue, i) => (
                  <div key={i} className={`req-issue-item req-issue-item--${issue.type}`}>
                    <div className="req-issue-header">
                      <IssueTag type={issue.type} />
                      <span className={`req-severity req-severity-${issue.severity}`}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="req-issue-description">{issue.description}</p>
                    <p className="req-issue-flagged">
                      Flagged: <code>"{issue.flaggedWord}"</code>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Suggestion */}
          {hasSuggestion && (
            <div className="req-suggestion">
              <div className="req-suggestion-header">
                <h4 className="req-section-label">
                  <span className="req-section-icon">🤖</span> AI Suggested Rewrite
                </h4>
                <div className="req-suggestion-actions">
                  <button
                    className="req-toggle-btn"
                    onClick={() => setShowSuggestion(!showSuggestion)}
                  >
                    {showSuggestion ? 'Hide' : 'Show suggestion'}
                  </button>
                </div>
              </div>

              {showSuggestion && (
                <div className="req-suggestion-content">
                  {/* Side by side comparison */}
                  <div className="req-comparison">
                    <div className="req-comparison-col req-comparison-original">
                      <div className="req-comparison-label">Original</div>
                      <p>{text}</p>
                    </div>
                    <div className="req-comparison-arrow">→</div>
                    <div className="req-comparison-col req-comparison-suggested">
                      <div className="req-comparison-label">Suggested</div>
                      <p>{suggestedRewrite}</p>
                    </div>
                  </div>

                  {/* Copy button */}
                  <button className="req-copy-btn" onClick={handleCopy}>
                    {copied ? '✓ Copied!' : '📋 Copy rewrite'}
                  </button>

                  {/* Explanation */}
                  {rewriteExplanation && (
                    <div className="req-explanation">
                      <span className="req-explanation-label">💡 Why this change?</span>
                      <p>{rewriteExplanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default RequirementCard;