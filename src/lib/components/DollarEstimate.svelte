<script lang="ts">
	import type { ExposureEstimate } from '$lib/types.js';

	interface Props {
		exposure: ExposureEstimate;
	}

	let { exposure }: Props = $props();

	const fmt = (n: number) =>
		n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

	const low = $derived(fmt(exposure.low));
	const high = $derived(fmt(exposure.high));
</script>

<section
	aria-labelledby="dollar-heading"
	class="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-panel)] p-6 mb-6"
	data-testid="dollar-estimate"
>
	<h2
		id="dollar-heading"
		class="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest mb-3"
	>
		Estimated Shadow AI Exposure
	</h2>

	<p
		aria-label="Estimated exposure: {low} to {high}"
		class="text-3xl font-bold text-[var(--color-text-primary)] mb-2"
	>
		{low} – {high}
	</p>

	<p class="text-sm text-[var(--color-text-secondary)] mb-4">
		Estimated annual financial exposure if a shadow AI breach occurs at your risk tier.
	</p>

	<p
		class="text-xs text-[var(--color-text-secondary)] border-t border-[var(--color-border-muted)] pt-3"
	>
		<strong>Methodology note:</strong> These ranges apply editorial probability estimates (not actuarial
		data) to IBM's 2025 confirmed average additional breach cost of $670,000 when shadow AI is involved.
		Ranges are illustrative of potential exposure magnitude, not actuarial projections.
	</p>
</section>
