<script lang="ts">
	import { enhance } from '$app/forms';
	import Logo from '$lib/components/Logo.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Masuk | Future Nexus</title>
</svelte:head>

<div class="auth-wrap">
	<div class="card auth-card stack">
		<div class="center"><Logo size={44} showText={false} /></div>
		<div class="center">
			<h2>Masuk</h2>
			<p class="muted small">Lanjutkan perjalanan mentoringmu.</p>
		</div>

		{#if form?.error}
			<p class="alert error" role="alert">{form.error}</p>
		{/if}

		<form
			method="POST"
			action="?redirectTo={encodeURIComponent(data.redirectTo)}"
			class="form"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			<div class="field">
				<label for="email">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					required
					value={form?.email ?? ''}
				/>
			</div>
			<div class="field">
				<label for="password">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
				/>
			</div>
			<a class="small" href="/lupa-password">Lupa password?</a>
			<button class="btn btn-primary btn-block" type="submit" disabled={loading}>
				{loading ? 'Memproses...' : 'Masuk'}
			</button>
		</form>

		<p class="center small muted">
			Belum punya akun? <a href="/register">Daftar</a>
		</p>
	</div>
</div>

<style>
	.center {
		text-align: center;
		display: grid;
		justify-items: center;
	}
	.center h2 {
		margin-bottom: 0.15rem;
	}
	.center p {
		margin: 0;
	}
</style>
