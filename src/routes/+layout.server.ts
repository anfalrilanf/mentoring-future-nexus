import type { LayoutServerLoad } from './$types';
import type { Profile } from '$lib/types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, cookies }) => {
	const { session, user } = await safeGetSession();

	let profile: Profile | null = null;
	if (user) {
		const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
		profile = (data as unknown as Profile | null) ?? null;
	}

	return {
		session,
		user,
		profile,
		cookies: cookies.getAll()
	};
};
