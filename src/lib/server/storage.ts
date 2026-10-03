import type { SupabaseClient } from '@supabase/supabase-js';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export interface UploadResult {
	url?: string;
	error?: string;
}

/**
 * Upload gambar ke Supabase Storage atas nama user yang sedang login,
 * sehingga kebijakan RLS pada storage.objects tetap berlaku.
 * Mengembalikan objek kosong jika tidak ada file yang dipilih.
 */
export async function uploadImage(
	supabase: SupabaseClient,
	bucket: string,
	folder: string,
	file: FormDataEntryValue | null
): Promise<UploadResult> {
	if (!(file instanceof File) || file.size === 0) return {};
	if (!ALLOWED_TYPES.includes(file.type)) {
		return { error: 'Format foto harus JPG, PNG, atau WebP.' };
	}
	if (file.size > MAX_SIZE) {
		return { error: 'Ukuran foto maksimal 2 MB.' };
	}

	const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
	const path = `${folder}/${crypto.randomUUID()}.${ext}`;

	const { error } = await supabase.storage
		.from(bucket)
		.upload(path, file, { contentType: file.type, upsert: false });
	if (error) return { error: `Gagal mengunggah foto: ${error.message}` };

	const { data } = supabase.storage.from(bucket).getPublicUrl(path);
	return { url: data.publicUrl };
}

export function str(form: FormData, key: string): string {
	const value = form.get(key);
	return typeof value === 'string' ? value.trim() : '';
}

export function strOrNull(form: FormData, key: string): string | null {
	const value = str(form, key);
	return value === '' ? null : value;
}
