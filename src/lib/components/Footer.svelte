<script lang="ts">
	import Logo from './Logo.svelte';

	const year = new Date().getFullYear();
</script>

<footer>
	<div class="container inner">
		<div>
			<Logo size={30} />
			<p class="muted small desc">
				Platform mentoring dari komunitas alumni SMANWAY untuk membantu siswa menyiapkan diri
				menuju perguruan tinggi.
			</p>
		</div>
		<nav aria-label="Tautan footer">
			<a href="/tentang">Tentang</a>
			<a href="/program">Program</a>
			<a href="/mentor">Mentor</a>
			<a href="/jadwal">Jadwal</a>
			<a href="/dokumentasi">Dokumentasi</a>
		</nav>
	</div>
	<div class="container copy small muted">
		&copy; {year} Mentoring Future Nexus &middot; Komunitas Alumni SMANWAY
	</div>
</footer>

<style>
	footer {
		margin-top: 3rem;
		padding: 2rem 0 1.5rem;
		background: var(--surface);
		border-top: 1px solid var(--border);
	}
	.inner {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		justify-content: space-between;
		align-items: flex-start;
	}
	.desc {
		max-width: 360px;
		margin-top: 0.75rem;
	}
	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem;
	}
	nav a {
		color: var(--muted);
		font-weight: 600;
		font-size: 0.9rem;
	}
	.copy {
		margin-top: 1.25rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
	}
</style>
