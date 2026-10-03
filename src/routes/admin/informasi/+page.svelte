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
	<h2>{data.editing ? 'Edit informasi' : 'Tambah informasi'}</h2>
	<p class="muted small">Informasi yang dipublikasikan tampil di dashboard peserta.</p>
	{#key data.editing?.id ?? 'new'}
		<form
			method="POST"
			action="?/simpan"
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
				<label for="content">Isi</label>
				<textarea id="content" name="content" required value={data.editing?.content ?? ''}></textarea>
			</div>
			<label class="check">
				<input type="checkbox" name="is_published" checked={data.editing?.is_published ?? true} />
				Publikasikan
			</label>
			<div class="row">
				<button class="btn btn-primary" type="submit" disabled={saving}>
					{saving ? 'Menyimpan...' : data.editing ? 'Simpan perubahan' : 'Tambah informasi'}
				</button>
				{#if data.editing}
					<a class="btn btn-ghost" href="/admin/informasi">Batal edit</a>
				{/if}
			</div>
		</form>
	{/key}
</section>

<h2 class="title">Daftar informasi ({data.items.length})</h2>
{#if data.items.length > 0}
	<div class="table-wrap">
		<table>
			<thead>
				<tr><th>Judul</th><th>Tanggal</th><th>Status</th><th></th></tr>
			</thead>
			<tbody>
				{#each data.items as item (item.id)}
					<tr>
						<td>{item.title}</td>
						<td>{formatShortDate(item.created_at)}</td>
						<td>
							<span class="badge" class:upcoming={item.is_published}>
								{item.is_published ? 'Terbit' : 'Draf'}
							</span>
						</td>
						<td class="actions">
							<a class="btn btn-outline btn-sm" href="?edit={item.id}">Edit</a>
							<form
								method="POST"
								action="?/hapus"
								use:enhance={({ cancel }) => {
									if (!confirm(`Hapus informasi "${item.title}"?`)) cancel();
								}}
							>
								<input type="hidden" name="id" value={item.id} />
								<button class="btn btn-danger btn-sm" type="submit">Hapus</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="empty">Belum ada informasi.</p>
{/if}

<style>
	.title {
		margin: 2rem 0 0.75rem;
		font-size: 1.25rem;
	}
	.alert {
		margin-bottom: 1rem;
	}
	.check {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		font-size: 0.92rem;
	}
	.actions {
		display: flex;
		gap: 0.4rem;
		justify-content: flex-end;
	}
</style>
