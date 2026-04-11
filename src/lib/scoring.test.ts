import { describe, it, expect } from 'vitest';
import {
	calculateExposure,
	calculateResults,
	determineRiskLevel,
	getRiskLabel,
	MAX_SCORE,
	SHADOW_AI_BREACH_PREMIUM
} from './scoring.js';
import type { AssessmentResponse } from './types.js';
import { questions } from './data/questions.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a response map where every question scores the given value (0–3). */
function uniformResponses(score: 0 | 1 | 2 | 3): ReadonlyMap<string, AssessmentResponse> {
	const map = new Map<string, AssessmentResponse>();
	for (const q of questions) {
		map.set(q.id, { questionId: q.id, selectedIndex: score, score });
	}
	return map;
}

/** Build a response map from an array of scores (one per question, in order). */
function responsesFromScores(scores: (0 | 1 | 2 | 3)[]): ReadonlyMap<string, AssessmentResponse> {
	const map = new Map<string, AssessmentResponse>();
	for (let i = 0; i < questions.length; i++) {
		const q = questions[i];
		const score = scores[i] ?? 0;
		map.set(q.id, { questionId: q.id, selectedIndex: score, score });
	}
	return map;
}

// ─── determineRiskLevel ────────────────────────────────────────────────────────

describe('determineRiskLevel', () => {
	it('returns critical for 0%', () => {
		expect(determineRiskLevel(0)).toBe('critical');
	});

	it('returns critical for 25% (boundary)', () => {
		expect(determineRiskLevel(25)).toBe('critical');
	});

	it('returns high for 26% (one above critical boundary)', () => {
		expect(determineRiskLevel(26)).toBe('high');
	});

	it('returns high for 50% (boundary)', () => {
		expect(determineRiskLevel(50)).toBe('high');
	});

	it('returns moderate for 51% (one above high boundary)', () => {
		expect(determineRiskLevel(51)).toBe('moderate');
	});

	it('returns moderate for 75% (boundary)', () => {
		expect(determineRiskLevel(75)).toBe('moderate');
	});

	it('returns low for 76% (one above moderate boundary)', () => {
		expect(determineRiskLevel(76)).toBe('low');
	});

	it('returns low for 100%', () => {
		expect(determineRiskLevel(100)).toBe('low');
	});
});

// ─── getRiskLabel ─────────────────────────────────────────────────────────────

describe('getRiskLabel', () => {
	it('returns correct label for critical', () => {
		expect(getRiskLabel('critical')).toBe('Severe Shadow AI Exposure');
	});

	it('returns correct label for high', () => {
		expect(getRiskLabel('high')).toBe('Significant Shadow AI Risk');
	});

	it('returns correct label for moderate', () => {
		expect(getRiskLabel('moderate')).toBe('Moderate Shadow AI Risk');
	});

	it('returns correct label for low', () => {
		expect(getRiskLabel('low')).toBe('Shadow AI Well-Managed');
	});
});

// ─── calculateExposure ────────────────────────────────────────────────────────

describe('calculateExposure', () => {
	it('critical exposure range uses 40%–60% of breach premium', () => {
		const { low, high } = calculateExposure('critical');
		expect(low).toBe(Math.round(0.4 * SHADOW_AI_BREACH_PREMIUM));
		expect(high).toBe(Math.round(0.6 * SHADOW_AI_BREACH_PREMIUM));
		expect(low).toBe(268_000);
		expect(high).toBe(402_000);
	});

	it('high exposure range uses 25%–40% of breach premium', () => {
		const { low, high } = calculateExposure('high');
		expect(low).toBe(Math.round(0.25 * SHADOW_AI_BREACH_PREMIUM));
		expect(high).toBe(Math.round(0.4 * SHADOW_AI_BREACH_PREMIUM));
		expect(low).toBe(167_500);
		expect(high).toBe(268_000);
	});

	it('moderate exposure range uses 10%–25% of breach premium', () => {
		const { low, high } = calculateExposure('moderate');
		expect(low).toBe(Math.round(0.1 * SHADOW_AI_BREACH_PREMIUM));
		expect(high).toBe(Math.round(0.25 * SHADOW_AI_BREACH_PREMIUM));
		expect(low).toBe(67_000);
		expect(high).toBe(167_500);
	});

	it('low exposure range uses 2%–10% of breach premium', () => {
		const { low, high } = calculateExposure('low');
		expect(low).toBe(Math.round(0.02 * SHADOW_AI_BREACH_PREMIUM));
		expect(high).toBe(Math.round(0.1 * SHADOW_AI_BREACH_PREMIUM));
		expect(low).toBe(13_400);
		expect(high).toBe(67_000);
	});

	it('low is always less than high for all risk levels', () => {
		for (const level of ['critical', 'high', 'moderate', 'low'] as const) {
			const { low, high } = calculateExposure(level);
			expect(low).toBeLessThan(high);
		}
	});

	it('SHADOW_AI_BREACH_PREMIUM is $670,000 (IBM 2025)', () => {
		expect(SHADOW_AI_BREACH_PREMIUM).toBe(670_000);
	});
});

