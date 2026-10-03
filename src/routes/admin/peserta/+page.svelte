<script lang="ts">
	import { enhance } from '$app/forms';
	import Avatar from '$lib/components/Avatar.svelte';
	import { formatShortDate } from '$lib/utils';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let query = $state('');

	const filtered = $derived(
		data.participants.filter((p) => {
			const q = query.trim().toLowerCase();
			if (!q) return true;
			return [p.full_name, p.school, p.interest].some((v) => (v ?? '').toLowerCase().includes(q));
		})
	);
</script>

{#if form?.error}
	<p class="alert error" role="alert">{form.error}</p>
{:else if form?.success}
	<p class="alert success" role="status">{form.success}</p>
{/if}

<div class="row between bar">
	<h2>Peserta ({filtered.length})</h2>
	<div class="search">
		<label class="sr-only" for="q">Cari peserta</label>
		<input id="q" type="text" placeholder="Cari nama, sekolah, atau minat" bind:value={query} />
	</div>
</div>

{#if filtered.length > 0}
	<div class="table-wrap">
		<table>
			<thead>
				<tr><th>Nama</th><th>Sekolah</th><th>Kelas</th><th>Minat</th><th>Bergabung</th><th>Role</th></tr>
			</thead>
			<tbody>
				{#each filtered as p (p.id)}
					<tr>
						<td>
							<div class="who">
								<Avatar src={p.avatar_url} name={p.full_name} size={32} />
								{p.full_name || 'Tanpa nama'}
							</div>
						</td>
						<td>{p.school ?? '-'}</td>
						<td>{p.grade ?? '-'}</td>
						<td>{p.interest ?? '-'}</td>
						<td>{formatShortDate(p.created_at)}</td>
						<td>
							<form method="POST" action="?/ubahRole" class="inline" use:enhance>
								<input type="hidden" name="id" value={p.id} />
								<select name="role" value={p.role} aria-label="Role {p.full_name}">
									<option value="participant">Peserta</option>
									<option value="admin">Admin</option>
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
	<p class="empty">Tidak ada peserta yang cocok.</p>
{/if}

<p class="muted small note">
	Alamat email peserta dikelola Supabase Auth dan dapat dilihat di Supabase Dashboard &rarr;
	Authentication &rarr; Users.
</p>

<style>
	.bar {
		margin-bottom: 1rem;
	}
	.bar h2 {
		margin: 0;
	}
	.search {
		min-width: min(100%, 300px);
	}
	.alert {
		margin-bottom: 1rem;
	}
	.who {
		display: flex;
		gap: 0.6rem;
		align-items: center;
	}
	.inline {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
	.inline select {
		min-width: 110px;
		padding: 0.4rem 0.6rem;
	}
	.note {
		margin-top: 1rem;
	}
</style>
