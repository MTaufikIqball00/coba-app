import type { ScheduleItem, Course } from "../types/dashboard";
export const SCHEDULE_DAYS: ScheduleItem[] = [
  { day: "Senin", time: "06.45" },
  { day: "Selasa", time: "07.00" },
  { day: "Rabu", time: "07.15" },
  { day: "Kamis", time: "07.00" },
  { day: "Jumat", time: "07.15" },
];

export const COURSES: Course[] = [
  {
    id: "1",
    title: "Matematika",
    description:
      "Pelajari konsep matematika dari dasar hingga lanjutan dengan metode pembelajaran yang interaktif.",
    image: "/assets/mtk.jpg",
    slug: "matematika",
  },
  {
    id: "2",
    title: "Bahasa Inggris",
    description:
      "Tingkatkan kemampuan bahasa Inggris Anda dengan materi yang komprehensif dan praktis.",
    image: "/assets/inggris.jpg",
    slug: "bahasa-inggris",
  },
  {
    id: "3",
    title: "Kimia",
    description:
      "Eksplorasi dunia kimia dengan eksperimen virtual dan penjelasan yang mudah dipahami.",
    image: "/assets/kimia.jpg",
    slug: "kimia",
  },
  {
    id: "4",
    title: "Fisika",
    description:
      "Pahami hukum-hukum fisika melalui simulasi dan contoh aplikasi dalam kehidupan sehari-hari.",
    image: "/assets/fisika.jpg",
    slug: "fisika",
  },
];
