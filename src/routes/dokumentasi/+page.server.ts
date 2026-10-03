import type { PageServerLoad } from './$types';
import type { DocumentationItem } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data } = await supabase
		.from('documentation')
		.select('*')
		.order('created_at', { ascending: false });
	return { items: (data ?? []) as unknown as DocumentationItem[] };
};
