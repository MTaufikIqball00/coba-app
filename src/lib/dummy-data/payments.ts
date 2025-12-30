export type Payment = {
  id: string;
  subscriptionId: string;
  schoolId: string;
  amount: number;
  paymentDate: string;
  method: "bank_transfer" | "credit_card" | "virtual_account";
  status: "completed" | "pending" | "failed";
  invoiceNumber: string;
};

export const payments: Payment[] = [
  {
    id: "pay-001",
    subscriptionId: "sub-001",
    schoolId: "sch-001",
    amount: 9500000,
    paymentDate: "2023-08-14",
    method: "bank_transfer",
    status: "completed",
    invoiceNumber: "INV-2023-08-001",
  },
  {
    id: "pay-002",
    subscriptionId: "sub-002",
    schoolId: "sch-002",
    amount: 9500000,
    paymentDate: "2023-08-31",
    method: "virtual_account",
    status: "completed",
    invoiceNumber: "INV-2023-08-002",
  },
  {
    id: "pay-003",
    subscriptionId: "sub-003",
    schoolId: "sch-003",
    amount: 2800000,
    paymentDate: "2024-01-19",
    method: "credit_card",
    status: "completed",
    invoiceNumber: "INV-2024-01-003",
  },
  {
    id: "pay-004",
    subscriptionId: "sub-004",
    schoolId: "sch-004",
    amount: 1500000,
    paymentDate: "2023-11-09",
    method: "bank_transfer",
    status: "completed",
    invoiceNumber: "INV-2023-11-004",
  },
  {
    id: "pay-005",
    subscriptionId: "sub-005",
    schoolId: "sch-005",
    amount: 5000000,
    paymentDate: "2024-03-04",
    method: "virtual_account",
    status: "completed",
    invoiceNumber: "INV-2024-03-005",
  },
  {
    id: "pay-006",
    subscriptionId: "sub-new-006", // hypothetical new subscription
    schoolId: "sch-006",
    amount: 9500000,
    paymentDate: "2024-07-28",
    method: "bank_transfer",
    status: "pending",
    invoiceNumber: "INV-2024-07-006",
  },
];