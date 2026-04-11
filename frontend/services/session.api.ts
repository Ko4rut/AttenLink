import { apiClient } from "@/lib/apiClient";
export type SessionItem = {
  id: string;
  name: string;
  time: string;
  status: 'Active' | 'Closed';
  qr: string;
  checkin: string;
};

type SessionApiResponse = {
  SessionID: string;
  SectionID: string;
  Name: string;
  Time: string;
  isDeleted: boolean;
  attendanceCount: number;
  totalStudents: number;
  status: string;
};

type SessionListResponse = {
  message?: string;
  data: SessionApiResponse[];
};

function formatSessionTimeFromApi(time?: string) {
  if (!time) return 'No time';

  const date = new Date(time);

  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
function mapSessionToUI(session: SessionApiResponse): SessionItem {
  const isActive =
    session.status === 'ACTIVE' || session.status === 'Active';

  return {
    id: session.SessionID,
    name: session.Name || 'Untitled Session',
    time: formatSessionTimeFromApi(session.Time),
    status: isActive ? 'Active' : 'Closed',
    qr: isActive ? 'Generate QR' : 'Expired',
    checkin: `${session.attendanceCount ?? 0}/${session.totalStudents ?? 0}`,
  };
}
export const sessionApi = {
  async getSessionsBySection(sectionId: string): Promise<SessionItem[]> {
    const response = await apiClient.get<SessionListResponse>(
      `sessions/sections/${sectionId}/sessions`
    );
    // console.log('API Response:', response.data);
    return response.data.data.map(mapSessionToUI);
  },

  async createSession(sectionId: string, payload: { Name: string; Time: string }) {
    const teacherUserId = localStorage.getItem("user_id");

    if (!teacherUserId) {
      throw new Error("Không tìm thấy user_id trong localStorage");
    }

    await apiClient.post<{
      message?: string;
      data: SessionApiResponse;
    }>(
      `/sessions/sections/${sectionId}/sessions`,
      payload,
      {
        params: {
          teacher_user_id: teacherUserId,
        },
      }
    );

    // return mapSessionToUI(response.data.data);
  }
};