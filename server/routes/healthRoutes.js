const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// GET /api/health
router.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.json({
    success: true,
    status: 'ReqClarity API is running',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

module.exports = router;