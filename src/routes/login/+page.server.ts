import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { safeRedirectPath } from '$lib/utils';

export const load: PageServerLoad = async ({ locals: { safeGetSession }, url }) => {
	const { user } = await safeGetSession();
	if (user) redirect(303, safeRedirectPath(url.searchParams.get('redirectTo')));
	return { redirectTo: safeRedirectPath(url.searchParams.get('redirectTo')) };
};

export const actions: Actions = {
	default: async ({ request, url, locals: { supabase } }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const password = String(form.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { email, error: 'Email dan password wajib diisi.' });
		}

		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			const message =
				error.message === 'Email not confirmed'
					? 'Email belum dikonfirmasi. Cek kotak masukmu untuk tautan konfirmasi.'
					: 'Email atau password salah.';
			return fail(400, { email, error: message });
		}

		redirect(303, safeRedirectPath(url.searchParams.get('redirectTo')));
	}
};
