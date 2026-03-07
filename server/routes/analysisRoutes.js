const express = require('express');
const router = express.Router();
const { analyzeRequirement } = require('../services/detectionService');
const { analyzeAndScore, getRecommendations } = require('../services/scoringService');

// POST /api/analysis/test-detection — temporary test endpoint
router.post('/test-detection', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a "text" field in the request body.',
    });
  }

  const result = analyzeRequirement(text);

  res.json({
    success: true,
    text,
    issuesFound: result.totalIssues,
    breakdown: {
      ambiguity: result.ambiguity.length,
      nonTestability: result.nonTestability.length,
      incompleteness: result.incompleteness.length,
    },
    issues: result.allIssues,
  });
});

// GET /api/analysis — get all analyses (history)
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Get all analyses — logic coming on Day 20',
    data: [],
  });
});

// GET /api/analysis/:id — get a specific analysis by ID
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    message: `Get analysis ${req.params.id} — logic coming on Day 16`,
    data: null,
  });
});

// POST /api/analysis — create/trigger a new analysis
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Trigger analysis — logic coming on Day 16',
    data: null,
  });
});

// DELETE /api/analysis/:id — delete an analysis
router.delete('/:id', (req, res) => {
  res.json({
    success: true,
    message: `Delete analysis ${req.params.id} — logic coming on Day 21`,
  });
});

// POST /api/analysis/test-scoring — temporary test endpoint
router.post('/test-scoring', (req, res) => {
  const { requirements } = req.body;

  if (!requirements || !Array.isArray(requirements) || requirements.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a "requirements" array in the request body.',
    });
  }

  const result = analyzeAndScore(requirements, analyzeRequirement);
  const recommendations = getRecommendations(result.documentScore);

  res.json({
    success: true,
    documentScore: result.documentScore,
    recommendations,
    requirements: result.requirements.map((r) => ({
      index: r.index,
      text: r.text,
      score: r.requirementScore,
      issueCount: r.issueCount,
      issues: r.issues,
    })),
  });
});
module.exports = router;