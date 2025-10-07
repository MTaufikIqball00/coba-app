"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiUsers,
  FiFileText,
  FiClipboard,
  FiCheckSquare,
  FiBookOpen,
  FiEdit3,
  FiUserCheck,
  FiAward,
  FiActivity,
  FiTrendingUp,
  FiCalendar,
  FiClock,
  FiTarget,
} from "react-icons/fi";

// ✅ Enhanced Dashboard Card with proper TypeScript types
interface DashboardCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
  stats?: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
  }>;
  prefetch?: boolean; // ✅ Control prefetch behavior
}

const DashboardCard = ({
  href,
  icon,
  title,
  description,
  gradient,
  iconBg,
  stats,
  prefetch = true, // ✅ Default prefetch enabled
}: DashboardCardProps) => (
  <Link
    href={href}
    prefetch={prefetch} // ✅ Optimize prefetch
    className="group relative backdrop-blur-xl bg-white/50 hover:bg-white/80 border border-white/30 rounded-3xl overflow-hidden transition-all duration-700 hover:scale-[1.05] hover:-translate-y-4 shadow-xl hover:shadow-2xl cursor-pointer block"
    // ✅ Add accessibility
    aria-label={`Navigate to ${title} - ${description}`}
  >
    {/* Card Content */}
    <div className="p-8">
      {/* Icon and Title */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`p-4 ${iconBg} rounded-2xl shadow-lg transform group-hover:rotate-12 transition-transform duration-500`}
        >
          <div className="text-white text-2xl">{icon}</div>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-800 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-slate-600 mt-1">Dashboard</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-600 leading-relaxed mb-6 group-hover:text-slate-700 transition-colors duration-300">
        {description}
      </p>

      {/* Stats if provided */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-3 bg-gradient-to-r from-slate-50/80 to-white/80 rounded-xl border border-white/40"
            >
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-slate-600" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Button */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-700 transition-colors duration-300">
          Klik untuk masuk →
        </span>
        <div className="w-12 h-12 bg-gradient-to-r from-slate-100/50 to-white/50 group-hover:from-blue-100/80 group-hover:to-cyan-100/80 rounded-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110">
          <FiActivity className="h-5 w-5 text-slate-500 group-hover:text-blue-600" />
        </div>
      </div>
    </div>

    {/* Gradient overlay */}
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl`}
    />

    {/* Glassmorphism overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />
  </Link>
);

// ✅ Enhanced Quick Action Button Component
interface QuickActionButtonProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  colorScheme: string;
  onClick?: () => void; // ✅ Optional custom handler
}

const QuickActionButton = ({
  href,
  icon,
  label,
  colorScheme,
  onClick,
}: QuickActionButtonProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 ${colorScheme} text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg active:scale-95`}
    prefetch={false} // ✅ Quick actions don't need prefetch
  >
    {icon}
    <span>{label}</span>
  </Link>
);

// ✅ Interface for component props
interface TeacherDashboardProps {
  session: {
    name?: string;
    role?: string;
  } | null;
  stats: {
    activeAssignments: number;
    assignmentCompletion: string;
    totalModules: number;
    modulesViewed: number;
    verifiedAttendance: number;
    pendingAttendance: number;
    totalQuizzes: number;
    avgQuizScore: string;
  };
}

