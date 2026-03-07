const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

// ── Extract raw text from PDF or TXT file ──
const parseDocument = async (filePath, fileType) => {
  try {
    if (fileType === 'pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      return sanitizeText(pdfData.text);
    }

    if (fileType === 'txt') {
      const rawText = fs.readFileSync(filePath, 'utf-8');
      return sanitizeText(rawText);
    }

    throw new Error(`Unsupported file type: ${fileType}`);
  } catch (error) {
    throw new Error(`Failed to parse document: ${error.message}`);
  }
};

// ── Clean up raw extracted text ──
const sanitizeText = (text) => {
  return text
    .replace(/\r\n/g, '\n')       // normalize Windows line endings
    .replace(/\r/g, '\n')          // normalize old Mac line endings
    .replace(/\t/g, ' ')           // tabs to spaces
    .replace(/ {2,}/g, ' ')        // multiple spaces to one
    .replace(/\n{3,}/g, '\n\n')    // max 2 consecutive newlines
    .trim();
};

// ── Split extracted text into individual requirements ──
const splitIntoRequirements = (text) => {
  const lines = text.split('\n');
  const requirements = [];

  for (let line of lines) {
    const cleaned = line.trim();

    // Skip empty lines
    if (!cleaned) continue;

    // Skip very short lines (likely headers or page numbers)
    if (cleaned.length < 10) continue;

    // Skip lines that look like section headers (ALL CAPS, numbered headings)
    if (isHeader(cleaned)) continue;

    // Skip lines that are just numbers or special characters
    if (/^[\d\s\.\-\*\#]+$/.test(cleaned)) continue;

    requirements.push(cleaned);
  }

  // If line-by-line gives too few results, try sentence splitting
  if (requirements.length < 3) {
    return splitBySentences(text);
  }

  return requirements;
};

// ── Detect if a line is a header/title rather than a requirement ──
const isHeader = (line) => {
  // All uppercase lines (section titles)
  if (line === line.toUpperCase() && line.length > 3) return true;

  // Lines ending with a colon (labels)
  if (line.endsWith(':')) return true;

  // Lines that are just a number followed by a title
  // e.g. "1. Introduction" or "3.2 Functional Requirements"
  if (/^\d+(\.\d+)*\.?\s+[A-Z]/.test(line) && line.split(' ').length <= 6) return true;

  // Lines starting with common header words
  const headerPatterns = [
    /^(section|chapter|appendix|table|figure|introduction|overview|scope|purpose)/i,
    /^(functional requirements|non-functional|system requirements)/i,
    /^(revision history|document|version|date|author)/i,
  ];

  if (headerPatterns.some((p) => p.test(line))) return true;

  return false;
};

// ── Fallback: split by sentences if line splitting fails ──
const splitBySentences = (text) => {
  // Split on sentence-ending punctuation followed by space and capital letter
  const sentences = text
    .replace(/([.!?])\s+([A-Z])/g, '$1\n$2')
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length >= 10)
    .filter((s) => !isHeader(s));

  return sentences;
};

// ── Get file extension from original filename ──
const getFileType = (originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  if (ext === '.pdf') return 'pdf';
  if (ext === '.txt') return 'txt';
  return null;
};

// ── Delete file from disk after processing ──
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.warn(`⚠️ Could not delete temp file: ${filePath}`);
  }
};

module.exports = {
  parseDocument,
  splitIntoRequirements,
  sanitizeText,
  getFileType,
  deleteFile,
};