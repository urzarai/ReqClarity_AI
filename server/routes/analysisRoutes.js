const express = require('express');
const router = express.Router();
const { analyzeRequirement } = require('../services/detectionService');
const { analyzeAndScore, getRecommendations } = require('../services/scoringService');
const { generateRewrite } = require('../services/aiService');
const Analysis = require('../models/Analysis');
const Requirement = require('../models/Requirement');

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

// POST /api/analysis/test-ai — temporary test endpoint
router.post('/test-ai', async (req, res) => {
  const { text, issues } = req.body;

  if (!text || !issues) {
    return res.status(400).json({
      success: false,
      error: 'Please provide "text" and "issues" fields.',
    });
  }

  console.log(`🤖 Testing AI rewrite for: "${text.substring(0, 50)}..."`);

  const result = await generateRewrite(text, issues);

  res.json({
    success: true,
    original: text,
    aiResult: result,
  });
});

// GET /api/analysis — get all analyses
router.get('/', async (req, res) => {
  try {
    const analyses = await Analysis.find()
      .sort({ createdAt: -1 })
      .select('-originalText'); // exclude large text field

    res.json({ success: true, data: analyses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analysis/:id — get a specific analysis
router.get('/:id', async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) return res.status(404).json({ success: false, error: 'Analysis not found.' });

    const requirements = await Requirement.find({ analysisId: req.params.id }).sort({ index: 1 });

    res.json({ success: true, data: { analysis, requirements } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/analysis — create/trigger a new analysis
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Trigger analysis — handled via /api/upload',
    data: null,
  });
});

// DELETE /api/analysis/:id
router.delete('/:id', async (req, res) => {
  try {
    await Analysis.findByIdAndDelete(req.params.id);
    await Requirement.deleteMany({ analysisId: req.params.id });
    res.json({ success: true, message: 'Analysis deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;