export type ActivityLog = {
  id: string;
  userId: string;
  timestamp: string;
  action: string;
  details: string;
  ipAddress: string;
};

export const activityLogs: ActivityLog[] = [
  {
    id: "log-001",
    userId: "user-001",
    timestamp: "2024-07-28T10:05:00Z",
    action: "LOGIN_SUCCESS",
    details: "Admin Utama logged in successfully.",
    ipAddress: "103.12.34.56",
  },
  {
    id: "log-002",
    userId: "user-002",
    timestamp: "2024-07-28T09:02:00Z",
    action: "UPDATE_STUDENT_DATA",
    details: "Updated profile for student ID user-006.",
    ipAddress: "125.45.67.89",
  },
  {
    id: "log-003",
    userId: "user-001",
    timestamp: "2024-07-27T16:00:00Z",
    action: "CREATE_PACKAGE",
    details: "Created new package: Paket Premium 6 Bulan.",
    ipAddress: "103.12.34.56",
  },
  {
    id: "log-004",
    userId: "user-003",
    timestamp: "2024-07-27T15:35:00Z",
    action: "ADD_TEACHER",
    details: "Added new teacher: Citra Guru.",
    ipAddress: "202.88.99.11",
  },
  {
    id: "log-005",
    userId: "user-001",
    timestamp: "2024-07-26T11:00:00Z",
    action: "PROCESS_PAYMENT",
    details: "Processed payment for subscription sub-005.",
    ipAddress: "103.12.34.56",
  },
  {
    id: "log-006",
    userId: "user-004",
    timestamp: "2024-07-28T08:15:00Z",
    action: "UPLOAD_MODULE",
    details: "Uploaded module 'Matematika Bab 1'.",
    ipAddress: "125.45.67.89",
  },
];