# Mentoring Future Nexus

Platform mentoring dari komunitas alumni **SMANWAY** untuk membantu siswa mempersiapkan diri menuju perguruan tinggi.

**Teknologi:** SvelteKit (Svelte 5) + TypeScript · Supabase Auth, PostgreSQL, Storage · Deploy ke Netlify.

> **Status verifikasi:** kode ditulis tanpa akses `npm` (registry diblokir di lingkungan pembuatnya), jadi
> `npm run check` dan `npm run build` **belum pernah dijalankan**. Jalankan keduanya di langkah 3 di bawah
> sebelum deploy. Detail ada di `progress.md`.

---

## 1. Siapkan Supabase

1. Buat project di <https://supabase.com>.
2. Buka **SQL Editor**, tempel isi [`supabase/schema.sql`](supabase/schema.sql), lalu **Run**.
   File ini membuat tabel, trigger, Row Level Security (RLS), dan 3 bucket storage
   (`avatars`, `mentor-photos`, `documentation`).
3. *(Opsional)* jalankan [`supabase/seed.sql`](supabase/seed.sql) untuk data contoh
   (nama mentor di dalamnya fiktif).
4. Ambil kredensial di **Project Settings → API**: `Project URL` dan `anon public key`.
   Jangan pakai `service_role` key di project ini.
5. **Authentication → URL Configuration**:
   - *Site URL*: alamat website produksi kamu (mis. `https://nama-situs.netlify.app`).
   - *Redirect URLs*: tambahkan `https://nama-situs.netlify.app/auth/callback`
     dan `http://localhost:5173/auth/callback`.
6. **Authentication → Providers → Email**: pastikan Email aktif. Konfirmasi email boleh dibiarkan
   aktif (disarankan) atau dimatikan saat uji coba.

### Menjadikan akun sebagai admin

Daftar dulu lewat website, lalu di SQL Editor jalankan (ganti emailnya):

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'email-admin@contoh.com');
```

Setelah itu menu **Admin** muncul di navigasi. Admin berikutnya bisa ditetapkan dari
halaman **Admin → Peserta**.

## 2. Jalankan di komputer

Butuh Node.js 20+ (disarankan 22).

```bash
cp .env.example .env      # lalu isi PUBLIC_SUPABASE_URL dan PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev               # http://localhost:5173
```

## 3. Cek dan build production

```bash
npm run check             # svelte-check + TypeScript
npm run build             # build production (adapter Netlify)
npm run preview           # coba hasil build secara lokal
```

Jika ada error pada langkah ini, kirimkan pesan error-nya untuk diperbaiki.

## 4. Deploy ke Netlify

### Lewat dashboard (paling mudah)

1. Push project ke GitHub/GitLab.
2. Netlify → **Add new site → Import an existing project** → pilih repository.
3. Pengaturan build sudah terbaca dari `netlify.toml`
   (`npm run build`, publish directory `build`, Node 22).
4. **Site configuration → Environment variables**, tambahkan:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
5. **Deploy site**. Setelah selesai, masukkan URL situs ke *Site URL* dan *Redirect URLs*
   di Supabase (langkah 1.5).

### Lewat Netlify CLI

```bash
npm i -g netlify-cli
netlify login
netlify init           # atau: netlify link
netlify env:set PUBLIC_SUPABASE_URL "https://xxxx.supabase.co"
netlify env:set PUBLIC_SUPABASE_ANON_KEY "anon-key-kamu"
netlify deploy --build --prod
```

## Struktur project

```
supabase/
  schema.sql        Tabel, trigger, RLS, bucket & policy storage
  seed.sql          Data contoh (opsional)
src/
  hooks.server.ts   Klien Supabase server + validasi sesi
  lib/
    components/     Navbar, Footer, Logo, Avatar, kartu mentor/program/sesi
    server/         Helper admin, query, upload storage
    constants.ts, types.ts, utils.ts
  routes/
    /               Beranda
    tentang  program  mentor  jadwal  dokumentasi
    login  register  lupa-password  reset-password  logout  auth/callback
    dashboard  profil
    admin/          Ringkasan, program, mentor, jadwal (+detail peserta),
                    peserta, informasi, dokumentasi
netlify.toml        Konfigurasi build Netlify
.env.example        Contoh environment variable
```

## Keamanan

- Password ditangani sepenuhnya oleh **Supabase Auth**; tidak ada password yang disimpan manual.
- Hanya `anon key` yang dipakai. Seluruh akses data dilindungi **RLS**:
  data publik (program, mentor, jadwal, dokumentasi) bisa dibaca semua orang; data pribadi
  (profil, pendaftaran) hanya pemiliknya dan admin; operasi tulis konten hanya admin.
- Role tidak bisa diubah sendiri oleh peserta (trigger `prevent_role_change`).
- Pendaftaran divalidasi di database: sesi harus `upcoming` dan kuota belum penuh.
- Upload foto dibatasi JPG/PNG/WebP maksimal 2 MB. Foto profil hanya bisa diunggah ke folder
  milik sendiri; foto mentor dan dokumentasi hanya oleh admin.
- Halaman `/admin` dicek di server (role admin), dan setiap aksi admin memeriksa ulang role.
- Jangan pernah commit file `.env` atau memasukkan `service_role` key ke repository.

## Catatan

- Email peserta tidak disalin ke tabel `profiles`; lihat di Supabase → Authentication → Users.
- Zona waktu sesi ditampilkan sebagai WIB.
- Logo adalah placeholder sederhana (`src/lib/components/Logo.svelte`, `static/favicon.svg`);
  ganti dengan logo Future Nexus yang asli jika sudah ada.
