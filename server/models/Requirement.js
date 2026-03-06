const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['ambiguity', 'non-testability', 'incompleteness'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  flaggedWord: {
    type: String, // the specific word/phrase that triggered the issue
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  detectedBy: {
    type: String,
    enum: ['rule-based', 'ai', 'both'],
    default: 'rule-based',
  },
});

const RequirementSchema = new mongoose.Schema(
  {
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
      required: true,
    },
    index: {
      type: Number, // position in the document (1, 2, 3...)
      required: true,
    },
    originalText: {
      type: String,
      required: true,
    },
    suggestedRewrite: {
      type: String,
      default: null,
    },
    rewriteExplanation: {
      type: String,
      default: null,
    },
    issues: [IssueSchema],
    requirementScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    isAccepted: {
      type: Boolean, // did the user accept the AI suggestion?
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Requirement', RequirementSchema);