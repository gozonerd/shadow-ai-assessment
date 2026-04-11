// ─── Primitive types ────────────────────────────────────────────────────────

export type RiskLevel = 'critical' | 'high' | 'moderate' | 'low';

export type OptionScore = 0 | 1 | 2 | 3;

/** Risk domain that each question measures. Used for per-category breakdown on results page. */
export type CategoryId = 'visibility' | 'policy' | 'data' | 'detection' | 'training';

// ─── Question types ─────────────────────────────────────────────────────────

export interface QuestionOption {
	label: string;
	score: OptionScore;
}

export interface ShadowAIQuestion {
	id: string;
	text: string;
	/** Explains why this question matters — shown as contextual help during assessment. */
	helpText: string;
	/** Risk domain this question measures — used for results breakdown. */
	riskCategory: CategoryId;
	/** Exactly 4 options, scored worst→best (0→3). */
	options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
}

// ─── Response types ─────────────────────────────────────────────────────────

export interface AssessmentResponse {
	questionId: string;
	selectedIndex: number;
	score: OptionScore;
}

// ─── Result types ───────────────────────────────────────────────────────────

/**
 * Dollar-exposure estimate range.
 * Source: IBM 2025 Cost of a Data Breach Report ($670K shadow AI breach premium).
 * Ranges are editorial estimates — not actuarial calculations.
 */
export interface ExposureEstimate {
	low: number;
	high: number;
}

export interface ShadowAIResult {
	rawScore: number;
	maxScore: number;
	percentage: number;
	riskLevel: RiskLevel;
	riskLabel: string;
	exposure: ExposureEstimate;
	completedAt: Date;
}
