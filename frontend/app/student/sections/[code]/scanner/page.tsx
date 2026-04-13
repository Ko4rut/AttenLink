'use client';

import Header from "../../components/SectionHeader";
import Body from "./components/ScannerBody";
import { attendanceApi } from "@/services/student.qrcode.api";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

function extractQrInfo(decodedText: string) {
  try {
    const url = new URL(decodedText);
    const token = url.searchParams.get("token") || "";

    const parts = url.pathname.split("/").filter(Boolean);
    // attend / ABC / Session 1
    const sectionCode = parts[1] || "";

    return { token, sectionCode };
  } catch {
    return { token: decodedText, sectionCode: "" };
  }
}

export default function ScanerPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    const path = window.location.pathname.split("/");
    path.pop();
    const newPath = path.join("/");
    window.location.href = newPath;
  };

  const handleScanSuccess = useCallback(async (decodedText: string) => {
    try {
      setLoading(true);

      const { token, sectionCode } = extractQrInfo(decodedText);

      console.log("decodedText:", decodedText);
      console.log("token:", token);
      console.log("sectionCode:", sectionCode);

      if (!token) {
        alert("QR không chứa token hợp lệ");
        return;
      }

      const res = await attendanceApi.checkInByQr({ token });
      console.log("Check-in success:", res);

      alert("Điểm danh thành công");

      if (sectionCode) {
        router.push(`/student/sections/${sectionCode}`);
      } else {
        router.push("/student/sections");
      }
    } catch (error: any) {
      console.error("Check-in failed:", error);
      alert(error?.response?.data?.detail || "Điểm danh thất bại");
    } finally {
      setLoading(false);
    }
  }, [router]);

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