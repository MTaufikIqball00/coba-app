"use client";
import React, { useState, useEffect } from "react";
import Table from "../../components/admin/Table";
import Modal from "../../components/admin/Modal";
import PageHeader from "../../components/admin/PageHeader";
import { EditButton, DeleteButton } from "../../components/admin/ActionButton";

interface Headmaster {
  id: string;
  name: string;
  email: string;
  role: "kepala_sekolah";
  status: "active" | "inactive";
  lastLogin?: string;
  schoolId?: string;
}

export default function ManajemenKepalaSekolahPage() {
  const [headmasters, setHeadmasters] = useState<Headmaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHeadmaster, setSelectedHeadmaster] = useState<Headmaster | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [headmasterToDelete, setHeadmasterToDelete] = useState<Headmaster | null>(null);

  useEffect(() => {
    fetchHeadmasters();
  }, []);

  const fetchHeadmasters = async () => {
    try {
      const res = await fetch('/api/school-admin/headmaster');
      if (res.ok) setHeadmasters(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (headmaster: Headmaster | null = null) => {
    setSelectedHeadmaster(headmaster);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedHeadmaster(null);
    setIsModalOpen(false);
  };

  const handleSaveHeadmaster = async (formData: any) => {
    try {
      if (selectedHeadmaster) {
        // Mock update logic or API implementation needed
        console.log("Updating", formData);
      } else {
        // Create
        const res = await fetch('/api/school-admin/headmaster', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) fetchHeadmasters();
      }
    } catch (e) {
      console.error(e);
    }
    handleCloseModal();
  };

  const openDeleteModal = (headmaster: Headmaster) => {
    setHeadmasterToDelete(headmaster);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setHeadmasterToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteHeadmaster = () => {
    if (headmasterToDelete) {
      setHeadmasters(headmasters.filter((u) => u.id !== headmasterToDelete.id)); // Mock delete
      closeDeleteModal();
    }
  };

  const columns = [
    {
      header: "Nama Kepala Sekolah",
      accessor: (row: Headmaster) => (
        <div>
          <div className="font-semibold">{row.name}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: Headmaster) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {row.status === "active" ? "Aktif" : "Tidak Aktif"}
        </span>
      ),
    },
    {
      header: "Terakhir Login",
      accessor: (row: Headmaster) => row.lastLogin ? new Date(row.lastLogin).toLocaleDateString() : '-',
    },
    {
      header: "Aksi",
      accessor: (row: Headmaster) => (
        <div className="flex gap-2">
          <EditButton onClick={() => handleOpenModal(row)} />
          <DeleteButton onClick={() => openDeleteModal(row)} />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Manajemen Kepala Sekolah"
        subtitle="Kelola data kepala sekolah"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Data Kepala Sekolah</h2>
            <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Tambah Kepala Sekolah
            </button>
          </div>
          {loading ? (
            <div className="p-10 text-center">Loading data...</div>
          ) : (
            <Table
              columns={columns}
              data={headmasters}
              keyExtractor={(row) => row.id}
            />
          )}
        </div>
      </div>

      {isModalOpen && (
        <HeadmasterFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveHeadmaster}
          headmaster={selectedHeadmaster}
        />
      )}

      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          title="Konfirmasi Hapus"
        >
          <div>
            <p>
              Apakah Anda yakin ingin menghapus{" "}
              <strong>{headmasterToDelete?.name}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteHeadmaster}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function HeadmasterFormModal({
  isOpen,
  onClose,
  onSave,
  headmaster,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
  headmaster: Headmaster | null;
}) {
  const [formData, setFormData] = useState({
    name: headmaster?.name || "",
    email: headmaster?.email || "",
    status: headmaster?.status || "active",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Nama tidak boleh kosong.";
    if (!formData.email.trim()) {
      newErrors.email = "Email tidak boleh kosong.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid.";
    }
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={headmaster ? "Edit Kepala Sekolah" : "Tambah Kepala Sekolah"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nama Lengkap" required className={`w-full border p-2 rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className={`w-full border p-2 rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>
        <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded-md">
          <option value="active">Aktif</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Simpan</button>
        </div>
      </form>
    </Modal>
  );
}