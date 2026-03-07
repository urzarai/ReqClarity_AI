const nlp = require('compromise');

// ════════════════════════════════════════
// AMBIGUITY DETECTION
// ════════════════════════════════════════

// ── Word lists ──
const AMBIGUOUS_ADJECTIVES = [
  'fast', 'slow', 'quick', 'rapid', 'efficient', 'effective', 'adequate',
  'appropriate', 'reasonable', 'sufficient', 'acceptable', 'proper',
  'good', 'bad', 'large', 'small', 'big', 'high', 'low', 'simple',
  'complex', 'easy', 'hard', 'difficult', 'robust', 'reliable',
  'scalable', 'flexible', 'secure', 'safe', 'accurate', 'correct',
  'modern', 'advanced', 'standard', 'normal', 'typical', 'basic',
  'minimal', 'maximum', 'optimal', 'better', 'best', 'improved',
];

const VAGUE_QUANTIFIERS = [
  'some', 'several', 'many', 'few', 'most', 'various', 'numerous',
  'multiple', 'a lot', 'lots', 'plenty', 'enough', 'sufficient',
  'excessive', 'minimal', 'maximum', 'minimum', 'frequent', 'often',
  'sometimes', 'occasionally', 'rarely', 'regularly', 'periodically',
];

const WEAK_MODALS = [
  'should', 'may', 'might', 'could', 'would', 'can',
];

const UNTESTABLE_TERMS = [
  'user-friendly', 'user friendly', 'intuitive', 'easy to use',
  'easy-to-use', 'simple to use', 'straightforward', 'seamless',
  'transparent', 'natural', 'obvious', 'self-explanatory',
  'aesthetically pleasing', 'visually appealing', 'attractive',
  'modern', 'state-of-the-art', 'cutting-edge', 'world-class',
  'best-in-class', 'industry-standard',
];

const VAGUE_TIME_TERMS = [
  'quickly', 'rapidly', 'soon', 'immediately', 'instantly',
  'promptly', 'timely', 'in a timely manner', 'as soon as possible',
  'asap', 'real-time', 'near real-time', 'at all times', 'always',
  'never', 'constantly', 'continuously', 'periodically',
];

// ── Main ambiguity detection function ──
const detectAmbiguity = (text) => {
  const issues = [];
  const lowerText = text.toLowerCase();

  // 1. Check for ambiguous adjectives
  for (const word of AMBIGUOUS_ADJECTIVES) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(text)) {
      issues.push({
        type: 'ambiguity',
        description: `The term "${word}" is vague and subjective. Replace it with a measurable, specific criterion.`,
        flaggedWord: word,
        severity: 'medium',
        detectedBy: 'rule-based',
      });
    }
  }

  // 2. Check for vague quantifiers
  for (const word of VAGUE_QUANTIFIERS) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(text)) {
      issues.push({
        type: 'ambiguity',
        description: `"${word}" is a vague quantifier. Specify an exact number or measurable range instead.`,
        flaggedWord: word,
        severity: 'medium',
        detectedBy: 'rule-based',
      });
    }
  }

  // 3. Check for weak modal verbs
  for (const modal of WEAK_MODALS) {
    const regex = new RegExp(`\\b${modal}\\b`, 'i');
    if (regex.test(text)) {
      issues.push({
        type: 'ambiguity',
        description: `The modal verb "${modal}" creates ambiguity about whether this is a requirement or a preference. Use "shall" for mandatory requirements.`,
        flaggedWord: modal,
        severity: modal === 'should' ? 'high' : 'medium',
        detectedBy: 'rule-based',
      });
    }
  }

  // 4. Check for untestable terms
  for (const term of UNTESTABLE_TERMS) {
    if (lowerText.includes(term)) {
      issues.push({
        type: 'ambiguity',
        description: `"${term}" is subjective and cannot be objectively measured or tested. Replace with a specific, verifiable criterion.`,
        flaggedWord: term,
        severity: 'high',
        detectedBy: 'rule-based',
      });
    }
  }

  // 5. Check for vague time terms
  for (const term of VAGUE_TIME_TERMS) {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(text)) {
      issues.push({
        type: 'ambiguity',
        description: `"${term}" is a vague time reference. Specify an exact time value (e.g., "within 2 seconds").`,
        flaggedWord: term,
        severity: 'high',
        detectedBy: 'rule-based',
      });
    }
  }

  // 6. Check for passive voice using compromise NLP
  const passiveIssues = detectPassiveVoice(text);
  issues.push(...passiveIssues);

  // Remove duplicate flagged words
  return deduplicateIssues(issues);
};

