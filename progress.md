# Progress - Mentoring Future Nexus

Terakhir diperbarui: 3 Oktober 2026

## Status verifikasi (penting)

- [ ] `npm install` - **belum dijalankan** (registry npm diblokir saat project dibuat)
- [ ] `npm run check` (svelte-check / TypeScript) - **belum dijalankan**
- [ ] `npm run build` (build production) - **belum dijalankan**
- [ ] Diuji dengan project Supabase sungguhan - **belum**

Kode ditulis dengan hati-hati tetapi belum pernah dikompilasi. Jalankan tiga perintah pertama di
komputer sendiri sebelum deploy; jika ada error, kirim pesannya untuk diperbaiki.

## Fitur yang sudah dibuat (kode sudah ditulis)

### Halaman publik
- [x] Beranda: logo, penjelasan mentoring, tujuan, tombol "Mulai Mentoring"/"Daftar", pratinjau jadwal terdekat
- [x] Tentang Mentoring: pengertian, tujuan, manfaat, cara mengikuti
- [x] Program Mentoring: 5 kategori (filter), judul, deskripsi, mentor, jadwal
- [x] Mentor: nama, foto (Supabase Storage), kampus, jurusan, angkatan, keahlian, deskripsi
- [x] Jadwal Mentoring: nama sesi, topik, mentor, tanggal, jam, status, kuota
- [x] Pendaftaran ke sesi untuk peserta yang login (daftar & batal, validasi kuota di database)
- [x] Dokumentasi (galeri foto kegiatan) - halaman tambahan agar dokumentasi dari admin tampil

### Akun & peserta
- [x] Register, login, logout (email + password via Supabase Auth)
- [x] Reset password (kirim email + halaman password baru)
- [x] Callback auth (konfirmasi email & reset password)
- [x] Dashboard peserta: profil, mentoring diikuti, jadwal tersedia, riwayat, informasi terbaru
- [x] Profil pengguna: nama, foto profil, sekolah, kelas, minat jurusan/kampus, bio

### Admin
- [x] Role admin + proteksi halaman dan aksi
- [x] Kelola program (tambah/edit/hapus)
- [x] Kelola mentor (tambah/edit/hapus, upload foto)
- [x] Kelola jadwal sesi (tambah/edit/hapus, status, kuota)
- [x] Lihat peserta per sesi dan ubah status kehadiran
- [x] Daftar peserta + ubah role (peserta/admin)
- [x] Kelola informasi terbaru (pengumuman)
- [x] Kelola dokumentasi (upload foto)

### Infrastruktur
- [x] Skema SQL Supabase (`supabase/schema.sql`) lengkap dengan trigger
- [x] Row Level Security di semua tabel + policy storage
- [x] Data contoh opsional (`supabase/seed.sql`)
- [x] Konfigurasi Netlify (`netlify.toml`, adapter-netlify)
- [x] `.env.example` (hanya `PUBLIC_SUPABASE_URL` dan `PUBLIC_SUPABASE_ANON_KEY`)
- [x] README (menjalankan & deploy), tanpa credential asli
- [x] Desain responsive (HP & desktop), sederhana dan modern

## Belum dibuat / ide lanjutan

- [ ] Verifikasi build dan uji alur end-to-end dengan Supabase asli
- [ ] Logo Future Nexus asli (saat ini placeholder)
- [ ] Notifikasi email pengingat sesi
- [ ] Sertifikat/rekap kehadiran peserta
- [ ] Feedback/rating sesi dari peserta
- [ ] Sesi berulang (jadwal otomatis mingguan/bulanan)
- [ ] Hapus file foto lama dari Storage saat foto diganti atau data dihapus
- [ ] Ekspor daftar peserta ke CSV
- [ ] Pencarian dan paginasi untuk data yang besar
- [ ] Pengujian otomatis (unit/e2e)
