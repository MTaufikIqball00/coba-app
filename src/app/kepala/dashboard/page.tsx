"use client";
import React from "react";

export default function KepalaDashboardPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Dashboard Kepala Sekolah</h1>
      <p className="text-gray-700">
        Ini adalah halaman dashboard untuk Kepala Sekolah.
      </p>

      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">Manajemen Guru</div>
        <div className="p-4 bg-white rounded shadow">Manajemen Murid</div>
        <div className="p-4 bg-white rounded shadow">Leaderboard Akademik</div>
      </section>
    </>
  );
}
