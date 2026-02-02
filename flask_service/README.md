# Python Data Analysis Service

Service ini menggunakan Flask untuk memproses data excel siswa dan melakukan clustering risiko menggunakan algoritma K-Means.

## Cara Menjalankan (Windows)

1. Pastikan Python sudah terinstall.
2. Klik dua kali file `start_flask.bat`.
   - Script ini akan menginstall library yang dibutuhkan (`pandas`, `scikit-learn`, `flask`, dll).
   - Kemudian akan menjalankan server di `http://localhost:5000`.

## Integrasi

- Next.js akan mengirim file Excel ke endpoint `http://localhost:5000/api/analyze`.
- Pastikan server Flask ini tetap berjalan saat Anda mencoba fitur Analisis di Dashboard Guru.
