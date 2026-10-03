<script lang="ts">
	import { enhance } from '$app/forms';
	import Logo from '$lib/components/Logo.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Daftar | Future Nexus</title>
</svelte:head>

<div class="auth-wrap">
	<div class="card auth-card stack">
		<div class="center"><Logo size={44} showText={false} /></div>
		<div class="center">
			<h2>Buat akun</h2>
			<p class="muted small">Gratis. Mulai mentoring bersama alumni SMANWAY.</p>
		</div>

		{#if form?.error}
			<p class="alert error" role="alert">{form.error}</p>
		{/if}
		{#if form?.success}
			<p class="alert success" role="status">{form.success}</p>
		{/if}

		<form
			method="POST"
			class="form"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update({ reset: false });
					loading = false;
				};
			}}
		>
			<div class="field">
				<label for="full_name">Nama lengkap</label>
				<input
					id="full_name"
					name="full_name"
					type="text"
					autocomplete="name"
					required
					value={form?.full_name ?? ''}
				/>
			</div>
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
					autocomplete="new-password"
					minlength="8"
					required
				/>
				<span class="hint">Minimal 8 karakter.</span>
			</div>
			<div class="field">
				<label for="confirm">Ulangi password</label>
				<input
					id="confirm"
					name="confirm"
					type="password"
					autocomplete="new-password"
					minlength="8"
					required
				/>
			</div>
			<button class="btn btn-primary btn-block" type="submit" disabled={loading}>
				{loading ? 'Memproses...' : 'Daftar'}
			</button>
		</form>

		<p class="center small muted">
			Sudah punya akun? <a href="/login">Masuk</a>
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
