"use client";
import React, { useState, useEffect } from "react";
import PageHeader from "../../../components/admin/PageHeader";
import Table from "../../../components/admin/Table";
import Modal from "../../../components/admin/Modal";
import { EditButton } from "../../../components/admin/ActionButton";

// Types
export interface Payment {
  id: string;
  invoiceNumber: string; // Add if API has it (current API might not, let's map id to invoice for now)
  schoolId: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  method: "bank_transfer" | "credit_card" | "virtual_account";
  proofOfPayment?: string;
  schoolName?: string; // Enhanced from API
}

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-rose-50 text-rose-700",
};

const methodDisplayNames: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  credit_card: "Credit Card",
  virtual_account: "Virtual Account",
};

const PembayaranPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/payments');
      if (res.ok) {
        const data = await res.json();
        // Normalize data if needed (e.g. invoiceNumber mapping)
        const mappedData = data.map((d: any) => ({
          ...d,
          invoiceNumber: d.id // Mock
        }));
        setPayments(mappedData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
      accessor: (row: Payment) => row.schoolName || "N/A",
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
          className={`px-3 py-1.5 text-xs font-semibold rounded-full capitalize ${statusStyles[row.status] || ''
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
          {loading ? (
            <div className="p-10 text-center">Loading data...</div>
          ) : (
            <Table columns={columns} data={payments} keyExtractor={(p) => p.id} />
          )}
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
    setFormData(prev => ({ ...prev, [name]: value as any }));
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