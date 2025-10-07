export const dummyUsers = [
  {
    id: "1",
    email: "murid.jabar@sekolah.id",
    password: "password123",
    role: "student",
    name: "Siswa Jabar (Kelas 12)",
    grade: 12,
    school: {
      name: "SMA Negeri 1 Bandung",
      province: "Jawa Barat",
      subscriptionStatus: "active",
    },
  },
  {
    id: "2",
    email: "guru.jabar@sekolah.id",
    password: "password123",
    role: "teacher",
    name: "Guru Jabar",
    school: {
      name: "SMA Negeri 1 Bandung",
      province: "Jawa Barat",
      subscriptionStatus: "active",
    },
  },
  {
    id: "3",
    email: "admin@langganan.id",
    password: "password123",
    role: "admin_langganan",
    name: "Admin Langganan",
  },
  {
    id: "4",
    email: "murid.luar@sekolah.id",
    password: "password123",
    role: "student",
    name: "Siswa Luar Jabar (Kelas 11)",
    grade: 11,
    school: {
      name: "SMA Negeri 1 Medan",
      province: "Sumatera Utara",
      subscriptionStatus: "limited",
    },
  },
  {
    id: "5",
    email: "murid.kelas10@sekolah.id",
    password: "password123",
    role: "student",
    name: "Siswa Kelas 10",
    grade: 10,
    school: {
      name: "SMA Negeri 2 Jakarta",
      province: "DKI Jakarta",
      subscriptionStatus: "expired",
    },
  },
  {
    id: "6",
    email: "guru.luar@sekolah.id",
    password: "password123",
    role: "teacher",
    name: "Guru Luar Jabar",
    school: {
      name: "SMA Negeri 1 Medan",
      province: "Sumatera Utara",
      subscriptionStatus: "limited",
    },
  },
];

// 2. Dummy Module Data (from api/teacher/modules/store.ts)
export interface Module {
  id: string;
  teacherId: string;
  title: string;
  description?: string;
  type: "video" | "pdf" | "quiz" | "document";
  contentUrl: string;
  fileName?: string;
  fileType?: string;
  createdAt: string;
}

// Using a Map to simulate a database table for modules.
export const dummyModules = new Map<string, Module>();

// Pre-populate with some data if needed
const initialModule: Module = {
  id: "mod-initial-1",
  teacherId: "2", // Corresponds to "Guru Hebat"
  title: "Pengenalan Aljabar",
  description: "Bab pertama dalam kurikulum matematika semester ini.",
  type: "pdf",
  contentUrl: "http://example.com/aljabar.pdf",
  createdAt: new Date().toISOString(),
};

dummyModules.set(initialModule.id, initialModule);

// 3. Dummy Student Data
import {
  Student,
  StudentActivity,
  StudentAttendance,
  StudentGrade,
} from "./types/student";

// Using a Map to simulate a database table for students.
export const dummyStudents = new Map<string, Student>();

