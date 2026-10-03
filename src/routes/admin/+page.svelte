<script lang="ts">
	import { formatShortDate, registrationLabel } from '$lib/utils';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const items = $derived([
		{ label: 'Peserta', value: data.stats.participants, href: '/admin/peserta' },
		{ label: 'Program', value: data.stats.programs, href: '/admin/program' },
		{ label: 'Mentor', value: data.stats.mentors, href: '/admin/mentor' },
		{ label: 'Sesi', value: data.stats.sessions, href: '/admin/jadwal' },
		{ label: 'Pendaftaran', value: data.stats.registrations, href: '/admin/jadwal' }
	]);
</script>

<div class="grid grid-3 stats">
	{#each items as item (item.label)}
		<a class="card stat" href={item.href}>
			<strong>{item.value}</strong>
			<span class="muted">{item.label}</span>
		</a>
	{/each}
</div>

<h2 class="title">Pendaftaran terbaru</h2>
{#if data.recent.length > 0}
	<div class="table-wrap">
		<table>
			<thead>
				<tr><th>Peserta</th><th>Sesi</th><th>Status</th><th>Tanggal</th></tr>
			</thead>
			<tbody>
				{#each data.recent as reg (reg.id)}
					<tr>
						<td>{reg.profiles?.full_name || 'Tanpa nama'}</td>
						<td>{reg.sessions?.title ?? '-'}</td>
						<td><span class="badge {reg.status}">{registrationLabel(reg.status)}</span></td>
						<td>{formatShortDate(reg.created_at)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="empty">Belum ada pendaftaran.</p>
{/if}

<style>
	.stat {
		display: block;
		color: var(--text);
	}
	.stat:hover {
		text-decoration: none;
		border-color: var(--primary);
	}
	.stat strong {
		display: block;
		font-size: 2rem;
		color: var(--primary);
		line-height: 1.1;
	}
	.title {
		margin-top: 2rem;
		font-size: 1.25rem;
	}
</style>
