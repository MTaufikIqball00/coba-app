"use client";
import React, { useState, useMemo } from "react";
import PageHeader from "../../../components/admin/PageHeader";
import Table from "../../../components/admin/Table";
import Modal from "../../../components/admin/Modal";
import { EditButton } from "../../../components/admin/ActionButton";
import { subscriptions as initialSubscriptions, Subscription } from "../../../../lib/dummy-data/subscriptions";
import { schools } from "../../../../lib/dummy-data/schools";
import { packages } from "../../../../lib/dummy-data/packages";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700",
  expired: "bg-rose-50 text-rose-700",
  cancelled: "bg-slate-50 text-slate-600",
};

const LanggananSekolahPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);

  const dataMap = useMemo(() => {
    const schoolMap = new Map(schools.map(s => [s.id, s.name]));
    const packageMap = new Map(packages.map(p => [p.id, p.name]));
    return { schoolMap, packageMap };
  }, []);

  const handleOpenModal = (subscription: Subscription) => {
    setCurrentSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSubscription(null);
  };

  const handleSave = (subscriptionData: Partial<Subscription>) => {
    if (currentSubscription) {
      setSubscriptions(
        subscriptions.map((sub) =>
          sub.id === currentSubscription.id ? { ...sub, ...subscriptionData } : sub
        )
      );
    }
    handleCloseModal();
  };

  const columns = [
    {
      header: "Nama Sekolah",
      accessor: (row: Subscription) => (
        <div>
          <p className="font-semibold text-slate-900">{dataMap.schoolMap.get(row.schoolId) || "Nama Sekolah Tidak Ditemukan"}</p>
          <p className="text-sm text-slate-500">ID Langganan: {row.id}</p>
        </div>
      ),
    },
    {
      header: "Paket",
      accessor: (row: Subscription) => dataMap.packageMap.get(row.packageId) || "N/A",
    },
    {
      header: "Tanggal Mulai",
      accessor: (row: Subscription) => new Date(row.startDate).toLocaleDateString("id-ID"),
    },
    {
      header: "Tanggal Berakhir",
      accessor: (row: Subscription) => new Date(row.endDate).toLocaleDateString("id-ID"),
    },
    {
      header: "Status",
      accessor: (row: Subscription) => (
        <span
          className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize ${
            statusStyles[row.status] || statusStyles.cancelled
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Aksi",
      accessor: (row: Subscription) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <EditButton onClick={() => handleOpenModal(row)} />
        </div>
      ),
      headerClassName: "text-right",
      cellClassName: "text-right",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <PageHeader
        title="Langganan Sekolah"
        subtitle="Pantau dan perbarui status langganan untuk setiap sekolah."
      />

      <main className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
          <Table columns={columns} data={subscriptions} keyExtractor={(s) => s.id} />
        </div>
        <div className="h-12"></div>
      </main>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`Edit Langganan: ${dataMap.schoolMap.get(currentSubscription?.schoolId || "")}`}
        >
          <SubscriptionForm
            subscription={currentSubscription}
            onSave={handleSave}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

const SubscriptionForm: React.FC<{
  subscription: Subscription | null;
  onSave: (data: Partial<Subscription>) => void;
  onCancel: () => void;
}> = ({ subscription, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    status: subscription?.status || "active",
    endDate: subscription?.endDate || "",
    autoRenew: subscription?.autoRenew || false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status Langganan</label>
        <select name="status" value={formData.status} onChange={handleChange} className="p-2 border rounded w-full bg-white">
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berakhir</label>
        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="p-2 border rounded w-full" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="autoRenew" name="autoRenew" checked={formData.autoRenew} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
        <label htmlFor="autoRenew" className="text-sm text-gray-700">Perpanjang Otomatis</label>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
          Batal
        </button>
        <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
          Simpan Perubahan
        </button>
      </div>
    </form>
  );
};

export default LanggananSekolahPage;