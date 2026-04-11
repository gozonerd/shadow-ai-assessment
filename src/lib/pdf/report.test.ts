import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateReport } from './report.js';
import type { AssessmentResponse, ShadowAIResult } from '$lib/types.js';

// ─── jsPDF mock ───────────────────────────────────────────────────────────────

const { mockAddPage, mockSave } = vi.hoisted(() => ({
	mockAddPage: vi.fn(),
	mockSave: vi.fn()
}));

vi.mock('jspdf', () => ({
	jsPDF: class {
		internal = { pageSize: { getWidth: () => 210, getHeight: () => 297 } };
		setFillColor = vi.fn();
		setTextColor = vi.fn();
		setDrawColor = vi.fn();
		setFontSize = vi.fn();
		setFont = vi.fn();
		setLineWidth = vi.fn();
		rect = vi.fn();
		text = vi.fn();
		line = vi.fn();
		splitTextToSize = vi.fn(() => ['mocked line']);
		addPage = mockAddPage;
		save = mockSave;
	}
}));

// ─── Test helpers ─────────────────────────────────────────────────────────────

function makeResult(
	riskLevel: 'critical' | 'high' | 'moderate' | 'low',
	percentage: number
): ShadowAIResult {
	const exposureMap = {
		critical: { low: 268_000, high: 402_000 },
		high: { low: 167_500, high: 268_000 },
		moderate: { low: 67_000, high: 167_500 },
		low: { low: 13_400, high: 67_000 }
	};
	const labelMap = {
		critical: 'Severe Shadow AI Exposure',
		high: 'Significant Shadow AI Risk',
		moderate: 'Moderate Shadow AI Risk',
		low: 'Shadow AI Well-Managed'
	};
	return {
		rawScore: Math.round((percentage / 100) * 24),
		maxScore: 24,
		percentage,
		riskLevel,
		riskLabel: labelMap[riskLevel],
		exposure: exposureMap[riskLevel],
		completedAt: new Date('2026-04-11T12:00:00')
	};
}

function makeResponses(score: 0 | 1 | 2 | 3): ReadonlyMap<string, AssessmentResponse> {
	const ids = ['q01', 'q02', 'q03', 'q04', 'q05', 'q06', 'q07', 'q08'];
	const map = new Map<string, AssessmentResponse>();
	for (const id of ids) {
		map.set(id, { questionId: id, selectedIndex: score, score });
	}
	return map;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('generateReport', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('resolves without throwing', () => {
		it('critical risk level (score 0)', async () => {
			await expect(
				generateReport(makeResult('critical', 0), makeResponses(0))
			).resolves.toBeUndefined();
		});

		it('high risk level (score 1)', async () => {
			await expect(
				generateReport(makeResult('high', 38), makeResponses(1))
			).resolves.toBeUndefined();
		});

		it('moderate risk level (score 2)', async () => {
			await expect(
				generateReport(makeResult('moderate', 63), makeResponses(2))
			).resolves.toBeUndefined();
		});

		it('low risk level (score 3)', async () => {
			await expect(
				generateReport(makeResult('low', 92), makeResponses(3))
			).resolves.toBeUndefined();
		});

		it('empty responses map (defaults all to score 0)', async () => {
			await expect(generateReport(makeResult('critical', 0), new Map())).resolves.toBeUndefined();
		});
	});

	it('calls addPage exactly twice (3-page report)', async () => {
		await generateReport(makeResult('high', 38), makeResponses(1));
		expect(mockAddPage).toHaveBeenCalledTimes(2);
	});

	it('calls save exactly once', async () => {
		await generateReport(makeResult('moderate', 63), makeResponses(2));
		expect(mockSave).toHaveBeenCalledTimes(1);
	});

	it('save filename matches Shadow_AI_Risk_Brief_YYYY-MM-DD.pdf pattern', async () => {
		await generateReport(makeResult('low', 92), makeResponses(3));
		expect(mockSave).toHaveBeenCalledWith(
			expect.stringMatching(/^Shadow_AI_Risk_Brief_\d{4}-\d{2}-\d{2}\.pdf$/)
		);
	});

	it('uses the completedAt date in the filename', async () => {
		// completedAt is 2026-04-11
		await generateReport(makeResult('moderate', 63), makeResponses(2));
		expect(mockSave).toHaveBeenCalledWith('Shadow_AI_Risk_Brief_2026-04-11.pdf');
	});
});
