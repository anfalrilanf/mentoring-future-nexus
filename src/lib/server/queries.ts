import type { SupabaseClient } from '@supabase/supabase-js';
import type { MentoringSession, SessionStatus } from '$lib/types';

interface SessionQuery {
	status?: SessionStatus;
	fromDate?: string;
	limit?: number;
}

/** Ambil sesi mentoring (urut tanggal naik) beserta jumlah pendaftar aktif. */
export async function loadSessions(
	supabase: SupabaseClient,
	options: SessionQuery = {}
): Promise<MentoringSession[]> {
	let query = supabase
		.from('sessions')
		.select('*, mentors(id, name), programs(id, title)')
		.order('session_date', { ascending: true })
		.order('start_time', { ascending: true });

	if (options.status) query = query.eq('status', options.status);
	if (options.fromDate) query = query.gte('session_date', options.fromDate);
	if (options.limit) query = query.limit(options.limit);

	const { data } = await query;
	const sessions = (data ?? []) as unknown as MentoringSession[];
	if (sessions.length === 0) return sessions;

	const { data: stats } = await supabase
		.from('session_stats')
		.select('session_id, registered_count')
		.in(
			'session_id',
			sessions.map((s) => s.id)
		);

	const counts = new Map<string, number>(
		((stats ?? []) as unknown as { session_id: string; registered_count: number }[]).map((row) => [
			row.session_id,
			row.registered_count
		])
	);

	return sessions.map((s) => ({ ...s, registered_count: counts.get(s.id) ?? 0 }));
}

/** Tanggal hari ini (YYYY-MM-DD) pada zona waktu Asia/Jakarta. */
export function todayJakarta(): string {
	return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
}
