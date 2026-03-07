const { detectAmbiguity, detectNonTestability, detectIncompleteness } = require('./services/detectionService');

// ════════════════════════════════════════
//  AMBIGUITY DETECTION TESTS
// ════════════════════════════════════════
console.log('════════════════════════════════');
console.log('  AMBIGUITY DETECTION TESTS');
console.log('════════════════════════════════\n');

const ambiguityTests = [
  {
    name: 'Vague adjective — adequate',
    text: 'The system shall provide adequate security for all stored data.',
    expectIssues: true,
    expectWord: 'adequate',
  },
  {
    name: 'Weak modal — should',
    text: 'The system should send email notifications to users.',
    expectIssues: true,
    expectWord: 'should',
  },
  {
    name: 'Vague time — quickly',
    text: 'The system shall respond quickly to all user requests.',
    expectIssues: true,
    expectWord: 'quickly',
  },
  {
    name: 'Untestable term — user-friendly',
    text: 'The interface shall be user-friendly and easy to use.',
    expectIssues: true,
    expectWord: 'user-friendly',
  },
  {
    name: 'Vague quantifier — several',
    text: 'The system shall support several file formats.',
    expectIssues: true,
    expectWord: 'several',
  },
  {
    name: 'Passive voice',
    text: 'All passwords shall be encrypted before being stored.',
    expectIssues: true,
    expectWord: null,
  },
  {
    name: 'Clean requirement — no issues',
    text: 'The system shall respond to all login requests within 2 seconds.',
    expectIssues: false,
  },
  {
    name: 'Multiple issues in one requirement',
    text: 'The system should quickly provide adequate responses to some users.',
    expectIssues: true,
  },
];

runTests('Ambiguity', ambiguityTests, detectAmbiguity);

// ════════════════════════════════════════
//  NON-TESTABILITY DETECTION TESTS
// ════════════════════════════════════════
console.log('\n════════════════════════════════');
console.log('  NON-TESTABILITY DETECTION TESTS');
console.log('════════════════════════════════\n');

const testabilityTests = [
  {
    name: 'Subjective quality — user-friendly',
    text: 'The system shall be user-friendly and intuitive.',
    expectIssues: true,
    expectWord: 'user-friendly',
  },
  {
    name: 'Unmeasurable performance — high performance',
    text: 'The system shall deliver high performance under load.',
    expectIssues: true,
    expectWord: 'high performance',
  },
  {
    name: 'Missing metric — availability',
    text: 'The system shall be highly available at all times.',
    expectIssues: true,
    expectWord: 'availability',
  },
  {
    name: 'Missing metric — performance without number',
    text: 'The system shall have good performance.',
    expectIssues: true,
  },
  {
    name: 'Missing metric — security without standard',
    text: 'The system shall be secure.',
    expectIssues: true,
    expectWord: 'security',
  },
  {
    name: 'Subjective comparison — improved',
    text: 'The new system shall provide improved response times.',
    expectIssues: true,
    expectWord: 'improved',
  },
  {
    name: 'Clean requirement — measurable',
    text: 'The system shall respond to all requests within 2 seconds with 99.9% uptime.',
    expectIssues: false,
  },
  {
    name: 'Clean requirement — security with standard',
    text: 'The system shall encrypt all data using AES-256 encryption.',
    expectIssues: false,
  },
];

runTests('Non-Testability', testabilityTests, detectNonTestability);

// ════════════════════════════════════════
//  INCOMPLETENESS DETECTION TESTS
// ════════════════════════════════════════
console.log('\n════════════════════════════════');
console.log('  INCOMPLETENESS DETECTION TESTS');
console.log('════════════════════════════════\n');

const incompletenessTests = [
  {
    name: 'Missing actor — starts with shall',
    text: 'Shall allow users to upload files to the system.',
    expectIssues: true,
    expectWord: 'missing actor',
  },
  {
    name: 'Missing size constraint — upload',
    text: 'The system shall allow users to upload files.',
    expectIssues: true,
    expectWord: 'missing size constraint',
  },
  {
    name: 'Missing auth constraint — login',
    text: 'The system shall allow users to login with their credentials.',
    expectIssues: true,
    expectWord: 'missing auth constraint',
  },
  {
    name: 'Missing time constraint — notification',
    text: 'The system shall send email notifications to registered users.',
    expectIssues: true,
    expectWord: 'missing time constraint',
  },
  {
    name: 'Missing error handling — submit',
    text: 'The system shall allow users to submit their registration form.',
    expectIssues: true,
    expectWord: 'missing error handling',
  },
  {
    name: 'Clean requirement — upload with constraint',
    text: 'The system shall allow authenticated users to upload PDF files up to 10MB.',
    expectIssues: false,
  },
  {
    name: 'Clean requirement — notification with time',
    text: 'The system shall send email notifications to registered users within 5 minutes of a status change.',
    expectIssues: false,
  },
  {
    name: 'Clean requirement — login with constraints',
    text: 'The system shall lock user accounts after 5 failed login attempts within 10 minutes.',
    expectIssues: false,
  },
];

runTests('Incompleteness', incompletenessTests, detectIncompleteness);

// ════════════════════════════════════════
//  FULL ANALYSIS TEST
// ════════════════════════════════════════
console.log('\n════════════════════════════════');
console.log('  FULL analyzeRequirement TEST');
console.log('════════════════════════════════\n');

const { analyzeRequirement } = require('./services/detectionService');

const fullTestCases = [
  {
    text: 'Shall allow users to upload files to the system.',
    label: 'Missing actor + missing constraint',
  },
  {
    text: 'The system shall respond to all login requests within 2 seconds.',
    label: 'Clean requirement',
  },
  {
    text: 'The system should quickly provide adequate and user-friendly responses.',
    label: 'Multiple defect types',
  },
];

for (const tc of fullTestCases) {
  const result = analyzeRequirement(tc.text);
  console.log(`📋 "${tc.label}"`);
  console.log(`   Text: "${tc.text}"`);
  console.log(`   Total issues: ${result.totalIssues}`);
  console.log(`   Ambiguity: ${result.ambiguity.length} | Non-testability: ${result.nonTestability.length} | Incompleteness: ${result.incompleteness.length}`);
  console.log('');
}

// ── Test runner helper ──
function runTests(label, tests, detectFn) {
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const issues = detectFn(test.text);
    const hasIssues = issues.length > 0;
    let testPassed = true;

    if (test.expectIssues !== hasIssues) testPassed = false;

    if (test.expectWord) {
      const wordFound = issues.some(
        (i) => i.flaggedWord?.toLowerCase() === test.expectWord.toLowerCase()
      );
      if (!wordFound) testPassed = false;
    }

    if (testPassed) {
      console.log(`✅ PASS: ${test.name}`);
      console.log(`   Issues found: ${issues.length}`);
      if (issues.length > 0) {
        issues.forEach((i) =>
          console.log(`   → [${i.severity}] "${i.flaggedWord}" — ${i.description.substring(0, 65)}...`)
        );
      }
      passed++;
    } else {
      console.log(`❌ FAIL: ${test.name}`);
      console.log(`   Expected issues: ${test.expectIssues}, Got: ${hasIssues}`);
      if (test.expectWord) {
        console.log(`   Expected word "${test.expectWord}" not found in issues`);
      }
      failed++;
    }
    console.log('');
  }

  console.log(`════════════════════════════════`);
  console.log(`${label} Results: ${passed} passed, ${failed} failed`);
  console.log(`════════════════════════════════`);
}