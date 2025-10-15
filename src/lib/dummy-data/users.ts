export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for security reasons in frontend models
  role:
    | "student"
    | "teacher"
    | "school_admin"
    | "admin_langganan"
    | "kepala_sekolah"
    | "admin_sekolah";
  schoolId: string | null;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  avatar: string;
};

export const users: User[] = [
  // Admin Langganan
  {
    id: "user-001",
    name: "Admin Utama",
    email: "admin@langganan.id",
    password: "password123",
    role: "admin_langganan",
    schoolId: null,
    status: "active",
    lastLogin: "2024-07-28T10:00:00Z",
    avatar: "/assets/Avatar.png",
  },

  // School Admins
  {
    id: "user-002",
    name: "Kepala Sekolah SMAN 1 Bandung",
    email: "kepalasekolah@sman1bandung.sch.id",
    password: "password123",
    role: "kepala_sekolah",
    schoolId: "sch-001",
    status: "active",
    lastLogin: "2024-07-28T09:00:00Z",
    avatar: "/assets/Avatar.png",
  },
  {
    id: "user-009",
    name: "Admin Sekolah SMAN 2 Contoh",
    email: "admin2@sman2.sch.id",
    password: "password123",
    role: "admin_sekolah",
    schoolId: "sch-004",
    status: "active",
    lastLogin: "2024-08-01T09:00:00Z",
    avatar: "/assets/Avatar.png",
  },
  {
    id: "user-003",
    name: "Admin SMAN 3 Jakarta",
    email: "admin@sman3jakarta.sch.id",
    password: "password123",
    role: "school_admin",
    schoolId: "sch-002",
    status: "active",
    lastLogin: "2024-07-27T15:30:00Z",
    avatar: "/assets/Avatar.png",
  },

  // Teachers
  {
    id: "user-004",
    name: "Budi Guru",
    email: "budi.guru@sman1bandung.sch.id",
    password: "password123",
    role: "teacher",
    schoolId: "sch-001",
    status: "active",
    lastLogin: "2024-07-28T08:00:00Z",
    avatar: "/assets/Avatar.png",
  },
  {
    id: "user-005",
    name: "Citra Guru",
    email: "citra.guru@sman3jakarta.sch.id",
    password: "password123",
    role: "teacher",
    schoolId: "sch-002",
    status: "inactive",
    lastLogin: "2024-06-20T11:00:00Z",
    avatar: "/assets/Avatar.png",
  },

  // Students
  // Siswa Kelas 12
  {
    id: "user-006",
    name: "Andi Siswa",
    email: "andi.siswa@sman1bandung.sch.id",
    password: "password123",
    role: "student",
    schoolId: "sch-001",
    status: "active",
    lastLogin: "2024-07-28T11:00:00Z",
    avatar: "/assets/Avatar.png",
  },
  // Siswa Kelas 11
  {
    id: "user-008",
    name: "Rian Siswa",
    email: "rian.siswa@sman1bogor.sch.id",
    password: "password123",
    role: "student",
    schoolId: "sch-006",
    status: "active",
    lastLogin: "2024-07-28T12:00:00Z",
    avatar: "/assets/Avatar.png",
  },
  // Siswa Kelas 10
  {
    id: "user-007",
    name: "Sari Siswa",
    email: "sari.siswa@sman5surabaya.sch.id",
    password: "password123",
    role: "student",
    schoolId: "sch-003",
    status: "active",
    lastLogin: "2024-07-25T11:00:00Z",
    avatar: "/assets/Avatar.png",
  },
];
