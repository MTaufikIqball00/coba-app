export type Package = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMonths: 3 | 6 | 12;
  features: string[];
  type: "basic" | "premium" | "enterprise";
  isAvailable: boolean;
};

export const packages: Package[] = [
  {
    id: "pkg-basic-3",
    name: "Paket Basic 3 Bulan",
    description: "Akses dasar untuk sekolah kecil.",
    price: 1500000,
    durationMonths: 3,
    features: [
      "Manajemen Siswa (hingga 100)",
      "Manajemen Guru (hingga 10)",
      "Fitur Absensi",
      "Forum Diskusi",
    ],
    type: "basic",
    isAvailable: true,
  },
  {
    id: "pkg-basic-6",
    name: "Paket Basic 6 Bulan",
    description: "Akses dasar untuk sekolah kecil dengan durasi lebih lama.",
    price: 2800000,
    durationMonths: 6,
    features: [
      "Manajemen Siswa (hingga 100)",
      "Manajemen Guru (hingga 10)",
      "Fitur Absensi",
      "Forum Diskusi",
    ],
    type: "basic",
    isAvailable: true,
  },
  {
    id: "pkg-premium-6",
    name: "Paket Premium 6 Bulan",
    description: "Fitur lengkap untuk sekolah menengah.",
    price: 5000000,
    durationMonths: 6,
    features: [
      "Semua fitur Basic",
      "Manajemen Siswa (hingga 500)",
      "Manajemen Guru (hingga 50)",
      "Manajemen Modul & Tugas",
      "Fitur Try-Out",
      "Laporan Analitik",
    ],
    type: "premium",
    isAvailable: true,
  },
  {
    id: "pkg-premium-12",
    name: "Paket Premium 12 Bulan",
    description: "Solusi lengkap untuk satu tahun ajaran.",
    price: 9500000,
    durationMonths: 12,
    features: [
      "Semua fitur Premium",
      "Manajemen Siswa (unlimited)",
      "Manajemen Guru (unlimited)",
      "Dukungan Prioritas",
      "Backup Data Otomatis",
    ],
    type: "premium",
    isAvailable: true,
  },
  {
    id: "pkg-enterprise",
    name: "Paket Enterprise",
    description: "Solusi kustom untuk grup sekolah atau dinas pendidikan.",
    price: 0, // Custom price
    durationMonths: 12,
    features: ["Semua fitur Premium", "Integrasi Kustom", "Server Khusus"],
    type: "enterprise",
    isAvailable: false, // Requires consultation
  },
];