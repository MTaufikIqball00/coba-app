# Design Audit Report

## 1. Color System (Warna)
**🔴 Masalah:**
- Ditemukan banyak penggunaan **hardcoded hex colors** seperti `#2366d1`, `#57a6ff`, `#10b981`, `#f1f5f9`, dan `#64748b` di berbagai file (`src/app/tugas/layout.tsx`, `src/app/kepala/dashboard/page.tsx`, dll).
- Penggunaan warna gradasi hardcoded `from-[#2366d1] to-[#57a6ff]` yang berulang-ulang di layout.
- Tidak ada standarisasi warna status (success, warning, danger) yang terpusat; kode warna sering ditulis manual atau menggunakan utility standar Tailwind tanpa semantic naming (e.g., `text-emerald-600` vs `text-success`).

**🟡 Dampak:**
- Inkonsistensi visual jika warna perlu diubah (harus find-and-replace di banyak file).
- Kesulitan dalam maintain dark mode karena warna hardcoded tidak otomatis beradaptasi.
- Kode menjadi kotor dan sulit dibaca.

**🟢 Rekomendasi:**
- Definisikan palette warna utama di `src/app/globals.css` menggunakan CSS variables dan map ke Tailwind theme.
- Ganti hardcoded hex dengan utility class semantic (e.g., `bg-brand-primary`, `text-status-success`).
- Buat komponen wrapper atau utility class untuk gradasi background yang sering dipakai.

---

## 2. Typography
**🔴 Masalah:**
- Font family utama didefinisikan sebagai `Arial, Helvetica, sans-serif` di `globals.css`, sementara theme Tailwind mendefinisikan `var(--font-geist-sans)`.
- Penggunaan ukuran font bercampur antara utility `text-sm`, `text-base` dan heading size manual.
- Inkonsistensi penggunaan font weight di label form dan card.

**🟡 Dampak:**
- Identitas visual typography tidak konsisten (Geist vs Arial).
- Readability text pada berbagai ukuran layar mungkin tidak optimal.

**🟢 Rekomendasi:**
- Standarisasi font stack di `globals.css` agar konsisten menggunakan font Geist (jika itu yang diinginkan) atau fallback yang seragam.
- Gunakan plugin `@tailwindcss/typography` atau definisikan layer base untuk styling heading `h1-h6` agar konsisten.

---

## 3. Spacing & Layout
**🔴 Masalah:**
- Padding dan margin yang tidak konsisten antar halaman (misal: `px-8 py-5` di layout vs `p-6` di dashboard components).
- Penggunaan `w-full` dan container yang berulang manual tanpa standarisasi `max-width`.
- Duplikasi struktur layout card di berbagai file layout (kode `div` dengan shadow dan gradient yang sama di-copy paste).

**🟡 Dampak:**
- Rhythm visual halaman terasa "lompat-lompat" saat navigasi.
- Maintenance layout sulit; perubahan padding harus dilakukan di setiap file layout.

**🟢 Rekomendasi:**
- Buat komponen `PageContainer` atau `SectionWrapper` yang membungkus padding standar.
- Ekstrak komponen `HeaderCard` (gradient header) yang digunakan di banyak layout menjadi komponen reusable.

---

## 4. UI Components
**🔴 Masalah:**
- **Buttons & Inputs:** Tidak ada komponen reusable yang jelas untuk `Button` dan `Input` di folder `ui`. Kode form menggunakan input HTML standar dengan class Tailwind panjang yang di-copy paste (contoh di `src/app/tugas/[id]/submit/page.tsx`).
- **Cards:** Struktur card duplikat (e.g., `CourseCard` vs card manual di dashboard).
- **Forms:** Style input (border, focus ring) tidak konsisten antar form login dan form submit tugas.

**🟡 Dampak:**
- Inkonsistensi interaksi (hover state, focus ring).
- Kode repetitif (DRY violation) yang memperbesar ukuran bundle dan mempersulit refactor.

**🟢 Rekomendasi:**
- Refactor elemen UI dasar menjadi komponen React reusable (`src/components/ui/Button.tsx`, `Input.tsx`).
- Gunakan variant props (e.g., `variant="primary"`) untuk mengelola style button.

---

## 5. Responsiveness & Dark Mode
**🔴 Masalah:**
- Beberapa komponen memiliki hardcoded width atau height (e.g., `w-96 h-96`) yang mungkin pecah di mobile.
- Dukungan dark mode ada di `globals.css` tapi implementasi di komponen sering menggunakan warna fix (e.g., `bg-white`, `text-slate-900`) tanpa modifier `dark:`.

**🟡 Dampak:**
- Tampilan rusak di perangkat mobile kecil.
- Fitur dark mode tidak berfungsi penuh atau menghasilkan kontras buruk.

**🟢 Rekomendasi:**
- Gunakan `w-full max-w-*` daripada width fix.
- Tambahkan varian `dark:` pada komponen utama (card background, text color).
