<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Atur Password Baru | Future Nexus</title>
</svelte:head>

<div class="auth-wrap">
	<div class="card auth-card stack">
		<div>
			<h2>Atur password baru</h2>
			<p class="muted small">Buat password baru untuk akunmu.</p>
		</div>

		{#if form?.error}
			<p class="alert error" role="alert">{form.error}</p>
		{/if}

		<form
			method="POST"
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
				<label for="password">Password baru</label>
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
				{loading ? 'Menyimpan...' : 'Simpan password'}
			</button>
		</form>
	</div>
</div>
