const path = require('path');

const fileValidator = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded. Please upload a PDF or TXT file.',
    });
  }

  const allowedExtensions = ['.pdf', '.txt'];
  const fileExtension = path.extname(req.file.originalname).toLowerCase();

  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(400).json({
      success: false,
      error: `Invalid file type: ${fileExtension}. Only PDF and TXT files are allowed.`,
    });
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (req.file.size > maxSize) {
    return res.status(400).json({
      success: false,
      error: 'File size exceeds the 10MB limit.',
    });
  }

  next();
};

module.exports = fileValidator;