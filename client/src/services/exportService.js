import jsPDF from 'jspdf';

// ── Score label helper ──
const getScoreLabel = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Critical';
};

// ── Score color helper (returns RGB array) ──
const getScoreRGB = (score) => {
  if (score >= 75) return [132, 204, 22];
  if (score >= 60) return [234, 179, 8];
  if (score >= 40) return [249, 115, 22];
  return [239, 68, 68];
};

// ── Issue type color ──
const getIssueColor = (type) => {
  if (type === 'ambiguity') return [245, 158, 11];
  if (type === 'non-testability') return [239, 68, 68];
  if (type === 'incompleteness') return [139, 92, 246];
  return [100, 116, 139];
};

// ════════════════════════════════════════
// MAIN EXPORT FUNCTION
// ════════════════════════════════════════

export const exportToPDF = (analysis, requirements) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 0;

  // ── Helper: add new page if needed ──
  const checkPage = (neededHeight = 20) => {
    if (y + neededHeight > pageH - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // ── Helper: draw a horizontal divider ──
  const drawDivider = (color = [226, 232, 240]) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
    y += 4;
  };

  // ════════════════════════════════════
  // PAGE 1 — HEADER & SUMMARY
  // ════════════════════════════════════

  // Header background
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageW, 42, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('ReqClarity AI', margin, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(199, 210, 254);
  doc.text('SRS Quality Analysis Report', margin, 24);

  // File name + date
  doc.setFontSize(8);
  doc.setTextColor(199, 210, 254);
  const date = new Date(analysis.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  doc.text(`File: ${analysis.fileName}   |   Generated: ${date}`, margin, 34);

  y = 54;

  // ── Overall Score Box ──
  const scoreRGB = getScoreRGB(analysis.qualityScore);
  doc.setFillColor(...scoreRGB);
  doc.roundedRect(margin, y, 50, 24, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text(String(analysis.qualityScore), margin + 8, y + 14);

  doc.setFontSize(9);
  doc.text(getScoreLabel(analysis.qualityScore), margin + 8, y + 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('Overall Quality Score', margin + 56, y + 10);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`${analysis.totalRequirements} requirements analyzed`, margin + 56, y + 16);
  doc.text(`Processing time: ${analysis.processingTime || 'N/A'}s`, margin + 56, y + 21);

  y += 34;
  drawDivider();

  // ── Issue Summary Row ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('Issue Summary', margin, y);
  y += 8;

  const issueBoxes = [
    { label: 'Ambiguous', value: analysis.issuesSummary.ambiguity, rgb: [245, 158, 11] },
    { label: 'Non-Testable', value: analysis.issuesSummary.nonTestability, rgb: [239, 68, 68] },
    { label: 'Incomplete', value: analysis.issuesSummary.incompleteness, rgb: [139, 92, 246] },
    { label: 'Total Issues', value: analysis.issuesSummary.total, rgb: [79, 70, 229] },
  ];

  const boxW = (contentW - 9) / 4;
  issueBoxes.forEach((box, i) => {
    const x = margin + i * (boxW + 3);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, boxW, 18, 2, 2, 'F');
    doc.setDrawColor(...box.rgb);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, boxW, 18, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...box.rgb);
    doc.text(String(box.value), x + boxW / 2, y + 10, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(box.label, x + boxW / 2, y + 15, { align: 'center' });
  });

  y += 26;
  drawDivider();

  // ── Requirements Summary Table ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('Requirements Overview', margin, y);
  y += 7;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentW, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('#', margin + 2, y + 5);
  doc.text('Requirement', margin + 10, y + 5);
  doc.text('Score', margin + contentW - 30, y + 5);
  doc.text('Issues', margin + contentW - 12, y + 5);
  y += 8;

  // Table rows
  requirements.forEach((req, idx) => {
    checkPage(10);

    const rowColor = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(...rowColor);
    doc.rect(margin, y - 1, contentW, 8, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(String(req.index), margin + 2, y + 4);

    // Truncate long requirement text
    const maxLen = 85;
    const text = req.originalText?.length > maxLen
      ? req.originalText.substring(0, maxLen) + '...'
      : req.originalText || '';
    doc.text(text, margin + 10, y + 4);

    // Score with color
    const sRGB = getScoreRGB(req.requirementScore);
    doc.setTextColor(...sRGB);
    doc.setFont('helvetica', 'bold');
    doc.text(String(req.requirementScore), margin + contentW - 28, y + 4);

    // Issue count
    doc.setTextColor(req.issues.length > 0 ? 239 : 34, req.issues.length > 0 ? 68 : 197, req.issues.length > 0 ? 68 : 94);
    doc.text(String(req.issues.length), margin + contentW - 10, y + 4);

    y += 8;
  });

  y += 4;

  // ════════════════════════════════════
  // PAGE 2+ — DETAILED ISSUES
  // ════════════════════════════════════

  const reqsWithIssues = requirements.filter((r) => r.issues.length > 0);

  if (reqsWithIssues.length > 0) {
    doc.addPage();
    y = 20;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text('Detailed Issue Analysis', margin, y);
    y += 4;
    drawDivider([79, 70, 229]);

    reqsWithIssues.forEach((req) => {
      checkPage(40);

      // Requirement header
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, y, contentW, 10, 2, 2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(79, 70, 229);
      doc.text(`REQ-${String(req.index).padStart(3, '0')}`, margin + 3, y + 7);

      const sRGB = getScoreRGB(req.requirementScore);
      doc.setTextColor(...sRGB);
      doc.text(`Score: ${req.requirementScore}`, margin + contentW - 25, y + 7);

      y += 13;

      // Original text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      const lines = doc.splitTextToSize(req.originalText || '', contentW - 4);
      checkPage(lines.length * 5 + 10);
      doc.text(lines, margin + 2, y);
      y += lines.length * 5 + 4;

      // Issues list
      req.issues.forEach((issue) => {
        checkPage(12);
        const iRGB = getIssueColor(issue.type);
        doc.setFillColor(...iRGB.map(v => Math.min(v + 180, 255)));
        doc.roundedRect(margin + 2, y, contentW - 4, 9, 1, 1, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...iRGB);
        const typeLabel = issue.type === 'non-testability' ? 'Non-Testable' :
          issue.type.charAt(0).toUpperCase() + issue.type.slice(1);
        doc.text(`[${typeLabel}] "${issue.flaggedWord}"`, margin + 5, y + 4);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const descLines = doc.splitTextToSize(issue.description, contentW - 12);
        doc.text(descLines[0], margin + 5, y + 7.5);
        y += 11;
      });

      // AI Rewrite if available
      if (req.suggestedRewrite) {
        checkPage(20);
        doc.setFillColor(236, 253, 245);
        doc.roundedRect(margin + 2, y, contentW - 4, 6, 1, 1, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(16, 185, 129);
        doc.text('✓ AI Suggested Rewrite', margin + 5, y + 4.5);
        y += 8;

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        const rewriteLines = doc.splitTextToSize(`"${req.suggestedRewrite}"`, contentW - 8);
        checkPage(rewriteLines.length * 5 + 6);
        doc.text(rewriteLines, margin + 4, y);
        y += rewriteLines.length * 5 + 4;
      }

      y += 5;
      drawDivider();
    });
  }

  // ── Footer on last page ──
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `ReqClarity AI  |  Page ${i} of ${totalPages}  |  ${analysis.fileName}`,
      pageW / 2,
      pageH - 8,
      { align: 'center' }
    );
  }

  // ── Save ──
  const safeName = analysis.fileName.replace(/\.[^/.]+$/, '');
  doc.save(`ReqClarity_${safeName}_Report.pdf`);
};