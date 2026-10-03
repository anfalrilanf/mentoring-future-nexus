<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Lupa Password | Future Nexus</title>
</svelte:head>

<div class="auth-wrap">
	<div class="card auth-card stack">
		<div>
			<h2>Lupa password?</h2>
			<p class="muted small">
				Masukkan email akunmu. Kami akan mengirim tautan untuk membuat password baru.
			</p>
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
			<button class="btn btn-primary btn-block" type="submit" disabled={loading}>
				{loading ? 'Mengirim...' : 'Kirim tautan reset'}
			</button>
		</form>

		<p class="small muted"><a href="/login">Kembali ke halaman masuk</a></p>
	</div>
</div>
