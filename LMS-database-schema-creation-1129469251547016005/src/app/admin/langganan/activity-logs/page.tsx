"use client";
import React, { useMemo } from "react";
import PageHeader from "../../../components/admin/PageHeader";
import Table from "../../../components/admin/Table";
import { activityLogs, ActivityLog } from "../../../../lib/dummy-data/activity-logs";
import { users } from "../../../../lib/dummy-data/users";

const LogAktivitasPage = () => {
  const userMap = useMemo(() => new Map(users.map(u => [u.id, u])), []);

  const columns = [
    {
      header: "Timestamp",
      accessor: (row: ActivityLog) => new Date(row.timestamp).toLocaleString("id-ID"),
    },
    {
      header: "Pengguna",
      accessor: (row: ActivityLog) => {
        const user = userMap.get(row.userId);
        return user ? (
          <div>
            <p className="font-semibold text-slate-900">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        ) : (
          "Pengguna Tidak Dikenal"
        );
      },
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
    {
      header: "Alamat IP",
      accessor: (row: ActivityLog) => row.ipAddress,
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
          <Table columns={columns} data={activityLogs} keyExtractor={(log) => log.id} />
        </div>
        <div className="h-12"></div>
      </main>
    </div>
  );
};

export default LogAktivitasPage;