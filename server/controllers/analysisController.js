const { parseDocument, splitIntoRequirements, getFileType, deleteFile } = require('../services/parserService');
const { analyzeRequirement } = require('../services/detectionService');
const { analyzeAndScore, getRecommendations } = require('../services/scoringService');
const { generateBatchRewrites } = require('../services/aiService');
const Analysis = require('../models/Analysis');
const Requirement = require('../models/Requirement');

const runFullAnalysis = async (req, res) => {
  const filePath = req.file.path;
  const startTime = Date.now();

  try {
    // ── STEP 1: Parse the document ──
    const fileType = getFileType(req.file.originalname);

    if (!fileType) {
      deleteFile(filePath);
      return res.status(400).json({
        success: false,
        error: 'Unsupported file type. Please upload a PDF or TXT file.',
      });
    }

    console.log(`\n📄 [1/5] Parsing document: ${req.file.originalname}`);
    const extractedText = await parseDocument(filePath, fileType);

    if (!extractedText || extractedText.length < 20) {
      deleteFile(filePath);
      return res.status(400).json({
        success: false,
        error: 'Could not extract readable text from the document.',
      });
    }

    // ── STEP 2: Split into requirements ──
    console.log(`🔪 [2/5] Splitting into requirements...`);
    const requirementTexts = splitIntoRequirements(extractedText);

    if (requirementTexts.length === 0) {
      deleteFile(filePath);
      return res.status(400).json({
        success: false,
        error: 'No requirements could be identified in the document.',
      });
    }

    console.log(`   Found ${requirementTexts.length} requirements`);
    deleteFile(filePath);

    // ── STEP 3: Detect issues + score ──
    console.log(`🔍 [3/5] Running detection and scoring...`);
    const { requirements: scoredRequirements, documentScore } = analyzeAndScore(
      requirementTexts,
      analyzeRequirement
    );

    // ── STEP 4: Generate AI rewrites ──
    console.log(`🤖 [4/5] Generating AI rewrites for defective requirements...`);
    const aiResults = await generateBatchRewrites(scoredRequirements);

    // ── STEP 5: Save to MongoDB ──
    console.log(`💾 [5/5] Saving to MongoDB...`);
    const processingTime = Date.now() - startTime;

    // Save the analysis document
    const analysis = await Analysis.create({
      fileName: req.file.originalname,
      fileType,
      originalText: extractedText,
      totalRequirements: scoredRequirements.length,
      qualityScore: documentScore.overallScore,
      issuesSummary: {
        ambiguity: documentScore.issuesSummary.ambiguity,
        nonTestability: documentScore.issuesSummary.nonTestability,
        incompleteness: documentScore.issuesSummary.incompleteness,
        total: documentScore.issuesSummary.total,
      },
      status: 'completed',
      processingTime,
    });

    // Save individual requirements
    const requirementDocs = await Promise.all(
      scoredRequirements.map(async (req, index) => {
        const aiResult = aiResults[index]?.aiResult;

        return Requirement.create({
          analysisId: analysis._id,
          index: req.index,
          originalText: req.text,
          suggestedRewrite: aiResult?.rewrite || null,
          rewriteExplanation: aiResult?.explanation || null,
          issues: req.issues,
          requirementScore: req.requirementScore,
          isAccepted: false,
        });
      })
    );

    const recommendations = getRecommendations(documentScore);
    const processingTimeSec = (processingTime / 1000).toFixed(2);

    console.log(`\n✅ Analysis complete!`);
    console.log(`   Score: ${documentScore.overallScore} (${documentScore.label})`);
    console.log(`   Requirements: ${scoredRequirements.length}`);
    console.log(`   Issues found: ${documentScore.issuesSummary.total}`);
    console.log(`   Processing time: ${processingTimeSec}s\n`);

    // ── Return full response ──
    res.json({
      success: true,
      analysisId: analysis._id,
      documentScore,
      recommendations,
      processingTime: processingTimeSec,
      requirements: requirementDocs.map((doc, index) => ({
        id: doc._id,
        index: doc.index,
        text: doc.originalText,
        score: doc.requirementScore,
        issueCount: doc.issues.length,
        issues: doc.issues,
        suggestedRewrite: doc.suggestedRewrite,
        rewriteExplanation: doc.rewriteExplanation,
        hasIssues: doc.issues.length > 0,
      })),
    });

  } catch (error) {
    deleteFile(filePath);
    console.error('❌ Analysis pipeline error:', error.message);
    res.status(500).json({
      success: false,
      error: `Analysis failed: ${error.message}`,
    });
  }
};

module.exports = { runFullAnalysis };