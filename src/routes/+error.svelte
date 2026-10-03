<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} | Future Nexus</title>
</svelte:head>

<div class="container wrap">
	<div class="card box">
		<p class="code">{page.status}</p>
		<h1>
			{#if page.status === 404}
				Halaman tidak ditemukan
			{:else if page.status === 403}
				Akses ditolak
			{:else}
				Terjadi kesalahan
			{/if}
		</h1>
		<p class="muted">{page.error?.message}</p>
		<a class="btn btn-primary" href="/">Kembali ke beranda</a>
	</div>
</div>

<style>
	.wrap {
		min-height: 60vh;
		display: grid;
		place-items: center;
		padding-top: 2rem;
	}
	.box {
		text-align: center;
		max-width: 480px;
	}
	.code {
		font-size: 3.5rem;
		font-weight: 800;
		margin: 0;
		background: linear-gradient(90deg, var(--primary), var(--accent));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	h1 {
		font-size: 1.5rem;
	}
</style>
