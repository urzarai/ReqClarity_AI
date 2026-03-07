const { splitIntoRequirements, sanitizeText } = require('./services/parserService');

// ── sanitizeText tests ──
console.log('Testing sanitizeText...');

const dirtyText = '  The system  shall\t respond.\r\nAnother line.  ';
const cleaned = sanitizeText(dirtyText);
console.assert(!cleaned.includes('\t'), '❌ Tabs not removed');
console.assert(!cleaned.startsWith(' '), '❌ Leading space not removed');
console.assert(!cleaned.includes('  '), '❌ Double spaces not removed');
console.log('✅ sanitizeText tests passed');

// ── splitIntoRequirements tests ──
console.log('Testing splitIntoRequirements...');

const sampleText = `
1. Introduction
This is the SRS document.

The system shall respond within 2 seconds.
Users shall be able to log in with email and password.
The system shall encrypt all stored data.
The interface should be easy to use.
Shall allow file uploads.
`;

const requirements = splitIntoRequirements(sampleText);
console.assert(requirements.length > 0, '❌ No requirements extracted');
console.assert(
  !requirements.some((r) => r === '1. Introduction'),
  '❌ Header not filtered out'
);
console.log(`✅ splitIntoRequirements extracted ${requirements.length} requirements`);
console.log('Requirements found:');
requirements.forEach((r, i) => console.log(`  ${i + 1}. ${r}`));

console.log('\n🎉 All parser tests passed!');