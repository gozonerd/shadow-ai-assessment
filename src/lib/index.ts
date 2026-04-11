// Public API re-exports
export type {
	AssessmentResponse,
	CategoryId,
	ExposureEstimate,
	OptionScore,
	QuestionOption,
	RiskLevel,
	ShadowAIQuestion,
	ShadowAIResult
} from './types.js';

export { questions } from './data/questions.js';

export {
	calculateExposure,
	calculateResults,
	determineRiskLevel,
	getRiskLabel,
	MAX_SCORE,
	SHADOW_AI_BREACH_PREMIUM
} from './scoring.js';

export { assessment } from './stores/assessment.svelte.js';
