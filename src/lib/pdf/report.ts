import type { AssessmentResponse, OptionScore, RiskLevel, ShadowAIResult } from '$lib/types.js';
import { questions } from '$lib/data/questions.js';

// ─── Internal types ───────────────────────────────────────────────────────────

type RGB = [number, number, number];

/**
 * Minimal jsPDF interface — covers only the methods used in this module.
 * The real jsPDF instance is cast to this type via `as unknown as PDFDoc`
 * to avoid pulling the full jsPDF type hierarchy into non-PDF code paths.
 */
interface PDFDoc {
	internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
	setFillColor(r: number, g: number, b: number): void;
	setTextColor(r: number, g: number, b: number): void;
	setFontSize(size: number): void;
	setFont(font: string, style: string): void;
	rect(x: number, y: number, w: number, h: number, style: string): void;
	text(
		text: string | string[],
		x: number,
		y: number,
		options?: { align?: string; maxWidth?: number }
	): void;
	splitTextToSize(text: string, maxWidth: number): string[];
	addPage(): void;
	save(filename: string): void;
}

// ─── Color palette ────────────────────────────────────────────────────────────

const COL_BG: RGB = [10, 10, 15]; // #0a0a0f
const COL_PANEL: RGB = [26, 26, 38]; // #1a1a26
const COL_TEXT: RGB = [248, 250, 252]; // #f8fafc
const COL_SECONDARY: RGB = [148, 163, 184]; // #94a3b8
const COL_ACCENT: RGB = [220, 38, 38]; // #dc2626

const RISK_COLORS: Record<RiskLevel, RGB> = {
	critical: [239, 68, 68], // #ef4444
	high: [249, 115, 22], // #f97316
	moderate: [234, 179, 8], // #eab308
	low: [34, 197, 94] // #22c55e
};

// ─── Score / risk mapping constants ──────────────────────────────────────────

const SCORE_TO_RISK: readonly [RiskLevel, RiskLevel, RiskLevel, RiskLevel] = [
	'critical',
	'high',
	'moderate',
	'low'
];

const SCORE_LABELS: Readonly<Record<OptionScore, string>> = {
	0: 'Critical',
	1: 'High',
	2: 'Moderate',
	3: 'Low'
};

// ─── PDF helper functions ─────────────────────────────────────────────────────

function applyFill(doc: PDFDoc, [r, g, b]: RGB): void {
	doc.setFillColor(r, g, b);
}

function applyTextColor(doc: PDFDoc, [r, g, b]: RGB): void {
	doc.setTextColor(r, g, b);
}

function fillRect(doc: PDFDoc, color: RGB, x: number, y: number, w: number, h: number): void {
	applyFill(doc, color);
	doc.rect(x, y, w, h, 'F');
}

function addFooter(
	doc: PDFDoc,
	pageWidth: number,
	pageHeight: number,
	pageNum: number,
	dateStr: string
): void {
	const footerY = pageHeight - 8;
	applyTextColor(doc, COL_SECONDARY);
	doc.setFontSize(7);
	doc.setFont('helvetica', 'normal');
	doc.text('shadowai.krystalmartinez.com', 20, footerY);
	doc.text(dateStr, pageWidth / 2, footerY, { align: 'center' });
	doc.text(`Page ${pageNum}`, pageWidth - 20, footerY, { align: 'right' });
}

/**
 * Draws a section header label with a thin accent rule beneath it.
 * Returns the new y position after the header.
 */
function sectionHeader(doc: PDFDoc, pageWidth: number, label: string, y: number): number {
	applyTextColor(doc, COL_ACCENT);
	doc.setFontSize(8);
	doc.setFont('helvetica', 'bold');
	doc.text(label.toUpperCase(), 20, y);
	applyFill(doc, COL_ACCENT);
	doc.rect(20, y + 1.5, pageWidth - 40, 0.3, 'F');
	return y + 8;
}

/**
 * Renders word-wrapped text and returns the new y position.
 * @param lineHeight - vertical spacing per line in mm
 */
function wrappedText(
	doc: PDFDoc,
	text: string,
	x: number,
	y: number,
	maxWidth: number,
	lineHeight: number
): number {
	const lines = doc.splitTextToSize(text, maxWidth);
	doc.text(lines, x, y);
	return y + lines.length * lineHeight;
}

// ─── Page builders ────────────────────────────────────────────────────────────

