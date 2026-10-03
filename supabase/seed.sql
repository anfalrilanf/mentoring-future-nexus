-- =====================================================================
-- DATA CONTOH (opsional) - semua nama mentor fiktif, ganti lewat panel admin.
-- Jalankan setelah schema.sql. Tanggal sesi dibuat relatif terhadap hari ini.
-- =====================================================================

insert into public.mentors (id, name, campus, major, batch_year, expertise, bio) values
  ('11111111-1111-1111-1111-111111111101', 'Contoh Mentor Satu', 'Universitas Contoh A', 'Teknik Informatika', 2019,
    array['Pemilihan jurusan', 'Teknologi & coding'],
    'Alumni yang senang membantu adik kelas memahami dunia perkuliahan teknik dan teknologi.'),
  ('11111111-1111-1111-1111-111111111102', 'Contoh Mentor Dua', 'Universitas Contoh B', 'Kedokteran', 2018,
    array['UTBK', 'Persiapan jalur masuk'],
    'Berbagi strategi belajar UTBK dan cara mengatur waktu selama masa persiapan.'),
  ('11111111-1111-1111-1111-111111111103', 'Contoh Mentor Tiga', 'Universitas Contoh C', 'Manajemen', 2020,
    array['Adaptasi kuliah', 'Organisasi'],
    'Berpengalaman di organisasi kampus dan siap berbagi tips adaptasi di semester awal.')
on conflict (id) do nothing;

insert into public.programs (id, title, description, category, mentor_id, schedule) values
  ('22222222-2222-2222-2222-222222222201', 'Roadmap Masuk Perguruan Tinggi',
    'Memahami alur jalur masuk perguruan tinggi dan menyusun timeline persiapan dari kelas XII.',
    'Persiapan masuk perguruan tinggi', '11111111-1111-1111-1111-111111111101', 'Setiap Sabtu pekan pertama, 15.00 WIB'),
  ('22222222-2222-2222-2222-222222222202', 'Kenali Jurusan dan Kampus Impianmu',
    'Diskusi santai untuk mengenali minat, prospek jurusan, dan cara memilih kampus yang cocok.',
    'Pemilihan jurusan dan kampus', '11111111-1111-1111-1111-111111111101', 'Setiap Minggu pekan kedua, 10.00 WIB'),
  ('22222222-2222-2222-2222-222222222203', 'Strategi UTBK dan Jalur Masuk',
    'Tips belajar, manajemen waktu, dan strategi mengerjakan soal untuk UTBK serta jalur lainnya.',
    'Persiapan UTBK/jalur masuk', '11111111-1111-1111-1111-111111111102', 'Setiap Sabtu pekan ketiga, 14.00 WIB'),
  ('22222222-2222-2222-2222-222222222204', 'Siap Kuliah: Adaptasi Semester Awal',
    'Cerita dan tips menghadapi budaya belajar, pertemanan, dan keuangan di awal masa kuliah.',
    'Adaptasi kehidupan perkuliahan', '11111111-1111-1111-1111-111111111103', 'Setiap Minggu pekan keempat, 16.00 WIB'),
  ('22222222-2222-2222-2222-222222222205', 'Cerita Alumni',
    'Alumni SMANWAY berbagi perjalanan, tantangan, dan pelajaran dari berbagai kampus dan bidang.',
    'Sharing pengalaman alumni', '11111111-1111-1111-1111-111111111103', 'Bulanan, jadwal diumumkan di dashboard')
on conflict (id) do nothing;

insert into public.sessions (program_id, mentor_id, title, topic, session_date, start_time, end_time, location, capacity, status) values
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101',
    'Roadmap Masuk PTN & PTS', 'Jalur masuk dan timeline persiapan', current_date + 7, '15:00', '16:30', 'Online (link dikirim lewat email)', 40, 'upcoming'),
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111102',
    'Strategi Belajar UTBK', 'Manajemen waktu dan teknik mengerjakan soal', current_date + 14, '14:00', '15:30', 'Online (link dikirim lewat email)', 50, 'upcoming'),
  ('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111103',
    'Bertahan di Semester Pertama', 'Adaptasi belajar, organisasi, dan keuangan mahasiswa baru', current_date + 21, '16:00', '17:30', 'Online (link dikirim lewat email)', 30, 'upcoming'),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111101',
    'Mengenal Jurusan Teknologi', 'Gambaran kuliah dan karier di bidang teknologi', current_date - 10, '10:00', '11:30', 'Online', 40, 'completed');

insert into public.announcements (title, content) values
  ('Selamat datang di Mentoring Future Nexus',
   'Lengkapi profilmu, lalu daftar ke sesi mentoring yang sesuai dengan minatmu. Sampai jumpa di sesi pertama!');
