import { apiClient } from "@/lib/apiClient";

export const loginTeacher = async (data: {
  username: string;
  password: string;
}) => {
  const formData = new URLSearchParams();
  formData.append("username", data.username);
  formData.append("password", data.password);
  formData.append("grant_type", "password");

  const res = await apiClient.post("/teachers/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return res.data;
};

export const loginStudent = async (data: {
  username: string;
  password: string;
}) => {
  const formData = new URLSearchParams();
  formData.append("username", data.username);
  formData.append("password", data.password);
  formData.append("grant_type", "password");

  const res = await apiClient.post("/students/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return res.data;
};