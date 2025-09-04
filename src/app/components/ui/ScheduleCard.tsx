import Link from "next/link";
import { ScheduleItem } from "../../types/dashboard";

interface ScheduleCardProps {
  schedules: ScheduleItem[];
}

export default function ScheduleCard({ schedules }: ScheduleCardProps) {
  return (
    <section className="w-full lg:w-1/3 bg-white shadow-md rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-black text-lg">Jadwal Masuk</h2>
        <Link 
          href="/schedule"
          className="border border-blue-700 text-blue-700 rounded-xl px-4 py-1 text-sm hover:bg-blue-50 transition-colors duration-200"
        >
          Lihat Semua
        </Link>
      </div>
      
      <ul className="space-y-2" role="list">
        {schedules.map((item) => (
          <li key={item.day} className="flex justify-between text-black py-1">
            <span>{item.day}</span>
            <time className="text-black font-medium">{item.time}</time>
          </li>
        ))}
      </ul>
    </section>
  );
}