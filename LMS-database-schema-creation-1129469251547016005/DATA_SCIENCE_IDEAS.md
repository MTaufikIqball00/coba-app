# Calon Topik Proyek Sains Data untuk LMS

Berikut adalah 3 ide calon topik proyek sains data yang inovatif dan relevan untuk pengembangan Learning Management System (LMS).

---

### **Ide 1 (Prioritas): Sistem Rekomendasi Jurusan Kuliah Berbasis Profil Siswa**

*   **Deskripsi Singkat:**
    Sistem ini secara proaktif menganalisis data aktivitas dan performa siswa di dalam LMS untuk memberikan rekomendasi jurusan kuliah yang paling sesuai dengan bakat, minat, dan potensi akademis mereka.

*   **Masalah yang Dipecahkan:**
    Banyak siswa SMA/SMK merasa bingung dan tidak memiliki dasar yang kuat saat memilih jurusan kuliah. Pilihan seringkali hanya didasarkan pada popularitas jurusan atau saran umum, bukan pada analisis data personal yang objektif. Proyek ini bertujuan untuk mengurangi ketidakpastian tersebut dan membantu siswa menemukan jalur karier yang sesuai dengan potensi mereka.

*   **Jenis Data yang Dibutuhkan dari LMS:**
    1.  **Data Performa Akademis:** Riwayat nilai dari semua mata pelajaran, kuis, tugas, dan *tryout*. Contoh: `nilai rata-rata Matematika dan Fisika selama 3 semester`, `skor tertinggi pada tryout Kimia`.
    2.  **Data Kecepatan & Konsistensi Belajar:** Waktu yang dihabiskan untuk menyelesaikan sebuah modul atau kuis, serta frekuensi pengerjaan ulang. Contoh: `rata-rata waktu pengerjaan kuis Bahasa Inggris`, `jumlah percobaan pada kuis Biologi`.
    3.  **Data Minat & Keterlibatan (Engagement):** Interaksi siswa dengan konten non-wajib. Contoh: `frekuensi mengakses modul Informatika`, `keaktifan (post/reply) di forum diskusi mata pelajaran tertentu`, `video materi yang paling sering ditonton`.
    4.  **Data Perbandingan Sosial (Opsional):** Performa siswa dibandingkan dengan siswa lain yang memiliki minat atau profil serupa.

*   **Metode Sains Data yang Sesuai:**
    **Hybrid Recommendation System (Collaborative & Content-Based Filtering)**.
    *   **Content-Based Filtering:** Menganalisis profil siswa (nilai tinggi di mapel eksak, cepat mengerjakan soal logika) lalu mencocokkannya dengan "profil" jurusan (misal, Teknik Informatika membutuhkan logika dan matematika yang kuat).
    *   **Collaborative Filtering:** Menemukan siswa lain dengan pola belajar dan minat yang serupa, kemudian merekomendasikan jurusan yang berhasil atau diminati oleh "kelompok" siswa tersebut.
    *   Model gabungan (hybrid) akan memberikan rekomendasi yang paling akurat dan personal.

---

### **Ide 2: Sistem Prediksi Dini Siswa Berisiko (At-Risk Student Prediction)**

*   **Deskripsi Singkat:**
    Sebuah model machine learning yang dapat mengidentifikasi siswa yang menunjukkan tanda-tanda penurunan performa, potensi *drop-out*, atau kesulitan belajar, sehingga guru dan konselor dapat melakukan intervensi lebih awal.

*   **Masalah yang Dipecahkan:**
    Guru seringkali baru menyadari masalah siswa setelah nilai mereka anjlok secara signifikan. Sistem ini memungkinkan deteksi dini berdasarkan perubahan pola perilaku halus di LMS, yang mungkin tidak langsung terlihat secara kasat mata.

*   **Jenis Data yang Dibutuhkan dari LMS:**
    1.  **Data Tren Performa:** Penurunan nilai secara bertahap dari waktu ke waktu. Contoh: `tren negatif pada nilai rata-rata bulanan`.
    2.  **Data Keterlibatan (Engagement):** Frekuensi login, waktu yang dihabiskan di platform, partisipasi di forum. Contoh: `penurunan drastis frekuensi login dalam 30 hari terakhir`, `tidak pernah membuka halaman tugas`.
    3.  **Data Perilaku:** Tingkat penyelesaian tugas, data absensi (jika terintegrasi). Contoh: `persentase tugas yang dikumpulkan terlambat`, `tingkat kehadiran di bawah 80%`.

*   **Metode Sains Data yang Sesuai:**
    **Binary Classification**. Model ini akan mengklasifikasikan siswa ke dalam dua kategori: "berisiko" atau "tidak berisiko". Algoritma yang bisa digunakan antara lain:
    *   **Logistic Regression:** Sebagai model dasar yang mudah diinterpretasi.
    *   **Random Forest** atau **Gradient Boosting (XGBoost):** Untuk akurasi yang lebih tinggi dengan menangani interaksi data yang kompleks.

---

### **Ide 3: Generator Jalur Belajar Adaptif (Adaptive Learning Path Generator)**

*   **Deskripsi Singkat:**
    Sistem yang secara dinamis menyusun urutan materi, kuis, dan video pembelajaran yang disesuaikan dengan kecepatan dan tingkat pemahaman masing-masing siswa secara *real-time*.

*   **Masalah yang Dipecahkan:**
    Pendekatan "satu untuk semua" dalam penyampaian materi tidak efektif. Siswa yang cepat akan merasa bosan, sementara siswa yang lebih lambat akan tertinggal. Sistem ini menciptakan pengalaman belajar yang personal dan efisien untuk setiap individu.

*   **Jenis Data yang Dibutuhkan dari LMS:**
    1.  **Data Interaksi Mikro:** Jawaban benar/salah pada setiap soal kuis. Contoh: `riwayat jawaban pada topik Aljabar`.
    2.  **Data Konsumsi Konten:** Waktu yang dihabiskan pada setiap halaman materi atau video. Contoh: `menghabiskan waktu >15 menit pada video tentang "Hukum Newton"`.
    3.  **Data Ketergantungan Topik:** Struktur materi yang sudah dipetakan (misal, untuk belajar "Turunan" harus paham "Limit" terlebih dahulu).

*   **Metode Sains Data yang Sesuai:**
    **Reinforcement Learning (Multi-Armed Bandit)** atau **Knowledge Tracing**.
    *   **Multi-Armed Bandit:** Sistem akan "bereksperimen" dengan memberikan materi/soal dengan tingkat kesulitan berbeda. Jika siswa berhasil, sistem akan memberikan materi yang lebih sulit. Jika gagal, sistem akan memberikan materi pengulangan atau prasyarat. Tujuannya adalah memaksimalkan "reward" (pemahaman siswa).
    *   **Deep Knowledge Tracing (DKT):** Menggunakan Recurrent Neural Networks (RNN) untuk memodelkan status pemahaman siswa dari waktu ke waktu dan memprediksi materi apa yang paling dibutuhkan selanjutnya.
