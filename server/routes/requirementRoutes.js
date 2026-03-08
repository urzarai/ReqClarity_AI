const express = require('express');
const router = express.Router();
const Requirement = require('../models/Requirement');

// GET /api/requirements/:analysisId — get all requirements for an analysis
router.get('/:analysisId', async (req, res) => {
  try {
    const requirements = await Requirement.find({ analysisId: req.params.analysisId }).sort({ index: 1 });
    res.json({ success: true, data: requirements });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/requirements/:id/accept — accept a suggested rewrite
router.patch('/:id/accept', async (req, res) => {
  try {
    const requirement = await Requirement.findByIdAndUpdate(
      req.params.id,
      { isAccepted: true },
      { new: true }
    );

    if (!requirement) return res.status(404).json({ success: false, error: 'Requirement not found.' });

    res.json({ success: true, data: requirement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/requirements/:id/reject — reject a suggested rewrite
router.patch('/:id/reject', async (req, res) => {
  try {
    const requirement = await Requirement.findByIdAndUpdate(
      req.params.id,
      { isAccepted: false },
      { new: true }
    );

    if (!requirement) return res.status(404).json({ success: false, error: 'Requirement not found.' });

    res.json({ success: true, data: requirement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;