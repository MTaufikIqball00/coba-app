export type MonthlyReport = {
  month: string; // e.g., "2024-07"
  newSubscriptions: number;
  expiredSubscriptions: number;
  totalActiveSubscriptions: number;
  totalRevenue: number;
  topPackageId: string;
};

export type ProvinceReport = {
  province: string;
  activeSchools: number;
  totalSchools: number;
};

export type SubscriptionReportData = {
  monthly: MonthlyReport[];
  byProvince: ProvinceReport[];
};

export const reports: SubscriptionReportData = {
  monthly: [
    {
      month: "2024-05",
      newSubscriptions: 5,
      expiredSubscriptions: 2,
      totalActiveSubscriptions: 150,
      totalRevenue: 45000000,
      topPackageId: "pkg-premium-12",
    },
    {
      month: "2024-06",
      newSubscriptions: 8,
      expiredSubscriptions: 3,
      totalActiveSubscriptions: 155,
      totalRevenue: 72000000,
      topPackageId: "pkg-premium-12",
    },
    {
      month: "2024-07",
      newSubscriptions: 12,
      expiredSubscriptions: 1,
      totalActiveSubscriptions: 166,
      totalRevenue: 110000000,
      topPackageId: "pkg-premium-6",
    },
  ],
  byProvince: [
    { province: "Jawa Barat", activeSchools: 45, totalSchools: 60 },
    { province: "DKI Jakarta", activeSchools: 30, totalSchools: 35 },
    { province: "Jawa Timur", activeSchools: 25, totalSchools: 30 },
    { province: "DI Yogyakarta", activeSchools: 15, totalSchools: 20 },
    { province: "Bali", activeSchools: 10, totalSchools: 12 },
    { province: "Lainnya", activeSchools: 41, totalSchools: 55 },
  ],
};