function buildCoverPage(
	doc: PDFDoc,
	results: ShadowAIResult,
	pageWidth: number,
	pageHeight: number,
	dateStr: string
): void {
	const cx = pageWidth / 2;
	const riskColor = RISK_COLORS[results.riskLevel];

	// Full dark background
	fillRect(doc, COL_BG, 0, 0, pageWidth, pageHeight);

	// Title
	applyTextColor(doc, COL_TEXT);
	doc.setFontSize(28);
	doc.setFont('helvetica', 'bold');
	doc.text('Shadow AI', cx, 58, { align: 'center' });
	doc.text('Risk Brief', cx, 71, { align: 'center' });

	// Score panel
	fillRect(doc, COL_PANEL, cx - 42, 90, 84, 72);

	// Score percentage — large, risk-colored
	applyTextColor(doc, riskColor);
	doc.setFontSize(52);
	doc.setFont('helvetica', 'bold');
	doc.text(`${results.percentage}%`, cx, 132, { align: 'center' });

	// Risk label
	doc.setFontSize(10);
	doc.setFont('helvetica', 'bold');
	doc.text(results.riskLabel, cx, 148, { align: 'center' });

	// Thin divider
	applyFill(doc, COL_SECONDARY);
	doc.rect(cx - 35, 155, 70, 0.4, 'F');

	// Raw score
	applyTextColor(doc, COL_SECONDARY);
	doc.setFontSize(8.5);
	doc.setFont('helvetica', 'normal');
	doc.text(`Score: ${results.rawScore} / ${results.maxScore}`, cx, 163, { align: 'center' });

	// Completion date
	doc.setFontSize(9);
	doc.text(`Assessment completed ${dateStr}`, cx, 192, { align: 'center' });

	addFooter(doc, pageWidth, pageHeight, 1, dateStr);
}

function buildFindingsPage(
	doc: PDFDoc,
	results: ShadowAIResult,
	responses: ReadonlyMap<string, AssessmentResponse>,
	pageWidth: number,
	pageHeight: number,
	dateStr: string
): void {
	const margin = 20;
	const contentWidth = pageWidth - margin * 2;
	const riskColor = RISK_COLORS[results.riskLevel];

	fillRect(doc, COL_BG, 0, 0, pageWidth, pageHeight);

	let y = 20;

	// Section header
	y = sectionHeader(doc, pageWidth, 'Risk Findings', y);
	y += 4;

	// Dollar-exposure estimate box
	fillRect(doc, COL_PANEL, margin, y, contentWidth, 28);

	const fmtOpts: Intl.NumberFormatOptions = {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0
	};
	const lowFmt = results.exposure.low.toLocaleString('en-US', fmtOpts);
	const highFmt = results.exposure.high.toLocaleString('en-US', fmtOpts);

	applyTextColor(doc, COL_SECONDARY);
	doc.setFontSize(7.5);
	doc.setFont('helvetica', 'normal');
	doc.text('ESTIMATED SHADOW AI BREACH EXPOSURE', margin + 6, y + 8);

	applyTextColor(doc, riskColor);
	doc.setFontSize(15);
	doc.setFont('helvetica', 'bold');
	doc.text(`${lowFmt} \u2013 ${highFmt}`, margin + 6, y + 20);

	applyTextColor(doc, COL_SECONDARY);
	doc.setFontSize(6.5);
	doc.setFont('helvetica', 'normal');
	doc.text(
		'Editorial probability estimate applied to IBM 2025 $670K shadow AI breach premium. Not actuarial data.',
		pageWidth - margin - 4,
		y + 26,
		{ align: 'right' }
	);

	y += 34;

	// Question-by-question breakdown
	y = sectionHeader(doc, pageWidth, 'Question Breakdown', y);
	y += 2;

	for (const question of questions) {
		if (y > pageHeight - 30) break; // overflow guard

		const response = responses.get(question.id);
		const score = response?.score ?? 0;
		const scoreLabel = SCORE_LABELS[score];
		const scoreColor = RISK_COLORS[SCORE_TO_RISK[score]];
		const selectedLabel = response
			? (question.options[response.selectedIndex]?.label ?? '\u2014')
			: 'Not answered';

		// Row background
		fillRect(doc, COL_PANEL, margin, y, contentWidth, 20);

		// Question text (single line, truncated)
		applyTextColor(doc, COL_TEXT);
		doc.setFontSize(7.5);
		doc.setFont('helvetica', 'bold');
		const qLines = doc.splitTextToSize(question.text, contentWidth - 32);
		const qLine = qLines[0] + (qLines.length > 1 ? '\u2026' : '');
		doc.text(qLine, margin + 3, y + 7);

		// Answer text (single line, truncated)
		applyTextColor(doc, COL_SECONDARY);
		doc.setFontSize(6.5);
		doc.setFont('helvetica', 'normal');
		const aLines = doc.splitTextToSize(selectedLabel, contentWidth - 32);
		const aLine = aLines[0] + (aLines.length > 1 ? '\u2026' : '');
		doc.text(aLine, margin + 3, y + 13);

		// Score badge aligned right
		applyTextColor(doc, scoreColor);
		doc.setFontSize(7);
		doc.setFont('helvetica', 'bold');
		doc.text(scoreLabel, pageWidth - margin - 3, y + 10, { align: 'right' });

		y += 22;
	}

	addFooter(doc, pageWidth, pageHeight, 2, dateStr);
}

