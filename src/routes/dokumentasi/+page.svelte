<script lang="ts">
	import { formatShortDate } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Dokumentasi | Future Nexus</title>
</svelte:head>

<div class="container">
	<header class="page-header">
		<span class="eyebrow">Dokumentasi</span>
		<h1>Momen Mentoring</h1>
		<p>Cuplikan kegiatan mentoring Future Nexus.</p>
	</header>

	{#if data.items.length > 0}
		<div class="grid grid-3">
			{#each data.items as item (item.id)}
				<figure class="card item">
					{#if item.image_url}
						<img src={item.image_url} alt={item.title} loading="lazy" />
					{/if}
					<figcaption>
						<h3>{item.title}</h3>
						{#if item.description}<p class="muted small">{item.description}</p>{/if}
						<span class="muted small">{formatShortDate(item.created_at)}</span>
					</figcaption>
				</figure>
			{/each}
		</div>
	{:else}
		<p class="empty">Dokumentasi kegiatan akan segera ditambahkan.</p>
	{/if}
</div>

<style>
	.item {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
	img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}
	figcaption {
		padding: 1rem 1.25rem 1.25rem;
	}
	figcaption p {
		margin: 0 0 0.5rem;
	}
</style>
