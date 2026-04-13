import { apiClient } from "@/lib/apiClient";

export type AttendanceStatus = "Present" | "Late" | "Absent";

export type AttendanceSessionInfo = {
  SessionID: string;
  SectionID: string;
  Name: string;
  Time: string;
};

export type AttendanceSummary = {
  present: number;
  absent: number;
  late: number;
  total: number;
};

export type AttendanceStudentInfo = {
  userID: string;
  studentCode: string;
  fullName: string;
  email: string;
  username: string;
};

export type AttendanceListItem = {
  AttendanceRecordID: string | null;
  studentUserID: string;
  SessionID: string;
  status: AttendanceStatus;
  checkInTime: string | null;
  createdAt: string | null;
  isDeleted: boolean;
  student: AttendanceStudentInfo;
};

export type SessionAttendanceResponse = {
  session: AttendanceSessionInfo;
  summary: AttendanceSummary;
  records: AttendanceListItem[];
};

export type AttendanceRow = {
  id: string;
  attendanceRecordID: string | null;
  studentUserID: string;
  sessionID: string;
  studentCode: string;
  fullName: string;
  status: AttendanceStatus;
  checkInTime: string;
};

export type AttendanceManualUpdatePayload = {
  AttendanceRecordID: string | null;
  studentUserID: string;
  SessionID: string;
  status: AttendanceStatus;
};

export type AttendanceManualUpdateResponse = {
  message: string;
  data?: AttendanceListItem | null;
};

function formatAttendanceTime(time?: string | null) {
  if (!time) return "—";

  const date = new Date(time);

  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function getFilenameFromContentDisposition(contentDisposition?: string) {
  if (!contentDisposition) return "attendance.xlsx";

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const asciiMatch = contentDisposition.match(/filename="([^"]+)"/i);
  if (asciiMatch?.[1]) {
    return asciiMatch[1];
  }

  return "attendance.xlsx";
}

function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.URL.revokeObjectURL(url);
}

export function mapAttendanceRecordToRow(
  item: AttendanceListItem,
  index: number
): AttendanceRow {
  return {
    id: item.AttendanceRecordID ?? `absent-${item.student.userID}-${index}`,
    attendanceRecordID: item.AttendanceRecordID,
    studentUserID: item.studentUserID,
    sessionID: item.SessionID,
    studentCode: item.student.studentCode,
    fullName: item.student.fullName,
    status: item.status,
    checkInTime: formatAttendanceTime(item.checkInTime),
  };
}

export const attendanceApi = {
  async getSessionAttendance(
    sessionId: string
  ): Promise<SessionAttendanceResponse> {
    const res = await apiClient.get<SessionAttendanceResponse>(
      `/sessions/${sessionId}/attendance`
    );

    return res.data;
  },

  async updateAttendanceManual(
    data: AttendanceManualUpdatePayload
  ): Promise<AttendanceManualUpdateResponse> {
    const res = await apiClient.patch<AttendanceManualUpdateResponse>(
      "/attendance/manual",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  },

  async exportSessionAttendanceExcel(sessionId: string): Promise<void> {
    const res = await apiClient.get(
      `/sessions/${sessionId}/attendance/export`,
      {
        responseType: "blob",
      }
    );

    const contentDisposition = res.headers["content-disposition"];
    const filename = getFilenameFromContentDisposition(contentDisposition);

    triggerBrowserDownload(res.data, filename);
  },
};