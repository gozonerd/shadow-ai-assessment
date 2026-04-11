<script lang="ts">
	const features = [
		'Your Shadow AI Exposure Score (0–100)',
		'Estimated dollar risk range ($13K–$402K)',
		'8 targeted risk questions across 5 categories',
		'Downloadable Shadow AI Risk Brief (PDF)',
		'100% client-side — no data ever leaves your browser',
		'Immediate, actionable next steps'
	] as const;
</script>

<svelte:head>
	<title>Shadow AI Risk Assessment — Free 2-Minute Exposure Scan</title>
	<meta
		name="description"
		content="Discover your organization's Shadow AI exposure in 2 minutes. Get a free risk score, dollar-exposure estimate, and downloadable risk brief — 100% client-side."
	/>
</svelte:head>

<!-- ─── Hero ──────────────────────────────────────────────────────────────────── -->

<section aria-labelledby="hero-heading" class="py-16 md:py-24 text-center">
	<div class="max-w-2xl mx-auto">
		<p class="text-sm font-semibold tracking-widest text-[var(--color-warning)] uppercase mb-4">
			Free Risk Assessment
		</p>

		<h1
			id="hero-heading"
			class="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] leading-tight mb-6"
		>
			How Much Is Shadow AI<br class="hidden sm:inline" /> Costing You?
		</h1>

		<p class="text-lg text-[var(--color-text-secondary)] mb-4 max-w-xl mx-auto">
			Employees are using AI tools you don't know about — and the average organization pays
			<strong class="text-[var(--color-text-primary)]">$670,000 more</strong> when a shadow AI breach
			occurs.
		</p>

		<p class="text-base text-[var(--color-text-secondary)] mb-10 max-w-xl mx-auto">
			8 questions. 2 minutes. A clear exposure score and dollar estimate you can act on.
		</p>

		<a
			href="/assess"
			class="inline-flex items-center justify-center min-h-[52px] px-8 py-3 rounded-lg font-semibold text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus-ring)] text-base"
		>
			Take the 2-Minute Assessment
		</a>

		<p class="mt-4 text-xs text-[var(--color-text-secondary)]">
			No account required. No data collected. 100% client-side.
		</p>
	</div>
</section>

<!-- ─── Stats Strip ───────────────────────────────────────────────────────────── -->

<section aria-label="Shadow AI risk statistics" class="py-10">
	<ul
		class="grid grid-cols-1 sm:grid-cols-3 gap-4 list-none p-0 m-0"
		aria-label="Key shadow AI statistics from IBM 2025 Cost of a Data Breach Report"
	>
		<li
			class="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-6 text-center"
		>
			<p
				class="text-4xl font-bold text-[var(--color-accent)] mb-2"
				aria-label="1 in 5 organizations"
			>
				1 in 5
			</p>
			<p class="text-sm text-[var(--color-text-secondary)] leading-snug">
				organizations experienced a shadow AI breach
			</p>
			<p class="text-xs text-[var(--color-text-secondary)] mt-2">IBM 2025</p>
		</li>

		<li
			class="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-6 text-center"
		>
			<p class="text-4xl font-bold text-[var(--color-accent)] mb-2" aria-label="670,000 dollars">
				$670K
			</p>
			<p class="text-sm text-[var(--color-text-secondary)] leading-snug">
				average additional breach cost when shadow AI is involved
			</p>
			<p class="text-xs text-[var(--color-text-secondary)] mt-2">IBM 2025</p>
		</li>

		<li
			class="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] p-6 text-center"
		>
			<p class="text-4xl font-bold text-[var(--color-accent)] mb-2" aria-label="97 percent">97%</p>
			<p class="text-sm text-[var(--color-text-secondary)] leading-snug">
				of breached organizations lacked proper AI access controls
			</p>
			<p class="text-xs text-[var(--color-text-secondary)] mt-2">IBM 2025</p>
		</li>
	</ul>
</section>

<!-- ─── Feature Box ───────────────────────────────────────────────────────────── -->

<section
	aria-labelledby="features-heading"
	class="py-10 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-panel)] px-8 mb-16"
>
	<h2
		id="features-heading"
		class="text-xl font-semibold text-[var(--color-text-primary)] mb-6 text-center"
	>
		What you'll learn in 2 minutes
	</h2>

	<ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0 m-0 max-w-xl mx-auto">
		{#each features as feature}
			<li class="flex items-start gap-3">
				<span
					class="text-[var(--color-success)] font-bold text-lg mt-0.5 select-none"
					aria-hidden="true">✓</span
				>
				<span class="text-[var(--color-text-secondary)] text-sm leading-relaxed">{feature}</span>
			</li>
		{/each}
	</ul>

	<div class="mt-8 text-center">
		<a
			href="/assess"
			class="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 rounded-lg font-semibold text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus-ring)] text-sm"
		>
			Start Free Assessment
		</a>
	</div>
</section>
