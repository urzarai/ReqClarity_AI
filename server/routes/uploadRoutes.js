const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fileValidator = require('../middleware/fileValidator');

// Configure multer for file storage
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

// POST /api/upload
router.post('/', upload.single('document'), fileValidator, (req, res) => {
  // Placeholder — real logic added on Day 8
  res.json({
    success: true,
    message: 'File upload endpoint ready',
    file: {
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
});

module.exports = router;