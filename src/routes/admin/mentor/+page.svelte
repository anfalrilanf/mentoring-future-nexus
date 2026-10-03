<script lang="ts">
	import { enhance } from '$app/forms';
	import Avatar from '$lib/components/Avatar.svelte';
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
	<h2>{data.editing ? 'Edit mentor' : 'Tambah mentor'}</h2>
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

			<div class="photo">
				<Avatar src={data.editing?.photo_url} name={data.editing?.name} size={72} />
				<div class="field">
					<label for="photo">Foto mentor</label>
					<input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" />
					<span class="hint">JPG, PNG, atau WebP. Maksimal 2 MB. Disimpan di Supabase Storage.</span>
				</div>
			</div>

			<div class="form-grid">
				<div class="field">
					<label for="name">Nama</label>
					<input id="name" name="name" type="text" required value={data.editing?.name ?? ''} />
				</div>
				<div class="field">
					<label for="batch_year">Tahun angkatan</label>
					<input
						id="batch_year"
						name="batch_year"
						type="number"
						min="1990"
						max="2100"
						value={data.editing?.batch_year ?? ''}
					/>
				</div>
			</div>

			<div class="form-grid">
				<div class="field">
					<label for="campus">Kampus</label>
					<input id="campus" name="campus" type="text" required value={data.editing?.campus ?? ''} />
				</div>
				<div class="field">
					<label for="major">Jurusan</label>
					<input id="major" name="major" type="text" required value={data.editing?.major ?? ''} />
				</div>
			</div>

			<div class="field">
				<label for="expertise">Keahlian / topik mentoring</label>
				<input
					id="expertise"
					name="expertise"
					type="text"
					placeholder="Pisahkan dengan koma: UTBK, Pemilihan jurusan"
					value={data.editing?.expertise?.join(', ') ?? ''}
				/>
			</div>

			<div class="field">
				<label for="bio">Deskripsi singkat</label>
				<textarea id="bio" name="bio" value={data.editing?.bio ?? ''}></textarea>
			</div>

			<div class="row">
				<button class="btn btn-primary" type="submit" disabled={saving}>
					{saving ? 'Menyimpan...' : data.editing ? 'Simpan perubahan' : 'Tambah mentor'}
				</button>
				{#if data.editing}
					<a class="btn btn-ghost" href="/admin/mentor">Batal edit</a>
				{/if}
			</div>
		</form>
	{/key}
</section>

<h2 class="title">Daftar mentor ({data.mentors.length})</h2>
{#if data.mentors.length > 0}
	<div class="table-wrap">
		<table>
			<thead>
				<tr><th>Mentor</th><th>Kampus</th><th>Jurusan</th><th>Angkatan</th><th></th></tr>
			</thead>
			<tbody>
				{#each data.mentors as mentor (mentor.id)}
					<tr>
						<td>
							<div class="who">
								<Avatar src={mentor.photo_url} name={mentor.name} size={32} />
								{mentor.name}
							</div>
						</td>
						<td>{mentor.campus}</td>
						<td>{mentor.major}</td>
						<td>{mentor.batch_year ?? '-'}</td>
						<td class="actions">
							<a class="btn btn-outline btn-sm" href="?edit={mentor.id}">Edit</a>
							<form
								method="POST"
								action="?/hapus"
								use:enhance={({ cancel }) => {
									if (!confirm(`Hapus mentor "${mentor.name}"?`)) cancel();
								}}
							>
								<input type="hidden" name="id" value={mentor.id} />
								<button class="btn btn-danger btn-sm" type="submit">Hapus</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="empty">Belum ada mentor.</p>
{/if}

<style>
	.title {
		margin: 2rem 0 0.75rem;
		font-size: 1.25rem;
	}
	.alert {
		margin-bottom: 1rem;
	}
	.photo {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	.who {
		display: flex;
		gap: 0.6rem;
		align-items: center;
	}
	.actions {
		display: flex;
		gap: 0.4rem;
		justify-content: flex-end;
	}
</style>
