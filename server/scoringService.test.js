const { scoreRequirement, scoreDocument, analyzeAndScore, getScoreLabel, getRecommendations } = require('./services/scoringService');
const { analyzeRequirement } = require('./services/detectionService');

console.log('════════════════════════════════');
console.log('  SCORING ENGINE TESTS');
console.log('════════════════════════════════\n');

// ── Test 1: scoreRequirement — no issues ──
console.log('Test 1: scoreRequirement — clean requirement');
const cleanScore = scoreRequirement([]);
console.assert(cleanScore.score === 100, '❌ Clean requirement should score 100');
console.assert(cleanScore.issueCount === 0, '❌ Clean requirement should have 0 issues');
console.log(`✅ Score: ${cleanScore.score}, Issues: ${cleanScore.issueCount}\n`);

// ── Test 2: scoreRequirement — with issues ──
console.log('Test 2: scoreRequirement — with issues');
const mockIssues = [
  { type: 'ambiguity', severity: 'high', flaggedWord: 'should' },
  { type: 'non-testability', severity: 'high', flaggedWord: 'user-friendly' },
  { type: 'incompleteness', severity: 'medium', flaggedWord: 'missing actor' },
];
const issueScore = scoreRequirement(mockIssues);
console.assert(issueScore.score < 100, '❌ Score should be less than 100 when there are issues');
console.assert(issueScore.score >= 0, '❌ Score should never be negative');
console.assert(issueScore.issueCount === 3, '❌ Should count 3 issues');
console.log(`✅ Score: ${issueScore.score}, Penalty: ${issueScore.penalty}, Issues: ${issueScore.issueCount}\n`);

// ── Test 3: getScoreLabel ──
console.log('Test 3: getScoreLabel thresholds');
const labels = [
  { score: 95, expected: 'Excellent' },
  { score: 80, expected: 'Good' },
  { score: 65, expected: 'Fair' },
  { score: 50, expected: 'Poor' },
  { score: 20, expected: 'Critical' },
];
let labelsPassed = true;
for (const { score, expected } of labels) {
  const { label } = getScoreLabel(score);
  if (label !== expected) {
    console.log(`❌ Score ${score} should be "${expected}" but got "${label}"`);
    labelsPassed = false;
  }
}
if (labelsPassed) console.log('✅ All score label thresholds correct\n');

// ── Test 4: Full pipeline with analyzeAndScore ──
console.log('Test 4: Full pipeline — analyzeAndScore');
const testRequirements = [
  'The system shall respond to all login requests within 2 seconds.',
  'The system should provide adequate and user-friendly responses.',
  'Shall allow users to upload files.',
  'The system shall encrypt all passwords using AES-256 before storing them.',
  'The interface should be easy to use and intuitive.',
];

const result = analyzeAndScore(testRequirements, analyzeRequirement);

console.log(`Total requirements: ${result.documentScore.totalRequirements}`);
console.log(`Overall score: ${result.documentScore.overallScore} (${result.documentScore.label})`);
console.log(`Requirements with issues: ${result.documentScore.requirementsWithIssues}`);
console.log(`Clean requirements: ${result.documentScore.cleanRequirements}`);
console.log(`Issues summary:`, result.documentScore.issuesSummary);
console.log('');
console.log('Per-requirement scores:');
result.requirements.forEach((req) => {
  console.log(`  [${req.requirementScore}] ${req.text.substring(0, 60)}...`);
  if (req.issues.length > 0) {
    req.issues.forEach((i) => console.log(`       → [${i.severity}] ${i.flaggedWord}`));
  }
});

console.assert(result.documentScore.totalRequirements === 5, '❌ Should have 5 requirements');
console.assert(result.documentScore.overallScore >= 0 && result.documentScore.overallScore <= 100, '❌ Score out of range');
console.log('\n✅ Full pipeline test passed\n');

// ── Test 5: Recommendations ──
console.log('Test 5: Recommendations');
const recommendations = getRecommendations(result.documentScore);
console.log('Recommendations generated:');
recommendations.forEach((r) => console.log(`  → ${r}`));
console.assert(recommendations.length > 0, '❌ Should generate at least one recommendation');
console.log('\n✅ Recommendations test passed\n');

console.log('════════════════════════════════');
console.log('  All scoring tests complete!');
console.log('════════════════════════════════');