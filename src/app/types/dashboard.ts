// types/dashboard.ts
export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
}

export interface ScheduleItem {
  day: string;
  time: string;
}
