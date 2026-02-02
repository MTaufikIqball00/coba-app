"use client";
import React, { useMemo, useState, useEffect } from "react";
import PageHeader from "../../../components/admin/PageHeader";

// Wrappers for types based on API response
// API: { monthlyRevenue: [], provinceDistribution: [] }
interface MonthlyRevenue {
  month: string;
  revenue: number;
  growth: number;
}
interface ProvinceDist {
  province: string;
  schoolCount: number;
  totalUsers: number;
  activePercentage: number;
}

const LaporanLanggananPage = () => {
  const [monthly, setMonthly] = useState<MonthlyRevenue[]>([]);
  const [provinceData, setProvinceData] = useState<ProvinceDist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/reports');
      if (res.ok) {
        const data = await res.json();
        setMonthly(data.monthlyRevenue);
        setProvinceData(data.provinceDistribution);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const overallStats = useMemo(() => {
    return {
      totalRevenue: monthly.reduce((acc, r) => acc + r.revenue, 0),
      totalActiveSubscriptions: 0, // Need to fetch from subscriptions count or add to reports API
      totalSchools: provinceData.reduce((acc, p) => acc + p.schoolCount, 0),
    };
  }, [monthly, provinceData]);

  if (loading) return <div className="p-10 text-center">Loading Report Data...</div>;

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
            <p className="text-sm font-medium text-slate-600 mb-1">Total Sekolah Terdaftar</p>
            <p className="text-3xl font-bold text-purple-600">{overallStats.totalSchools}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-slate-800 p-6 border-b">Laporan Pendapatan Bulanan</h3>
            <div className="p-6 space-y-4">
              {monthly.length === 0 ? <p className="text-gray-500">Belum ada data pendapatan.</p> : monthly.map((report) => (
                <div key={report.month}>
                  <p className="font-semibold">{report.month}</p>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-slate-600">Pendapatan: <span className="font-bold">Rp{report.revenue.toLocaleString("id-ID")}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Province Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-slate-800 p-6 border-b">Sebaran Sekolah per Provinsi</h3>
            <div className="p-6 space-y-4">
              {provinceData.length === 0 ? <p className="text-gray-500">Belum ada data sekolah.</p> : provinceData.map((report) => (
                <div key={report.province}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-slate-700">{report.province}</p>
                    <p className="text-sm text-slate-500">{report.schoolCount} Sekolah</p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                      className="bg-sky-500 h-2.5 rounded-full"
                      style={{ width: `100%` }}
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