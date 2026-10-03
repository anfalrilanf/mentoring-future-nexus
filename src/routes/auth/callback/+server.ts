import { redirect } from '@sveltejs/kit';
import type { EmailOtpType } from '@supabase/supabase-js';
import type { RequestHandler } from './$types';
import { safeRedirectPath } from '$lib/utils';

/**
 * Menangani tautan dari email Supabase (konfirmasi pendaftaran & reset password).
 * Mendukung alur PKCE (?code=...) dan alur token_hash (?token_hash=...&type=...).
 */
export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const next = safeRedirectPath(url.searchParams.get('next'), '/dashboard');
	const code = url.searchParams.get('code');
	const tokenHash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type') as EmailOtpType | null;

	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (!error) redirect(303, next);
	} else if (tokenHash && type) {
		const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
		if (!error) redirect(303, type === 'recovery' ? '/reset-password' : next);
	}

	redirect(303, '/login?error=tautan');
};
