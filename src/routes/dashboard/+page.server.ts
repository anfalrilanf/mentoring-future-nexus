import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Announcement, Registration } from '$lib/types';
import { loadSessions, todayJakarta } from '$lib/server/queries';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) redirect(303, '/login?redirectTo=/dashboard');

	const { data: regData } = await supabase
		.from('registrations')
		.select(
			'id, session_id, user_id, status, created_at, sessions(*, mentors(id, name), programs(id, title))'
		)
		.eq('user_id', user.id);

	const registrations = ((regData ?? []) as unknown as Registration[]).filter((r) => r.sessions);

	const sortKey = (r: Registration) =>
		`${r.sessions?.session_date ?? ''} ${r.sessions?.start_time ?? ''}`;

	const followed = registrations
		.filter(
			(r) =>
				r.status === 'registered' &&
				(r.sessions?.status === 'upcoming' || r.sessions?.status === 'ongoing')
		)
		.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

	const history = registrations
		.filter((r) => !followed.includes(r))
		.sort((a, b) => sortKey(b).localeCompare(sortKey(a)));

	const joinedIds = new Set(
		registrations.filter((r) => r.status !== 'cancelled').map((r) => r.session_id)
	);
	const upcoming = await loadSessions(supabase, {
		status: 'upcoming',
		fromDate: todayJakarta(),
		limit: 8
	});
	const available = upcoming.filter((s) => !joinedIds.has(s.id)).slice(0, 3);

	const { data: annData } = await supabase
		.from('announcements')
		.select('*')
		.eq('is_published', true)
		.order('created_at', { ascending: false })
		.limit(5);

	return {
		followed,
		history,
		available,
		announcements: (annData ?? []) as unknown as Announcement[],
		attendedCount: registrations.filter((r) => r.status === 'attended').length
	};
};

export const actions: Actions = {
	batal: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) redirect(303, '/login?redirectTo=/dashboard');

		const form = await request.formData();
		const sessionId = String(form.get('session_id') ?? '');
		if (!sessionId) return fail(400, { error: 'Sesi tidak valid.' });

		const { error } = await supabase
			.from('registrations')
			.update({ status: 'cancelled' })
			.eq('session_id', sessionId)
			.eq('user_id', user.id)
			.eq('status', 'registered');

		if (error) return fail(400, { error: error.message });
		return { success: 'Pendaftaran dibatalkan.' };
	}
};
