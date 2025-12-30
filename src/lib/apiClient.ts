import { AttendanceRecord } from "../app/types/attendance";

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * A generic fetch wrapper for client-side API calls.
 * It automatically handles cookies and throws a structured error.
 * @param url The API endpoint to call (e.g., '/api/attendance')
 * @param options Standard fetch options
 * @returns The JSON response
 */
async function apiClient<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
    // The browser automatically includes the httpOnly cookie for same-origin requests.
    // 'credentials: "include"' is critical if your API is on a different subdomain.
    credentials: "include",
  });

  if (!response.ok) {
    let errorMessage = `API Error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Ignore if response body is not JSON
    }
    throw new ApiError(errorMessage, response.status);
  }

  // Handle 204 No Content response
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

// =================================================================
// Attendance API Functions
// =================================================================

/**
 * Fetches all attendance records for the current user.
 * Designed to be used with useQuery.
 */
export const getAttendanceRecords = (): Promise<AttendanceRecord[]> => {
  return apiClient<AttendanceRecord[]>("/api/attendance/records");
};

/**
 * Submits a new attendance record.
 * @param attendanceData The data for the new attendance record.
 */
export const submitAttendance = (attendanceData: { [key: string]: any }): Promise<any> => {
  return apiClient<any>("/api/attendance/submit", {
    method: "POST",
    body: JSON.stringify(attendanceData),
  });
};

/**
 * Updates an existing attendance record.
 * @param recordId The ID of the record to update.
 * @param updateData The data to update.
 */
export const updateAttendanceRecord = ({ recordId, updateData }: { recordId: string; updateData: { [key: string]: any } }): Promise<AttendanceRecord> => {
  return apiClient<AttendanceRecord>(`/api/attendance/records/${recordId}`, {
    method: "PUT",
    body: JSON.stringify(updateData),
  });
};

/**
 * Deletes an attendance record.
 * @param recordId The ID of the record to delete.
 */
export const deleteAttendanceRecord = (recordId: string): Promise<{ success: boolean }> => {
  return apiClient<{ success: boolean }>(`/api/attendance/records/${recordId}`, {
    method: "DELETE",
  });
};

// =================================================================
// New functions migrated from attendanceService
// =================================================================

import { AttendanceStats } from "../app/types/attendance";

export interface BulkCheckInData {
  records: Partial<AttendanceRecord>[];
  validateLocation?: boolean;
  allowDuplicates?: boolean;
  timestamp?: string;
}

export const getAttendanceStats = (): Promise<AttendanceStats> => {
  return apiClient<AttendanceStats>("/api/attendance/stats");
};

export const checkIn = (data: Partial<AttendanceRecord>): Promise<AttendanceRecord> => {
  return apiClient<AttendanceRecord>("/api/attendance/check-in", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      checkInTime: data.checkInTime || new Date().toISOString(),
      timestamp: Date.now(),
    }),
  });
};

export const checkOut = (recordId: string): Promise<AttendanceRecord> => {
  return apiClient<AttendanceRecord>(`/api/attendance/check-out/${recordId}`, {
    method: "POST",
    body: JSON.stringify({
      checkOutTime: new Date().toISOString(),
      timestamp: Date.now(),
    }),
  });
};

export const bulkCheckIn = (bulkData: BulkCheckInData): Promise<AttendanceRecord[]> => {
  return apiClient<AttendanceRecord[]>("/api/attendance/bulk-check-in", {
    method: "POST",
    body: JSON.stringify({
      ...bulkData,
      timestamp: Date.now(),
    }),
  });
};

export const bulkCheckOut = (recordIds: string[]): Promise<AttendanceRecord[]> => {
  return apiClient<AttendanceRecord[]>("/api/attendance/bulk-check-out", {
    method: "POST",
    body: JSON.stringify({
      recordIds,
      checkOutTime: new Date().toISOString(),
      timestamp: Date.now(),
    }),
  });
};

export const markAbsent = (params: { userId: string; date: string; reason?: string }): Promise<AttendanceRecord> => {
  return apiClient<AttendanceRecord>("/api/attendance/mark-absent", {
    method: "POST",
    body: JSON.stringify({
      ...params,
      status: "absent",
      timestamp: Date.now(),
    }),
  });
};

export const refreshToken = (token: string): Promise<{ token: string; refreshToken?: string }> => {
  return apiClient<{ token: string; refreshToken?: string }>("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken: token }),
  });
};

export const checkAuthStatus = (): Promise<{ status: string }> => {
  return apiClient<{ status: string }>("/api/auth/verify");
};
