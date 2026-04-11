<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-accent)] focus:text-white focus:rounded-md focus:font-semibold"
>
	Skip to main content
</a>

<div class="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
	<header class="border-b border-[var(--color-border-muted)] px-6 py-4">
		<nav class="max-w-4xl mx-auto flex items-center justify-between" aria-label="Main navigation">
			<a
				href="/"
				class="text-lg font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
			>
				Shadow AI Risk Assessment
			</a>
		</nav>
	</header>

	<main id="main-content" class="flex-1 px-6 py-8">
		<div class="max-w-4xl mx-auto">
			{@render children()}
		</div>
	</main>

	<footer class="border-t border-[var(--color-border-muted)] px-6 py-4">
		<div class="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
			<p class="text-xs text-[var(--color-text-secondary)]">
				Built by <a
					href="https://krystalmartinez.com"
					class="hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
					>Krystal Martinez</a
				>
			</p>
			<nav
				class="flex gap-4 text-xs text-[var(--color-text-secondary)]"
				aria-label="Footer navigation"
			>
				<a
					href="/privacy"
					class="hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
				>
					Privacy Policy
				</a>
				<a
					href="/terms"
					class="hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
				>
					Terms of Use
				</a>
			</nav>
		</div>
	</footer>
</div>