// Pre-populate with some data
const student1: Student = {
  id: "s1",
  studentId: "NIM001",
  name: "Budi Pekerti",
  email: "budi.pekerti@sekolah.id",
  avatar: "/assets/Avatar.png",
  semester: 3,
  grade: 11,
  school: {
    name: "SMA Negeri 1 Jakarta",
    province: "DKI Jakarta",
  },
  phone: "081234567890",
  class: "Kelas 11A",
  major: "Ilmu Pengetahuan Alam",
  enrollmentDate: "2023-07-15T00:00:00.000Z",
  status: "active",
  gpa: 3.85,
  totalCredits: 60,
  completedCredits: 45,
  address: "Jl. Pendidikan No. 1, Jakarta",
  parentName: "Ayah Budi",
  parentPhone: "081209876543",
  attendanceRate: 95.5,
  assignmentCompletion: 98.0,
  quizAverage: 88.2,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const student2: Student = {
  id: "s2",
  studentId: "NIM002",
  name: "Siti Aminah",
  email: "siti.aminah@sekolah.id",
  avatar: "/assets/Avatar2.png",
  semester: 5,
  grade: 12, // Kelas 12
  school: {
    name: "SMA Negeri 3 Bandung",
    province: "Jawa Barat",
  },
  phone: "081234567891",
  class: "Kelas 12B",
  major: "Ilmu Pengetahuan Sosial",
  enrollmentDate: "2022-07-15T00:00:00.000Z",
  status: "active",
  gpa: 3.92,
  totalCredits: 120,
  completedCredits: 100,
  address: "Jl. Merdeka No. 45, Bandung",
  parentName: "Ayah Siti",
  parentPhone: "081209876544",
  attendanceRate: 96.0,
  assignmentCompletion: 95.0,
  quizAverage: 91.5,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const student3: Student = {
  id: "s3",
  studentId: "NIM003",
  name: "Ahmad Fadil",
  email: "ahmad.fadil@sekolah.id",
  avatar: "/assets/Avatar3.png",
  semester: 1,
  grade: 10, // Kelas 10
  school: {
    name: "SMA Swasta Harapan",
    province: "Jawa Tengah",
  },
  phone: "081234567892",
  class: "Kelas 10C",
  major: "Ilmu Pengetahuan Alam",
  enrollmentDate: "2024-07-15T00:00:00.000Z",
  status: "active",
  gpa: 3.65,
  totalCredits: 24,
  completedCredits: 18,
  address: "Jl. Pemuda No. 78, Semarang",
  parentName: "Ayah Ahmad",
  parentPhone: "081209876545",
  attendanceRate: 93.0,
  assignmentCompletion: 89.0,
  quizAverage: 85.0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

dummyStudents.set(student1.id, student1);
dummyStudents.set(student2.id, student2);

// 4. Dummy Grades Data
export const dummyGrades = new Map<string, StudentGrade[]>();
dummyGrades.set("s1", [
  {
    id: "g1",
    studentId: "s1",
    subject: "Fisika",
    type: "Tugas",
    title: "Hukum Newton",
    score: 90,
    maxScore: 100,
    percentage: 90,
    grade: "A",
    submittedAt: "2024-05-10T08:00:00.000Z",
    gradedAt: "2024-05-12T14:00:00.000Z",
  },
  {
    id: "g2",
    studentId: "s1",
    subject: "Matematika",
    type: "Kuis",
    title: "Kalkulus Dasar",
    score: 85,
    maxScore: 100,
    percentage: 85,
    grade: "A-",
    submittedAt: "2024-05-11T09:00:00.000Z",
    gradedAt: "2024-05-11T15:00:00.000Z",
  },
]);
dummyGrades.set("s2", [
  {
    id: "g3",
    studentId: "s2",
    subject: "Kimia",
    type: "Tugas",
    title: "Struktur Atom",
    score: 88,
    maxScore: 100,
    percentage: 88,
    grade: "A-",
    submittedAt: "2024-05-12T08:00:00.000Z",
    gradedAt: "2024-05-14T14:00:00.000Z",
  },
  {
    id: "g4",
    studentId: "s2",
    subject: "Biologi",
    type: "Kuis",
    title: "Sistem Sel",
    score: 92,
    maxScore: 100,
    percentage: 92,
    grade: "A",
    submittedAt: "2024-05-13T09:00:00.000Z",
    gradedAt: "2024-05-13T15:00:00.000Z",
  },
]);

// 5. Dummy Attendance Data
export const dummyAttendance = new Map<string, StudentAttendance[]>();
dummyAttendance.set("s1", [
  {
    id: "att1",
    studentId: "s1",
    date: "2024-05-20T00:00:00.000Z",
    status: "present",
    subject: "Fisika",
    checkInTime: "08:05:12",
    location: "Ruang Kelas 11A",
    notes: "Tepat waktu",
  },
  {
    id: "att2",
    studentId: "s1",
    date: "2024-05-19T00:00:00.000Z",
    status: "late",
    subject: "Matematika",
    checkInTime: "09:15:30",
    location: "Ruang Kelas 11A",
    notes: "Terlambat 15 menit",
  },
]);
dummyAttendance.set("s2", [
  {
    id: "att3",
    studentId: "s2",
    date: "2024-05-20T00:00:00.000Z",
    status: "present",
    subject: "Kimia",
    checkInTime: "08:03:00",
    location: "Ruang Kelas 11A",
    notes: "Tepat waktu",
  },
  {
    id: "att4",
    studentId: "s2",
    date: "2024-05-19T00:00:00.000Z",
    status: "absent",
    subject: "Biologi",
    checkInTime: "08:00:00",
    location: "Ruang Kelas 11A",
    notes: "Sakit",
  },
]);

// 6. Dummy Activities Data
export const dummyActivities = new Map<string, StudentActivity[]>();
dummyActivities.set("s1", [
  {
    id: "act1",
    studentId: "s1",
    type: "assignment_submit",
    timestamp: "2024-05-10T08:00:00.000Z",
    title: "Tugas Fisika Dikumpulkan",
    description: "Menyerahkan tugas tentang Hukum Newton.",
  },
  {
    id: "act2",
    studentId: "s1",
    type: "quiz_complete",
    timestamp: "2024-05-11T09:30:00.000Z",
    title: "Kuis Matematika Selesai",
    description: "Menyelesaikan kuis Kalkulus Dasar dengan skor 85.",
  },
  {
    id: "act3",
    studentId: "s1",
    type: "login",
    timestamp: "2024-05-20T07:55:00.000Z",
    title: "Login ke Sistem",
    description: "Login dari perangkat seluler.",
  },
]);
dummyActivities.set("s2", [
  {
    id: "act4",
    studentId: "s2",
    type: "assignment_submit",
    timestamp: "2024-05-12T08:00:00.000Z",
    title: "Tugas Kimia Dikumpulkan",
    description: "Menyerahkan tugas tentang Struktur Atom.",
  },
  {
    id: "act5",
    studentId: "s2",
    type: "quiz_complete",
    timestamp: "2024-05-13T09:30:00.000Z",
    title: "Kuis Biologi Selesai",
    description: "Menyelesaikan kuis Sistem Sel dengan skor 92.",
  },
  {
    id: "act6",
    studentId: "s2",
    type: "login",
    timestamp: "2024-05-20T07:58:00.000Z",
    title: "Login ke Sistem",
    description: "Login dari perangkat desktop.",
  },
]);
