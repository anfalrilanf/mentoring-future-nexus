<script lang="ts">
	let { size = 36, showText = true }: { size?: number; showText?: boolean } = $props();
</script>

<span class="logo">
	<svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
		<defs>
			<linearGradient id="fn-logo-grad" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" stop-color="#4f46e5" />
				<stop offset="1" stop-color="#14b8a6" />
			</linearGradient>
		</defs>
		<rect width="64" height="64" rx="16" fill="url(#fn-logo-grad)" />
		<g stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none">
			<path d="M18 44 L32 20 L46 44" />
			<path d="M18 44 H46" />
		</g>
		<g fill="#fff">
			<circle cx="18" cy="44" r="5" />
			<circle cx="32" cy="20" r="5" />
			<circle cx="46" cy="44" r="5" />
		</g>
	</svg>
	{#if showText}
		<span class="text">
			<strong>Future Nexus</strong>
			<small>Mentoring SMANWAY</small>
		</span>
	{/if}
</span>

<style>
	.logo {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--text);
	}
	.text {
		display: flex;
		flex-direction: column;
		line-height: 1.1;
	}
	strong {
		font-size: 1.05rem;
		font-weight: 800;
	}
	small {
		font-size: 0.7rem;
		color: var(--muted);
		font-weight: 600;
		letter-spacing: 0.04em;
	}
</style>
