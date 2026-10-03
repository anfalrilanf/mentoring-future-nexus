import type { PageServerLoad } from './$types';
import type { Registration } from '$lib/types';

async function count(supabase: App.Locals['supabase'], table: string): Promise<number> {
	const { count: total } = await supabase.from(table).select('id', { count: 'exact', head: true });
	return total ?? 0;
}

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const [participants, programs, mentors, sessions, registrationCount] = await Promise.all([
		count(supabase, 'profiles'),
		count(supabase, 'programs'),
		count(supabase, 'mentors'),
		count(supabase, 'sessions'),
		count(supabase, 'registrations')
	]);

	const { data } = await supabase
		.from('registrations')
		.select('id, session_id, user_id, status, created_at, profiles(id, full_name), sessions(id, title)')
		.order('created_at', { ascending: false })
		.limit(6);

	return {
		stats: { participants, programs, mentors, sessions, registrations: registrationCount },
		recent: (data ?? []) as unknown as Registration[]
	};
};
