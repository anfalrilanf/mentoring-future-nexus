export const PROGRAM_CATEGORIES = [
	'Persiapan masuk perguruan tinggi',
	'Pemilihan jurusan dan kampus',
	'Persiapan UTBK/jalur masuk',
	'Adaptasi kehidupan perkuliahan',
	'Sharing pengalaman alumni'
] as const;

export const SESSION_STATUSES = [
	{ value: 'upcoming', label: 'Akan datang' },
	{ value: 'ongoing', label: 'Berlangsung' },
	{ value: 'completed', label: 'Selesai' },
	{ value: 'cancelled', label: 'Dibatalkan' }
] as const;

export const GRADES = ['X', 'XI', 'XII', 'Alumni / Gap year', 'Mahasiswa'] as const;