export default function TeacherDashboard({ session, stats }: TeacherDashboardProps) {
  // ✅ Optional: Add programmatic navigation
  const router = useRouter();

  const handleQuickNavigation = (path: string) => {
    // ✅ Add loading state or analytics here if needed
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Glassmorphism background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse [animation-delay:500ms]" />
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        {/* Enhanced Header Section */}
        <div className="mb-16">
          <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-3xl p-8 shadow-2xl animate-slide-in-up">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl animate-pulse">
                    {session?.name?.charAt(0).toUpperCase() || "T"}
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                      Selamat Datang, {session?.name || "Teacher"}!
                    </h1>
                    <p className="text-lg text-slate-600 font-medium mt-2">
                      Dashboard Teacher - Kelola pembelajaran dengan mudah
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
                    <FiCalendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-slate-700">
                      {new Date().toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
                    <FiClock className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-slate-700">
                      {new Date().toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
                    <FiActivity className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-semibold text-slate-700">
                      Teacher Portal
                    </span>
                  </div>
                </div>
              </div>

              {/* Welcome Message Card */}
              <div className="lg:max-w-md">
                <div className="p-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-200/50 backdrop-blur-sm">
                  <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <FiTarget className="h-5 w-5" />
                    Akses Cepat
                  </h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    Pilih menu di bawah untuk mulai mengelola pembelajaran,
                    tugas, dan evaluasi siswa dengan sistem yang terintegrasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
          <DashboardCard
            href="/teacher/assignment"
            icon={<FiFileText />}
            title="Manajemen Tugas"
            description="Buat, edit, dan kelola tugas untuk siswa. Monitor progress pengerjaan dan berikan feedback yang konstruktif."
            gradient="from-orange-500/20 via-red-500/10 to-pink-500/20"
            iconBg="bg-gradient-to-r from-orange-500 to-red-500"
            stats={[
              { icon: FiFileText, label: "Tugas Aktif", value: stats.activeAssignments.toString() },
              { icon: FiTrendingUp, label: "Completion", value: stats.assignmentCompletion },
            ]}
          />

          <DashboardCard
            href="/teacher/modules"
            icon={<FiBookOpen />}
            title="Manajemen Modul"
            description="Unggah dan atur Modul pembelajaran. Organisir konten video, dokumen, dan resource pembelajaran lainnya."
            gradient="from-blue-500/20 via-indigo-500/10 to-purple-500/20"
            iconBg="bg-gradient-to-r from-blue-500 to-indigo-500"
            stats={[
              { icon: FiClipboard, label: "Total Modul", value: stats.totalModules.toString() },
              { icon: FiActivity, label: "Viewed", value: stats.modulesViewed.toString() },
            ]}
          />

          <DashboardCard
            href="/teacher/attendance"
            icon={<FiUserCheck />}
            title="Verifikasi Absensi"
            description="Verifikasi dan kelola data absensi siswa. Monitor kehadiran dan generate laporan attendance yang akurat."
            gradient="from-green-500/20 via-emerald-500/10 to-teal-500/20"
            iconBg="bg-gradient-to-r from-green-500 to-emerald-500"
            stats={[
              { icon: FiCheckSquare, label: "Terverifikasi", value: stats.verifiedAttendance.toString() },
              { icon: FiClock, label: "Menunggu", value: stats.pendingAttendance.toString() },
            ]}
          />

          <DashboardCard
            href="/teacher/quizzes"
            icon={<FiAward />}
            title="Manajemen Kuis"
            description="Buat dan kelola kuis untuk evaluasi siswa. Design assessment yang komprehensif dengan berbagai tipe soal."
            gradient="from-purple-500/20 via-pink-500/10 to-rose-500/20"
            iconBg="bg-gradient-to-r from-purple-500 to-pink-500"
            stats={[
              { icon: FiUsers, label: "Total Kuis", value: stats.totalQuizzes.toString() },
              { icon: FiTrendingUp, label: "Avg Score", value: stats.avgQuizScore },
            ]}
          />
        </div>

        {/* Additional Features */}
        <div className="mt-12">
          <div className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent mb-6 flex items-center gap-3">
              <FiActivity className="h-7 w-7 text-blue-600" />
              Fitur Tambahan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group p-6 bg-gradient-to-r from-white/60 to-blue-50/60 rounded-2xl border border-white/40 hover:shadow-lg transition-all duration-300">
                <FiTrendingUp className="h-8 w-8 text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-slate-800 mb-2">Analytics</h3>
                <p className="text-sm text-slate-600">
                  Monitor performa dan engagement siswa secara real-time
                </p>
              </div>

              <div className="group p-6 bg-gradient-to-r from-white/60 to-emerald-50/60 rounded-2xl border border-white/40 hover:shadow-lg transition-all duration-300">
                <FiUsers className="h-8 w-8 text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-slate-800 mb-2">Collaboration</h3>
                <p className="text-sm text-slate-600">
                  Fitur kolaborasi dan komunikasi dengan siswa
                </p>
              </div>

              <div className="group p-6 bg-gradient-to-r from-white/60 to-purple-50/60 rounded-2xl border border-white/40 hover:shadow-lg transition-all duration-300">
                <FiCalendar className="h-8 w-8 text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-bold text-slate-800 mb-2">Schedule</h3>
                <p className="text-sm text-slate-600">
                  Atur jadwal mengajar dan deadline dengan mudah
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Enhanced Quick Actions Panel */}
        <div className="mt-12">
          <div className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FiTarget className="h-5 w-5 text-blue-600" />
              Aksi Cepat
            </h3>
            <div className="flex flex-wrap gap-4">
              <QuickActionButton
                href="/teacher/modules/new"
                icon={<FiBookOpen className="h-4 w-4" />}
                label="Buat Materi Baru"
                colorScheme="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              />

              <QuickActionButton
                href="/teacher/quizzes/new"
                icon={<FiAward className="h-4 w-4" />}
                label="Buat Kuis Baru"
                colorScheme="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              />

              <QuickActionButton
                href="/teacher/assignment/new"
                icon={<FiFileText className="h-4 w-4" />}
                label="Buat Tugas Baru"
                colorScheme="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Enhanced CSS animations */}
      <style jsx global>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        /* ✅ Enhanced hover effects */
        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }

        .group:active .active\\:scale-95 {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}
