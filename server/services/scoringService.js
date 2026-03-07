// ════════════════════════════════════════
// QUALITY SCORING ENGINE
// ════════════════════════════════════════

// ── Severity penalty weights ──
const SEVERITY_PENALTIES = {
  high: 25,
  medium: 15,
  low: 8,
};

// ── Issue type weights (how much each type affects score) ──
const TYPE_WEIGHTS = {
  ambiguity: 1.0,
  'non-testability': 1.2, // non-testability is slightly more critical
  incompleteness: 1.1,
};

// ── Score label thresholds ──
const SCORE_LABELS = [
  { min: 90, max: 100, label: 'Excellent', color: '#22c55e' },
  { min: 75, max: 89,  label: 'Good',      color: '#84cc16' },
  { min: 60, max: 74,  label: 'Fair',       color: '#eab308' },
  { min: 40, max: 59,  label: 'Poor',       color: '#f97316' },
  { min: 0,  max: 39,  label: 'Critical',   color: '#ef4444' },
];

// ════════════════════════════════════════
// REQUIREMENT-LEVEL SCORING
// ════════════════════════════════════════

// ── Score a single requirement based on its issues ──
const scoreRequirement = (issues) => {
  if (!issues || issues.length === 0) {
    return {
      score: 100,
      penalty: 0,
      issueCount: 0,
      breakdown: { ambiguity: 0, nonTestability: 0, incompleteness: 0 },
    };
  }

  let totalPenalty = 0;
  const breakdown = { ambiguity: 0, nonTestability: 0, incompleteness: 0 };

  for (const issue of issues) {
    const severityPenalty = SEVERITY_PENALTIES[issue.severity] || 10;
    const typeWeight = TYPE_WEIGHTS[issue.type] || 1.0;
    const penalty = Math.round(severityPenalty * typeWeight);

    totalPenalty += penalty;

    // Track breakdown by type
    if (issue.type === 'ambiguity') breakdown.ambiguity++;
    else if (issue.type === 'non-testability') breakdown.nonTestability++;
    else if (issue.type === 'incompleteness') breakdown.incompleteness++;
  }

  // Cap penalty at 100 so score never goes below 0
  const cappedPenalty = Math.min(totalPenalty, 100);
  const score = Math.max(0, 100 - cappedPenalty);

  return {
    score,
    penalty: cappedPenalty,
    issueCount: issues.length,
    breakdown,
  };
};

// ════════════════════════════════════════
// DOCUMENT-LEVEL SCORING
// ════════════════════════════════════════

// ── Score the entire document based on all requirements ──
const scoreDocument = (analyzedRequirements) => {
  if (!analyzedRequirements || analyzedRequirements.length === 0) {
    return {
      overallScore: 0,
      label: 'Critical',
      color: '#ef4444',
      totalRequirements: 0,
      requirementsWithIssues: 0,
      cleanRequirements: 0,
      issuesSummary: { ambiguity: 0, nonTestability: 0, incompleteness: 0, total: 0 },
      averageIssuesPerRequirement: 0,
    };
  }

  let totalScore = 0;
  let requirementsWithIssues = 0;
  const issuesSummary = { ambiguity: 0, nonTestability: 0, incompleteness: 0, total: 0 };

  for (const req of analyzedRequirements) {
    totalScore += req.requirementScore;

    if (req.issueCount > 0) requirementsWithIssues++;

    issuesSummary.ambiguity += req.breakdown.ambiguity;
    issuesSummary.nonTestability += req.breakdown.nonTestability;
    issuesSummary.incompleteness += req.breakdown.incompleteness;
    issuesSummary.total += req.issueCount;
  }

  const overallScore = Math.round(totalScore / analyzedRequirements.length);
  const scoreInfo = getScoreLabel(overallScore);

  return {
    overallScore,
    label: scoreInfo.label,
    color: scoreInfo.color,
    totalRequirements: analyzedRequirements.length,
    requirementsWithIssues,
    cleanRequirements: analyzedRequirements.length - requirementsWithIssues,
    issuesSummary,
    averageIssuesPerRequirement: parseFloat(
      (issuesSummary.total / analyzedRequirements.length).toFixed(2)
    ),
  };
};

// ════════════════════════════════════════
// FULL PIPELINE
// ════════════════════════════════════════

// ── Run full analysis + scoring on a list of requirement texts ──
const analyzeAndScore = (requirementTexts, analyzeRequirement) => {
  const analyzedRequirements = requirementTexts.map((text, index) => {
    const analysis = analyzeRequirement(text);
    const scoring = scoreRequirement(analysis.allIssues);

    return {
      index: index + 1,
      text,
      issues: analysis.allIssues,
      issueCount: scoring.issueCount,
      requirementScore: scoring.score,
      penalty: scoring.penalty,
      breakdown: scoring.breakdown,
      hasIssues: scoring.issueCount > 0,
    };
  });

  const documentScore = scoreDocument(analyzedRequirements);

  return {
    requirements: analyzedRequirements,
    documentScore,
  };
};

// ════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════

const getScoreLabel = (score) => {
  for (const range of SCORE_LABELS) {
    if (score >= range.min && score <= range.max) {
      return { label: range.label, color: range.color };
    }
  }
  return { label: 'Critical', color: '#ef4444' };
};

const getScoreColor = (score) => getScoreLabel(score).color;

const getRecommendations = (documentScore) => {
  const recommendations = [];
  const { issuesSummary, overallScore, requirementsWithIssues, totalRequirements } = documentScore;

  if (overallScore < 60) {
    recommendations.push('Overall document quality is poor. A comprehensive review is strongly recommended before using these requirements.');
  }

  if (issuesSummary.ambiguity > 0) {
    recommendations.push(`${issuesSummary.ambiguity} ambiguity issue(s) detected. Replace vague terms with specific, measurable criteria.`);
  }

  if (issuesSummary.nonTestability > 0) {
    recommendations.push(`${issuesSummary.nonTestability} non-testability issue(s) detected. Add measurable acceptance criteria to each affected requirement.`);
  }

  if (issuesSummary.incompleteness > 0) {
    recommendations.push(`${issuesSummary.incompleteness} incompleteness issue(s) detected. Ensure all requirements specify actors, constraints, and error handling.`);
  }

  const issueRate = requirementsWithIssues / totalRequirements;
  if (issueRate > 0.7) {
    recommendations.push('More than 70% of requirements have issues. Consider rewriting the SRS document using IEEE 830 guidelines.');
  } else if (issueRate > 0.4) {
    recommendations.push('More than 40% of requirements have issues. Targeted revisions are recommended.');
  }

  if (overallScore >= 90) {
    recommendations.push('Excellent quality! This document meets high standards for clarity and testability.');
  }

  return recommendations;
};

module.exports = {
  scoreRequirement,
  scoreDocument,
  analyzeAndScore,
  getScoreLabel,
  getScoreColor,
  getRecommendations,
};