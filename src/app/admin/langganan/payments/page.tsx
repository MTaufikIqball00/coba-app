"use client";
import React, { useState, useMemo } from "react";
import PageHeader from "../../../components/admin/PageHeader";
import Table from "../../../components/admin/Table";
import Modal from "../../../components/admin/Modal";
import { EditButton } from "../../../components/admin/ActionButton";
import { payments as initialPayments, Payment } from "../../../../lib/dummy-data/payments";
import { schools } from "../../../../lib/dummy-data/schools";

const statusStyles = {
  completed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-rose-50 text-rose-700",
};

const methodDisplayNames = {
  bank_transfer: "Bank Transfer",
  credit_card: "Credit Card",
  virtual_account: "Virtual Account",
};

const PembayaranPage = () => {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);

  const schoolMap = useMemo(() => new Map(schools.map(s => [s.id, s.name])), []);

  const handleOpenModal = (payment: Payment) => {
    setCurrentPayment(payment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPayment(null);
  };

  const handleSave = (paymentData: Partial<Payment>) => {
    if (currentPayment) {
      setPayments(
        payments.map((p) =>
          p.id === currentPayment.id ? { ...p, ...paymentData } : p
        )
      );
    }
    handleCloseModal();
  };

  const columns = [
    {
      header: "Invoice",
      accessor: (row: Payment) => (
        <div>
          <p className="font-semibold text-slate-900">{row.invoiceNumber}</p>
          <p className="text-sm text-slate-500">ID: {row.id}</p>
        </div>
      ),
    },
    {
      header: "Nama Sekolah",
      accessor: (row: Payment) => schoolMap.get(row.schoolId) || "N/A",
    },
    {
      header: "Jumlah",
      accessor: (row: Payment) => `Rp${row.amount.toLocaleString("id-ID")}`,
    },
    {
      header: "Metode",
      accessor: (row: Payment) => methodDisplayNames[row.method] || row.method,
    },
    {
      header: "Status",
      accessor: (row: Payment) => (
        <span
          className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize ${
            statusStyles[row.status]
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Aksi",
      accessor: (row: Payment) => (
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
        title="Pembayaran"
        subtitle="Lihat riwayat pembayaran dan perbarui status transaksi."
      />

      <main className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
          <Table columns={columns} data={payments} keyExtractor={(p) => p.id} />
        </div>
        <div className="h-12"></div>
      </main>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`Edit Pembayaran: ${currentPayment?.invoiceNumber}`}
        >
          <PaymentForm
            payment={currentPayment}
            onSave={handleSave}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

const PaymentForm: React.FC<{
  payment: Payment | null;
  onSave: (data: Partial<Payment>) => void;
  onCancel: () => void;
}> = ({ payment, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    status: payment?.status || "pending",
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status Pembayaran</label>
        <select name="status" value={formData.status} onChange={handleChange} className="p-2 border rounded w-full bg-white">
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
          Batal
        </button>
        <button type="submit" className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
          Simpan Status
        </button>
      </div>
    </form>
  );
};

export default PembayaranPage;