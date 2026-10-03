import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Registration } from '$lib/types';
import { loadSessions } from '$lib/server/queries';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const [sessions, { user }] = await Promise.all([loadSessions(supabase), safeGetSession()]);

	let registrations: Registration[] = [];
	if (user) {
		const { data } = await supabase
			.from('registrations')
			.select('id, session_id, user_id, status, created_at')
			.eq('user_id', user.id);
		registrations = (data ?? []) as unknown as Registration[];
	}

	const active = sessions.filter((s) => s.status === 'upcoming' || s.status === 'ongoing');
	const past = sessions
		.filter((s) => s.status === 'completed' || s.status === 'cancelled')
		.reverse();

	return { active, past, registrations };
};

export const actions: Actions = {
	daftar: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) redirect(303, '/login?redirectTo=/jadwal');

		const form = await request.formData();
		const sessionId = String(form.get('session_id') ?? '');
		if (!sessionId) return fail(400, { error: 'Sesi tidak valid.' });

		const { error } = await supabase
			.from('registrations')
			.upsert(
				{ session_id: sessionId, user_id: user.id, status: 'registered' },
				{ onConflict: 'session_id,user_id' }
			);

		if (error) return fail(400, { error: error.message });
		return { success: 'Pendaftaran berhasil. Sampai jumpa di sesi mentoring!' };
	},

	batal: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) redirect(303, '/login?redirectTo=/jadwal');

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
