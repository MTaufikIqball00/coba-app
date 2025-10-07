export type School = {
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
};

export const schools: School[] = [
  {
    id: "sch-001",
    name: "SMA Negeri 1 Bandung",
    address: "Jl. Ir. H. Juanda No.93",
    city: "Bandung",
    province: "Jawa Barat",
    postalCode: "40132",
    phone: "022-2501234",
    email: "info@sman1bandung.sch.id",
    headmaster: "Dr. H. Iwan Setiawan, M.Pd.",
    subscriptionStatus: "active",
    registeredDate: "2022-08-15",
  },
  {
    id: "sch-002",
    name: "SMA Negeri 3 Jakarta",
    address: "Jl. Setiabudi II No.1",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    postalCode: "12910",
    phone: "021-5251234",
    email: "kontak@sman3jakarta.sch.id",
    headmaster: "Dra. Hj. Retno Listyarti, M.Si.",
    subscriptionStatus: "active",
    registeredDate: "2022-09-01",
  },
  {
    id: "sch-003",
    name: "SMA Negeri 5 Surabaya",
    address: "Jl. Kusuma Bangsa No.21",
    city: "Surabaya",
    province: "Jawa Timur",
    postalCode: "60272",
    phone: "031-5341234",
    email: "support@sman5surabaya.sch.id",
    headmaster: "Drs. H. M. Basuki, M.M.",
    subscriptionStatus: "limited",
    registeredDate: "2023-01-20",
  },
  {
    id: "sch-004",
    name: "SMA Negeri 1 Yogyakarta",
    address: "Jl. HOS Cokroaminoto No.10",
    city: "Yogyakarta",
    province: "DI Yogyakarta",
    postalCode: "55253",
    phone: "0274-512123",
    email: "humas@sman1yogya.sch.id",
    headmaster: "Drs. Munjahid, M.Pd.",
    subscriptionStatus: "expired",
    registeredDate: "2022-11-10",
  },
  {
    id: "sch-005",
    name: "SMA Negeri 1 Denpasar",
    address: "Jl. Kamboja No.4",
    city: "Denpasar",
    province: "Bali",
    postalCode: "80233",
    phone: "0361-223123",
    email: "info@sman1denpasar.sch.id",
    headmaster: "I Made Raka, S.Pd., M.Pd.",
    subscriptionStatus: "active",
    registeredDate: "2023-03-05",
  },
  {
    id: "sch-006",
    name: "SMA Negeri 1 Bogor",
    address: "Jl. Ir. H. Juanda No. 16",
    city: "Bogor",
    province: "Jawa Barat",
    postalCode: "16122",
    phone: "0251-8321724",
    email: "info@sman1bogor.sch.id",
    headmaster: "Drs. Bambang Aryan Soekisno, M.Pd",
    subscriptionStatus: "none",
    registeredDate: "2023-05-10",
  }
];