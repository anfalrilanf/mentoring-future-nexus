import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { user } = await safeGetSession();
	// Halaman ini hanya bisa diakses setelah membuka tautan reset dari email.
	if (!user) redirect(303, '/lupa-password');
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) redirect(303, '/lupa-password');

		const form = await request.formData();
		const password = String(form.get('password') ?? '');
		const confirm = String(form.get('confirm') ?? '');

		if (password.length < 8) return fail(400, { error: 'Password minimal 8 karakter.' });
		if (password !== confirm) return fail(400, { error: 'Konfirmasi password tidak sama.' });

		const { error } = await supabase.auth.updateUser({ password });
		if (error) return fail(400, { error: error.message });

		redirect(303, '/dashboard');
	}
};
