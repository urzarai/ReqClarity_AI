import { useState } from 'react';
import IssueTag from './IssueTag';
import './RequirementCard.css';

function RequirementCard({ requirement, index }) {
  const [expanded, setExpanded] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const { originalText, suggestedRewrite, rewriteExplanation, issues, requirementScore } = requirement;

  const hasIssues = issues && issues.length > 0;
  const hasSuggestion = suggestedRewrite && suggestedRewrite !== null;

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-good';
    if (score >= 60) return 'score-fair';
    return 'score-poor';
  };

  return (
    <div className={`req-card ${hasIssues ? 'req-card-has-issues' : 'req-card-clean'}`}>

      {/* ── Card Header ── */}
      <div className="req-card-header">
        <div className="req-card-header-left">
          <span className="req-index">REQ-{String(index).padStart(3, '0')}</span>
          {hasIssues ? (
            <div className="req-issue-tags">
              {issues.map((issue, i) => (
                <IssueTag
                  key={i}
                  type={issue.type}
                  flaggedWord={issue.flaggedWord}
                />
              ))}
            </div>
          ) : (
            <span className="req-clean-badge">✓ No issues found</span>
          )}
        </div>

        <div className="req-card-header-right">
          <div className={`req-score ${getScoreClass(requirementScore)}`}>
            {requirementScore}
          </div>
          <button
            className="req-expand-btn"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* ── Original Text (always visible) ── */}
      <p className="req-original-text">{originalText}</p>

      {/* ── Expanded Content ── */}
      {expanded && (
        <div className="req-expanded">

          {/* Issue Details */}
          {hasIssues && (
            <div className="req-issues-detail">
              <h4 className="req-section-label">Issues Detected</h4>
              <div className="req-issues-list">
                {issues.map((issue, i) => (
                  <div key={i} className="req-issue-item">
                    <IssueTag type={issue.type} />
                    <div className="req-issue-info">
                      <p className="req-issue-description">{issue.description}</p>
                      <div className="req-issue-meta">
                        <span className={`req-severity req-severity-${issue.severity}`}>
                          {issue.severity} severity
                        </span>
                        <span className="req-detected-by">
                          Detected by: {issue.detectedBy}
                        </span>
                      </div>
                    </div>
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
                  🤖 AI Suggested Rewrite
                </h4>
                <button
                  className="req-toggle-btn"
                  onClick={() => setShowSuggestion(!showSuggestion)}
                >
                  {showSuggestion ? 'Hide suggestion' : 'Show suggestion'}
                </button>
              </div>

              {showSuggestion && (
                <div className="req-suggestion-content">
                  {/* Side by side comparison */}
                  <div className="req-comparison">
                    <div className="req-comparison-col req-comparison-original">
                      <div className="req-comparison-label">Original</div>
                      <p>{originalText}</p>
                    </div>
                    <div className="req-comparison-arrow">→</div>
                    <div className="req-comparison-col req-comparison-suggested">
                      <div className="req-comparison-label">Suggested</div>
                      <p>{suggestedRewrite}</p>
                    </div>
                  </div>

                  {/* Explanation */}
                  {rewriteExplanation && (
                    <div className="req-explanation">
                      <span className="req-explanation-label">Why this change?</span>
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