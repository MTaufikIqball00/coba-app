"use client";
import React, { useState } from "react";
import { dummyUsers } from "../../../lib/dummy-data";

type School = {
  name: string;
  province: string;
  subscriptionStatus: string;
};

function getSchools(): School[] {
  const schoolsMap = new Map<string, School>();

  dummyUsers.forEach((user) => {
    if (user.school && !schoolsMap.has(user.school.name)) {
      schoolsMap.set(user.school.name, {
        name: user.school.name,
        province: user.school.province,
        subscriptionStatus:
          (user.school as any).subscriptionStatus || "unknown",
      });
    }
  });

  return Array.from(schoolsMap.values());
}

const statusStyles: { [key: string]: string } = {
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  limited: "bg-amber-50 text-amber-700 border border-amber-200",
  expired: "bg-rose-50 text-rose-700 border border-rose-200",
  unknown: "bg-slate-50 text-slate-600 border border-slate-200",
};

export default function AdminLanggananPage() {
  const schools = getSchools();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter schools based on search
  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: schools.length,
    active: schools.filter((s) => s.subscriptionStatus === "active").length,
    limited: schools.filter((s) => s.subscriptionStatus === "limited").length,
    expired: schools.filter((s) => s.subscriptionStatus === "expired").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard Langganan</h1>
              <p className="text-sky-100 text-lg">
                Kelola dan pantau status langganan sekolah
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
                <p className="text-sm text-sky-100">Total Sekolah</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Total Sekolah
                </p>
                <p className="text-3xl font-bold text-sky-600">{stats.total}</p>
              </div>
              <div className="bg-sky-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Aktif</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {stats.active}
                </p>
              </div>
              <div className="bg-emerald-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Terbatas
                </p>
                <p className="text-3xl font-bold text-amber-600">
                  {stats.limited}
                </p>
              </div>
              <div className="bg-amber-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">
                  Kedaluwarsa
                </p>
                <p className="text-3xl font-bold text-rose-600">
                  {stats.expired}
                </p>
              </div>
              <div className="bg-rose-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-rose-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
          {/* Search and Actions */}
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-sky-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Cari sekolah atau provinsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Tambah Sekolah
                </button>
                <button className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-medium transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-sky-50 to-blue-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Nama Sekolah
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Provinsi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSchools.length > 0 ? (
                  filteredSchools.map((school, index) => (
                    <tr
                      key={school.name}
                      className="hover:bg-sky-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-sm">
                            {school.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {school.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              ID: SCH-{String(index + 1).padStart(3, "0")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="text-slate-700">
                            {school.province}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1.5 inline-flex items-center gap-1.5 text-xs font-semibold rounded-full ${
                            statusStyles[school.subscriptionStatus] ||
                            "bg-slate-50 text-slate-600 border border-slate-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              school.subscriptionStatus === "active"
                                ? "bg-emerald-500"
                                : school.subscriptionStatus === "limited"
                                ? "bg-amber-500"
                                : school.subscriptionStatus === "expired"
                                ? "bg-rose-500"
                                : "bg-slate-400"
                            }`}
                          ></span>
                          {school.subscriptionStatus === "active"
                            ? "Aktif"
                            : school.subscriptionStatus === "limited"
                            ? "Terbatas"
                            : school.subscriptionStatus === "expired"
                            ? "Kedaluwarsa"
                            : "Tidak Diketahui"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Kelola Langganan"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </button>
                          <button
                            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                            title="Detail"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-12 h-12 text-slate-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-slate-500 font-medium">
                          Tidak ada data sekolah ditemukan
                        </p>
                        <p className="text-sm text-slate-400">
                          Coba ubah kata kunci pencarian
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer/Pagination */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Menampilkan{" "}
                <span className="font-semibold text-slate-900">
                  {filteredSchools.length}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-slate-900">
                  {schools.length}
                </span>{" "}
                sekolah
              </p>
              <div className="flex gap-1">
                <button
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  Sebelumnya
                </button>
                <button className="px-3 py-1.5 text-sm bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                  1
                </button>
                <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-white transition-colors">
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing at bottom */}
      <div className="h-12"></div>
    </div>
  );
}
