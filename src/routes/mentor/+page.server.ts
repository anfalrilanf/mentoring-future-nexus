import type { PageServerLoad } from './$types';
import type { Mentor } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data } = await supabase.from('mentors').select('*').order('name', { ascending: true });
	return { mentors: (data ?? []) as unknown as Mentor[] };
};
