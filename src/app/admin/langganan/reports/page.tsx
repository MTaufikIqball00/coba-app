"use client";
import React, { useMemo } from "react";
import PageHeader from "../../../components/admin/PageHeader";
import { reports, MonthlyReport, ProvinceReport } from "../../../../lib/dummy-data/reports";
import { packages } from "../../../../lib/dummy-data/packages";

const LaporanLanggananPage = () => {
  const packageMap = useMemo(() => new Map(packages.map(p => [p.id, p.name])), []);

  const overallStats = useMemo(() => {
    return {
      totalRevenue: reports.monthly.reduce((acc, r) => acc + r.totalRevenue, 0),
      totalActiveSubscriptions: reports.monthly[reports.monthly.length - 1]?.totalActiveSubscriptions || 0,
      totalSchools: reports.byProvince.reduce((acc, p) => acc + p.totalSchools, 0),
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <PageHeader
        title="Laporan Langganan"
        subtitle="Analisis tren langganan, pendapatan, dan demografi sekolah."
      />

      <main className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
            <p className="text-sm font-medium text-slate-600 mb-1">Total Pendapatan</p>
            <p className="text-3xl font-bold text-sky-600">Rp{overallStats.totalRevenue.toLocaleString("id-ID")}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6">
            <p className="text-sm font-medium text-slate-600 mb-1">Total Langganan Aktif</p>
            <p className="text-3xl font-bold text-emerald-600">{overallStats.totalActiveSubscriptions}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
            <p className="text-sm font-medium text-slate-600 mb-1">Total Sekolah Terdaftar</p>
            <p className="text-3xl font-bold text-purple-600">{overallStats.totalSchools}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-slate-800 p-6 border-b">Laporan Bulanan</h3>
            <div className="p-6 space-y-4">
              {reports.monthly.map((report) => (
                <div key={report.month}>
                  <p className="font-semibold">{new Date(report.month + "-02").toLocaleString("id-ID", { month: "long", year: "numeric" })}</p>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-slate-600">Pendapatan: <span className="font-bold">Rp{report.totalRevenue.toLocaleString("id-ID")}</span></p>
                    <p className="text-sm text-slate-600">Langganan Baru: <span className="font-bold text-green-600">+{report.newSubscriptions}</span></p>
                    <p className="text-sm text-slate-600">Paket Teratas: <span className="font-bold">{packageMap.get(report.topPackageId) || "N/A"}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Province Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-slate-800 p-6 border-b">Sebaran Sekolah per Provinsi</h3>
            <div className="p-6 space-y-4">
              {reports.byProvince.map((report) => (
                <div key={report.province}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-slate-700">{report.province}</p>
                    <p className="text-sm text-slate-500">{report.activeSchools} / {report.totalSchools} Aktif</p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                      className="bg-sky-500 h-2.5 rounded-full"
                      style={{ width: `${(report.activeSchools / report.totalSchools) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-12"></div>
      </main>
    </div>
  );
};

export default LaporanLanggananPage;