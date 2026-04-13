"use client";

import Header from "../../components/SectionHeader";
import Body from "./components/ScannerBody";
import { attendanceApi } from "@/services/student.qrcode.api";
import { useCallback, useState } from "react";

export default function ScanerPage() {
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    const path = window.location.pathname.split("/");
    path.pop();
    const newPath = path.join("/");
    window.location.href = newPath;
  };

  const handleScanSuccess = useCallback(async (decodedText: string) => {
    try {
      setLoading(true);

      const res = await attendanceApi.checkInByQr({
        token: decodedText,
      });

      console.log("Check-in success:", res);
      alert(res.message || "Điểm danh thành công");
    } catch (error: any) {
      console.error("Check-in failed:", error);
      alert(error?.response?.data?.detail || "Điểm danh thất bại");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#DCE3E6]">
      <Header onLogout={handleLogout} />
      {loading && (
        <p className="pt-4 text-center font-semibold text-[#0F8A9D]">
          Đang gửi điểm danh...
        </p>
      )}
      <Body onScanSuccess={handleScanSuccess} />
    </div>
  );
}