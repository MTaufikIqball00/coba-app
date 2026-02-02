"use client";
import React, { useState, useEffect } from "react";
import PageHeader from "../../components/admin/PageHeader";

// Simplified type based on API response
interface SchoolSettings {
  name: string;
  address: string;
  level: string;
  academicYear: string;
  userCapacity: number;
  logo: string;
}

export default function PengaturanSekolahPage() {
  const [formData, setFormData] = useState<SchoolSettings>({
    name: "", address: "", level: "SMA", academicYear: "", userCapacity: 0, logo: ""
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState<SchoolSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/school-admin/settings');
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
        setOriginalData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/school-admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Pengaturan sekolah berhasil disimpan!");
        setOriginalData(formData);
        setIsEditing(false);
      } else {
        alert("Gagal menyimpan pengaturan.");
      }
    } catch (error) {
      console.error("Error saving settings", error);
    }
  };

  const handleCancel = () => {
    if (originalData) setFormData(originalData);
    setIsEditing(false);
  };

  if (loading) return <div className="p-10 text-center">Loading settings...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Pengaturan Sekolah"
        subtitle="Kelola identitas dan pengaturan operasional sekolah Anda"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSave}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Identitas Sekolah</h2>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Pengaturan
                </button>
              )}
            </div>
            <div className="p-6 space-y-6">
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Sekolah</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className="mt-1 w-full p-2 border rounded-md bg-gray-100 disabled:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Jenjang</label>
                  <select name="level" value={formData.level} onChange={handleChange} disabled={!isEditing} className="mt-1 w-full p-2 border rounded-md bg-gray-100 disabled:bg-white">
                    <option value="SMA">SMA</option>
                    <option value="SMK">SMK</option>
                    <option value="MA">MA</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Alamat</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} className="mt-1 w-full p-2 border rounded-md bg-gray-100 disabled:bg-white" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tahun Ajaran Aktif</label>
                  <input type="text" name="academicYear" value={formData.academicYear} onChange={handleChange} disabled={!isEditing} className="mt-1 w-full p-2 border rounded-md bg-gray-100 disabled:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kapasitas Pengguna</label>
                  <input type="number" name="userCapacity" value={formData.userCapacity} onChange={handleChange} disabled={!isEditing} className="mt-1 w-full p-2 border rounded-md bg-gray-100 disabled:bg-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Logo Sekolah (URL)</label>
                <input type="text" name="logo" value={formData.logo} onChange={handleChange} disabled={!isEditing} className="mt-1 w-full p-2 border rounded-md bg-gray-100 disabled:bg-white" />
              </div>
            </div>

            {isEditing && (
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Simpan Perubahan
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}