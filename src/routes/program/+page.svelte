<script lang="ts">
	import ProgramCard from '$lib/components/ProgramCard.svelte';
	import { PROGRAM_CATEGORIES } from '$lib/constants';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let selected = $state<string>('Semua');

	const filtered = $derived(
		selected === 'Semua' ? data.programs : data.programs.filter((p) => p.category === selected)
	);
</script>

<svelte:head>
	<title>Program Mentoring | Future Nexus</title>
	<meta
		name="description"
		content="Pilih program mentoring: persiapan masuk perguruan tinggi, pemilihan jurusan dan kampus, UTBK, adaptasi kuliah, dan sharing alumni."
	/>
</svelte:head>

<div class="container">
	<header class="page-header">
		<span class="eyebrow">Program</span>
		<h1>Program Mentoring</h1>
		<p>Pilih topik yang paling kamu butuhkan. Setiap program dipandu oleh mentor alumni.</p>
	</header>

	<div class="filters" role="group" aria-label="Filter kategori">
		{#each ['Semua', ...PROGRAM_CATEGORIES] as category (category)}
			<button
				type="button"
				class="chip"
				class:active={selected === category}
				aria-pressed={selected === category}
				onclick={() => (selected = category)}>{category}</button
			>
		{/each}
	</div>

	{#if filtered.length > 0}
		<div class="grid grid-2 list">
			{#each filtered as program (program.id)}
				<ProgramCard {program} />
			{/each}
		</div>
	{:else}
		<p class="empty list">Belum ada program pada kategori ini.</p>
	{/if}
</div>

<style>
	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.chip {
		font: inherit;
		font-size: 0.88rem;
		font-weight: 600;
		padding: 0.45rem 0.95rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--muted);
		cursor: pointer;
	}
	.chip:hover {
		border-color: var(--primary);
		color: var(--primary);
	}
	.chip.active {
		background: var(--primary);
		border-color: var(--primary);
		color: #fff;
	}
	.list {
		margin-top: 1.5rem;
	}
</style>
