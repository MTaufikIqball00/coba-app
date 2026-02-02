"use client";
import React, { useMemo, useState, useEffect } from "react";
import PageHeader from "../../../components/admin/PageHeader";
import Table from "../../../components/admin/Table";

// API Response type
interface ActivityLog {
  id: string;
  user: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
  status: string;
  ipAddress?: string; // API might not return this yet
}

const LogAktivitasPage = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/activity-logs');
      if (res.ok) setLogs(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Timestamp",
      accessor: (row: ActivityLog) => new Date(row.timestamp).toLocaleString("id-ID"),
    },
    {
      header: "Pengguna",
      accessor: (row: ActivityLog) => (
        <div>
          <p className="font-semibold text-slate-900">{row.user}</p>
          <p className="text-sm text-slate-500">{row.role}</p>
        </div>
      ),
    },
    {
      header: "Aksi",
      accessor: (row: ActivityLog) => (
        <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded">
          {row.action}
        </span>
      ),
    },
    {
      header: "Detail",
      accessor: (row: ActivityLog) => row.details,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <PageHeader
        title="Log Aktivitas"
        subtitle="Lacak semua aktivitas penting yang terjadi di dalam sistem."
      />

      <main className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center">Loading data...</div>
          ) : (
            <Table columns={columns} data={logs} keyExtractor={(log) => log.id} />
          )}
        </div>
        <div className="h-12"></div>
      </main>
    </div>
  );
};

export default LogAktivitasPage;