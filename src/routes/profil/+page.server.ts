import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { str, strOrNull, uploadImage } from '$lib/server/storage';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) redirect(303, '/login?redirectTo=/profil');
	return { email: user.email ?? '' };
};

export const actions: Actions = {
	simpan: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) redirect(303, '/login?redirectTo=/profil');

		const form = await request.formData();
		const fullName = str(form, 'full_name');
		if (!fullName) return fail(400, { error: 'Nama wajib diisi.' });

		const updates: Record<string, string | null> = {
			full_name: fullName,
			school: strOrNull(form, 'school'),
			grade: strOrNull(form, 'grade'),
			interest: strOrNull(form, 'interest'),
			bio: strOrNull(form, 'bio')
		};

		if ((updates.bio ?? '').length > 300) {
			return fail(400, { error: 'Bio maksimal 300 karakter.' });
		}

		// Foto disimpan di folder <user_id>/ sesuai kebijakan RLS bucket "avatars".
		const upload = await uploadImage(supabase, 'avatars', user.id, form.get('avatar'));
		if (upload.error) return fail(400, { error: upload.error });
		if (upload.url) updates.avatar_url = upload.url;

		const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
		if (error) return fail(400, { error: error.message });

		return { success: 'Profil berhasil disimpan.' };
	}
};
