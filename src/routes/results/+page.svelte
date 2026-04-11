<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte.js';
	import { generateReport } from '$lib/pdf/report.js';
	import ExposureScore from '$lib/components/ExposureScore.svelte';
	import DollarEstimate from '$lib/components/DollarEstimate.svelte';
	import RiskBreakdown from '$lib/components/RiskBreakdown.svelte';
	import GovernanceCTA from '$lib/components/GovernanceCTA.svelte';
	import Button from '$lib/components/Button.svelte';

	// Guard: if no results, redirect to landing page
	$effect(() => {
		if (!assessment.results) {
			goto('/');
		}
	});

	const results = $derived(assessment.results);

	let isGeneratingPdf = $state(false);
	let pdfStatus = $state<'idle' | 'generating' | 'done' | 'error'>('idle');

	async function handleDownload() {
		if (!results || isGeneratingPdf) return;
		isGeneratingPdf = true;
		pdfStatus = 'generating';
		try {
			await generateReport(results);
			pdfStatus = 'done';
		} catch {
			pdfStatus = 'error';
		} finally {
			isGeneratingPdf = false;
		}
	}

	function handleRetake() {
		assessment.reset();
		goto('/');
	}
</script>

<svelte:head>
	<title>Your Results — Shadow AI Risk Assessment</title>
</svelte:head>

{#if results}
	<div class="max-w-2xl mx-auto py-8" data-testid="results-page">
		<!-- Data loss warning -->
		<div
			class="mb-6 flex items-start gap-2 rounded-lg border border-[var(--color-risk-high)]/30 bg-[var(--color-bg-panel)] px-4 py-3 text-xs text-[var(--color-text-secondary)]"
			role="alert"
			aria-label="Data loss warning"
		>
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				class="mt-0.5 shrink-0 text-[var(--color-risk-high)]"
				aria-hidden="true"
			>
				<path
					d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
				/>
				<line x1="12" y1="9" x2="12" y2="13" />
				<line x1="12" y1="17" x2="12.01" y2="17" />
			</svg>
			<span>
				<strong class="text-[var(--color-text-primary)]"
					>Your results exist only in this browser session.</strong
				>
				Closing or refreshing this tab will discard your responses. Download the PDF report below to keep
				your results.
			</span>
		</div>

		<!-- H1 -->
		<h1 class="text-3xl font-bold text-[var(--color-text-primary)] text-center mb-2">
			Your Shadow AI Exposure Score
		</h1>
		<p class="text-center text-sm text-[var(--color-text-secondary)] mb-8">
			Assessment completed {results.completedAt.toLocaleDateString('en-US', {
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			})}
		</p>

		<!-- Exposure Score -->
		<ExposureScore
			percentage={results.percentage}
			riskLevel={results.riskLevel}
			riskLabel={results.riskLabel}
			rawScore={results.rawScore}
			maxScore={results.maxScore}
		/>

		<!-- Dollar Estimate -->
		<DollarEstimate exposure={results.exposure} />

		<!-- Risk Breakdown -->
		<RiskBreakdown responses={assessment.responses} />

		<!-- Governance CTA (strategic funnel) -->
		<GovernanceCTA />

		<!-- Action Bar -->
		<div
			class="border-t border-[var(--color-border-muted)] pt-8 mt-4"
			data-testid="results-actions"
		>
			<!-- PDF status announcement -->
			<div aria-live="polite" aria-atomic="true" class="sr-only">
				{#if pdfStatus === 'generating'}
					Generating your Shadow AI Risk Brief PDF, please wait.
				{:else if pdfStatus === 'done'}
					Your Shadow AI Risk Brief PDF has been downloaded.
				{:else if pdfStatus === 'error'}
					An error occurred while generating the PDF. Please try again.
				{/if}
			</div>

			<div class="flex flex-col sm:flex-row gap-4">
				<Button
					variant="primary"
					onclick={handleDownload}
					disabled={isGeneratingPdf}
					ariaBusy={isGeneratingPdf}
					aria-label={isGeneratingPdf
						? 'Generating PDF, please wait'
						: 'Download Shadow AI Risk Brief as PDF'}
					data-testid="btn-download-pdf"
				>
					{#if isGeneratingPdf}
						<span aria-hidden="true">Generating...</span>
					{:else}
						Download Risk Brief (PDF)
					{/if}
				</Button>
				<Button
					variant="secondary"
					onclick={handleRetake}
					aria-label="Retake the Shadow AI Risk Assessment"
					data-testid="btn-retake"
				>
					Retake Assessment
				</Button>
			</div>

			{#if pdfStatus === 'error'}
				<p class="mt-3 text-sm text-[var(--color-risk-critical)]" role="alert">
					PDF generation failed. Please try again.
				</p>
			{/if}
		</div>
	</div>
{/if}
