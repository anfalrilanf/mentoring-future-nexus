<script lang="ts">
	import { page } from '$app/state';
	import Logo from './Logo.svelte';
	import Avatar from './Avatar.svelte';
	import type { Profile } from '$lib/types';

	let { loggedIn = false, profile = null }: { loggedIn?: boolean; profile?: Profile | null } =
		$props();

	let open = $state(false);

	const links = [
		{ href: '/', label: 'Beranda' },
		{ href: '/tentang', label: 'Tentang' },
		{ href: '/program', label: 'Program' },
		{ href: '/mentor', label: 'Mentor' },
		{ href: '/jadwal', label: 'Jadwal' }
	];

	function isActive(href: string): boolean {
		const path = page.url.pathname;
		return href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);
	}

	function close() {
		open = false;
	}
</script>

<header class="nav">
	<div class="container bar">
		<a href="/" class="brand" onclick={close} aria-label="Future Nexus - Beranda">
			<Logo size={34} />
		</a>

		<button
			class="toggle"
			type="button"
			aria-label="Buka menu"
			aria-expanded={open}
			aria-controls="main-menu"
			onclick={() => (open = !open)}
		>
			<span></span><span></span><span></span>
		</button>

		<nav id="main-menu" class:open aria-label="Navigasi utama">
			<ul>
				{#each links as link (link.href)}
					<li>
						<a
							href={link.href}
							class:active={isActive(link.href)}
							aria-current={isActive(link.href) ? 'page' : undefined}
							onclick={close}>{link.label}</a
						>
					</li>
				{/each}
			</ul>

			<div class="actions">
				{#if loggedIn}
					{#if profile?.role === 'admin'}
						<a class="btn btn-outline btn-sm" href="/admin" onclick={close}>Admin</a>
					{/if}
					<a class="me" href="/dashboard" onclick={close}>
						<Avatar src={profile?.avatar_url} name={profile?.full_name} size={32} />
						<span>Dashboard</span>
					</a>
					<form method="POST" action="/logout">
						<button class="btn btn-ghost btn-sm" type="submit">Keluar</button>
					</form>
				{:else}
					<a class="btn btn-ghost btn-sm" href="/login" onclick={close}>Masuk</a>
					<a class="btn btn-primary btn-sm" href="/register" onclick={close}>Daftar</a>
				{/if}
			</div>
		</nav>
	</div>
</header>

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: 20;
		background: rgb(255 255 255 / 0.9);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--border);
	}
	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 64px;
	}
	.brand {
		text-decoration: none;
	}
	nav {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
	ul {
		display: flex;
		gap: 0.25rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	li a {
		display: block;
		padding: 0.45rem 0.8rem;
		border-radius: 999px;
		color: var(--muted);
		font-weight: 600;
		font-size: 0.93rem;
	}
	li a:hover {
		color: var(--text);
		background: var(--surface-soft);
		text-decoration: none;
	}
	li a.active {
		color: var(--primary-dark);
		background: var(--primary-soft);
	}
	.actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.me {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--text);
		font-weight: 600;
		font-size: 0.9rem;
	}
	.me:hover {
		text-decoration: none;
	}
	.toggle {
		display: none;
		flex-direction: column;
		gap: 5px;
		background: none;
		border: none;
		padding: 0.5rem;
		cursor: pointer;
	}
	.toggle span {
		width: 22px;
		height: 2px;
		background: var(--text);
		border-radius: 2px;
	}

	@media (max-width: 860px) {
		.toggle {
			display: flex;
		}
		nav {
			display: none;
			position: absolute;
			top: 64px;
			left: 0;
			right: 0;
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
			padding: 1rem 1.25rem 1.25rem;
			background: var(--surface);
			border-bottom: 1px solid var(--border);
			box-shadow: var(--shadow);
		}
		nav.open {
			display: flex;
		}
		ul {
			flex-direction: column;
		}
		.actions {
			flex-wrap: wrap;
			padding-top: 0.75rem;
			border-top: 1px solid var(--border);
		}
	}
</style>
