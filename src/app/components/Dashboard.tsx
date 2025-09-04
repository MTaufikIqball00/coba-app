import Image from "next/image";
import Link from "next/link";
import { SCHEDULE_DAYS, COURSES } from "../constants/dashboard";
import ScheduleCard from "./ui/ScheduleCard";
import CourseCard from "./ui/CourseCard";

export default function Dashboard() {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <ScheduleCard schedules={SCHEDULE_DAYS} />

        {/* Dashboard Info & Help Cards */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Main Dashboard Card */}
          <section className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center">
            <div className="flex-1">
              <h1 className="font-bold text-black text-xl mb-2">
                Dashboard LMS Disdik Jabar
              </h1>
              <p className="text-gray-600 text-sm max-w-md mb-3">
                Platform pembelajaran digital yang menyediakan berbagai materi 
                dan alat pembelajaran interaktif untuk mendukung pendidikan berkualitas.
              </p>
              <Link 
                href="/about" 
                className="text-blue-600 text-sm hover:text-blue-700 hover:underline transition-colors duration-200"
              >
                Pelajari lebih lanjut →
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="w-32 h-24 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center rounded-lg shadow-sm">
                <Image
                  src="/assets/logo.png"
                  alt="Logo Dinas Pendidikan Jawa Barat"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
          </section>

          {/* Help Card */}
          <section className="bg-blue-50 shadow-md rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0">
                ?
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">Butuh Bantuan?</p>
                <p className="text-gray-600 text-sm mb-2">
                  Tim support siap membantu Anda 24/7
                </p>
                <Link 
                  href="/help" 
                  className="text-blue-600 text-sm hover:text-blue-700 hover:underline transition-colors duration-200"
                >
                  Hubungi Support →
                </Link>
              </div>
            </div>
            
            <Link
              href="/help"
              className="bg-white px-6 py-2 rounded-xl text-blue-600 font-semibold hover:bg-blue-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Bantuan
            </Link>
          </section>
        </div>
      </div>

      {/* Course Overview Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-black text-xl">Mata Pelajaran</h2>
          <Link 
            href="/courses"
            className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Lihat Semua Pelajaran →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COURSES.map((course, index) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              priority={index < 2} // Load first 2 images with priority
            />
          ))}
        </div>
      </section>
    </div>
  );
}
