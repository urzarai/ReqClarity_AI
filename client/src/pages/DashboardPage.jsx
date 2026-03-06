import ScoreGauge from '../components/report/ScoreGauge';
import IssueBreakdownChart from '../components/report/IssueBreakdownChart';
import RequirementScoreChart from '../components/report/RequirementScoreChart';
import ReportSummaryPanel from '../components/report/ReportSummaryPanel';
import './DashboardPage.css';

// ── Mock data — replaced with real API data on Day 16 ──
const MOCK_ANALYSIS = {
  fileName: 'SRS_Library_System_v1.2.pdf',
  qualityScore: 54,
  totalRequirements: 6,
  processingTime: 3420,
  issuesSummary: {
    ambiguity: 3,
    nonTestability: 2,
    incompleteness: 2,
    total: 7,
  },
};

const MOCK_REQUIREMENTS = [
  { id: '1', index: 1, requirementScore: 35, issues: [{ type: 'ambiguity' }, { type: 'non-testability' }], suggestedRewrite: 'suggested' },
  { id: '2', index: 2, requirementScore: 28, issues: [{ type: 'non-testability' }, { type: 'ambiguity' }], suggestedRewrite: 'suggested' },
  { id: '3', index: 3, requirementScore: 45, issues: [{ type: 'incompleteness' }, { type: 'incompleteness' }], suggestedRewrite: 'suggested' },
  { id: '4', index: 4, requirementScore: 30, issues: [{ type: 'ambiguity' }], suggestedRewrite: 'suggested' },
  { id: '5', index: 5, requirementScore: 88, issues: [], suggestedRewrite: null },
  { id: '6', index: 6, requirementScore: 92, issues: [], suggestedRewrite: null },
];

const PIE_DATA = [
  { name: 'Ambiguous', value: 3 },
  { name: 'Non-Testable', value: 2 },
  { name: 'Incomplete', value: 2 },
];

const BAR_DATA = MOCK_REQUIREMENTS.map((r) => ({
  name: `REQ-${String(r.index).padStart(3, '0')}`,
  score: r.requirementScore,
}));

function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* ── Page Header ── */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Quality Dashboard</h1>
            <p className="dashboard-subtitle">
              Visual breakdown of your SRS document quality analysis.
            </p>
          </div>
          <div className="dashboard-header-actions">
            <button className="dashboard-btn-secondary">
              View Results →
            </button>
            <button className="dashboard-btn-primary">
              Export PDF Report
            </button>
          </div>
        </div>

        {/* ── File Info Bar ── */}
        <div className="dashboard-file-bar">
          <span className="dashboard-file-icon">📄</span>
          <div>
            <p className="dashboard-file-name">{MOCK_ANALYSIS.fileName}</p>
            <p className="dashboard-file-meta">
              {MOCK_ANALYSIS.totalRequirements} requirements analyzed ·{' '}
              {MOCK_ANALYSIS.processingTime}ms processing time
            </p>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="dashboard-grid">

          {/* Score Gauge Card */}
          <div className="dashboard-card dashboard-card-gauge">
            <h2 className="dashboard-card-title">Quality Score</h2>
            <ScoreGauge score={MOCK_ANALYSIS.qualityScore} />
          </div>

          {/* Issue Breakdown Card */}
          <div className="dashboard-card dashboard-card-pie">
            <h2 className="dashboard-card-title">Issue Breakdown</h2>
            <p className="dashboard-card-subtitle">
              Distribution of detected defect types
            </p>
            <IssueBreakdownChart data={PIE_DATA} />
          </div>

          {/* Summary Panel Card */}
          <div className="dashboard-card dashboard-card-summary">
            <h2 className="dashboard-card-title">Analysis Summary</h2>
            <p className="dashboard-card-subtitle">
              Key metrics and recommendations
            </p>
            <ReportSummaryPanel
              analysis={MOCK_ANALYSIS}
              requirements={MOCK_REQUIREMENTS}
            />
          </div>

          {/* Requirement Scores Card */}
          <div className="dashboard-card dashboard-card-bar">
            <h2 className="dashboard-card-title">Per-Requirement Scores</h2>
            <p className="dashboard-card-subtitle">
              Individual quality score for each requirement
            </p>
            <RequirementScoreChart data={BAR_DATA} />
          </div>

        </div>

      </div>
    </div>
  );
}

export default DashboardPage;