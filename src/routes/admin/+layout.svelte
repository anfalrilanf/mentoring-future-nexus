<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const tabs = [
		{ href: '/admin', label: 'Ringkasan' },
		{ href: '/admin/program', label: 'Program' },
		{ href: '/admin/mentor', label: 'Mentor' },
		{ href: '/admin/jadwal', label: 'Jadwal' },
		{ href: '/admin/peserta', label: 'Peserta' },
		{ href: '/admin/informasi', label: 'Informasi' },
		{ href: '/admin/dokumentasi', label: 'Dokumentasi' }
	];

	function isActive(href: string): boolean {
		const path = page.url.pathname;
		return href === '/admin' ? path === '/admin' : path === href || path.startsWith(`${href}/`);
	}
</script>

<svelte:head>
	<title>Admin | Future Nexus</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="container admin">
	<header class="page-header">
		<span class="eyebrow">Admin</span>
		<h1>Panel Admin</h1>
	</header>

	<nav class="tabs" aria-label="Menu admin">
		{#each tabs as tab (tab.href)}
			<a
				href={tab.href}
				class:active={isActive(tab.href)}
				aria-current={isActive(tab.href) ? 'page' : undefined}>{tab.label}</a
			>
		{/each}
	</nav>

	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.admin .page-header {
		padding-bottom: 1rem;
	}
	.tabs {
		display: flex;
		gap: 0.4rem;
		overflow-x: auto;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border);
	}
	.tabs a {
		flex: none;
		padding: 0.5rem 1rem;
		border-radius: 999px;
		color: var(--muted);
		font-weight: 600;
		font-size: 0.9rem;
	}
	.tabs a:hover {
		text-decoration: none;
		background: var(--surface-soft);
		color: var(--text);
	}
	.tabs a.active {
		background: var(--primary-soft);
		color: var(--primary-dark);
	}
	.content {
		padding-top: 1.5rem;
	}
</style>
