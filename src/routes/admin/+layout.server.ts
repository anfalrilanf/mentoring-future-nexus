import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, parent }) => {
	const { user } = await safeGetSession();
	if (!user) redirect(303, '/login?redirectTo=/admin');

	const { profile } = await parent();
	if (profile?.role !== 'admin') error(403, 'Halaman ini hanya untuk admin.');

	return {};
};
