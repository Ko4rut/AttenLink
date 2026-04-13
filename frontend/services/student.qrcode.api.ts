import { apiClient } from "@/lib/apiClient";

export type CheckInRequest = {
  token: string;
};

type CheckInApiResponse = {
  AttendanceRecordID: string;
  studentUserID: string;
  SessionID: string;
  CreateAt: string;
  isDeleted: boolean;
};

export type CheckInResponse = {
  attendanceRecordID: string;
  studentID: string;
  sessionID: string;
  checkedInAt: string;
  isDeleted: boolean;
};

function mapCheckInResponse(data: CheckInApiResponse): CheckInResponse {
  return {
    attendanceRecordID: data.AttendanceRecordID,
    studentID: data.studentUserID,
    sessionID: data.SessionID,
    checkedInAt: data.CreateAt,
    isDeleted: data.isDeleted,
  };
}

export const attendanceApi = {
  async checkInByQr(payload: CheckInRequest): Promise<CheckInResponse> {
    const response = await apiClient.post<CheckInApiResponse>(
      "/attendance/check-in",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[checkInByQr] payload:", payload);
    console.log("[checkInByQr] response:", response.data);

    return mapCheckInResponse(response.data);
  },
};