import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Mentor, MentoringSession, Program } from '$lib/types';
import { SESSION_STATUSES } from '$lib/constants';
import { requireAdmin } from '$lib/server/admin';
import { str, strOrNull } from '$lib/server/storage';
import { loadSessions } from '$lib/server/queries';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const [sessions, { data: programs }, { data: mentors }] = await Promise.all([
		loadSessions(supabase),
		supabase.from('programs').select('id, title').order('title', { ascending: true }),
		supabase.from('mentors').select('id, name').order('name', { ascending: true })
	]);

	const sorted: MentoringSession[] = [...sessions].reverse();
	const editId = url.searchParams.get('edit');

	return {
		sessions: sorted,
		programs: (programs ?? []) as unknown as Pick<Program, 'id' | 'title'>[],
		mentors: (mentors ?? []) as unknown as Pick<Mentor, 'id' | 'name'>[],
		editing: sorted.find((s) => s.id === editId) ?? null
	};
};

export const actions: Actions = {
	simpan: async ({ request, locals }) => {
		await requireAdmin(locals);
		const form = await request.formData();

		const id = str(form, 'id');
		const title = str(form, 'title');
		const topic = str(form, 'topic');
		const sessionDate = str(form, 'session_date');
		const startTime = str(form, 'start_time');
		const endTime = str(form, 'end_time');
		const status = str(form, 'status') || 'upcoming';

		if (!title || !topic || !sessionDate || !startTime || !endTime) {
			return fail(400, { error: 'Nama sesi, topik, tanggal, dan jam wajib diisi.' });
		}
		if (endTime <= startTime) {
			return fail(400, { error: 'Jam selesai harus setelah jam mulai.' });
		}
		if (!SESSION_STATUSES.some((s) => s.value === status)) {
			return fail(400, { error: 'Status sesi tidak valid.' });
		}

		const capacityRaw = str(form, 'capacity');
		const capacity = capacityRaw ? Number.parseInt(capacityRaw, 10) : null;
		if (capacity !== null && (Number.isNaN(capacity) || capacity < 1)) {
			return fail(400, { error: 'Kuota harus berupa angka lebih dari 0.' });
		}

		const payload = {
			title,
			topic,
			program_id: strOrNull(form, 'program_id'),
			mentor_id: strOrNull(form, 'mentor_id'),
			session_date: sessionDate,
			start_time: startTime,
			end_time: endTime,
			location: strOrNull(form, 'location'),
			capacity,
			status
		};

		const { error } = id
			? await locals.supabase.from('sessions').update(payload).eq('id', id)
			: await locals.supabase.from('sessions').insert(payload);

		if (error) return fail(400, { error: error.message });
		return { success: id ? 'Sesi diperbarui.' : 'Sesi ditambahkan.' };
	},

	hapus: async ({ request, locals }) => {
		await requireAdmin(locals);
		const form = await request.formData();
		const id = str(form, 'id');
		if (!id) return fail(400, { error: 'Sesi tidak valid.' });

		const { error } = await locals.supabase.from('sessions').delete().eq('id', id);
		if (error) return fail(400, { error: error.message });
		return { success: 'Sesi dihapus.' };
	}
};
