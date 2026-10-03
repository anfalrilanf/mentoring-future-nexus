<svelte:head>
	<title>Tentang Mentoring | Future Nexus</title>
	<meta
		name="description"
		content="Kenali Mentoring Future Nexus: tujuan program, manfaat bagi peserta, dan cara mengikuti mentoring dari alumni SMANWAY."
	/>
</svelte:head>

<div class="container">
	<header class="page-header">
		<span class="eyebrow">Tentang</span>
		<h1>Tentang Mentoring Future Nexus</h1>
		<p>
			Program mentoring dari komunitas alumni SMANWAY untuk menemani siswa menyiapkan diri
			menuju perguruan tinggi dan dunia perkuliahan.
		</p>
	</header>

	<section class="stack block">
		<h2>Apa itu Mentoring Future Nexus?</h2>
		<p class="muted">
			Future Nexus adalah wadah yang menghubungkan siswa dengan kakak-kakak alumni SMANWAY yang
			sedang atau sudah berkuliah di berbagai kampus dan jurusan. Lewat sesi mentoring, siswa
			bisa bertanya langsung, berdiskusi, dan mendapat gambaran nyata tentang proses seleksi
			hingga kehidupan di kampus.
		</p>
	</section>

	<section class="block">
		<h2>Tujuan program</h2>
		<div class="grid grid-3">
			<article class="card">
				<h3>Menjembatani informasi</h3>
				<p class="muted small">
					Menyediakan informasi perkuliahan yang jujur dan relevan dari pengalaman alumni.
				</p>
			</article>
			<article class="card">
				<h3>Membantu mengambil keputusan</h3>
				<p class="muted small">
					Mendampingi siswa memilih jurusan, kampus, dan jalur masuk yang sesuai minat dan
					kemampuan.
				</p>
			</article>
			<article class="card">
				<h3>Membangun jejaring</h3>
				<p class="muted small">
					Menguatkan ikatan antara siswa dan alumni SMANWAY sebagai komunitas yang saling
					mendukung.
				</p>
			</article>
		</div>
	</section>

	<section class="block">
		<h2>Manfaat bagi peserta</h2>
		<ul class="benefits">
			<li>Bertanya langsung kepada alumni dari berbagai kampus dan jurusan.</li>
			<li>Mendapat tips persiapan UTBK dan jalur masuk lainnya.</li>
			<li>Memahami gambaran jurusan, prospek, dan tantangan sebelum memilih.</li>
			<li>Siap beradaptasi dengan budaya belajar dan kehidupan kampus.</li>
			<li>Memperluas relasi dengan sesama calon mahasiswa dan alumni.</li>
		</ul>
	</section>

	<section class="block">
		<h2>Cara mengikuti mentoring</h2>
		<ol class="steps">
			<li>
				<strong>Buat akun.</strong>
				<span class="muted"><a href="/register">Daftar</a> dengan email dan password.</span>
			</li>
			<li>
				<strong>Lengkapi profil.</strong>
				<span class="muted">Isi sekolah, kelas, dan minat jurusan/kampusmu.</span>
			</li>
			<li>
				<strong>Pilih sesi.</strong>
				<span class="muted">Lihat <a href="/jadwal">jadwal</a> dan daftar ke sesi yang kamu butuhkan.</span>
			</li>
			<li>
				<strong>Ikuti sesi.</strong>
				<span class="muted">Hadir sesuai jadwal dan pantau riwayatmu di dashboard.</span>
			</li>
		</ol>
		<div class="row cta">
			<a class="btn btn-primary" href="/register">Mulai Mentoring</a>
			<a class="btn btn-outline" href="/program">Lihat program</a>
		</div>
	</section>
</div>

<style>
	.block {
		padding: 1.25rem 0 1.5rem;
	}
	.benefits {
		padding-left: 1.2rem;
		display: grid;
		gap: 0.5rem;
		margin: 0;
	}
	.steps {
		list-style: none;
		counter-reset: step;
		padding: 0;
		margin: 0 0 1.5rem;
		display: grid;
		gap: 0.9rem;
	}
	.steps li {
		counter-increment: step;
		display: grid;
		grid-template-columns: 40px 1fr;
		column-gap: 0.9rem;
		align-items: start;
	}
	.steps li::before {
		content: counter(step);
		grid-row: span 2;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--primary-soft);
		color: var(--primary-dark);
		display: grid;
		place-items: center;
		font-weight: 800;
	}
</style>
