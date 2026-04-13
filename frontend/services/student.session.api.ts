import { apiClient } from '@/lib/apiClient';

export type SessionItem = {
  id: string;
  title: string;
  date: string;
  checkIn: string;
  status: 'Attended' | 'Absent';
};

export type SectionDetailData = {
  sectionName: string;
  code: string;
  attendance: string;
  sessions: SessionItem[];
};

type SectionSessionApiResponse = {
  SessionID: string;
  name: string;
  time: string;
  attendanceRecordID: string | null;
  checkInTime: string | null;
  status: string;
};

type SectionDetailApiResponse = {
  SectionID: string;
  code: string;
  name: string;
  description: string;
  attendedCount: number;
  totalSessions: number;
  sessions: SectionSessionApiResponse[];
};

type SectionDetailResponse = {
  message?: string;
  data: SectionDetailApiResponse;
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

function formatCheckInTimeFromApi(time?: string | null) {
  if (!time) return 'Not checked in';

  const date = new Date(time);

  return date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function mapSectionDetailToUI(section: SectionDetailApiResponse): SectionDetailData {
  return {
    sectionName: section.name || 'Untitled Section',
    code: section.code,
    attendance: `${section.attendedCount ?? 0}/${section.totalSessions ?? 0}`,
    sessions: (section.sessions || []).map((session) => ({
      id: session.SessionID,
      title: session.name || 'Untitled Session',
      date: formatSessionTimeFromApi(session.time),
      checkIn: formatCheckInTimeFromApi(session.checkInTime),
      status:
        session.status === 'ATTENDED' || session.status === 'Attended'
          ? 'Attended'
          : 'Absent',
    })),
  };
}

export const studentSessionApi = {
  async getSectionDetailByCode(sectionCode: string): Promise<SectionDetailData> {
    const response = await apiClient.get<SectionDetailResponse>(
      `/sessions/sections/${sectionCode}`
    );

    return mapSectionDetailToUI(response.data.data);
  },
};