import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultsSummary from '../components/analysis/ResultsSummary';
import RequirementCard from '../components/analysis/RequirementCard';
import './ResultsPage.css';

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
  {
    id: '1',
    index: 1,
    originalText:
      'The system shall respond quickly to all user requests at all times.',
    requirementScore: 35,
    issues: [
      {
        type: 'ambiguity',
        description: 'The word "quickly" is vague and does not specify a measurable response time.',
        flaggedWord: 'quickly',
        severity: 'high',
        detectedBy: 'rule-based',
      },
      {
        type: 'non-testability',
        description: '"At all times" cannot be verified without specific availability metrics.',
        flaggedWord: 'at all times',
        severity: 'medium',
        detectedBy: 'rule-based',
      },
    ],
    suggestedRewrite:
      'The system shall respond to all user requests within 2 seconds under normal load (up to 500 concurrent users) and within 5 seconds under peak load.',
    rewriteExplanation:
      'Replaced "quickly" with a specific time metric (2 seconds), added load conditions, and defined "at all times" with measurable thresholds.',
  },
  {
    id: '2',
    index: 2,
    originalText:
      'The user interface shall be intuitive and easy to use for all users.',
    requirementScore: 28,
    issues: [
      {
        type: 'non-testability',
        description: '"Intuitive" and "easy to use" are subjective and cannot be objectively tested.',
        flaggedWord: 'intuitive',
        severity: 'high',
        detectedBy: 'ai',
      },
      {
        type: 'ambiguity',
        description: '"All users" is vague — does not specify user roles or accessibility requirements.',
        flaggedWord: 'all users',
        severity: 'medium',
        detectedBy: 'rule-based',
      },
    ],
    suggestedRewrite:
      'The user interface shall achieve a System Usability Scale (SUS) score of at least 75 in usability testing with a sample of 20 representative users from each defined user role.',
    rewriteExplanation:
      'Replaced subjective terms with the SUS standard metric, specified a measurable threshold, and defined the user population clearly.',
  },
  {
    id: '3',
    index: 3,
    originalText:
      'Shall allow users to upload files to the system.',
    requirementScore: 45,
    issues: [
      {
        type: 'incompleteness',
        description: 'Missing subject — does not specify which actor (user role) can perform this action.',
        flaggedWord: null,
        severity: 'high',
        detectedBy: 'rule-based',
      },
      {
        type: 'incompleteness',
        description: 'Missing constraints — no file type, size limit, or storage destination specified.',
        flaggedWord: null,
        severity: 'medium',
        detectedBy: 'ai',
      },
    ],
    suggestedRewrite:
      'Authenticated users shall be able to upload PDF and TXT files up to 10MB in size to their personal workspace. The system shall reject files exceeding the size limit with an appropriate error message.',
    rewriteExplanation:
      'Added the actor (authenticated users), defined allowed file types, specified size constraints, and described error handling behavior.',
  },
  {
    id: '4',
    index: 4,
    originalText:
      'The system shall provide adequate security for all stored data.',
    requirementScore: 30,
    issues: [
      {
        type: 'ambiguity',
        description: '"Adequate security" is vague and does not reference any security standard.',
        flaggedWord: 'adequate',
        severity: 'high',
        detectedBy: 'rule-based',
      },
    ],
    suggestedRewrite:
      'The system shall encrypt all stored user data using AES-256 encryption and comply with OWASP Top 10 security guidelines.',
    rewriteExplanation:
      'Replaced "adequate security" with a specific encryption standard (AES-256) and a recognized security framework (OWASP Top 10).',
  },
  {
    id: '5',
    index: 5,
    originalText:
      'The system shall generate monthly reports for administrators.',
    requirementScore: 88,
    issues: [],
    suggestedRewrite: null,
    rewriteExplanation: null,
  },
  {
    id: '6',
    index: 6,
    originalText:
      'The system shall send email notifications to registered users within 5 minutes of a status change.',
    requirementScore: 92,
    issues: [],
    suggestedRewrite: null,
    rewriteExplanation: null,
  },
];

// ── Filter options ──
const FILTER_OPTIONS = [
  { value: 'all', label: 'All Requirements' },
  { value: 'issues', label: 'With Issues Only' },
  { value: 'ambiguity', label: 'Ambiguous' },
  { value: 'non-testability', label: 'Non-Testable' },
  { value: 'incompleteness', label: 'Incomplete' },
  { value: 'clean', label: 'No Issues' },
];

function ResultsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('index');

  const filteredRequirements = MOCK_REQUIREMENTS.filter((req) => {
    if (filter === 'all') return true;
    if (filter === 'issues') return req.issues.length > 0;
    if (filter === 'clean') return req.issues.length === 0;
    return req.issues.some((issue) => issue.type === filter);
  }).sort((a, b) => {
    if (sortBy === 'score-asc') return a.requirementScore - b.requirementScore;
    if (sortBy === 'score-desc') return b.requirementScore - a.requirementScore;
    return a.index - b.index;
  });

  return (
    <div className="results-page">
      <div className="results-container">

        {/* ── Page Header ── */}
        <div className="results-header">
          <div>
            <h1 className="results-title">Analysis Results</h1>
            <p className="results-subtitle">
              Review detected issues and AI-powered improvement suggestions
              for each requirement.
            </p>
          </div>
          <button
            className="results-export-btn"
            onClick={() => navigate('/dashboard/123')}
          >
            View Dashboard →
          </button>
        </div>

        {/* ── Summary Banner ── */}
        <ResultsSummary analysis={MOCK_ANALYSIS} />

        {/* ── Filter & Sort Bar ── */}
        <div className="results-controls">
          <div className="results-filters">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`filter-btn ${filter === opt.value ? 'filter-btn-active' : ''}`}
                onClick={() => setFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="results-sort">
            <label htmlFor="sort" className="sort-label">Sort by:</label>
            <select
              id="sort"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="index">Requirement order</option>
              <option value="score-asc">Score: Low to High</option>
              <option value="score-desc">Score: High to Low</option>
            </select>
          </div>
        </div>

        {/* ── Results Count ── */}
        <p className="results-count">
          Showing <strong>{filteredRequirements.length}</strong> of{' '}
          <strong>{MOCK_REQUIREMENTS.length}</strong> requirements
        </p>

        {/* ── Requirement Cards ── */}
        <div className="results-list">
          {filteredRequirements.length > 0 ? (
            filteredRequirements.map((req) => (
              <RequirementCard
                key={req.id}
                requirement={req}
                index={req.index}
              />
            ))
          ) : (
            <div className="results-empty">
              <span className="results-empty-icon">🔍</span>
              <p>No requirements match this filter.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ResultsPage;