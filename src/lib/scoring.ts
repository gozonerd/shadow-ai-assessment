import type {
	AssessmentResponse,
	ExposureEstimate,
	RiskLevel,
	ShadowAIResult
} from '$lib/types.js';
import { questions } from '$lib/data/questions.js';

// ─── Constants ───────────────────────────────────────────────────────────────

/** Maximum possible score: 8 questions × 3 points each. */
export const MAX_SCORE = 24;

/**
 * Additional breach cost when shadow AI is involved.
 * Source: IBM 2025 Cost of a Data Breach Report (published July 30, 2025).
 * Citation: https://www.ibm.com/reports/data-breach
 */
export const SHADOW_AI_BREACH_PREMIUM = 670_000;

/**
 * Probability-of-breach ranges by risk tier.
 * Derivation (editorial — illustrative, not actuarial):
 *   IBM 2025 baseline: 20% of all orgs experienced a shadow AI breach.
 *   Tier multipliers applied to that baseline:
 *     critical: ~2x–3x baseline → 0.40–0.60
 *     high:     ~1.25x–2x baseline → 0.25–0.40
 *     moderate: ~0.5x–1.25x baseline → 0.10–0.25
 *     low:      ~0.1x–0.5x baseline → 0.02–0.10
 */
const EXPOSURE_RANGES: Record<RiskLevel, [number, number]> = {
	critical: [0.4, 0.6],
	high: [0.25, 0.4],
	moderate: [0.1, 0.25],
	low: [0.02, 0.1]
};

const RISK_LABELS: Record<RiskLevel, string> = {
	critical: 'Severe Shadow AI Exposure',
	high: 'Significant Shadow AI Risk',
	moderate: 'Moderate Shadow AI Risk',
	low: 'Shadow AI Well-Managed'
};

// ─── Pure functions ───────────────────────────────────────────────────────────

/**
 * Determines risk level from a 0–100 percentage score.
 * 0–25 → critical, 26–50 → high, 51–75 → moderate, 76–100 → low.
 */
export function determineRiskLevel(percentage: number): RiskLevel {
	if (percentage <= 25) return 'critical';
	if (percentage <= 50) return 'high';
	if (percentage <= 75) return 'moderate';
	return 'low';
}

/** Returns the human-readable label for a risk level. */
export function getRiskLabel(riskLevel: RiskLevel): string {
	return RISK_LABELS[riskLevel];
}

/**
 * Calculates the dollar-exposure estimate range for a given risk level.
 * Applies the IBM 2025 breach premium to editorial probability ranges.
 * Returned values are rounded to the nearest dollar.
 */
export function calculateExposure(riskLevel: RiskLevel): ExposureEstimate {
	const [probLow, probHigh] = EXPOSURE_RANGES[riskLevel];
	return {
		low: Math.round(probLow * SHADOW_AI_BREACH_PREMIUM),
		high: Math.round(probHigh * SHADOW_AI_BREACH_PREMIUM)
	};
}

/**
 * Calculates the full assessment result from a map of responses.
 * Pure function — does not mutate input. Returns a ShadowAIResult.
 */
export function calculateResults(
	responses: ReadonlyMap<string, AssessmentResponse>
): ShadowAIResult {
	let rawScore = 0;
	for (const question of questions) {
		const response = responses.get(question.id);
		if (response) {
			rawScore += response.score;
		}
	}

	const percentage = Math.round((rawScore / MAX_SCORE) * 100);
	const riskLevel = determineRiskLevel(percentage);

	return {
		rawScore,
		maxScore: MAX_SCORE,
		percentage,
		riskLevel,
		riskLabel: getRiskLabel(riskLevel),
		exposure: calculateExposure(riskLevel),
		completedAt: new Date()
	};
}
