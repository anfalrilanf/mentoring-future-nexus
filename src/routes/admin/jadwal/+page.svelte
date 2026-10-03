<script lang="ts">
	import { enhance } from '$app/forms';
	import { SESSION_STATUSES } from '$lib/constants';
	import { formatShortDate, formatTime, statusLabel } from '$lib/utils';
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
	<h2>{data.editing ? 'Edit sesi' : 'Tambah sesi'}</h2>
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

			<div class="form-grid">
				<div class="field">
					<label for="title">Nama sesi</label>
					<input id="title" name="title" type="text" required value={data.editing?.title ?? ''} />
				</div>
				<div class="field">
					<label for="topic">Topik</label>
					<input id="topic" name="topic" type="text" required value={data.editing?.topic ?? ''} />
				</div>
			</div>

			<div class="form-grid">
				<div class="field">
					<label for="program_id">Program</label>
					<select id="program_id" name="program_id" value={data.editing?.program_id ?? ''}>
						<option value="">Tanpa program</option>
						{#each data.programs as program (program.id)}
							<option value={program.id}>{program.title}</option>
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

			<div class="form-grid">
				<div class="field">
					<label for="session_date">Tanggal</label>
					<input
						id="session_date"
						name="session_date"
						type="date"
						required
						value={data.editing?.session_date ?? ''}
					/>
				</div>
				<div class="field">
					<label for="start_time">Jam mulai</label>
					<input
						id="start_time"
						name="start_time"
						type="time"
						required
						value={formatTime(data.editing?.start_time ?? '').replace('-', '')}
					/>
				</div>
				<div class="field">
					<label for="end_time">Jam selesai</label>
					<input
						id="end_time"
						name="end_time"
						type="time"
						required
						value={formatTime(data.editing?.end_time ?? '').replace('-', '')}
					/>
				</div>
			</div>

			<div class="form-grid">
				<div class="field">
					<label for="location">Tempat / tautan</label>
					<input
						id="location"
						name="location"
						type="text"
						placeholder="Online (Zoom/Meet) atau nama ruangan"
						value={data.editing?.location ?? ''}
					/>
				</div>
				<div class="field">
					<label for="capacity">Kuota peserta</label>
					<input
						id="capacity"
						name="capacity"
						type="number"
						min="1"
						placeholder="Kosongkan jika tanpa batas"
						value={data.editing?.capacity ?? ''}
					/>
				</div>
				<div class="field">
					<label for="status">Status</label>
					<select id="status" name="status" value={data.editing?.status ?? 'upcoming'}>
						{#each SESSION_STATUSES as s (s.value)}
							<option value={s.value}>{s.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="row">
				<button class="btn btn-primary" type="submit" disabled={saving}>
					{saving ? 'Menyimpan...' : data.editing ? 'Simpan perubahan' : 'Tambah sesi'}
				</button>
				{#if data.editing}
					<a class="btn btn-ghost" href="/admin/jadwal">Batal edit</a>
				{/if}
			</div>
		</form>
	{/key}
</section>

<h2 class="title">Daftar sesi ({data.sessions.length})</h2>
{#if data.sessions.length > 0}
	<div class="table-wrap">
		<table>
			<thead>
				<tr>
					<th>Sesi</th><th>Mentor</th><th>Tanggal</th><th>Jam</th><th>Peserta</th><th>Status</th><th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.sessions as s (s.id)}
					<tr>
						<td>{s.title}</td>
						<td>{s.mentors?.name ?? '-'}</td>
						<td>{formatShortDate(s.session_date)}</td>
						<td>{formatTime(s.start_time)} - {formatTime(s.end_time)}</td>
						<td>
							<a href="/admin/jadwal/{s.id}">
								{s.registered_count ?? 0}{s.capacity ? ` / ${s.capacity}` : ''}
							</a>
						</td>
						<td><span class="badge {s.status}">{statusLabel(s.status)}</span></td>
						<td class="actions">
							<a class="btn btn-outline btn-sm" href="?edit={s.id}">Edit</a>
							<form
								method="POST"
								action="?/hapus"
								use:enhance={({ cancel }) => {
									if (!confirm(`Hapus sesi "${s.title}"? Data pendaftarannya ikut terhapus.`)) cancel();
								}}
							>
								<input type="hidden" name="id" value={s.id} />
								<button class="btn btn-danger btn-sm" type="submit">Hapus</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="empty">Belum ada sesi.</p>
{/if}

<style>
	.title {
		margin: 2rem 0 0.75rem;
		font-size: 1.25rem;
	}
	.alert {
		margin-bottom: 1rem;
	}
	.actions {
		display: flex;
		gap: 0.4rem;
		justify-content: flex-end;
	}
</style>
