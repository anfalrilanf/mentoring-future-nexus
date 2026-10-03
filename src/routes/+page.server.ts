import type { PageServerLoad } from './$types';
import { loadSessions, todayJakarta } from '$lib/server/queries';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const upcoming = await loadSessions(supabase, {
		status: 'upcoming',
		fromDate: todayJakarta(),
		limit: 3
	});
	return { upcoming };
};
