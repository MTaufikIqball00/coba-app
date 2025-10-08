"use client";
import React from "react";
import { dummyTeachers } from "../../../lib/dummy-data/teachers";
import { dummyStudents } from "../../../lib/dummy-data/students";
import { schools } from "../../../lib/dummy-data/schools";

export default function AdminSekolahDashboardPage() {
  const school = schools[0]; // Assuming a single school context for the admin
  const totalTeachers = dummyTeachers.length;
  const totalStudents = dummyStudents.length;

  const stats = [
    {
      label: "Total Guru",
      value: totalTeachers,
      icon: (
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      color: "blue",
    },
    {
      label: "Total Murid",
      value: totalStudents,
      icon: (
        <svg
          className="w-8 h-8 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1.781-4.121" />
        </svg>
      ),
      color: "emerald",
    },
    {
      label: "Kepala Sekolah",
      value: school.headmaster,
      icon: (
        <svg
          className="w-8 h-8 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13v-3a1 1 0 011-1h12a1 1 0 011 1v3m-6 6v-6m-3 6v-3a3 3 0 013-3h3a3 3 0 013 3v3m-2-11V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2"
          />
        </svg>
      ),
      color: "purple",
    },
    {
      label: "Kapasitas Pengguna",
      value: `${totalTeachers + totalStudents} / ${school.userCapacity}`,
      icon: (
        <svg
          className="w-8 h-8 text-rose-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.28-1.25-1-1.65M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.28-1.25 1-1.65M12 4v2m0 4m0 4v2m0-10a2 2 0 110-4 2 2 0 010 4z"
          />
        </svg>
      ),
      color: "rose",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Admin Sekolah
          </h1>
          <p className="mt-1 text-md text-gray-600">
            Kelola semua aspek operasional sekolah Anda
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-white border-l-4 border-${stat.color}-500 rounded-lg shadow-sm overflow-hidden`}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">{stat.icon}</div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.label}
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900 truncate">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Akses Cepat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin-sekolah/teachers"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
            >
              <p className="text-lg font-medium text-gray-700">
                Manajemen Guru
              </p>
            </a>
            <a
              href="/admin-sekolah/students"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
            >
              <p className="text-lg font-medium text-gray-700">
                Manajemen Murid
              </p>
            </a>
            <a
              href="/admin-sekolah/headmaster"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
            >
              <p className="text-lg font-medium text-gray-700">
                Manajemen Kepala Sekolah
              </p>
            </a>
            <a
              href="/admin-sekolah/settings"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center"
            >
              <p className="text-lg font-medium text-gray-700">
                Pengaturan Sekolah
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}