import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScoreGauge from '../components/report/ScoreGauge';
import IssueBreakdownChart from '../components/report/IssueBreakdownChart';
import RequirementScoreChart from '../components/report/RequirementScoreChart';
import ReportSummaryPanel from '../components/report/ReportSummaryPanel';
import { fetchAnalysis } from '../api/index.js';
import './DashboardPage.css';

export default function DashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        const data = await fetchAnalysis(id);
        setAnalysis(data.data.analysis);
        setRequirements(data.data.requirements);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Failed to load dashboard</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/upload')}>Try Again</button>
      </div>
    );
  }

  if (!analysis) return null;

  // Build chart data from real requirements
  const issueBreakdown = [
    { name: 'Ambiguous', value: analysis.issuesSummary.ambiguity },
    { name: 'Non-Testable', value: analysis.issuesSummary.nonTestability },
    { name: 'Incomplete', value: analysis.issuesSummary.incompleteness },
  ];

  const requirementScores = requirements.map((r) => ({
    name: `R${r.index}`,
    score: r.requirementScore,
    text: r.originalText?.substring(0, 40) + '...',
    issueCount: r.issues.length,
  }));

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Analysis Dashboard</h1>
          <p className="dashboard-subtitle">{analysis.fileName}</p>
        </div>
        <button
          className="btn-back"
          onClick={() => navigate(`/results/${id}`)}
        >
          ← Back to Results
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <ScoreGauge score={analysis.qualityScore} />
        </div>

        <div className="dashboard-card">
          <IssueBreakdownChart data={issueBreakdown} />
        </div>

        <div className="dashboard-card dashboard-card--wide">
          <RequirementScoreChart data={requirementScores} />
        </div>

        <div className="dashboard-card">
          <ReportSummaryPanel analysis={analysis} requirements={requirements} />
        </div>
      </div>
    </div>
  );
}