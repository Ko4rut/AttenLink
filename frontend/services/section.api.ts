import { apiClient } from "@/lib/apiClient";

export type Section = {
  SectionID: string;
  code: string;
  name: string;
  enrolled: number;
  totalSessions: number;
};

export type SectionListResponse = {
  items: Section[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export const getSectionsByTeacher = async (
  teacherUserId: string,
  page: number = 1,
  limit: number = 7
): Promise<SectionListResponse> => {
  const res = await apiClient.get(`/sections/teacher/${teacherUserId}`, {
    params: {
      page,
      limit,
    },
  });

  return res.data;
};

export type CreateSectionPayload = {
  code: string;
  name: string;
  description: string;
};

export const createSection = async (
  teacherUserId: string,
  data: CreateSectionPayload
) => {
  const res = await apiClient.post("/sections", data, {
    params: {
      teacher_user_id: teacherUserId,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
};