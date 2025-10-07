"use client";
import React from "react";

export default function AdminSekolahDashboardPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin Sekolah</h1>
      <p className="text-gray-700">
        Ini adalah halaman dashboard untuk Admin Sekolah.
      </p>

      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">Manajemen Guru</div>
        <div className="p-4 bg-white rounded shadow">
          Manajemen Kepala Sekolah
        </div>
        <div className="p-4 bg-white rounded shadow">Manajemen Murid</div>
      </section>
    </>
  );
}