// ── Passive voice detection ──
const detectPassiveVoice = (text) => {
  const issues = [];

  // Passive voice patterns: "is/are/was/were + past participle"
  const passivePatterns = [
    /\b(is|are|was|were|be|been|being)\s+\w+ed\b/i,
    /\b(is|are|was|were|be|been|being)\s+\w+en\b/i, // broken, taken, etc.
  ];

  for (const pattern of passivePatterns) {
    const match = text.match(pattern);
    if (match) {
      issues.push({
        type: 'ambiguity',
        description: `Passive voice detected ("${match[0].trim()}"). Rewrite using active voice to clearly identify the actor responsible for this action.`,
        flaggedWord: match[0].trim(),
        severity: 'low',
        detectedBy: 'rule-based',
      });
      break; // Only flag once per requirement for passive voice
    }
  }

  return issues;
};

// ── Remove issues with duplicate flagged words ──
const deduplicateIssues = (issues) => {
  const seen = new Set();
  return issues.filter((issue) => {
    const key = `${issue.type}-${issue.flaggedWord?.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// ════════════════════════════════════════
// NON-TESTABILITY DETECTION
// ════════════════════════════════════════

const SUBJECTIVE_QUALITY_TERMS = [
  'user-friendly', 'user friendly', 'intuitive', 'easy to use',
  'easy-to-use', 'simple to use', 'straightforward', 'seamless',
  'pleasant', 'enjoyable', 'comfortable', 'natural', 'obvious',
  'self-explanatory', 'transparent', 'clean', 'elegant',
  'aesthetically pleasing', 'visually appealing', 'attractive',
  'professional', 'polished', 'well-designed',
];

const UNMEASURABLE_PERFORMANCE = [
  'high performance', 'high-performance', 'highly available',
  'highly reliable', 'highly scalable', 'highly secure',
  'very fast', 'very slow', 'very large', 'very small',
  'extremely fast', 'extremely reliable', 'extremely secure',
  'good performance', 'better performance', 'best performance',
  'optimal performance', 'maximum performance',
];

const MISSING_METRIC_PATTERNS = [
  {
    pattern: /\bperform(ance)?\b(?!.*\d)/i,
    description: 'Performance requirement detected without a measurable metric (e.g., response time in seconds, throughput in requests/sec).',
    flaggedWord: 'performance',
  },
  {
    pattern: /\bavailab(le|ility)\b(?!.*\d+\s*%)/i,
    description: 'Availability requirement detected without a measurable metric (e.g., "99.9% uptime").',
    flaggedWord: 'availability',
  },
  {
    pattern: /\breliab(le|ility)\b(?!.*\d)/i,
    description: 'Reliability requirement detected without a measurable metric (e.g., "mean time between failures > 1000 hours").',
    flaggedWord: 'reliability',
  },
  {
    pattern: /\bscalab(le|ility)\b(?!.*\d)/i,
    description: 'Scalability requirement detected without a measurable metric (e.g., "support up to 10,000 concurrent users").',
    flaggedWord: 'scalability',
  },
  {
    pattern: /\bsecure|security\b(?!.*\b(aes|ssl|tls|sha|rsa|owasp|iso)\b)/i,
    description: 'Security requirement detected without referencing a specific standard or measurable criterion (e.g., AES-256, TLS 1.3, OWASP Top 10).',
    flaggedWord: 'security',
  },
  {
    pattern: /\baccurate|accuracy\b(?!.*\d+\s*%)/i,
    description: 'Accuracy requirement detected without a measurable threshold (e.g., "accuracy of at least 95%").',
    flaggedWord: 'accuracy',
  },
];

const ACCEPTANCE_CRITERIA_MISSING = [
  {
    pattern: /\bshall\s+(be\s+)?(able\s+to\s+)?(handle|process|manage|support)\b(?!.*\d)/i,
    description: 'Capability requirement detected without measurable acceptance criteria — how much, how many, or how fast must be specified.',
    flaggedWord: 'handle/process/support',
  },
  {
    pattern: /\bshall\s+(be\s+)?(able\s+to\s+)?(display|show|present|render)\b(?!.*\d)/i,
    description: 'Display requirement detected without measurable criteria — specify load time, resolution, or data volume limits.',
    flaggedWord: 'display/show/render',
  },
];

const SUBJECTIVE_COMPARISON = [
  'better than', 'worse than', 'faster than', 'slower than',
  'more efficient', 'less efficient', 'more reliable', 'less reliable',
  'more secure', 'less secure', 'more accurate', 'improved',
  'enhanced', 'optimized', 'superior',
];

const detectNonTestability = (text) => {
  const issues = [];
  const lowerText = text.toLowerCase();

  // 1. Check for subjective quality terms
  for (const term of SUBJECTIVE_QUALITY_TERMS) {
    if (lowerText.includes(term)) {
      issues.push({
        type: 'non-testability',
        description: `"${term}" is a subjective quality term with no objective test criteria. Define a measurable standard (e.g., SUS score ≥ 75).`,
        flaggedWord: term,
        severity: 'high',
        detectedBy: 'rule-based',
      });
    }
  }

  // 2. Check for unmeasurable performance claims
  for (const term of UNMEASURABLE_PERFORMANCE) {
    if (lowerText.includes(term)) {
      issues.push({
        type: 'non-testability',
        description: `"${term}" is an unmeasurable performance claim. Specify exact metrics (e.g., response time < 2s, uptime > 99.9%).`,
        flaggedWord: term,
        severity: 'high',
        detectedBy: 'rule-based',
      });
    }
  }

  // 3. Check for quality attributes missing metrics
  for (const item of MISSING_METRIC_PATTERNS) {
    if (item.pattern.test(text)) {
      issues.push({
        type: 'non-testability',
        description: item.description,
        flaggedWord: item.flaggedWord,
        severity: 'medium',
        detectedBy: 'rule-based',
      });
    }
  }

  // 4. Check for missing acceptance criteria
  for (const item of ACCEPTANCE_CRITERIA_MISSING) {
    if (item.pattern.test(text)) {
      issues.push({
        type: 'non-testability',
        description: item.description,
        flaggedWord: item.flaggedWord,
        severity: 'medium',
        detectedBy: 'rule-based',
      });
    }
  }

  // 5. Check for subjective comparisons
  for (const term of SUBJECTIVE_COMPARISON) {
    if (lowerText.includes(term)) {
      issues.push({
        type: 'non-testability',
        description: `"${term}" is a relative comparison with no baseline or measurable target. Specify the exact improvement metric.`,
        flaggedWord: term,
        severity: 'medium',
        detectedBy: 'rule-based',
      });
    }
  }

  return deduplicateIssues(issues);
};

// ════════════════════════════════════════
// INCOMPLETENESS DETECTION
// ════════════════════════════════════════

const MISSING_ACTOR_PATTERNS = [
  /^shall\s+/i,
  /^will\s+/i,
  /^must\s+/i,
  /^should\s+/i,
  /^may\s+/i,
];

const INCOMPLETE_CONDITION_PATTERNS = [
  {
    pattern: /\b(if|when|unless|until|after|before|upon)\b/i,
    description: 'Conditional requirement detected but the condition outcome or response is not fully specified.',
    flaggedWord: 'conditional statement',
  },
];

const MISSING_CONSTRAINT_KEYWORDS = [
  {
    pattern: /\b(upload|download|transfer|receive|store|save)\b(?!.*(\d+\s*(kb|mb|gb|bytes)|up to \d|size|limit|maximum|minimum))/i,
    description: 'File or data operation detected without size or quantity constraints. Specify limits (e.g., "up to 10MB").',
    flaggedWord: 'missing size constraint',
  },
  {
    pattern: /\b(login|authenticate|sign in|access)\b(?!.*(attempt|limit|timeout|lock|\d+))/i,
    description: 'Authentication requirement detected without security constraints (e.g., max login attempts, lockout policy, timeout).',
    flaggedWord: 'missing auth constraint',
  },
  {
    pattern: /\b(notify|notification|alert|email|sms)\b(?!.*(within|after|\d+\s*(second|minute|hour|day)))/i,
    description: 'Notification requirement detected without a time constraint. Specify when the notification should be sent (e.g., "within 5 minutes").',
    flaggedWord: 'missing time constraint',
  },
  {
    pattern: /\b(display|show|list|present)\b(?!.*(maximum|minimum|up to|at most|\d+\s*(item|record|result|row)))/i,
    description: 'Display requirement detected without quantity constraints. Specify how many items should be shown (e.g., "up to 50 records per page").',
    flaggedWord: 'missing display constraint',
  },
];

const INCOMPLETE_SENTENCE_PATTERNS = [
  {
    pattern: /\band\s*$/i,
    description: 'Requirement appears to be incomplete — ends with "and", suggesting a continuation is missing.',
    flaggedWord: 'incomplete sentence',
  },
  {
    pattern: /\bor\s*$/i,
    description: 'Requirement appears to be incomplete — ends with "or", suggesting an alternative condition is missing.',
    flaggedWord: 'incomplete sentence',
  },
  {
    pattern: /^.{0,20}$/,
    description: 'Requirement is too short to be a complete, meaningful requirement. It likely lacks context, actors, or conditions.',
    flaggedWord: 'too short',
  },
];

const MISSING_ERROR_HANDLING = [
  {
    pattern: /\b(submit|save|process|calculate|generate|create|delete|update)\b(?!.*(error|fail|invalid|exception|otherwise|if not|unsuccessful))/i,
    description: 'Action requirement detected without error handling. Specify what happens when the action fails (e.g., "The system shall display an error message if the upload fails").',
    flaggedWord: 'missing error handling',
  },
];

const detectIncompleteness = (text) => {
  const issues = [];
  const trimmedText = text.trim();

  // 1. Check for missing actor — requirement starts with modal verb
  for (const pattern of MISSING_ACTOR_PATTERNS) {
    if (pattern.test(trimmedText)) {
      issues.push({
        type: 'incompleteness',
        description: 'Missing actor — the requirement does not specify who or what performs this action. Add a subject (e.g., "The system shall...", "The user shall...").',
        flaggedWord: 'missing actor',
        severity: 'high',
        detectedBy: 'rule-based',
      });
      break;
    }
  }

  // 2. Check for incomplete conditional statements
  for (const item of INCOMPLETE_CONDITION_PATTERNS) {
    if (item.pattern.test(text)) {
      // Only flag if there's no clear response/outcome after the condition
      const hasOutcome = /\b(shall|will|must|should|then)\b/i.test(text);
      if (!hasOutcome) {
        issues.push({
          type: 'incompleteness',
          description: item.description,
          flaggedWord: item.flaggedWord,
          severity: 'medium',
          detectedBy: 'rule-based',
        });
      }
    }
  }

  // 3. Check for missing constraints
  for (const item of MISSING_CONSTRAINT_KEYWORDS) {
    if (item.pattern.test(text)) {
      issues.push({
        type: 'incompleteness',
        description: item.description,
        flaggedWord: item.flaggedWord,
        severity: 'medium',
        detectedBy: 'rule-based',
      });
    }
  }

  // 4. Check for incomplete sentences
  for (const item of INCOMPLETE_SENTENCE_PATTERNS) {
    if (item.pattern.test(trimmedText)) {
      issues.push({
        type: 'incompleteness',
        description: item.description,
        flaggedWord: item.flaggedWord,
        severity: item.flaggedWord === 'too short' ? 'high' : 'medium',
        detectedBy: 'rule-based',
      });
    }
  }

  // 5. Check for missing error handling
  for (const item of MISSING_ERROR_HANDLING) {
    if (item.pattern.test(text)) {
      issues.push({
        type: 'incompleteness',
        description: item.description,
        flaggedWord: item.flaggedWord,
        severity: 'low',
        detectedBy: 'rule-based',
      });
    }
  }

  return deduplicateIssues(issues);
};

// ════════════════════════════════════════
// COMBINED ANALYZER
// ════════════════════════════════════════

const analyzeRequirement = (text) => {
  const ambiguity = detectAmbiguity(text);
  const nonTestability = detectNonTestability(text);
  const incompleteness = detectIncompleteness(text);

  const allIssues = [...ambiguity, ...nonTestability, ...incompleteness];

  return {
    ambiguity,
    nonTestability,
    incompleteness,
    allIssues,
    totalIssues: allIssues.length,
    hasIssues: allIssues.length > 0,
  };
};

module.exports = {
  detectAmbiguity,
  detectNonTestability,
  detectIncompleteness,
  analyzeRequirement,
};