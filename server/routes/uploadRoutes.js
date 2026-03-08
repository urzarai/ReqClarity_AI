const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fileValidator = require('../middleware/fileValidator');
const { runFullAnalysis } = require('../controllers/analysisController');

// ── Multer config ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// POST /api/upload — full analysis pipeline
router.post('/', upload.single('document'), fileValidator, runFullAnalysis);

module.exports = router;