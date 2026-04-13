import { apiClient } from "@/lib/apiClient";

export type EnrollmentJoinPayload = {
  code: string;
};

export type EnrollmentJoinResponse = {
  message: string;
  data?: {
    EnrollmentID: string;
    StudentID: string;
    SectionID: string;
    isDeleted: boolean;
  };
};

export const joinSection = async (
  data: EnrollmentJoinPayload
): Promise<EnrollmentJoinResponse> => {
  const res = await apiClient.post("/enrollments/join", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
};