const express = require('express');
const router = express.Router();

// GET /api/requirements/:analysisId — get all requirements for an analysis
router.get('/:analysisId', (req, res) => {
  res.json({
    success: true,
    message: `Get requirements for analysis ${req.params.analysisId} — logic coming on Day 16`,
    data: [],
  });
});

// PATCH /api/requirements/:id/accept — mark a suggestion as accepted
router.patch('/:id/accept', (req, res) => {
  res.json({
    success: true,
    message: `Accept suggestion for requirement ${req.params.id} — logic coming on Day 18`,
  });
});

module.exports = router;