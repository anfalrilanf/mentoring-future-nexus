<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatDate, formatTime, registrationLabel, statusLabel } from '$lib/utils';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const activeCount = $derived(data.registrations.filter((r) => r.status !== 'cancelled').length);
</script>

<p><a href="/admin/jadwal">&larr; Kembali ke jadwal</a></p>

<section class="card info">
	<div class="row between">
		<h2>{data.session.title}</h2>
		<span class="badge {data.session.status}">{statusLabel(data.session.status)}</span>
	</div>
	<p class="muted">{data.session.topic}</p>
	<p class="small">
		{formatDate(data.session.session_date)} &middot; {formatTime(data.session.start_time)} -
		{formatTime(data.session.end_time)} WIB &middot; Mentor: {data.session.mentors?.name ?? '-'}
	</p>
	<p class="small muted">
		Peserta aktif: {activeCount}{data.session.capacity ? ` / ${data.session.capacity}` : ''}
	</p>
</section>

{#if form?.error}
	<p class="alert error" role="alert">{form.error}</p>
{:else if form?.success}
	<p class="alert success" role="status">{form.success}</p>
{/if}

<h2 class="title">Peserta terdaftar</h2>
{#if data.registrations.length > 0}
	<div class="table-wrap">
		<table>
			<thead>
				<tr><th>Nama</th><th>Sekolah</th><th>Kelas</th><th>Status</th><th>Ubah status</th></tr>
			</thead>
			<tbody>
				{#each data.registrations as reg (reg.id)}
					<tr>
						<td>{reg.profiles?.full_name || 'Tanpa nama'}</td>
						<td>{reg.profiles?.school ?? '-'}</td>
						<td>{reg.profiles?.grade ?? '-'}</td>
						<td><span class="badge {reg.status}">{registrationLabel(reg.status)}</span></td>
						<td>
							<form method="POST" action="?/ubahStatus" class="inline" use:enhance>
								<input type="hidden" name="id" value={reg.id} />
								<select name="status" value={reg.status} aria-label="Status {reg.profiles?.full_name}">
									<option value="registered">Terdaftar</option>
									<option value="attended">Hadir</option>
									<option value="cancelled">Dibatalkan</option>
								</select>
								<button class="btn btn-outline btn-sm" type="submit">Simpan</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="empty">Belum ada peserta yang mendaftar.</p>
{/if}

<style>
	.info h2 {
		margin: 0;
	}
	.info p {
		margin: 0.35rem 0 0;
	}
	.title {
		margin: 2rem 0 0.75rem;
		font-size: 1.25rem;
	}
	.alert {
		margin: 1rem 0 0;
	}
	.inline {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
	.inline select {
		min-width: 130px;
		padding: 0.4rem 0.6rem;
	}
</style>
