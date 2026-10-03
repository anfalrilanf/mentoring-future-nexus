<script lang="ts">
	import { initials } from '$lib/utils';

	let {
		src = null,
		name = '',
		size = 48
	}: { src?: string | null; name?: string | null; size?: number } = $props();
</script>

{#if src}
	<img
		{src}
		alt={name ? `Foto ${name}` : 'Foto profil'}
		width={size}
		height={size}
		loading="lazy"
		style="width:{size}px;height:{size}px"
	/>
{:else}
	<span
		class="fallback"
		style="width:{size}px;height:{size}px;font-size:{Math.round(size * 0.38)}px"
		aria-hidden="true">{initials(name)}</span
	>
{/if}

<style>
	img,
	.fallback {
		border-radius: 50%;
		object-fit: cover;
		flex: none;
	}
	.fallback {
		display: inline-grid;
		place-items: center;
		background: linear-gradient(135deg, var(--primary), var(--accent));
		color: #fff;
		font-weight: 700;
	}
</style>
