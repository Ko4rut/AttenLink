'use client';

import { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

import { FiCamera, FiX, FiRefreshCw } from 'react-icons/fi';

export default function QrScanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scannerVisible, setScannerVisible] = useState(false);

  useEffect(() => {
    if (!scannerVisible) return;

    const html5QrCode = new Html5Qrcode("reader");

    const startScanner = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras();

        if (cameras && cameras.length) {
          let backCameraId: string | undefined;
          for (const cam of cameras) {
            if (
              cam.label.toLowerCase().includes("back") ||
              cam.label.toLowerCase().includes("rear") ||
              cam.label.toLowerCase().includes("environment")
            ) {
              backCameraId = cam.id;
              break;
            }
          }

          const cameraId = backCameraId || cameras[0].id;

          await html5QrCode.start(
            cameraId,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText: string) => {
              setScanResult(decodedText);
              html5QrCode.stop();
              setScannerVisible(false);
            },
            (err: string) => console.debug("Scan error:", err)
          );
        } else {
          console.warn("Không tìm thấy camera nào");
          alert("Không tìm thấy camera. Hãy kiểm tra quyền truy cập.");
        }
      } catch (err) {
        console.error("Lỗi khởi động camera:", err);
        alert("Không mở được camera. Kiểm tra:\n- Quyền camera\n- Trang chạy HTTPS\n- Browser hỗ trợ");
      }
    };

    startScanner();

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, [scannerVisible]);

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-[#EBF4F6] to-[#DFF1F5]">
      {/* Header - full width, fixed top */}
      <header className="bg-[#088395] shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center relative">
          {/* Nút back bên trái */}
          <button className="absolute left-4 p-2 -ml-2 text-white hover:bg-[#09637E] rounded-full">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Logo + tên app - căn giữa */}
          <div className="flex-1 flex items-center justify-center gap-2">
            <img src="/img/paper-plane.png" alt="logo" className="w-7 h-7" />
            <h1 className="text-xl font-semibold text-white">AttenLink</h1>
          </div>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">QR Scanner</h1>

          {/* BUTTON START */}
          {!scannerVisible && !scanResult && (
            <button
              onClick={() => setScannerVisible(true)}
              className="
                flex items-center justify-center gap-2
                w-full py-3
                bg-[#088395] hover:bg-teal-700
                text-white font-semibold
                rounded-xl shadow-md
                transition-all active:scale-95
              "
            >
              <FiCamera className="text-xl" />
              Bắt đầu quét
            </button>
          )}

        {/* SCANNER */}
        {scannerVisible && (
          <div className="animate-fadeIn">
            <div
              id="reader"
              className="w-full rounded-xl overflow-hidden border"
            />
            
            <button
              onClick={() => setScannerVisible(false)}
              className="
                mt-4 w-full py-2
                flex items-center justify-center gap-2
                bg-red-500 hover:bg-red-600
                text-white rounded-xl
                transition-all active:scale-95
              "
            >
              <FiX />
              Đóng camera
            </button>
          </div>
        )}

          {/* RESULT */}
          {scanResult && (
            <div className="animate-fadeIn">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-left">
                <p className="font-semibold text-green-800 mb-2">Kết quả:</p>
                <p className="text-sm break-all text-gray-700 font-mono">
                  {scanResult}
                </p>
              </div>

              <button
                onClick={() => {
                  setScanResult(null);
                  setScannerVisible(true);
                }}
                className="
                  mt-6 w-full py-3
                  flex items-center justify-center gap-2
                  bg-blue-600 hover:bg-blue-700
                  text-white font-semibold
                  rounded-xl
                  transition-all active:scale-95
                "
              >
                <FiRefreshCw className="text-lg" />
                Quét lại
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}