<script lang="ts">
	import type { Program } from '$lib/types';

	let { program }: { program: Program } = $props();
</script>

<article class="card program">
	<span class="badge tag">{program.category}</span>
	<h3>{program.title}</h3>
	<p class="muted small desc">{program.description}</p>
	<dl>
		<div>
			<dt>Mentor</dt>
			<dd>{program.mentors?.name ?? 'Akan diumumkan'}</dd>
		</div>
		<div>
			<dt>Jadwal</dt>
			<dd>{program.schedule ?? 'Akan diumumkan'}</dd>
		</div>
	</dl>
	<a class="btn btn-outline btn-sm" href="/jadwal">Lihat sesi</a>
</article>

<style>
	.program {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
	}
	h3 {
		margin-top: 0.5rem;
	}
	.desc {
		margin-bottom: 0.5rem;
	}
	dl {
		margin: 0 0 1rem;
		display: grid;
		gap: 0.4rem;
		width: 100%;
	}
	dl div {
		display: flex;
		gap: 0.5rem;
		font-size: 0.9rem;
	}
	dt {
		flex: none;
		width: 56px;
		color: var(--muted);
		font-weight: 600;
	}
	dd {
		margin: 0;
	}
	.program .btn {
		margin-top: auto;
	}
</style>