// ─── calculateResults ─────────────────────────────────────────────────────────

describe('calculateResults', () => {
	it('score 0 of 24 → critical risk (0%)', () => {
		const result = calculateResults(uniformResponses(0));
		expect(result.rawScore).toBe(0);
		expect(result.maxScore).toBe(MAX_SCORE);
		expect(result.percentage).toBe(0);
		expect(result.riskLevel).toBe('critical');
		expect(result.riskLabel).toBe('Severe Shadow AI Exposure');
	});

	it('score 6 of 24 → critical risk (25%)', () => {
		// 6/24 = 25% → critical boundary
		const responses = responsesFromScores([1, 1, 1, 1, 1, 1, 0, 0]);
		const result = calculateResults(responses);
		expect(result.rawScore).toBe(6);
		expect(result.percentage).toBe(25);
		expect(result.riskLevel).toBe('critical');
	});

	it('score 7 of 24 → high risk (29%)', () => {
		// 7/24 = 29.17% → rounds to 29% → high
		const responses = responsesFromScores([1, 1, 1, 1, 1, 1, 1, 0]);
		const result = calculateResults(responses);
		expect(result.rawScore).toBe(7);
		expect(result.percentage).toBe(29);
		expect(result.riskLevel).toBe('high');
	});

	it('score 12 of 24 → high risk (50%)', () => {
		// 12/24 = 50% → high boundary. 2+2+2+2+1+1+1+1 = 12
		const responses = responsesFromScores([2, 2, 2, 2, 1, 1, 1, 1]);
		const result = calculateResults(responses);
		expect(result.rawScore).toBe(12);
		expect(result.percentage).toBe(50);
		expect(result.riskLevel).toBe('high');
	});

	it('score 13 of 24 → moderate risk (54%)', () => {
		// 13/24 = 54.17% → rounds to 54% → moderate
		const responses = responsesFromScores([2, 2, 2, 2, 2, 1, 1, 1]);
		const result = calculateResults(responses);
		expect(result.rawScore).toBe(13);
		expect(result.percentage).toBe(54);
		expect(result.riskLevel).toBe('moderate');
	});

	it('score 18 of 24 → moderate risk (75%)', () => {
		// 18/24 = 75% → moderate boundary. 3+3+3+3+2+2+1+1 = 18
		const responses = responsesFromScores([3, 3, 3, 3, 2, 2, 1, 1]);
		const result = calculateResults(responses);
		expect(result.rawScore).toBe(18);
		expect(result.percentage).toBe(75);
		expect(result.riskLevel).toBe('moderate');
	});

	it('score 19 of 24 → low risk (79%)', () => {
		// 19/24 = 79.17% → rounds to 79% → low. 3+3+3+3+2+2+2+1 = 19
		const responses = responsesFromScores([3, 3, 3, 3, 2, 2, 2, 1]);
		const result = calculateResults(responses);
		expect(result.rawScore).toBe(19);
		expect(result.percentage).toBe(79);
		expect(result.riskLevel).toBe('low');
	});

	it('score 24 of 24 → low risk (100%)', () => {
		const result = calculateResults(uniformResponses(3));
		expect(result.rawScore).toBe(24);
		expect(result.maxScore).toBe(24);
		expect(result.percentage).toBe(100);
		expect(result.riskLevel).toBe('low');
		expect(result.riskLabel).toBe('Shadow AI Well-Managed');
	});

	it('exposure is populated for all risk levels', () => {
		for (const score of [0, 7, 13, 19] as const) {
			// approximate scores for each level
			const responses = uniformResponses(score === 0 ? 0 : score === 7 ? 1 : score === 13 ? 2 : 3);
			const result = calculateResults(responses);
			expect(result.exposure.low).toBeGreaterThan(0);
			expect(result.exposure.high).toBeGreaterThan(result.exposure.low);
		}
	});

	it('returns completedAt as a Date', () => {
		const result = calculateResults(uniformResponses(2));
		expect(result.completedAt).toBeInstanceOf(Date);
	});

	it('handles empty responses (all unanswered = score 0)', () => {
		const result = calculateResults(new Map());
		expect(result.rawScore).toBe(0);
		expect(result.riskLevel).toBe('critical');
	});

	it('ignores responses for unknown question IDs', () => {
		const map = new Map<string, AssessmentResponse>([
			['q_unknown', { questionId: 'q_unknown', selectedIndex: 3, score: 3 }]
		]);
		const result = calculateResults(map);
		expect(result.rawScore).toBe(0);
	});
});
