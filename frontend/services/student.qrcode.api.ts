import { apiClient } from '@/lib/apiClient';


export type CheckInRequest = {
  token: string;
};

export type CheckInResponse = {
  message?: string;
  data?: {
    attendanceRecordID?: string;
    sessionID?: string;
    studentID?: string;
    checkedInAt?: string;
    status?: string;
  };
};

export const attendanceApi = {
  async checkInByQr(payload: CheckInRequest): Promise<CheckInResponse> {
    const response = await apiClient.post<CheckInResponse>(
      "/attendance/check-in",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  },
};