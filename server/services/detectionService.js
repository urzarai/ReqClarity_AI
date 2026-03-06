// detectionService.js
// Rule-based NLP defect detection engine
// Full implementation: Days 9, 10, 11

const detectAmbiguity = (text) => {
  // TODO: Day 9
  return [];
};

const detectNonTestability = (text) => {
  // TODO: Day 10
  return [];
};

const detectIncompleteness = (text) => {
  // TODO: Day 11
  return [];
};

const analyzeRequirement = (text) => {
  return {
    ambiguity: detectAmbiguity(text),
    nonTestability: detectNonTestability(text),
    incompleteness: detectIncompleteness(text),
  };
};

module.exports = {
  detectAmbiguity,
  detectNonTestability,
  detectIncompleteness,
  analyzeRequirement,
};