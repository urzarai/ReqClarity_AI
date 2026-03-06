import './ReportSummaryPanel.css';

function ReportSummaryPanel({ analysis, requirements }) {
  const issueReqs = requirements.filter((r) => r.issues.length > 0);
  const cleanReqs = requirements.filter((r) => r.issues.length === 0);
  const withSuggestions = requirements.filter((r) => r.suggestedRewrite);
  const avgScore = Math.round(
    requirements.reduce((sum, r) => sum + r.requirementScore, 0) /
      requirements.length
  );

  const getRecommendations = () => {
    const recs = [];
    if (analysis.issuesSummary.ambiguity > 0)
      recs.push({
        icon: '🔀',
        text: `Replace vague terms in ${analysis.issuesSummary.ambiguity} requirement(s) with measurable, specific criteria.`,
        type: 'ambiguity',
      });
    if (analysis.issuesSummary.nonTestability > 0)
      recs.push({
        icon: '🧪',
        text: `Add testable acceptance criteria to ${analysis.issuesSummary.nonTestability} requirement(s) that currently lack verification metrics.`,
        type: 'testability',
      });
    if (analysis.issuesSummary.incompleteness > 0)
      recs.push({
        icon: '🧩',
        text: `Define missing actors, preconditions, or constraints in ${analysis.issuesSummary.incompleteness} incomplete requirement(s).`,
        type: 'incomplete',
      });
    if (recs.length === 0)
      recs.push({
        icon: '🎉',
        text: 'Excellent! No major issues detected. Your SRS is well-written.',
        type: 'success',
      });
    return recs;
  };

  return (
    <div className="report-summary-panel">

      {/* ── Key Metrics ── */}
      <div className="report-metrics">
        <div className="report-metric">
          <span className="report-metric-value">{issueReqs.length}</span>
          <span className="report-metric-label">Requirements with issues</span>
        </div>
        <div className="report-metric">
          <span className="report-metric-value">{cleanReqs.length}</span>
          <span className="report-metric-label">Clean requirements</span>
        </div>
        <div className="report-metric">
          <span className="report-metric-value">{withSuggestions.length}</span>
          <span className="report-metric-label">AI rewrites available</span>
        </div>
        <div className="report-metric">
          <span className="report-metric-value">{avgScore}</span>
          <span className="report-metric-label">Average req. score</span>
        </div>
      </div>

      {/* ── Recommendations ── */}
      <div className="report-recommendations">
        <h3 className="report-rec-title">Recommendations</h3>
        <div className="report-rec-list">
          {getRecommendations().map((rec, i) => (
            <div key={i} className={`report-rec-item report-rec-${rec.type}`}>
              <span className="report-rec-icon">{rec.icon}</span>
              <p className="report-rec-text">{rec.text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default ReportSummaryPanel;