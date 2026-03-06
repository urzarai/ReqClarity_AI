const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'txt'],
      required: true,
    },
    originalText: {
      type: String,
      required: true,
    },
    totalRequirements: {
      type: Number,
      default: 0,
    },
    qualityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    issuesSummary: {
      ambiguity: { type: Number, default: 0 },
      nonTestability: { type: Number, default: 0 },
      incompleteness: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    processingTime: {
      type: Number, // in milliseconds
      default: 0,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Analysis', AnalysisSchema);