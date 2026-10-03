import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Profile, Role } from '$lib/types';
import { requireAdmin } from '$lib/server/admin';
import { str } from '$lib/server/storage';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data } = await supabase
		.from('profiles')
		.select('*')
		.order('created_at', { ascending: false });
	return { participants: (data ?? []) as unknown as Profile[] };
};

export const actions: Actions = {
	ubahRole: async ({ request, locals }) => {
		const admin = await requireAdmin(locals);
		const form = await request.formData();
		const id = str(form, 'id');
		const role = str(form, 'role') as Role;

		if (!id || (role !== 'admin' && role !== 'participant')) {
			return fail(400, { error: 'Data tidak valid.' });
		}
		if (id === admin.id) {
			return fail(400, { error: 'Kamu tidak bisa mengubah role akunmu sendiri.' });
		}

		const { error } = await locals.supabase.from('profiles').update({ role }).eq('id', id);
		if (error) return fail(400, { error: error.message });
		return { success: 'Role diperbarui.' };
	}
};
