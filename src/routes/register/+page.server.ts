import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (user) redirect(303, '/dashboard');
	return {};
};

export const actions: Actions = {
	default: async ({ request, url, locals: { supabase } }) => {
		const form = await request.formData();
		const fullName = String(form.get('full_name') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		const password = String(form.get('password') ?? '');
		const confirm = String(form.get('confirm') ?? '');

		const values = { full_name: fullName, email };

		if (!fullName || !email || !password) {
			return fail(400, { ...values, error: 'Nama, email, dan password wajib diisi.' });
		}
		if (password.length < 8) {
			return fail(400, { ...values, error: 'Password minimal 8 karakter.' });
		}
		if (password !== confirm) {
			return fail(400, { ...values, error: 'Konfirmasi password tidak sama.' });
		}

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { full_name: fullName },
				emailRedirectTo: `${url.origin}/auth/callback`
			}
		});

		if (error) {
			return fail(400, { ...values, error: error.message });
		}

		// Jika konfirmasi email dimatikan di Supabase, sesi langsung aktif.
		if (data.session) redirect(303, '/dashboard');

		return {
			...values,
			success:
				'Akun berhasil dibuat. Cek email kamu dan klik tautan konfirmasi sebelum masuk.'
		};
	}
};