function getActions(riskLevel: RiskLevel): string[] {
	const common: string[] = [
		'Conduct an AI tool inventory — identify every AI tool currently in use across your organization.',
		'Establish or update your AI usage policy and communicate it clearly to all employees.',
		'Train employees on what data is and is not appropriate to share with AI tools.'
	];

	const byLevel: Record<RiskLevel, string[]> = {
		critical: [
			'URGENT: Assess recent AI interactions for potential data exposure — engage your security team immediately.',
			'Suspend unapproved AI tool access while conducting a full risk inventory.',
			...common,
			'Deploy technical controls (DLP, access restrictions) to prevent confidential data from entering AI tools.'
		],
		high: [
			'Prioritize technical controls for your highest-risk data categories (customer data, source code, financials).',
			...common,
			'Establish a fast-track AI tool approval process to reduce shadow adoption.'
		],
		moderate: [
			'Strengthen monitoring coverage — move from reactive to proactive detection of unapproved AI tools.',
			...common,
			'Review and refresh your AI policy — ensure it is current, enforced, and widely understood.'
		],
		low: [
			'Maintain your governance posture — schedule quarterly reviews of your AI tool inventory.',
			'Extend monitoring to emerging AI tools as the landscape evolves.',
			'Consider formalizing your practices into a documented AI governance framework.'
		]
	};

	return byLevel[riskLevel];
}

function buildNextStepsPage(
	doc: PDFDoc,
	results: ShadowAIResult,
	pageWidth: number,
	pageHeight: number,
	dateStr: string
): void {
	const margin = 20;
	const contentWidth = pageWidth - margin * 2;

	fillRect(doc, COL_BG, 0, 0, pageWidth, pageHeight);

	let y = 20;

	y = sectionHeader(doc, pageWidth, 'Recommended Next Steps', y);
	y += 4;

	// Risk-level-specific actions
	const actions = getActions(results.riskLevel);
	for (const action of actions) {
		// Bullet marker
		applyTextColor(doc, COL_ACCENT);
		doc.setFontSize(9);
		doc.setFont('helvetica', 'bold');
		doc.text('\u203a', margin, y + 1);

		// Action text
		applyTextColor(doc, COL_TEXT);
		doc.setFontSize(8);
		doc.setFont('helvetica', 'normal');
		y = wrappedText(doc, action, margin + 5, y, contentWidth - 8, 5);
		y += 4;
	}

	y += 8;

	// Governance CTA box
	fillRect(doc, COL_PANEL, margin, y, contentWidth, 40);

	applyTextColor(doc, COL_ACCENT);
	doc.setFontSize(10);
	doc.setFont('helvetica', 'bold');
	doc.text('Shadow AI is one piece of the picture.', margin + 6, y + 10);

	applyTextColor(doc, COL_TEXT);
	doc.setFontSize(8);
	doc.setFont('helvetica', 'normal');
	const ctaText =
		'For a complete AI governance readiness score \u2014 covering policy, risk management, ' +
		'compliance, oversight, and AI inventory \u2014 visit the full governance tool.';
	wrappedText(doc, ctaText, margin + 6, y + 18, contentWidth - 14, 4.5);

	applyTextColor(doc, COL_ACCENT);
	doc.setFontSize(9);
	doc.setFont('helvetica', 'bold');
	doc.text('governance.krystalmartinez.com', margin + 6, y + 36);

	y += 48;

	// Source attribution
	applyTextColor(doc, COL_SECONDARY);
	doc.setFontSize(7);
	doc.setFont('helvetica', 'normal');
	doc.text(
		'Source: IBM 2025 Cost of a Data Breach Report (July 2025). ' +
			'Exposure estimates are editorial probability ranges applied to the $670K shadow AI breach premium. ' +
			'These are not actuarial calculations.',
		margin,
		y,
		{ maxWidth: contentWidth }
	);

	addFooter(doc, pageWidth, pageHeight, 3, dateStr);
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Generates and triggers browser download of a Shadow AI Risk Brief PDF.
 * Uses a dynamic import for jsPDF — safe for SSR environments.
 *
 * @param results   - Calculated assessment results (score, risk level, exposure).
 * @param responses - Per-question response map from the assessment store.
 */
export async function generateReport(
	results: ShadowAIResult,
	responses: ReadonlyMap<string, AssessmentResponse>
): Promise<void> {
	const { jsPDF } = await import('jspdf');
	const doc = new jsPDF({
		orientation: 'portrait',
		unit: 'mm',
		format: 'a4'
	}) as unknown as PDFDoc;

	const pageWidth = doc.internal.pageSize.getWidth();
	const pageHeight = doc.internal.pageSize.getHeight();

	const completedAt = results.completedAt;
	const dateStr = completedAt.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});

	// Page 1 — Cover
	buildCoverPage(doc, results, pageWidth, pageHeight, dateStr);

	// Page 2 — Findings
	doc.addPage();
	buildFindingsPage(doc, results, responses, pageWidth, pageHeight, dateStr);

	// Page 3 — Next Steps
	doc.addPage();
	buildNextStepsPage(doc, results, pageWidth, pageHeight, dateStr);

	// Filename: Shadow_AI_Risk_Brief_YYYY-MM-DD.pdf
	const yyyy = completedAt.getFullYear();
	const mm = String(completedAt.getMonth() + 1).padStart(2, '0');
	const dd = String(completedAt.getDate()).padStart(2, '0');
	const filename = `Shadow_AI_Risk_Brief_${yyyy}-${mm}-${dd}.pdf`;

	doc.save(filename);
}
