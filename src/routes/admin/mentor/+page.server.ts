import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Mentor } from '$lib/types';
import { requireAdmin } from '$lib/server/admin';
import { str, strOrNull, uploadImage } from '$lib/server/storage';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const { data } = await supabase.from('mentors').select('*').order('name', { ascending: true });
	const list = (data ?? []) as unknown as Mentor[];
	const editId = url.searchParams.get('edit');
	return { mentors: list, editing: list.find((m) => m.id === editId) ?? null };
};

export const actions: Actions = {
	simpan: async ({ request, locals }) => {
		await requireAdmin(locals);
		const form = await request.formData();

		const id = str(form, 'id');
		const name = str(form, 'name');
		const campus = str(form, 'campus');
		const major = str(form, 'major');
		if (!name || !campus || !major) {
			return fail(400, { error: 'Nama, kampus, dan jurusan wajib diisi.' });
		}

		const yearRaw = str(form, 'batch_year');
		const batchYear = yearRaw ? Number.parseInt(yearRaw, 10) : null;
		if (batchYear !== null && (Number.isNaN(batchYear) || batchYear < 1990 || batchYear > 2100)) {
			return fail(400, { error: 'Tahun angkatan tidak valid.' });
		}

		const payload: Record<string, unknown> = {
			name,
			campus,
			major,
			batch_year: batchYear,
			expertise: str(form, 'expertise')
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean),
			bio: strOrNull(form, 'bio')
		};

		const upload = await uploadImage(locals.supabase, 'mentor-photos', 'mentors', form.get('photo'));
		if (upload.error) return fail(400, { error: upload.error });
		if (upload.url) payload.photo_url = upload.url;

		const { error } = id
			? await locals.supabase.from('mentors').update(payload).eq('id', id)
			: await locals.supabase.from('mentors').insert(payload);

		if (error) return fail(400, { error: error.message });
		return { success: id ? 'Mentor diperbarui.' : 'Mentor ditambahkan.' };
	},

	hapus: async ({ request, locals }) => {
		await requireAdmin(locals);
		const form = await request.formData();
		const id = str(form, 'id');
		if (!id) return fail(400, { error: 'Mentor tidak valid.' });

		const { error } = await locals.supabase.from('mentors').delete().eq('id', id);
		if (error) return fail(400, { error: error.message });
		return { success: 'Mentor dihapus.' };
	}
};
