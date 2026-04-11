<script lang="ts">
	import type { AssessmentResponse } from '$lib/types.js';
	import { questions } from '$lib/data/questions.js';

	interface Props {
		responses: ReadonlyMap<string, AssessmentResponse>;
	}

	let { responses }: Props = $props();

	const scoreLabels = ['Critical', 'High', 'Moderate', 'Low'] as const;
	const scoreColors = [
		'var(--color-risk-critical)',
		'var(--color-risk-high)',
		'var(--color-risk-moderate)',
		'var(--color-risk-low)'
	] as const;
</script>

<section
	aria-labelledby="breakdown-heading"
	class="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-panel)] p-6 mb-6"
	data-testid="risk-breakdown"
>
	<h2 id="breakdown-heading" class="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
		Question-by-Question Breakdown
	</h2>

	<ul class="space-y-3 list-none p-0 m-0" aria-label="Responses for each assessment question">
		{#each questions as question}
			{@const response = responses.get(question.id)}
			{@const score = response?.score ?? 0}
			{@const selectedLabel = response
				? question.options[response.selectedIndex]?.label
				: 'Not answered'}
			<li
				class="border border-[var(--color-border-muted)] rounded-lg p-4 bg-[var(--color-bg-card)]"
			>
				<div class="flex items-start justify-between gap-4">
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-[var(--color-text-primary)] mb-1">
							{question.text}
						</p>
						<p class="text-xs text-[var(--color-text-secondary)] leading-relaxed truncate">
							{selectedLabel}
						</p>
					</div>
					<div class="flex-shrink-0 text-right">
						<span
							class="inline-block text-xs font-semibold px-2 py-1 rounded"
							style="color: {scoreColors[score]}; background-color: color-mix(in srgb, {scoreColors[
								score
							]} 15%, transparent)"
							aria-label="Score: {scoreLabels[score]}"
						>
							{scoreLabels[score]}
						</span>
						<p class="text-xs text-[var(--color-text-secondary)] mt-1">{score}/3</p>
					</div>
				</div>
			</li>
		{/each}
	</ul>
</section>
