import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { DocumentationItem, MentoringSession } from '$lib/types';
import { requireAdmin } from '$lib/server/admin';
import { str, strOrNull, uploadImage } from '$lib/server/storage';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const [{ data }, { data: sessions }] = await Promise.all([
		supabase.from('documentation').select('*').order('created_at', { ascending: false }),
		supabase
			.from('sessions')
			.select('id, title, session_date')
			.order('session_date', { ascending: false })
	]);

	const list = (data ?? []) as unknown as DocumentationItem[];
	const editId = url.searchParams.get('edit');

	return {
		items: list,
		sessions: (sessions ?? []) as unknown as Pick<MentoringSession, 'id' | 'title' | 'session_date'>[],
		editing: list.find((d) => d.id === editId) ?? null
	};
};

export const actions: Actions = {
	simpan: async ({ request, locals }) => {
		await requireAdmin(locals);
		const form = await request.formData();

		const id = str(form, 'id');
		const title = str(form, 'title');
		if (!title) return fail(400, { error: 'Judul wajib diisi.' });

		const payload: Record<string, unknown> = {
			title,
			description: strOrNull(form, 'description'),
			session_id: strOrNull(form, 'session_id')
		};

		const upload = await uploadImage(locals.supabase, 'documentation', 'photos', form.get('image'));
		if (upload.error) return fail(400, { error: upload.error });
		if (upload.url) payload.image_url = upload.url;

		if (!id && !upload.url) {
			return fail(400, { error: 'Pilih foto dokumentasi terlebih dahulu.' });
		}

		const { error } = id
			? await locals.supabase.from('documentation').update(payload).eq('id', id)
			: await locals.supabase.from('documentation').insert(payload);

		if (error) return fail(400, { error: error.message });
		return { success: id ? 'Dokumentasi diperbarui.' : 'Dokumentasi ditambahkan.' };
	},

	hapus: async ({ request, locals }) => {
		await requireAdmin(locals);
		const form = await request.formData();
		const id = str(form, 'id');
		if (!id) return fail(400, { error: 'Data tidak valid.' });

		const { error } = await locals.supabase.from('documentation').delete().eq('id', id);
		if (error) return fail(400, { error: error.message });
		return { success: 'Dokumentasi dihapus.' };
	}
};
