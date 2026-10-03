<script lang="ts">
	import { enhance } from '$app/forms';
	import Avatar from '$lib/components/Avatar.svelte';
	import { GRADES } from '$lib/constants';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const parent = $derived(data);
	let saving = $state(false);
</script>

<svelte:head>
	<title>Profil Saya | Future Nexus</title>
</svelte:head>

<div class="container narrow">
	<header class="page-header">
		<span class="eyebrow">Profil</span>
		<h1>Profil saya</h1>
		<p>Ceritakan sedikit tentang dirimu agar mentor bisa membantu lebih tepat.</p>
	</header>

	{#if form?.error}
		<p class="alert error" role="alert">{form.error}</p>
	{:else if form?.success}
		<p class="alert success" role="status">{form.success}</p>
	{/if}

	<form
		method="POST"
		action="?/simpan"
		enctype="multipart/form-data"
		class="card form"
		use:enhance={() => {
			saving = true;
			return async ({ update }) => {
				await update({ reset: false });
				saving = false;
			};
		}}
	>
		<div class="photo">
			<Avatar src={parent.profile?.avatar_url} name={parent.profile?.full_name} size={80} />
			<div class="field">
				<label for="avatar">Foto profil</label>
				<input id="avatar" name="avatar" type="file" accept="image/jpeg,image/png,image/webp" />
				<span class="hint">JPG, PNG, atau WebP. Maksimal 2 MB.</span>
			</div>
		</div>

		<div class="field">
			<label for="email">Email</label>
			<input id="email" type="email" value={data.email} disabled />
		</div>

		<div class="field">
			<label for="full_name">Nama lengkap</label>
			<input
				id="full_name"
				name="full_name"
				type="text"
				required
				value={parent.profile?.full_name ?? ''}
			/>
		</div>

		<div class="form-grid">
			<div class="field">
				<label for="school">Sekolah</label>
				<input id="school" name="school" type="text" value={parent.profile?.school ?? ''} />
			</div>
			<div class="field">
				<label for="grade">Kelas</label>
				<select id="grade" name="grade" value={parent.profile?.grade ?? ''}>
					<option value="">Pilih kelas</option>
					{#each GRADES as grade (grade)}
						<option value={grade}>{grade}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="field">
			<label for="interest">Minat jurusan / kampus</label>
			<input
				id="interest"
				name="interest"
				type="text"
				placeholder="Contoh: Teknik Informatika, Kedokteran"
				value={parent.profile?.interest ?? ''}
			/>
		</div>

		<div class="field">
			<label for="bio">Bio singkat</label>
			<textarea id="bio" name="bio" maxlength="300" value={parent.profile?.bio ?? ''}></textarea>
			<span class="hint">Maksimal 300 karakter.</span>
		</div>

		<div class="row">
			<button class="btn btn-primary" type="submit" disabled={saving}>
				{saving ? 'Menyimpan...' : 'Simpan profil'}
			</button>
			<a class="btn btn-ghost" href="/dashboard">Kembali</a>
		</div>
	</form>
</div>

<style>
	.narrow {
		max-width: 720px;
	}
	.photo {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	.alert {
		margin-bottom: 1rem;
	}
</style>
