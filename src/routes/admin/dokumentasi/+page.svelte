<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatShortDate } from '$lib/utils';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let saving = $state(false);
</script>

{#if form?.error}
	<p class="alert error" role="alert">{form.error}</p>
{:else if form?.success}
	<p class="alert success" role="status">{form.success}</p>
{/if}

<section class="card">
	<h2>{data.editing ? 'Edit dokumentasi' : 'Tambah dokumentasi'}</h2>
	{#key data.editing?.id ?? 'new'}
		<form
			method="POST"
			action="?/simpan"
			enctype="multipart/form-data"
			class="form"
			use:enhance={() => {
				saving = true;
				return async ({ update }) => {
					await update({ reset: !data.editing });
					saving = false;
				};
			}}
		>
			<input type="hidden" name="id" value={data.editing?.id ?? ''} />

			<div class="field">
				<label for="title">Judul</label>
				<input id="title" name="title" type="text" required value={data.editing?.title ?? ''} />
			</div>

			<div class="field">
				<label for="description">Keterangan</label>
				<textarea id="description" name="description" value={data.editing?.description ?? ''}
				></textarea>
			</div>

			<div class="form-grid">
				<div class="field">
					<label for="session_id">Terkait sesi (opsional)</label>
					<select id="session_id" name="session_id" value={data.editing?.session_id ?? ''}>
						<option value="">Tidak terkait sesi</option>
						{#each data.sessions as s (s.id)}
							<option value={s.id}>{s.title} ({formatShortDate(s.session_date)})</option>
						{/each}
					</select>
				</div>
				<div class="field">
					<label for="image">Foto</label>
					<input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" />
					<span class="hint">
						{data.editing ? 'Kosongkan jika tidak ingin mengganti foto. ' : ''}Maksimal 2 MB.
					</span>
				</div>
			</div>

			{#if data.editing?.image_url}
				<img class="preview" src={data.editing.image_url} alt={data.editing.title} />
			{/if}

			<div class="row">
				<button class="btn btn-primary" type="submit" disabled={saving}>
					{saving ? 'Menyimpan...' : data.editing ? 'Simpan perubahan' : 'Tambah dokumentasi'}
				</button>
				{#if data.editing}
					<a class="btn btn-ghost" href="/admin/dokumentasi">Batal edit</a>
				{/if}
			</div>
		</form>
	{/key}
</section>

<h2 class="title">Daftar dokumentasi ({data.items.length})</h2>
{#if data.items.length > 0}
	<div class="grid grid-3">
		{#each data.items as item (item.id)}
			<article class="card item">
				{#if item.image_url}
					<img src={item.image_url} alt={item.title} loading="lazy" />
				{/if}
				<div class="body">
					<h3>{item.title}</h3>
					<p class="muted small">{formatShortDate(item.created_at)}</p>
					<div class="row">
						<a class="btn btn-outline btn-sm" href="?edit={item.id}">Edit</a>
						<form
							method="POST"
							action="?/hapus"
							use:enhance={({ cancel }) => {
								if (!confirm(`Hapus dokumentasi "${item.title}"?`)) cancel();
							}}
						>
							<input type="hidden" name="id" value={item.id} />
							<button class="btn btn-danger btn-sm" type="submit">Hapus</button>
						</form>
					</div>
				</div>
			</article>
		{/each}
	</div>
{:else}
	<p class="empty">Belum ada dokumentasi.</p>
{/if}

<style>
	.title {
		margin: 2rem 0 0.75rem;
		font-size: 1.25rem;
	}
	.alert {
		margin-bottom: 1rem;
	}
	.preview {
		max-width: 260px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
	}
	.item {
		padding: 0;
		overflow: hidden;
	}
	.item img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}
	.body {
		padding: 1rem 1.25rem 1.25rem;
	}
	.body h3 {
		margin-bottom: 0.1rem;
	}
</style>
