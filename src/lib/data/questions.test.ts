import { describe, it, expect } from 'vitest';
import { questions } from './questions.js';

describe('questions data integrity', () => {
	it('has exactly 8 questions', () => {
		expect(questions).toHaveLength(8);
	});

	it('each question has exactly 4 options', () => {
		for (const q of questions) {
			expect(q.options).toHaveLength(4);
		}
	});

	it('all option scores are in {0, 1, 2, 3}', () => {
		const valid = new Set([0, 1, 2, 3]);
		for (const q of questions) {
			for (const opt of q.options) {
				expect(valid.has(opt.score)).toBe(true);
			}
		}
	});

	it('option scores within each question are 0, 1, 2, 3 in order', () => {
		for (const q of questions) {
			expect(q.options[0].score).toBe(0);
			expect(q.options[1].score).toBe(1);
			expect(q.options[2].score).toBe(2);
			expect(q.options[3].score).toBe(3);
		}
	});

	it('all question IDs are unique', () => {
		const ids = questions.map((q) => q.id);
		const unique = new Set(ids);
		expect(unique.size).toBe(ids.length);
	});

	it('question IDs follow the q01–q08 pattern', () => {
		const ids = questions.map((q) => q.id);
		expect(ids).toEqual(['q01', 'q02', 'q03', 'q04', 'q05', 'q06', 'q07', 'q08']);
	});

	it('all questions have non-empty text', () => {
		for (const q of questions) {
			expect(q.text.trim().length).toBeGreaterThan(0);
		}
	});

	it('all questions have non-empty helpText', () => {
		for (const q of questions) {
			expect(q.helpText.trim().length).toBeGreaterThan(0);
		}
	});

	it('all questions have a valid riskCategory', () => {
		const valid = new Set(['visibility', 'policy', 'data', 'detection', 'training']);
		for (const q of questions) {
			expect(valid.has(q.riskCategory)).toBe(true);
		}
	});

	it('all option labels are non-empty strings', () => {
		for (const q of questions) {
			for (const opt of q.options) {
				expect(typeof opt.label).toBe('string');
				expect(opt.label.trim().length).toBeGreaterThan(0);
			}
		}
	});

	it('max possible score from all questions at score 3 equals 24', () => {
		const max = questions.reduce((sum, q) => sum + q.options[3].score, 0);
		expect(max).toBe(24);
	});

	it('min possible score from all questions at score 0 equals 0', () => {
		const min = questions.reduce((sum, q) => sum + q.options[0].score, 0);
		expect(min).toBe(0);
	});
});
