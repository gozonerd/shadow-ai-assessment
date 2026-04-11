<script lang="ts">
	const GOVERNANCE_URL = 'https://governance.krystalmartinez.com';
</script>

<section
	aria-labelledby="governance-heading"
	class="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-6 mb-6"
	data-testid="governance-cta"
>
	<div class="flex items-start gap-3 mb-4">
		<div
			class="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-accent-muted)] flex items-center justify-center"
			aria-hidden="true"
		>
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="var(--color-accent)"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
			</svg>
		</div>
		<div>
			<h2
				id="governance-heading"
				class="text-base font-semibold text-[var(--color-text-primary)] mb-1"
			>
				Shadow AI is just one piece of the governance picture.
			</h2>
			<p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
				This assessment identifies your shadow AI exposure. For a complete AI governance readiness
				score — covering policy, risk management, compliance, oversight, and AI inventory — visit
				the full governance tool.
			</p>
		</div>
	</div>

	<a
		href={GOVERNANCE_URL}
		target="_blank"
		rel="noopener noreferrer"
		class="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] px-5 py-2.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-elevated)] min-h-[44px]"
		aria-label="Get your AI governance readiness score at governance.krystalmartinez.com (opens in new tab)"
	>
		Get Your Governance Score
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			aria-hidden="true"
		>
			<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
			<polyline points="15,3 21,3 21,9" />
			<line x1="10" y1="14" x2="21" y2="3" />
		</svg>
	</a>

	<p class="mt-3 text-xs text-[var(--color-text-secondary)]">
		Free · 18 questions · ~5 minutes · No account required
	</p>
</section>
