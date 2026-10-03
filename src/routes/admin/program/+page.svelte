<script lang="ts">
	import { enhance } from '$app/forms';
	import { PROGRAM_CATEGORIES } from '$lib/constants';
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
	<h2>{data.editing ? 'Edit program' : 'Tambah program'}</h2>
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
				<label for="description">Deskripsi</label>
				<textarea id="description" name="description" required value={data.editing?.description ?? ''}
				></textarea>
			</div>

			<div class="form-grid">
				<div class="field">
					<label for="category">Kategori</label>
					<select id="category" name="category" required value={data.editing?.category ?? ''}>
						<option value="" disabled>Pilih kategori</option>
						{#each PROGRAM_CATEGORIES as category (category)}
							<option value={category}>{category}</option>
						{/each}
					</select>
				</div>
				<div class="field">
					<label for="mentor_id">Mentor</label>
					<select id="mentor_id" name="mentor_id" value={data.editing?.mentor_id ?? ''}>
						<option value="">Belum ditentukan</option>
						{#each data.mentors as mentor (mentor.id)}
							<option value={mentor.id}>{mentor.name}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="field">
				<label for="schedule">Jadwal</label>
				<input
					id="schedule"
					name="schedule"
					type="text"
					placeholder="Contoh: Setiap Sabtu, 15.00 WIB"
					value={data.editing?.schedule ?? ''}
				/>
			</div>

			<label class="check">
				<input type="checkbox" name="is_active" checked={data.editing?.is_active ?? true} />
				Tampilkan di halaman publik
			</label>

			<div class="row">
				<button class="btn btn-primary" type="submit" disabled={saving}>
					{saving ? 'Menyimpan...' : data.editing ? 'Simpan perubahan' : 'Tambah program'}
				</button>
				{#if data.editing}
					<a class="btn btn-ghost" href="/admin/program">Batal edit</a>
				{/if}
			</div>
		</form>
	{/key}
</section>

<h2 class="title">Daftar program ({data.programs.length})</h2>
{#if data.programs.length > 0}
	<div class="table-wrap">
		<table>
			<thead>
				<tr><th>Judul</th><th>Kategori</th><th>Mentor</th><th>Status</th><th></th></tr>
			</thead>
			<tbody>
				{#each data.programs as program (program.id)}
					<tr>
						<td>{program.title}</td>
						<td>{program.category}</td>
						<td>{program.mentors?.name ?? '-'}</td>
						<td>
							<span class="badge" class:upcoming={program.is_active}>
								{program.is_active ? 'Aktif' : 'Disembunyikan'}
							</span>
						</td>
						<td class="actions">
							<a class="btn btn-outline btn-sm" href="?edit={program.id}">Edit</a>
							<form
								method="POST"
								action="?/hapus"
								use:enhance={({ cancel }) => {
									if (!confirm(`Hapus program "${program.title}"?`)) cancel();
								}}
							>
								<input type="hidden" name="id" value={program.id} />
								<button class="btn btn-danger btn-sm" type="submit">Hapus</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="empty">Belum ada program.</p>
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
