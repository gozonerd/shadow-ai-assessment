<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost';
		disabled?: boolean;
		ariaDisabled?: boolean;
		onclick?: () => void;
		type?: 'button' | 'submit';
		'aria-label'?: string;
		'data-testid'?: string;
		children?: import('svelte').Snippet;
	}

	let {
		variant = 'primary',
		disabled = false,
		ariaDisabled = false,
		onclick,
		type = 'button',
		'aria-label': ariaLabel,
		'data-testid': testId,
		children
	}: Props = $props();

	const isDisabled = $derived(disabled || ariaDisabled);

	function handleClick() {
		if (!isDisabled) {
			onclick?.();
		}
	}

	const baseClasses =
		'inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]';

	const variantClasses = {
		primary:
			'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
		secondary:
			'border border-[var(--color-border-default)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
		ghost:
			'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card)] active:scale-[0.98]'
	};
</script>

<button
	{type}
	{disabled}
	aria-disabled={ariaDisabled || undefined}
	aria-label={ariaLabel}
	onclick={handleClick}
	data-testid={testId}
	class="{baseClasses} {variantClasses[variant]}"
>
	{#if children}
		{@render children()}
	{/if}
</button>
