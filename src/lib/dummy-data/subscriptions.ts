export type Subscription = {
  id: string;
  schoolId: string;
  packageId: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "cancelled";
  autoRenew: boolean;
  paymentId: string;
};

export const subscriptions: Subscription[] = [
  {
    id: "sub-001",
    schoolId: "sch-001",
    packageId: "pkg-premium-12",
    startDate: "2023-08-15",
    endDate: "2024-08-14",
    status: "active",
    autoRenew: true,
    paymentId: "pay-001",
  },
  {
    id: "sub-002",
    schoolId: "sch-002",
    packageId: "pkg-premium-12",
    startDate: "2023-09-01",
    endDate: "2024-08-31",
    status: "active",
    autoRenew: true,
    paymentId: "pay-002",
  },
  {
    id: "sub-003",
    schoolId: "sch-003",
    packageId: "pkg-basic-6",
    startDate: "2024-01-20",
    endDate: "2024-07-19",
    status: "expired", // Matched with school's 'limited' status logic
    autoRenew: false,
    paymentId: "pay-003",
  },
  {
    id: "sub-004",
    schoolId: "sch-004",
    packageId: "pkg-basic-3",
    startDate: "2023-11-10",
    endDate: "2024-02-09",
    status: "expired",
    autoRenew: false,
    paymentId: "pay-004",
  },
  {
    id: "sub-005",
    schoolId: "sch-005",
    packageId: "pkg-premium-6",
    startDate: "2024-03-05",
    endDate: "2024-09-04",
    status: "active",
    autoRenew: false,
    paymentId: "pay-005",
  },
];