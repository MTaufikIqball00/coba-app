import pandas as pd
import numpy as np

def calculate_features(df):
    """
    Menghitung fitur yang dibutuhkan untuk model dan sistem peringatan dini.
    Asumsi input: DataFrame dengan kolom 'nilai' (list of floats), 'sakit', 'izin', 'alpa'.
    """
    # 1. Hitung total absensi
    df['total_absensi'] = df['sakit'].fillna(0) + df['izin'].fillna(0) + df['alpa'].fillna(0)
    
    # 2. Hitung rata-rata nilai
    # Asumsi kolom 'nilai' berisi list nilai. Kita perlu expand atau hitung langsung.
    # Jika inputan JSON langsung mengirim rata-rata, kita pakai itu. Tapi untuk robustness, hitung ulang.
    # Untuk simplisitas dan konsistensi dengan notebook yang membagi periode awal/akhir secara manual:
    
    def process_grades(grades_list):
        if not isinstance(grades_list, list) or len(grades_list) == 0:
            return pd.Series([0, 0, 0, 0], index=['rata_rata_nilai', 'rata_nilai_periode_awal', 'rata_nilai_periode_akhir', 'volatilitas_nilai'])
        
        grades = np.array(grades_list)
        rata_rata = np.mean(grades)
        volatilitas = np.std(grades)
        
        # Split awal vs akhir
        tengah = len(grades) // 2
        if tengah > 0:
            avg_awal = np.mean(grades[:tengah])
            avg_akhir = np.mean(grades[tengah:])
        else:
            avg_awal = rata_rata
            avg_akhir = rata_rata
            
        return pd.Series([rata_rata, avg_awal, avg_akhir, volatilitas], 
                         index=['rata_rata_nilai', 'rata_nilai_periode_awal', 'rata_nilai_periode_akhir', 'volatilitas_nilai'])

    grade_features = df['nilai'].apply(process_grades)
    df = pd.concat([df, grade_features], axis=1)

    # 3. Hitung perubahan nilai
    df['perubahan_nilai'] = df['rata_nilai_periode_akhir'] - df['rata_nilai_periode_awal']
    
    # Flag penurunan tajam (turun > 15% dari nilai awal)
    # Hindari division by zero
    df['persentase_perubahan'] = np.where(df['rata_nilai_periode_awal'] > 0, 
                                          (df['perubahan_nilai'] / df['rata_nilai_periode_awal']) * 100, 
                                          0)
    df['flag_penurunan_tajam'] = df['persentase_perubahan'] < -15

    # 4. Rasio Kehadiran (Asumsi 120 hari efektif)
    TOTAL_HARI_EFEKTIF = 120
    df['hari_hadir'] = TOTAL_HARI_EFEKTIF - df['total_absensi']
    df['rasio_kehadiran'] = (df['hari_hadir'] / TOTAL_HARI_EFEKTIF) * 100
    
    return df

def apply_early_warning_system(df):
    """
    Menerapkan rule-based early warning system.
    """
    # LEVEL 1: URGENT
    urgent_mask = (
        (df['flag_penurunan_tajam'] == True) | 
        ((df['rata_rata_nilai'] < 50) & (df['total_absensi'] > 30))
    )

    # LEVEL 2: WARNING
    warning_mask = (
        ~urgent_mask & 
        (
            (df['rata_rata_nilai'] < 60) |
            (df['total_absensi'] > 20) |
            (df['perubahan_nilai'] < -10)
        )
    )

    # LEVEL 3: WATCH
    watch_mask = (
        ~urgent_mask & ~warning_mask &
        (
            (df['rata_rata_nilai'] < 70) |
            (df['volatilitas_nilai'] > 20)
        )
    )

    # Assign status
    df['status_peringatan'] = 'NORMAL'
    df.loc[watch_mask, 'status_peringatan'] = 'WATCH'
    df.loc[warning_mask, 'status_peringatan'] = 'WARNING'
    df.loc[urgent_mask, 'status_peringatan'] = '🚨 URGENT'
    
    # Risk Score Calculation
    # Normalisasi komponen ke skala yang sebanding
    score = (
        (100 - df['rata_rata_nilai']) * 0.4 +         # Nilai rendah -> skor tinggi
        (df['total_absensi'] * 2) * 0.3 +             # Absensi -> skor tinggi
        (np.clip(-df['perubahan_nilai'], 0, None) * 2) * 0.2 + # Penurunan -> skor tinggi
        df['volatilitas_nilai'] * 0.1
    )
    # Simple normalization to 0-100 range logically
    df['risk_score'] = np.clip(score, 0, 100).round(2)

    return df

def generate_recommendations(row):
    """
    Membuat rekomendasi berdasarkan kondisi siswa.
    """
    rekomendasi = []

    # Penurunan nilai
    if row['flag_penurunan_tajam']:
        rekomendasi.append("Investigasi segera penyebab penurunan drastis")
        rekomendasi.append("Konseling siswa dan orang tua")

    # Nilai rendah
    if row['rata_rata_nilai'] < 50:
        rekomendasi.append("Bimbingan belajar intensif (2x/minggu)")
        rekomendasi.append("Evaluasi metode belajar")
    elif row['rata_rata_nilai'] < 70:
        rekomendasi.append("Bimbingan belajar reguler (1x/minggu)")

    # Absensi
    if row['total_absensi'] > 30:
        rekomendasi.append("Investigasi penyebab ketidakhadiran")
        rekomendasi.append("Home visit wali kelas")
    elif row['total_absensi'] > 15:
        rekomendasi.append("Konseling kedisiplinan")

    # Volatilitas
    if row['volatilitas_nilai'] > 20:
        rekomendasi.append("Evaluasi kestabilan emosi/mental")
        rekomendasi.append("Konseling BK")

    # Status URGENT
    if row['status_peringatan'] == '🚨 URGENT':
        rekomendasi.append("TINDAK LANJUT DALAM 3 HARI")

    if not rekomendasi:
        rekomendasi.append("Pertahankan performa")

    return " | ".join(rekomendasi)
