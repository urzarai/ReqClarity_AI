// scoringService.js
// Quality score calculation engine
// Full implementation: Day 12

const calculateRequirementScore = (issues) => {
  // TODO: Day 12
  return 100;
};

const calculateDocumentScore = (requirementScores) => {
  // TODO: Day 12
  if (!requirementScores.length) return 0;
  const sum = requirementScores.reduce((a, b) => a + b, 0);
  return Math.round(sum / requirementScores.length);
};

module.exports = { calculateRequirementScore, calculateDocumentScore };