import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Announcement } from '$lib/types';
import { requireAdmin } from '$lib/server/admin';
import { str } from '$lib/server/storage';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const { data } = await supabase
		.from('announcements')
		.select('*')
		.order('created_at', { ascending: false });
	const list = (data ?? []) as unknown as Announcement[];
	const editId = url.searchParams.get('edit');
	return { items: list, editing: list.find((a) => a.id === editId) ?? null };
};

export const actions: Actions = {
	simpan: async ({ request, locals }) => {
		await requireAdmin(locals);
		const form = await request.formData();

		const id = str(form, 'id');
		const title = str(form, 'title');
		const content = str(form, 'content');
		if (!title || !content) return fail(400, { error: 'Judul dan isi informasi wajib diisi.' });

		const payload = { title, content, is_published: form.get('is_published') === 'on' };

		const { error } = id
			? await locals.supabase.from('announcements').update(payload).eq('id', id)
			: await locals.supabase.from('announcements').insert(payload);

		if (error) return fail(400, { error: error.message });
		return { success: id ? 'Informasi diperbarui.' : 'Informasi ditambahkan.' };
	},

	hapus: async ({ request, locals }) => {
		await requireAdmin(locals);
		const form = await request.formData();
		const id = str(form, 'id');
		if (!id) return fail(400, { error: 'Data tidak valid.' });

		const { error } = await locals.supabase.from('announcements').delete().eq('id', id);
		if (error) return fail(400, { error: error.message });
		return { success: 'Informasi dihapus.' };
	}
};
