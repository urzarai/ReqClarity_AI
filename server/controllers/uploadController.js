const path = require('path');
const { parseDocument, splitIntoRequirements, getFileType, deleteFile } = require('../services/parserService');

const handleUpload = async (req, res) => {
  const filePath = req.file.path;

  try {
    const fileType = getFileType(req.file.originalname);

    if (!fileType) {
      deleteFile(filePath);
      return res.status(400).json({
        success: false,
        error: 'Unsupported file type. Please upload a PDF or TXT file.',
      });
    }

    console.log(`📄 Parsing file: ${req.file.originalname} (${fileType.toUpperCase()})`);

    // Step 1 — Extract text
    const extractedText = await parseDocument(filePath, fileType);

    if (!extractedText || extractedText.length < 20) {
      deleteFile(filePath);
      return res.status(400).json({
        success: false,
        error: 'Could not extract readable text from the document. Please check the file.',
      });
    }

    // Step 2 — Split into requirements
    const requirements = splitIntoRequirements(extractedText);

    if (requirements.length === 0) {
      deleteFile(filePath);
      return res.status(400).json({
        success: false,
        error: 'No requirements could be identified in the document.',
      });
    }

    console.log(`✅ Extracted ${requirements.length} requirements from ${req.file.originalname}`);

    // Clean up temp file
    deleteFile(filePath);

    // Return parsed data
    res.json({
      success: true,
      data: {
        fileName: req.file.originalname,
        fileType,
        totalRequirements: requirements.length,
        requirements: requirements.map((text, index) => ({
          index: index + 1,
          text,
        })),
        extractedTextPreview: extractedText.substring(0, 300) + '...',
      },
    });

  } catch (error) {
    deleteFile(filePath);
    console.error('❌ Upload/parse error:', error.message);
    res.status(500).json({
      success: false,
      error: `Failed to process document: ${error.message}`,
    });
  }
};

module.exports = { handleUpload };