import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { MentoringSession, Registration, RegistrationStatus } from '$lib/types';
import { requireAdmin } from '$lib/server/admin';
import { str } from '$lib/server/storage';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	const { data: session } = await supabase
		.from('sessions')
		.select('*, mentors(id, name), programs(id, title)')
		.eq('id', params.id)
		.maybeSingle();

	if (!session) error(404, 'Sesi tidak ditemukan.');

	const { data: regs } = await supabase
		.from('registrations')
		.select('id, session_id, user_id, status, created_at, profiles(id, full_name, school, grade)')
		.eq('session_id', params.id)
		.order('created_at', { ascending: true });

	return {
		session: session as unknown as MentoringSession,
		registrations: (regs ?? []) as unknown as Registration[]
	};
};

const STATUSES: RegistrationStatus[] = ['registered', 'attended', 'cancelled'];

export const actions: Actions = {
	ubahStatus: async ({ request, locals }) => {
		await requireAdmin(locals);
		const form = await request.formData();
		const id = str(form, 'id');
		const status = str(form, 'status') as RegistrationStatus;

		if (!id || !STATUSES.includes(status)) return fail(400, { error: 'Data tidak valid.' });

		const { error: dbError } = await locals.supabase
			.from('registrations')
			.update({ status })
			.eq('id', id);

		if (dbError) return fail(400, { error: dbError.message });
		return { success: 'Status peserta diperbarui.' };
	}
};
