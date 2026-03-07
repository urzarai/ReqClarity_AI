require('dotenv').config();
const { generateRewrite } = require('./services/aiService');

console.log('════════════════════════════════');
console.log('  AI SERVICE TEST (Gemini)');
console.log('════════════════════════════════\n');

const testRequirement = 'The system should respond quickly and provide adequate security.';
const testIssues = [
  {
    type: 'ambiguity',
    severity: 'high',
    flaggedWord: 'should',
    description: "The modal verb 'should' creates ambiguity. Use 'shall' for mandatory requirements.",
  },
  {
    type: 'ambiguity',
    severity: 'high',
    flaggedWord: 'quickly',
    description: "'quickly' is a vague time reference. Specify an exact time value.",
  },
  {
    type: 'ambiguity',
    severity: 'medium',
    flaggedWord: 'adequate',
    description: "'adequate' is vague and subjective. Replace with a measurable criterion.",
  },
];

(async () => {
  console.log(`Testing requirement: "${testRequirement}"\n`);
  console.log('Calling Gemini API...\n');

  const result = await generateRewrite(testRequirement, testIssues);

  if (result.success) {
    console.log('✅ AI rewrite successful!\n');
    console.log(`Original:    "${testRequirement}"`);
    console.log(`Rewrite:     "${result.rewrite}"`);
    console.log(`Explanation: "${result.explanation}"`);
    console.log(`Model used:  ${result.model}`);
  } else {
    console.log('❌ AI rewrite failed:', result.error);
  }

  console.log('\n════════════════════════════════');
  console.log('  AI Service Test Complete');
  console.log('════════════════════════════════');
})();