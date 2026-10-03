import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, url, locals: { supabase } }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();

		if (!email) return fail(400, { email, error: 'Email wajib diisi.' });

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${url.origin}/auth/callback?next=/reset-password`
		});

		if (error) return fail(400, { email, error: error.message });

		// Pesan sengaja netral agar tidak membocorkan email mana yang terdaftar.
		return {
			email,
			success: 'Jika email terdaftar, tautan untuk mengatur ulang password sudah dikirim.'
		};
	}
};
