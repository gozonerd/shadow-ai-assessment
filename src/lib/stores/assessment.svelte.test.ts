import { describe, it, expect, beforeEach } from 'vitest';
import { assessment } from '$lib/stores/assessment.svelte.js';

// Reset store to initial state before each test
beforeEach(() => {
	assessment.reset();
});

// ─── Initial State ────────────────────────────────────────────────────────────

describe('AssessmentStore — initial state', () => {
	it('starts at step 0', () => {
		expect(assessment.currentStep).toBe(0);
	});

	it('starts with empty responses', () => {
		expect(assessment.responses.size).toBe(0);
	});

	it('starts as not complete', () => {
		expect(assessment.isComplete).toBe(false);
	});

	it('starts with null results', () => {
		expect(assessment.results).toBeNull();
	});

	it('reports totalQuestions as 8', () => {
		expect(assessment.totalQuestions).toBe(8);
	});

	it('reports progress as 0 at step 0', () => {
		expect(assessment.progress).toBe(0);
	});
});

// ─── answerQuestion ───────────────────────────────────────────────────────────

describe('AssessmentStore — answerQuestion', () => {
	it('records a response with the correct score for option index 0', () => {
		assessment.answerQuestion('q01', 0);
		const response = assessment.responses.get('q01');
		expect(response).toBeDefined();
		expect(response?.selectedIndex).toBe(0);
		expect(response?.score).toBe(0);
	});

	it('records a response with the correct score for option index 3 (max)', () => {
		assessment.answerQuestion('q01', 3);
		const response = assessment.responses.get('q01');
		expect(response?.selectedIndex).toBe(3);
		expect(response?.score).toBe(3);
	});

	it('overwrites a previous answer for the same question', () => {
		assessment.answerQuestion('q01', 1);
		assessment.answerQuestion('q01', 3);
		const response = assessment.responses.get('q01');
		expect(response?.score).toBe(3);
		expect(response?.selectedIndex).toBe(3);
		expect(assessment.responses.size).toBe(1);
	});

	it('silently ignores an unknown question ID', () => {
		assessment.answerQuestion('q_nonexistent', 0);
		expect(assessment.responses.size).toBe(0);
	});

	it('silently ignores an out-of-range option index', () => {
		assessment.answerQuestion('q01', 99);
		expect(assessment.responses.size).toBe(0);
	});

	it('records correct questionId on the response object', () => {
		assessment.answerQuestion('q05', 2);
		const response = assessment.responses.get('q05');
		expect(response?.questionId).toBe('q05');
	});
});

// ─── nextStep / previousStep ──────────────────────────────────────────────────

describe('AssessmentStore — nextStep / previousStep', () => {
	it('increments step when nextStep is called', () => {
		assessment.nextStep();
		expect(assessment.currentStep).toBe(1);
	});

	it('clamps at totalQuestions — does not exceed', () => {
		for (let i = 0; i < 12; i++) {
			assessment.nextStep();
		}
		expect(assessment.currentStep).toBe(assessment.totalQuestions);
	});

	it('decrements step when previousStep is called', () => {
		assessment.nextStep();
		assessment.nextStep();
		assessment.previousStep();
		expect(assessment.currentStep).toBe(1);
	});

	it('clamps at 0 — does not go negative', () => {
		assessment.previousStep();
		assessment.previousStep();
		expect(assessment.currentStep).toBe(0);
	});
});

// ─── progress ─────────────────────────────────────────────────────────────────

describe('AssessmentStore — progress', () => {
	it('returns correct fraction after advancing steps', () => {
		assessment.nextStep();
		assessment.nextStep();
		expect(assessment.progress).toBeCloseTo(2 / 8);
	});

	it('returns 1.0 when at totalQuestions', () => {
		for (let i = 0; i < 8; i++) {
			assessment.nextStep();
		}
		expect(assessment.progress).toBe(1);
	});
});

// ─── calculateResults ─────────────────────────────────────────────────────────

describe('AssessmentStore — calculateResults', () => {
	it('sets isComplete to true', () => {
		assessment.calculateResults();
		expect(assessment.isComplete).toBe(true);
	});

	it('produces a non-null ShadowAIResult', () => {
		assessment.calculateResults();
		expect(assessment.results).not.toBeNull();
	});

	it('result has all required fields', () => {
		for (const id of ['q01', 'q02', 'q03', 'q04', 'q05', 'q06', 'q07', 'q08']) {
			assessment.answerQuestion(id, 2);
		}
		assessment.calculateResults();

		const r = assessment.results;
		expect(r?.rawScore).toBeGreaterThanOrEqual(0);
		expect(r?.maxScore).toBe(24);
		expect(r?.percentage).toBeGreaterThanOrEqual(0);
		expect(r?.percentage).toBeLessThanOrEqual(100);
		expect(r?.riskLevel).toMatch(/^(critical|high|moderate|low)$/);
		expect(r?.riskLabel).toBeTruthy();
		expect(r?.exposure.low).toBeGreaterThan(0);
		expect(r?.exposure.high).toBeGreaterThan(r?.exposure.low ?? 0);
		expect(r?.completedAt).toBeInstanceOf(Date);
	});

	it('unanswered assessment → score 0 → critical risk', () => {
		assessment.calculateResults();
		expect(assessment.results?.rawScore).toBe(0);
		expect(assessment.results?.riskLevel).toBe('critical');
	});

	it('all-max answers → score 24 → low risk', () => {
		for (const id of ['q01', 'q02', 'q03', 'q04', 'q05', 'q06', 'q07', 'q08']) {
			assessment.answerQuestion(id, 3);
		}
		assessment.calculateResults();
		expect(assessment.results?.rawScore).toBe(24);
		expect(assessment.results?.riskLevel).toBe('low');
	});
});

// ─── reset ────────────────────────────────────────────────────────────────────

describe('AssessmentStore — reset', () => {
	it('clears all state back to initial values', () => {
		assessment.answerQuestion('q01', 3);
		assessment.nextStep();
		assessment.nextStep();
		assessment.calculateResults();

		assessment.reset();

		expect(assessment.currentStep).toBe(0);
		expect(assessment.responses.size).toBe(0);
		expect(assessment.isComplete).toBe(false);
		expect(assessment.results).toBeNull();
		expect(assessment.progress).toBe(0);
	});
});
