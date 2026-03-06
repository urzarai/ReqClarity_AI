const express = require('express');
const router = express.Router();

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

module.exports = router;