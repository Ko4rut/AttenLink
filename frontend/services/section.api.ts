import { apiClient } from "@/lib/apiClient";

export type Section = {
  SectionID: string;
  code: string;
  name: string;
  enrolled: number;
  description?: string;
  totalSessions: number;
};

export type SectionListResponse = {
  items: Section[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type StudentSectionItem = {
  SectionID: string;
  code: string;
  name: string;
  sessionsCount: number;
};

export type StudentSectionListResponse = {
  message: string;
  data: StudentSectionItem[];
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

export type UpdateSectionPayload = {
  name: string;
  description: string;
};

export const updateSection = async (
  sectionId: string,
  teacherUserId: string,
  data: UpdateSectionPayload
) => {
  const res = await apiClient.put(`/sections/${sectionId}`, data, {
    params: {
      teacher_user_id: teacherUserId,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

export const deleteSection = async (
  sectionId: string,
  teacherUserId: string
) => {
  const res = await apiClient.patch(
    `/sections/${sectionId}/delete`,
    {},
    {
      params: {
        teacher_user_id: teacherUserId,
      },
    }
  );

  return res.data;
};

export const getSectionsByStudent = async (): Promise<StudentSectionListResponse> => {
  const res = await apiClient.get("/sections/Student/sections");
  return res.data;
};