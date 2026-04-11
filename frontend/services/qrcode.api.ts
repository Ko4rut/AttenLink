import {apiClient} from "@/lib/apiClient";

export type QRCodePayload = {
  QRTokenID: string;
  token: string;
  expireAt: string;
  isActive: boolean;
  createAt: string;
};

export const qrCodeApi = {
  async generate(sessionId: string, teacherUserId?: string) {
    const teacher_user_id =
      teacherUserId || localStorage.getItem("user_id") || "";

    if (!teacher_user_id) {
      throw new Error("Không tìm thấy user_id trong localStorage");
    }

    await apiClient.post(
      `/sessions/${sessionId}/qrcode`,
      null,
      {
        params: { teacher_user_id },
      }
    );
  },

  async getCurrent(sessionId: string) {
    const response = await apiClient.get<QRCodePayload>(
      `/sessions/${sessionId}/qrcode/current`
    );

    return response.data;
  },
};