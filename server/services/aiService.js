const Groq = require('groq-sdk');

// ── Initialize Groq client ──
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = 'llama-3.3-70b-versatile';

// ════════════════════════════════════════
// PROMPT ENGINEERING
// ════════════════════════════════════════

const buildSystemPrompt = () => {
  return `You are an expert software requirements engineer specializing in IEEE 830 SRS quality analysis.

Your job is to analyze defective software requirements and provide:
1. A high-quality rewritten version that fixes all detected issues
2. A clear explanation of what was wrong and what you changed

REWRITING RULES:
- Use "shall" for mandatory requirements (never "should", "may", "might", "could")
- Always include a clear actor (e.g., "The system shall...", "The user shall...")
- Replace all vague terms with specific, measurable criteria
- Add missing constraints (size limits, time limits, quantity limits)
- Ensure the requirement is objectively testable
- Keep the rewrite concise and precise
- Follow the format: "[Actor] shall [action] [object] [constraints]"

RESPONSE FORMAT:
You must respond ONLY with a valid JSON object in exactly this format:
{
  "rewrite": "The improved requirement text here",
  "explanation": "A clear 2-3 sentence explanation of what issues were found and what changes were made"
}

Do not include any text outside the JSON object. Do not use markdown code blocks.`;
};

const buildUserPrompt = (requirementText, issues) => {
  const issueList = issues
    .map((i) => `- [${i.type}] [${i.severity}] "${i.flaggedWord}": ${i.description}`)
    .join('\n');

  return `Analyze and rewrite this software requirement:

ORIGINAL REQUIREMENT:
"${requirementText}"

DETECTED ISSUES:
${issueList}

Provide an improved rewrite that fixes all the issues listed above, and explain your changes.
Remember: respond ONLY with the JSON object, no other text.`;
};

// ════════════════════════════════════════
// AI REWRITE GENERATION
// ════════════════════════════════════════

const generateRewrite = async (requirementText, issues) => {
  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: buildSystemPrompt(),
        },
        {
          role: 'user',
          content: buildUserPrompt(requirementText, issues),
        },
      ],
    });

    const rawText = response.choices[0]?.message?.content || '';

    // Parse the JSON response
    const parsed = parseAIResponse(rawText);

    return {
      success: true,
      rewrite: parsed.rewrite,
      explanation: parsed.explanation,
      model: MODEL,
      tokensUsed: response.usage?.total_tokens || 0,
    };

  } catch (error) {
    console.error('❌ AI service error:', error.message);
    return {
      success: false,
      rewrite: null,
      explanation: null,
      error: error.message,
    };
  }
};

// ════════════════════════════════════════
// BATCH PROCESSING
// ════════════════════════════════════════

// ── Generate rewrites for multiple requirements ──
const generateBatchRewrites = async (requirements) => {
  const results = [];

  for (const req of requirements) {
    // Only generate rewrites for requirements that have issues
    if (!req.hasIssues || req.issues.length === 0) {
      results.push({
        index: req.index,
        text: req.text,
        hasIssues: false,
        aiResult: null,
      });
      continue;
    }

    console.log(`🤖 Generating AI rewrite for requirement ${req.index}...`);

    const aiResult = await generateRewrite(req.text, req.issues);

    results.push({
      index: req.index,
      text: req.text,
      hasIssues: true,
      aiResult,
    });

    // Small delay between API calls to avoid rate limiting
    await sleep(500);
  }

  return results;
};

// ════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════

const parseAIResponse = (rawText) => {
  try {
    // Remove any accidental markdown code blocks
    const cleaned = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!parsed.rewrite || !parsed.explanation) {
      throw new Error('Missing rewrite or explanation fields');
    }

    return parsed;
  } catch (error) {
    console.error('❌ Failed to parse AI response:', error.message);
    console.error('Raw response was:', rawText);

    // Fallback — return a structured error response
    return {
      rewrite: 'AI rewrite unavailable — please review manually.',
      explanation: 'The AI response could not be parsed. Please try again.',
    };
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  generateRewrite,
  generateBatchRewrites,
};