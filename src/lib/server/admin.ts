import { error, redirect } from '@sveltejs/kit';
import type { User } from '@supabase/supabase-js';

/**
 * Pastikan pemanggil adalah admin. Dipakai di setiap form action admin
 * karena layout load tidak dijalankan untuk action. Pengaman utama tetap RLS di database.
 */
export async function requireAdmin(locals: App.Locals): Promise<User> {
	const { user } = await locals.safeGetSession();
	if (!user) redirect(303, '/login?redirectTo=/admin');

	const { data } = await locals.supabase
		.from('profiles')
		.select('role')
		.eq('id', user.id)
		.maybeSingle();

	if (data?.role !== 'admin') error(403, 'Hanya admin yang dapat melakukan aksi ini.');
	return user;
}
