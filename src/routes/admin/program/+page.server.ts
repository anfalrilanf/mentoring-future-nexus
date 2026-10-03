import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Mentor, Program } from '$lib/types';
import { PROGRAM_CATEGORIES } from '$lib/constants';
import { requireAdmin } from '$lib/server/admin';
import { str, strOrNull } from '$lib/server/storage';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const [{ data: programs }, { data: mentors }] = await Promise.all([
		supabase.from('programs').select('*, mentors(id, name)').order('created_at', { ascending: true }),
		supabase.from('mentors').select('id, name').order('name', { ascending: true })
	]);

	const list = (programs ?? []) as unknown as Program[];
	const editId = url.searchParams.get('edit');

	return {
		programs: list,
		mentors: (mentors ?? []) as unknown as Pick<Mentor, 'id' | 'name'>[],
		editing: list.find((p) => p.id === editId) ?? null
	};
};

export const actions: Actions = {
	simpan: async ({ request, locals }) => {
		await requireAdmin(locals);
		const form = await request.formData();

		const id = str(form, 'id');
		const title = str(form, 'title');
		const description = str(form, 'description');
		const category = str(form, 'category');

		if (!title || !description) return fail(400, { error: 'Judul dan deskripsi wajib diisi.' });
		if (!(PROGRAM_CATEGORIES as readonly string[]).includes(category)) {
			return fail(400, { error: 'Kategori tidak valid.' });
		}

		const payload = {
			title,
			description,
			category,
			mentor_id: strOrNull(form, 'mentor_id'),
			schedule: strOrNull(form, 'schedule'),
			is_active: form.get('is_active') === 'on'
		};

		const { error } = id
			? await locals.supabase.from('programs').update(payload).eq('id', id)
			: await locals.supabase.from('programs').insert(payload);

		if (error) return fail(400, { error: error.message });
		return { success: id ? 'Program diperbarui.' : 'Program ditambahkan.' };
	},

	hapus: async ({ request, locals }) => {
		await requireAdmin(locals);
		const form = await request.formData();
		const id = str(form, 'id');
		if (!id) return fail(400, { error: 'Program tidak valid.' });

		const { error } = await locals.supabase.from('programs').delete().eq('id', id);
		if (error) return fail(400, { error: error.message });
		return { success: 'Program dihapus.' };
	}
};
