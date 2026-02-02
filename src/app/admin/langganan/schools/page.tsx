"use client";
import React, { useState, useEffect } from "react";
import PageHeader from "../../../components/admin/PageHeader";
import Table from "../../../components/admin/Table";
import Modal from "../../../components/admin/Modal";
import { EditButton, DeleteButton } from "../../../components/admin/ActionButton";

// Types
export interface School {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  headmaster: string;
  subscriptionStatus: "active" | "limited" | "expired" | "none";
  registeredDate: string;
  logo: string;
  level: string;
  academicYear: string;
  userCapacity: number;
}

const ManajemenSekolahPage = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/schools');
      if (res.ok) setSchools(await res.json());
    } catch (error) {
      console.error("Failed to fetch schools", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (school: School | null = null) => {
    setCurrentSchool(school);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSchool(null);
  };

  const handleSave = async (schoolData: Omit<School, "id" | "registeredDate">) => {
    try {
      const method = currentSchool ? 'PUT' : 'POST';
      const url = currentSchool ? `/api/admin/schools/${currentSchool.id}` : '/api/admin/schools';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schoolData)
      });

      if (res.ok) {
        fetchData();
        handleCloseModal();
      } else {
        alert('Gagal menyimpan data');
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan');
    }
  };

  const handleDelete = async (schoolId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus sekolah ini?")) {
      try {
        const res = await fetch(`/api/admin/schools/${schoolId}`, { method: 'DELETE' });
        if (res.ok) {
          setSchools(schools.filter((s) => s.id !== schoolId));
        } else {
          alert("Gagal menghapus");
        }
      } catch (e) { console.error(e); }
    }
  };

  const columns = [
    {
      header: "Nama Sekolah",
      accessor: (row: School) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-sm">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{row.name}</p>
            <p className="text-sm text-slate-500">{row.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Provinsi",
      accessor: (row: School) => row.province,
    },
    {
      header: "Status Langganan",
      accessor: (row: School) => (
        <span
          className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize ${row.subscriptionStatus === "active"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : row.subscriptionStatus === "limited"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : row.subscriptionStatus === "expired"
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : "bg-slate-50 text-slate-600 border border-slate-200"
            }`}
        >
          {row.subscriptionStatus}
        </span>
      ),
    },
    {
      header: "Aksi",
      accessor: (row: School) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <EditButton onClick={() => handleOpenModal(row)} />
          <DeleteButton onClick={() => handleDelete(row.id)} />
        </div>
      ),
      headerClassName: "text-right",
      cellClassName: "text-right",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <PageHeader
        title="Manajemen Sekolah"
        subtitle="Tambah, edit, dan kelola data sekolah yang terdaftar."
      />

      <main className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-sky-50">
            <div className="flex justify-end">
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Sekolah
              </button>
            </div>
          </div>
          {loading ? (
            <div className="p-10 text-center">Loading data...</div>
          ) : (
            <Table columns={columns} data={schools} keyExtractor={(s) => s.id} />
          )}
        </div>
        <div className="h-12"></div>
      </main>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={currentSchool ? "Edit Sekolah" : "Tambah Sekolah Baru"}
        >
          <SchoolForm
            school={currentSchool}
            onSave={handleSave}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

// Form component for adding/editing a school
const SchoolForm: React.FC<{
  school: School | null;
  onSave: (data: Omit<School, "id" | "registeredDate">) => void;
  onCancel: () => void;
}> = ({ school, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<School, "id" | "registeredDate">>({
    name: school?.name || "",
    address: school?.address || "",
    city: school?.city || "",
    province: school?.province || "",
    postalCode: school?.postalCode || "",
    phone: school?.phone || "",
    email: school?.email || "",
    headmaster: school?.headmaster || "",
    subscriptionStatus: school?.subscriptionStatus || "none",
    // Default values for missing properties
    level: school?.level || "SMA",
    academicYear: school?.academicYear || "2023/2024",
    userCapacity: school?.userCapacity || 100,
    logo: school?.logo || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Nama Sekolah" className="p-2 border rounded w-full" required />
        <input name="headmaster" value={formData.headmaster} onChange={handleChange} placeholder="Nama Kepala Sekolah" className="p-2 border rounded w-full" required />
      </div>
      <input name="address" value={formData.address} onChange={handleChange} placeholder="Alamat" className="p-2 border rounded w-full" required />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input name="city" value={formData.city} onChange={handleChange} placeholder="Kota" className="p-2 border rounded w-full" required />
        <input name="province" value={formData.province} onChange={handleChange} placeholder="Provinsi" className="p-2 border rounded w-full" required />
        <input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="Kode Pos" className="p-2 border rounded w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Sekolah" className="p-2 border rounded w-full" required />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Telepon" className="p-2 border rounded w-full" />
      </div>
      <div>
        <label htmlFor="subscriptionStatus" className="block text-sm font-medium text-gray-700 mb-1">Status Langganan</label>
        <select name="subscriptionStatus" value={formData.subscriptionStatus} onChange={handleChange} className="p-2 border rounded w-full bg-white">
          <option value="none">None</option>
          <option value="active">Active</option>
          <option value="limited">Limited</option>
          <option value="expired">Expired</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
          Batal
        </button>
        <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
          Simpan
        </button>
      </div>
    </form>
  );
};

export default ManajemenSekolahPage;