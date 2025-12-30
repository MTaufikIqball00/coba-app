# Dashboard Analysis & Improvement Plan

## 1. Admin Utama (Super Admin) - `admin_langganan`

**Fokus:** Kontrol sistem & governance.

### 🔴 Masalah
- **Lack of Global Visibility:** Dashboard saat ini hanya menampilkan daftar sekolah dan status langganan. Tidak ada informasi tentang total murid atau guru di seluruh sistem.
- **Missing Governance Tools:** Tidak ada pemantauan status sistem (uptime, error rate) atau audit log aktivitas admin yang terlihat langsung.
- **Visual:** Hanya berupa tabel daftar (list view), bukan dashboard eksekutif yang memberikan "bird's eye view".

### 🟡 Dampak
- Admin tidak bisa mendeteksi anomali sistem dengan cepat.
- Sulit memantau pertumbuhan user secara keseluruhan (scalability metrics).

### 🟢 Rekomendasi
1. **Global Stats:** Tambahkan kartu statistik untuk Total Schools, Total Students, Total Teachers, dan Active Subscriptions.
2. **System Health:** Tambahkan widget indikator status sistem (Database, API, Storage).
3. **Audit Log Preview:** Tampilkan 5 aktivitas admin terakhir.

### 🧩 Struktur Ideal
- **Top Row:** Key Metrics (Schools, Revenue/Subs, Users, System Status).
- **Middle Row:**
    - Left (2/3): Subscription Growth Chart (New vs Expired).
    - Right (1/3): Recent System Alerts / Anomalies.
- **Bottom Row:** Recent Activity Logs & School Onboarding Queue.

---

## 2. Admin Sekolah - `admin_sekolah`

**Fokus:** Operasional sekolah harian.

### 🔴 Masalah
- **Lacking Daily Operational Data:** Dashboard saat ini statis (Total Guru, Total Murid). Tidak ada info dinamis hari ini.
- **No Attendance Insight:** Tidak ada info siapa yang absen hari ini (guru/murid).
- **No Schedule Awareness:** Admin tidak tahu kelas apa yang sedang berjalan.

### 🟡 Dampak
- Admin harus masuk ke menu spesifik untuk mencari tahu info operasional (misal: "Apakah Pak Budi masuk?").
- Respon lambat terhadap kejadian harian (misal: kelas kosong).

### 🟢 Rekomendasi
1. **Attendance Widget:** Ringkasan kehadiran hari ini (Hadir/Sakit/Izin/Alpha).
2. **Schedule Widget:** Info kelas yang sedang berlangsung sekarang.
3. **Action Items:** Notifikasi jika ada yang perlu approval atau perhatian (misal: "3 Guru belum absen").

### 🧩 Struktur Ideal
- **Top Row:** Today's Attendance (Student & Teacher), Active Classes, Issues needing attention.
- **Middle Row:**
    - Left: Ongoing Classes Schedule.
    - Right: Quick Actions (Add Student, Broadcast Msg).
- **Bottom Row:** Recent Enrolled Students or Teacher Status.

---

## 3. Guru - `teacher`

**Fokus:** Kegiatan mengajar & evaluasi.

### 🔴 Masalah
- **Missing "Today's Schedule":** Tidak ada info jadwal mengajar hari ini di halaman depan. Ini fitur paling krusial.
- **Grading Visibility:** Info tentang tugas yang belum dinilai tidak menonjol ("Needs Grading").
- **Visual Noise:** UI saat ini (TeacherDashboard.tsx) terlalu banyak gradasi dan animasi, yang bisa mengganggu fokus ("cognitive load" tinggi).

### 🟡 Dampak
- Guru harus mencari jadwal manual.
- Tugas siswa menumpuk karena tidak ada reminder visual yang jelas.

### 🟢 Rekomendasi
1. **Schedule First:** Tempatkan "Jadwal Hari Ini" di posisi paling strategis.
2. **To-Do List:** Widget khusus "Perlu Dinilai" atau "Tugas Mendatang".
3. **Simplify UI:** Kurangi elemen dekoratif berlebih, fokus pada kejelasan data.

### 🧩 Struktur Ideal
- **Top Row:** Next Class Card (Time, Subject, Room).
- **Middle Row:**
    - Left: "Needs Grading" List.
    - Right: Quick Access (Create Assignment, Attendance).
- **Bottom Row:** Recent Submissions / Performance Overview.

---

## 4. Kepala Sekolah - `headmaster` (via `kepala`)

**Fokus:** Insight & keputusan strategis.

### 🔴 Masalah
- **Data is Static:** Hanya menampilkan rata-rata statis (Avg Grade, Avg Attendance). Tidak ada tren waktu.
- **No Comparisons:** Tidak bisa membandingkan performa antar kelas atau antar periode.
- **Missing Teacher Performance:** Tidak ada info ringkas tentang kinerja guru.

### 🟡 Dampak
- Kepala sekolah tidak bisa melihat kemajuan atau kemunduran (tren).
- Keputusan berbasis data kurang akurat karena hanya melihat snapshot saat ini.

### 🟢 Rekomendasi
1. **Trend Charts:** Gunakan Line Chart untuk tren absensi mingguan/bulanan.
2. **Distribution Charts:** Bar Chart untuk sebaran nilai siswa (A, B, C, D, E).
3. **Teacher Highlights:** Tabel ringkas top performing teachers atau yang butuh perhatian (misal: sering terlambat).

### 🧩 Struktur Ideal
- **Top Row:** High-level KPIs (Attendance Rate, Avg GPA, Risk Students Count).
- **Middle Row:**
    - Left: Attendance Trend (Last 30 Days).
    - Right: Academic Performance Distribution.
- **Bottom Row:** Teacher Performance Summary / Class Comparison.
