<script lang="ts">
	import SessionCard from '$lib/components/SessionCard.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let tab = $state<'active' | 'past'>('active');

	const registrationBySession = $derived(new Map(data.registrations.map((r) => [r.session_id, r])));
	const sessions = $derived(tab === 'active' ? data.active : data.past);
</script>

<svelte:head>
	<title>Jadwal Mentoring | Future Nexus</title>
	<meta name="description" content="Jadwal sesi mentoring Future Nexus. Masuk lalu daftar ke sesi yang kamu butuhkan." />
</svelte:head>

<div class="container">
	<header class="page-header">
		<span class="eyebrow">Jadwal</span>
		<h1>Jadwal Mentoring</h1>
		<p>
			Pilih sesi yang sesuai kebutuhanmu.
			{#if !data.user}<a href="/login?redirectTo=/jadwal">Masuk</a> untuk mendaftar.{/if}
		</p>
	</header>

	{#if form?.error}
		<p class="alert error" role="alert">{form.error}</p>
	{:else if form && 'success' in form && form.success}
		<p class="alert success" role="status">{form.success}</p>
	{/if}

	<div class="tabs" role="tablist" aria-label="Filter jadwal">
		<button
			type="button"
			role="tab"
			class="tab"
			class:active={tab === 'active'}
			aria-selected={tab === 'active'}
			onclick={() => (tab = 'active')}>Akan datang ({data.active.length})</button
		>
		<button
			type="button"
			role="tab"
			class="tab"
			class:active={tab === 'past'}
			aria-selected={tab === 'past'}
			onclick={() => (tab = 'past')}>Selesai / dibatalkan ({data.past.length})</button
		>
	</div>

	{#if sessions.length > 0}
		<div class="grid grid-2 list">
			{#each sessions as session (session.id)}
				<SessionCard
					{session}
					registration={registrationBySession.get(session.id) ?? null}
					loggedIn={!!data.user}
				/>
			{/each}
		</div>
	{:else}
		<p class="empty list">Belum ada sesi pada kategori ini.</p>
	{/if}
</div>

<style>
	.tabs {
		display: flex;
		gap: 0.5rem;
		margin: 1rem 0 0;
		flex-wrap: wrap;
	}
	.tab {
		font: inherit;
		font-weight: 600;
		font-size: 0.9rem;
		padding: 0.5rem 1rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--muted);
		cursor: pointer;
	}
	.tab.active {
		background: var(--primary);
		border-color: var(--primary);
		color: #fff;
	}
	.list {
		margin-top: 1.25rem;
	}
	.alert {
		margin: 0 0 0.5rem;
	}
</style>
