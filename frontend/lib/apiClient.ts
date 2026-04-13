import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "any",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  config.headers = config.headers ?? {};
  config.headers["ngrok-skip-browser-warning"] = "any";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("username");
      localStorage.removeItem("user_id");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);