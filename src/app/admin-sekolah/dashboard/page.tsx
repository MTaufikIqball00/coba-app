"use client";
import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiClock,
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiUserCheck,
  FiUserX
} from "react-icons/fi";

// Types
interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendanceRate: number;
  recentActivities: any[];
  schoolName?: string;
}

export default function AdminSekolahDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/school-admin/dashboard');
        if (res.ok) setStats(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;
  if (!stats) return <div className="p-10 text-center">Dashboard unavailable</div>;

  // Mock secondary data for display if API doesn't return detailed attendance (simple version)
  const todayAttendance = {
    students: { present: Math.floor(stats.totalStudents * 0.95), absent: Math.floor(stats.totalStudents * 0.05), late: 0, total: stats.totalStudents },
    teachers: { present: Math.floor(stats.totalTeachers * 0.98), absent: Math.floor(stats.totalTeachers * 0.02), late: 0, total: stats.totalTeachers },
  };

  return (
    <div className="min-h-screen bg-slate-50/50">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Dashboard Operasional
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                + Buat Pengumuman
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top Row: Daily Attendance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Student Attendance */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Kehadiran Siswa</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {stats.totalStudents > 0 ? ((todayAttendance.students.present / stats.totalStudents) * 100).toFixed(1) : 0}%
                </h3>
                <p className="text-sm text-emerald-600 font-medium mt-1">Hadir Hari Ini</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                <FiUsers className="w-6 h-6" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 relative z-10">
              <div className="bg-slate-50 p-2 rounded-lg text-center">
                <p className="text-xs text-slate-500">Sakit/Izin</p>
                <p className="font-bold text-slate-800">{todayAttendance.students.absent}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg text-center">
                <p className="text-xs text-slate-500">Terlambat</p>
                <p className="font-bold text-amber-600">{todayAttendance.students.late}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg text-center">
                <p className="text-xs text-slate-500">Total</p>
                <p className="font-bold text-slate-800">{stats.totalStudents}</p>
              </div>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
          </div>

          {/* Teacher Attendance */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Kehadiran Guru</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {todayAttendance.teachers.present} <span className="text-lg text-slate-400 font-normal">/ {stats.totalTeachers}</span>
                </h3>
                <p className="text-sm text-emerald-600 font-medium mt-1">Guru di Sekolah</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                <FiUserCheck className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 relative z-10">
              {todayAttendance.teachers.absent > 0 ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-700 text-sm font-medium rounded-full border border-rose-100">
                  <FiUserX className="w-4 h-4" /> {todayAttendance.teachers.absent} Guru Absen
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-100">
                  <FiCheckCircle className="w-4 h-4" /> Semua Hadir
                </div>
              )}
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-50 rounded-full opacity-50"></div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4">Aktivitas Terkini</h3>
              {stats.recentActivities && stats.recentActivities.length > 0 ? (
                <ul className="space-y-3">
                  {stats.recentActivities.map((act, idx) => (
                    <li key={idx} className="flex justify-between text-sm border-b pb-2 last:border-0 hover:bg-slate-50 p-2 rounded">
                      <span>{act.action}</span>
                      <span className="text-slate-500">{act.time}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-slate-500">Tidak ada aktivitas baru.</p>}
            </div>
          </div>

          {/* Sidebar: Quick Actions */}
          <div className="space-y-6">

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4">Akses Cepat</h3>
              <div className="grid grid-cols-1 gap-3">
                <a href="/admin-sekolah/teachers" className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <FiUsers className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-slate-700">Manajemen Guru</span>
                </a>
                <a href="/admin-sekolah/students" className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <FiUsers className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-slate-700">Manajemen Murid</span>
                </a>
                <a href="/admin-sekolah/schedules" className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-violet-200 hover:bg-violet-50 transition-all group">
                  <div className="p-2 bg-violet-100 text-violet-600 rounded-lg group-hover:bg-violet-200 transition-colors">
                    <FiCalendar className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-slate-700">Atur Jadwal</span>
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Laporan Mingguan</h3>
                <p className="text-indigo-100 text-sm mb-4">Rekap kehadiran dan akademik minggu ini sudah siap.</p>
                <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold shadow hover:bg-indigo-50 transition-colors">
                  Unduh Laporan
                </button>
              </div>
              <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-10 -translate-y-10"></div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
