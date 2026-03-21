'use client';

import { FiX } from "react-icons/fi";
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";


const QRCode = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), {
  ssr: false,
  loading: () => <p>Loading QR...</p>
});
type Props = {
  sessionId: number;
  sectionCode: string;
  createdAt: Date;
  onClose: () => void;
};

export default function QRCodeModal({ sessionId, sectionCode, createdAt, onClose }: Props) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const expireTime = new Date(createdAt).getTime() + 5 * 60 * 1000; // +5 phút

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expireTime - now) / 1000));
      setTimeLeft(diff);
    };

    updateTimer(); // chạy lần đầu

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);
  const qrValue = `${window.location.origin}/attend/${sectionCode}/${sessionId}`;
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-87.5 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3d     right-3 cursor-pointer hover: blur-2xl"
        >
          <FiX size={20} />
        </button>

        <h3 className="text-center font-bold mb-4">
          Scan QR to attend
        </h3>

        <div className="flex justify-center">
          <QRCode value={qrValue} size={200} />
        </div>

        <p className="text-center mt-4 text-sm text-gray-500">
          Session: {sessionId}
        </p>
        <p className="text-center text-red-500 mt-3">
          {timeLeft > 0 ? `Expires in: ${formatTime(timeLeft)}` : "Expired"}
        </p>
      </div>
    </div>
  );
}