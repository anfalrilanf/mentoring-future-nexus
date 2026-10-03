import { SESSION_STATUSES } from '$lib/constants';

export function formatDate(value: string | null | undefined): string {
	if (!value) return '-';
	// Tanggal berformat YYYY-MM-DD; tambahkan jam agar tidak bergeser zona waktu.
	const date = new Date(value.length <= 10 ? `${value}T00:00:00` : value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat('id-ID', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}).format(date);
}

export function formatShortDate(value: string | null | undefined): string {
	if (!value) return '-';
	const date = new Date(value.length <= 10 ? `${value}T00:00:00` : value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat('id-ID', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	}).format(date);
}

export function formatTime(value: string | null | undefined): string {
	if (!value) return '-';
	return value.slice(0, 5);
}

export function statusLabel(status: string): string {
	return SESSION_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function registrationLabel(status: string): string {
	if (status === 'registered') return 'Terdaftar';
	if (status === 'attended') return 'Hadir';
	if (status === 'cancelled') return 'Dibatalkan';
	return status;
}

export function initials(name: string | null | undefined): string {
	const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return '?';
	return parts
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase() ?? '')
		.join('');
}

/** Hanya izinkan redirect ke path internal agar tidak jadi open redirect. */
export function safeRedirectPath(value: string | null | undefined, fallback = '/dashboard'): string {
	if (!value) return fallback;
	if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback;
	return value;
}
