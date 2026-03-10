import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ResultsSummary from '../components/analysis/ResultsSummary';
import RequirementCard from '../components/analysis/RequirementCard';
import { fetchAnalysis } from '../api/index.js';
import './ResultsPage.css';
import { exportToPDF } from '../services/exportService.js';

const FILTERS = ['All', 'With Issues', 'Ambiguous', 'Non-Testable', 'Incomplete', 'No Issues'];
const SORTS = [
  { value: 'index', label: 'Order' },
  { value: 'score-asc', label: 'Score ↑' },
  { value: 'score-desc', label: 'Score ↓' },
];

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSort, setActiveSort] = useState('index');

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

  const getFilteredRequirements = () => {
    let filtered = [...requirements];

    switch (activeFilter) {
      case 'With Issues':
        filtered = filtered.filter((r) => r.issues.length > 0);
        break;
      case 'Ambiguous':
        filtered = filtered.filter((r) => r.issues.some((i) => i.type === 'ambiguity'));
        break;
      case 'Non-Testable':
        filtered = filtered.filter((r) => r.issues.some((i) => i.type === 'non-testability'));
        break;
      case 'Incomplete':
        filtered = filtered.filter((r) => r.issues.some((i) => i.type === 'incompleteness'));
        break;
      case 'No Issues':
        filtered = filtered.filter((r) => r.issues.length === 0);
        break;
      default:
        break;
    }

    switch (activeSort) {
      case 'score-asc':
        filtered.sort((a, b) => a.requirementScore - b.requirementScore);
        break;
      case 'score-desc':
        filtered.sort((a, b) => b.requirementScore - a.requirementScore);
        break;
      default:
        filtered.sort((a, b) => a.index - b.index);
        break;
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="results-loading">
        <div className="loading-spinner"></div>
        <p>Loading analysis results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-error">
        <h2>Failed to load analysis</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/upload')}>Try Again</button>
      </div>
    );
  }

  if (!analysis) return null;

  const filteredRequirements = getFilteredRequirements();

  // Build summary data from real analysis
  const summaryData = {
    fileName: analysis.fileName,
    fileType: analysis.fileType,
    qualityScore: analysis.qualityScore,
    totalRequirements: analysis.totalRequirements,
    issuesSummary: analysis.issuesSummary,
    processingTime: analysis.processingTime,
    createdAt: analysis.createdAt,
  };

  return (
    <div className="results-page">
      <ResultsSummary analysis={summaryData} />

      <div className="results-controls">
        <div className="filter-bar">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="sort-bar">
          <span className="sort-label">Sort by:</span>
          {SORTS.map((sort) => (
            <button
              key={sort.value}
              className={`sort-btn ${activeSort === sort.value ? 'active' : ''}`}
              onClick={() => setActiveSort(sort.value)}
            >
              {sort.label}
            </button>
          ))}
        </div>
      </div>

      <div className="results-count">
        Showing {filteredRequirements.length} of {requirements.length} requirements
      </div>

      <div className="requirements-list">
        {filteredRequirements.map((req) => (
          <RequirementCard
            key={req._id}
            requirement={{
              id: req._id,
              index: req.index,
              text: req.originalText,
              score: req.requirementScore,
              issues: req.issues,
              suggestedRewrite: req.suggestedRewrite,
              rewriteExplanation: req.rewriteExplanation,
              hasIssues: req.issues.length > 0,
            }}
          />
        ))}
      </div>

      <div className="results-actions">
        <button
          className="btn-export"
          onClick={() => exportToPDF(analysis, requirements)}
        >
          ⬇ Export PDF Report
        </button>
        <button
          className="btn-dashboard"
          onClick={() => navigate(`/dashboard/${id}`)}
        >
          View Dashboard →
        </button>
      </div>
    </div>
  );
}