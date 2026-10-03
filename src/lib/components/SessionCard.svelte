<script lang="ts">
	import { enhance } from '$app/forms';
	import { formatDate, formatTime, statusLabel, registrationLabel } from '$lib/utils';
	import type { MentoringSession, Registration } from '$lib/types';

	let {
		session,
		registration = null,
		loggedIn = false,
		showActions = true
	}: {
		session: MentoringSession;
		registration?: Registration | null;
		loggedIn?: boolean;
		showActions?: boolean;
	} = $props();

	let submitting = $state(false);

	const registered = $derived(registration?.status === 'registered');
	const attended = $derived(registration?.status === 'attended');
	const taken = $derived(session.registered_count ?? 0);
	const full = $derived(session.capacity !== null && taken >= session.capacity);
	const open = $derived(session.status === 'upcoming');
</script>

<article class="card session">
	<div class="top">
		<h3>{session.title}</h3>
		<span class="badge {session.status}">{statusLabel(session.status)}</span>
	</div>

	<p class="topic">{session.topic}</p>

	<dl>
		<div>
			<dt>Mentor</dt>
			<dd>{session.mentors?.name ?? 'Akan diumumkan'}</dd>
		</div>
		<div>
			<dt>Tanggal</dt>
			<dd>{formatDate(session.session_date)}</dd>
		</div>
		<div>
			<dt>Jam</dt>
			<dd>{formatTime(session.start_time)} - {formatTime(session.end_time)} WIB</dd>
		</div>
		{#if session.location}
			<div>
				<dt>Tempat</dt>
				<dd>{session.location}</dd>
			</div>
		{/if}
		{#if session.capacity !== null}
			<div>
				<dt>Kuota</dt>
				<dd>
					{taken} / {session.capacity} peserta
					{#if full && open}<span class="badge cancelled">Penuh</span>{/if}
				</dd>
			</div>
		{/if}
	</dl>

	{#if showActions}
		<div class="foot">
			{#if registration && registration.status !== 'cancelled'}
				<span class="badge {registration.status}">{registrationLabel(registration.status)}</span>
			{/if}

			{#if !loggedIn}
				{#if open}
					<a class="btn btn-primary btn-sm" href="/login?redirectTo=/jadwal">Masuk untuk mendaftar</a>
				{/if}
			{:else if registered && open}
				<form
					method="POST"
					action="/jadwal?/batal"
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							await update();
							submitting = false;
						};
					}}
				>
					<input type="hidden" name="session_id" value={session.id} />
					<button class="btn btn-outline btn-sm" type="submit" disabled={submitting}>
						Batalkan pendaftaran
					</button>
				</form>
			{:else if !registered && !attended && open}
				<form
					method="POST"
					action="/jadwal?/daftar"
					use:enhance={() => {
						submitting = true;
						return async ({ update }) => {
							await update();
							submitting = false;
						};
					}}
				>
					<input type="hidden" name="session_id" value={session.id} />
					<button class="btn btn-primary btn-sm" type="submit" disabled={submitting || full}>
						{full ? 'Kuota penuh' : submitting ? 'Memproses...' : 'Daftar sesi'}
					</button>
				</form>
			{/if}
		</div>
	{/if}
</article>

<style>
	.session {
		display: flex;
		flex-direction: column;
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.75rem;
	}
	.top h3 {
		margin: 0;
	}
	.topic {
		color: var(--muted);
		margin: 0.35rem 0 0.9rem;
		font-size: 0.93rem;
	}
	dl {
		margin: 0 0 1rem;
		display: grid;
		gap: 0.35rem;
	}
	dl div {
		display: flex;
		gap: 0.5rem;
		font-size: 0.9rem;
	}
	dt {
		flex: none;
		width: 60px;
		color: var(--muted);
		font-weight: 600;
	}
	dd {
		margin: 0;
	}
	.foot {
		margin-top: auto;
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		align-items: center;
	}
</style>
