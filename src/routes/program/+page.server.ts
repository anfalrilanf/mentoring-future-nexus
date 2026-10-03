import type { PageServerLoad } from './$types';
import type { Program } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data } = await supabase
		.from('programs')
		.select('*, mentors(id, name)')
		.eq('is_active', true)
		.order('created_at', { ascending: true });

	return { programs: (data ?? []) as unknown as Program[] };
};
