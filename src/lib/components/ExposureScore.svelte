<script lang="ts">
	import type { RiskLevel } from '$lib/types.js';

	interface Props {
		percentage: number;
		riskLevel: RiskLevel;
		riskLabel: string;
		rawScore: number;
		maxScore: number;
	}

	let { percentage, riskLevel, riskLabel, rawScore, maxScore }: Props = $props();

	const riskColors: Record<RiskLevel, string> = {
		critical: 'var(--color-risk-critical)',
		high: 'var(--color-risk-high)',
		moderate: 'var(--color-risk-moderate)',
		low: 'var(--color-risk-low)'
	};

	const riskDescriptions: Record<RiskLevel, string> = {
		critical: 'Immediate action required — your organization has critical shadow AI exposure.',
		high: 'Significant risk — meaningful controls are needed across multiple areas.',
		moderate: 'Moderate risk — improvement is recommended in several areas.',
		low: 'Well-managed — continue monitoring and maintaining your controls.'
	};
</script>

<div class="text-center py-8" data-testid="exposure-score">
	<div
		aria-label="{percentage} percent — {riskLabel}"
		aria-describedby="score-description"
		class="inline-block"
	>
		<span
			class="block text-8xl font-extrabold leading-none tabular-nums"
			style="color: {riskColors[riskLevel]}"
		>
			{percentage}%
		</span>
		<span class="block text-2xl font-bold mt-2" style="color: {riskColors[riskLevel]}">
			{riskLabel}
		</span>
	</div>

	<p
		id="score-description"
		class="mt-4 text-sm text-[var(--color-text-secondary)] max-w-md mx-auto"
	>
		{riskDescriptions[riskLevel]}
	</p>

	<p class="mt-2 text-xs text-[var(--color-text-secondary)]">
		Score: {rawScore} / {maxScore} points
	</p>
</div>
