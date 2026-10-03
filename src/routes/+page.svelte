<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import SessionCard from '$lib/components/SessionCard.svelte';
	import { PROGRAM_CATEGORIES } from '$lib/constants';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const goals = [
		{
			title: 'Arah yang lebih jelas',
			text: 'Kenali minat, pilih jurusan dan kampus dengan informasi nyata dari kakak alumni.'
		},
		{
			title: 'Siap menghadapi seleksi',
			text: 'Pahami jalur masuk dan susun strategi belajar UTBK yang realistis.'
		},
		{
			title: 'Percaya diri saat kuliah',
			text: 'Dapatkan gambaran adaptasi, organisasi, dan kehidupan perkuliahan sebelum menjalaninya.'
		}
	];
</script>

<svelte:head>
	<title>Mentoring Future Nexus | Mentoring Alumni SMANWAY</title>
</svelte:head>

<section class="hero">
	<div class="container hero-inner">
		<div class="copy">
			<span class="eyebrow">Komunitas Alumni SMANWAY</span>
			<h1>Siapkan langkahmu menuju <span class="grad">dunia kuliah</span>.</h1>
			<p class="lead">
				Mentoring Future Nexus mempertemukan siswa dengan kakak-kakak alumni SMANWAY untuk
				berbagi pengalaman, strategi, dan semangat menyiapkan diri ke perguruan tinggi.
			</p>
			<div class="row">
				{#if data.user}
					<a class="btn btn-primary" href="/jadwal">Lihat Jadwal Mentoring</a>
					<a class="btn btn-outline" href="/dashboard">Buka Dashboard</a>
				{:else}
					<a class="btn btn-primary" href="/register">Mulai Mentoring</a>
					<a class="btn btn-outline" href="/login">Sudah punya akun? Masuk</a>
				{/if}
			</div>
		</div>
		<div class="art" aria-hidden="true">
			<Logo size={140} showText={false} />
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<span class="eyebrow">Apa itu mentoring?</span>
		<h2>Belajar langsung dari yang sudah menjalaninya</h2>
		<p class="muted intro">
			Mentoring adalah sesi bimbingan bersama alumni yang berkuliah di berbagai kampus dan jurusan.
			Kamu bisa bertanya, berdiskusi, dan mendapat gambaran yang jujur tentang proses menuju kampus
			impian.
		</p>

		<div class="grid grid-3 goals">
			{#each goals as goal (goal.title)}
				<article class="card">
					<h3>{goal.title}</h3>
					<p class="muted small">{goal.text}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="section soft">
	<div class="container">
		<span class="eyebrow">Program</span>
		<h2>Topik yang bisa kamu ikuti</h2>
		<ul class="chips">
			{#each PROGRAM_CATEGORIES as category (category)}
				<li><a href="/program">{category}</a></li>
			{/each}
		</ul>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="row between head">
			<div>
				<span class="eyebrow">Jadwal terdekat</span>
				<h2>Sesi mentoring berikutnya</h2>
			</div>
			<a class="btn btn-outline btn-sm" href="/jadwal">Semua jadwal</a>
		</div>

		{#if data.upcoming.length > 0}
			<div class="grid grid-2">
				{#each data.upcoming as session (session.id)}
					<SessionCard {session} showActions={false} />
				{/each}
			</div>
		{:else}
			<p class="empty">Belum ada sesi yang dijadwalkan. Pantau terus ya!</p>
		{/if}
	</div>
</section>

{#if !data.user}
	<section class="section cta-wrap">
		<div class="container">
			<div class="cta">
				<h2>Siap mulai?</h2>
				<p>Buat akun gratis dan daftar ke sesi mentoring pertamamu.</p>
				<a class="btn cta-btn" href="/register">Daftar Sekarang</a>
			</div>
		</div>
	</section>
{/if}

<style>
	.hero {
		background:
			radial-gradient(900px 400px at 85% -10%, rgb(20 184 166 / 0.18), transparent),
			radial-gradient(700px 400px at 0% 0%, rgb(79 70 229 / 0.14), transparent);
		padding: 3.5rem 0 3rem;
	}
	.hero-inner {
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 2rem;
		align-items: center;
	}
	.grad {
		background: linear-gradient(90deg, var(--primary), var(--accent));
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.lead {
		font-size: 1.1rem;
		color: var(--muted);
		max-width: 560px;
		margin: 1rem 0 1.5rem;
	}
	.art {
		display: grid;
		place-items: center;
	}
	.intro {
		max-width: 680px;
		margin-bottom: 1.5rem;
	}
	.goals {
		margin-top: 1rem;
	}
	.chips {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}
	.chips a {
		display: inline-block;
		padding: 0.5rem 1rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 999px;
		color: var(--text);
		font-weight: 600;
		font-size: 0.92rem;
	}
	.chips a:hover {
		border-color: var(--primary);
		color: var(--primary);
		text-decoration: none;
	}
	.head {
		margin-bottom: 1.25rem;
		align-items: flex-end;
	}
	.cta-wrap {
		padding-top: 0;
	}
	.cta {
		text-align: center;
		padding: 2.5rem 1.25rem;
		border-radius: var(--radius);
		background: linear-gradient(135deg, var(--primary), #6366f1 55%, var(--accent));
		color: #fff;
	}
	.cta p {
		opacity: 0.9;
	}
	.cta-btn {
		background: #fff;
		color: var(--primary-dark);
	}

	@media (max-width: 760px) {
		.hero-inner {
			grid-template-columns: 1fr;
		}
		.art {
			display: none;
		}
	}
</style>
