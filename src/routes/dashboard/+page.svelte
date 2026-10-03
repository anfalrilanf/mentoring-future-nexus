<script lang="ts">
	import { enhance } from '$app/forms';
	import Avatar from '$lib/components/Avatar.svelte';
	import {
		formatDate,
		formatShortDate,
		formatTime,
		registrationLabel,
		statusLabel
	} from '$lib/utils';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const profile = $derived(data.profile);
	const incomplete = $derived(
		!profile?.full_name || !profile?.school || !profile?.grade || !profile?.interest
	);
</script>

<svelte:head>
	<title>Dashboard | Future Nexus</title>
</svelte:head>

<div class="container">
	<header class="page-header">
		<span class="eyebrow">Dashboard</span>
		<h1>Halo, {profile?.full_name || 'Peserta'}!</h1>
		<p>Pantau mentoring yang kamu ikuti dan temukan sesi berikutnya.</p>
	</header>

	{#if form?.error}
		<p class="alert error" role="alert">{form.error}</p>
	{:else if form?.success}
		<p class="alert success" role="status">{form.success}</p>
	{/if}

	<div class="layout">
		<aside class="stack">
			<section class="card profile">
				<div class="who">
					<Avatar src={profile?.avatar_url} name={profile?.full_name} size={64} />
					<div>
						<h3>{profile?.full_name || 'Belum ada nama'}</h3>
						<p class="muted small">
							{profile?.school || 'Sekolah belum diisi'}
							{#if profile?.grade}&middot; Kelas {profile.grade}{/if}
						</p>
					</div>
				</div>
				{#if profile?.interest}
					<p class="small"><strong>Minat:</strong> {profile.interest}</p>
				{/if}
				{#if profile?.bio}
					<p class="small muted">{profile.bio}</p>
				{/if}
				{#if incomplete}
					<p class="alert info small">Lengkapi profilmu agar mentor mengenalmu lebih baik.</p>
				{/if}
				<a class="btn btn-outline btn-sm" href="/profil">Ubah profil</a>
			</section>

			<section class="card stats">
				<div>
					<strong>{data.followed.length}</strong>
					<span class="muted small">Sesi akan diikuti</span>
				</div>
				<div>
					<strong>{data.attendedCount}</strong>
					<span class="muted small">Sesi dihadiri</span>
				</div>
			</section>

			<section class="card">
				<h3>Informasi terbaru</h3>
				{#if data.announcements.length > 0}
					<ul class="news">
						{#each data.announcements as item (item.id)}
							<li>
								<strong>{item.title}</strong>
								<span class="muted small">{formatShortDate(item.created_at)}</span>
								<p class="small muted">{item.content}</p>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="muted small">Belum ada informasi terbaru.</p>
				{/if}
			</section>
		</aside>

		<div class="stack">
			<section>
				<h2>Mentoring yang diikuti</h2>
				{#if data.followed.length > 0}
					<div class="stack">
						{#each data.followed as reg (reg.id)}
							<article class="card item">
								<div>
									<h3>{reg.sessions?.title}</h3>
									<p class="muted small">
										{formatDate(reg.sessions?.session_date)} &middot;
										{formatTime(reg.sessions?.start_time)} - {formatTime(reg.sessions?.end_time)} WIB
									</p>
									<p class="small">Mentor: {reg.sessions?.mentors?.name ?? 'Akan diumumkan'}</p>
									{#if reg.sessions?.location}
										<p class="small muted">{reg.sessions.location}</p>
									{/if}
								</div>
								<form method="POST" action="?/batal" use:enhance>
									<input type="hidden" name="session_id" value={reg.session_id} />
									<button class="btn btn-outline btn-sm" type="submit">Batalkan</button>
								</form>
							</article>
						{/each}
					</div>
				{:else}
					<p class="empty">
						Kamu belum terdaftar di sesi mana pun. <a href="/jadwal">Cari sesi mentoring</a>
					</p>
				{/if}
			</section>

			<section>
				<div class="row between">
					<h2>Jadwal mentoring</h2>
					<a class="btn btn-ghost btn-sm" href="/jadwal">Lihat semua</a>
				</div>
				{#if data.available.length > 0}
					<div class="stack">
						{#each data.available as s (s.id)}
							<article class="card item">
								<div>
									<h3>{s.title}</h3>
									<p class="muted small">
										{formatDate(s.session_date)} &middot; {formatTime(s.start_time)} WIB
										&middot; {s.mentors?.name ?? 'Mentor akan diumumkan'}
									</p>
								</div>
								<a class="btn btn-primary btn-sm" href="/jadwal">Daftar</a>
							</article>
						{/each}
					</div>
				{:else}
					<p class="empty">Tidak ada sesi baru yang bisa didaftar saat ini.</p>
				{/if}
			</section>

			<section>
				<h2>Riwayat mentoring</h2>
				{#if data.history.length > 0}
					<div class="table-wrap">
						<table>
							<thead>
								<tr>
									<th>Sesi</th>
									<th>Tanggal</th>
									<th>Pendaftaran</th>
									<th>Sesi</th>
								</tr>
							</thead>
							<tbody>
								{#each data.history as reg (reg.id)}
									<tr>
										<td>{reg.sessions?.title}</td>
										<td>{formatShortDate(reg.sessions?.session_date)}</td>
										<td><span class="badge {reg.status}">{registrationLabel(reg.status)}</span></td>
										<td>
											<span class="badge {reg.sessions?.status}"
												>{statusLabel(reg.sessions?.status ?? '')}</span
											>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<p class="empty">Riwayat mentoring akan muncul di sini.</p>
				{/if}
			</section>
		</div>
	</div>
</div>

<style>
	.layout {
		display: grid;
		grid-template-columns: 320px 1fr;
		gap: 1.5rem;
		align-items: start;
	}
	.who {
		display: flex;
		gap: 0.9rem;
		align-items: center;
		margin-bottom: 0.9rem;
	}
	.who h3,
	.who p {
		margin: 0;
	}
	.stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		text-align: center;
	}
	.stats strong {
		display: block;
		font-size: 1.8rem;
		color: var(--primary);
	}
	.news {
		list-style: none;
		padding: 0;
		margin: 0.5rem 0 0;
		display: grid;
		gap: 0.9rem;
	}
	.news li p {
		margin: 0.15rem 0 0;
	}
	.item {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: center;
	}
	.item h3 {
		margin: 0 0 0.2rem;
	}
	.item p {
		margin: 0;
	}
	section h2 {
		font-size: 1.25rem;
		margin-bottom: 0.75rem;
	}

	@media (max-width: 900px) {
		.layout {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 520px) {
		.item {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
